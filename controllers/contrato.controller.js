import Cliente from "../models/cliente.model.js";
import Usuario from "../models/user.model.js";
import PlantillaContrato from "../models/plantillaContrato.model.js";
import Contrato from "../models/contrato.model.js";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { PassThrough } from "stream";
import { Resend } from "resend";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logoPath = path.join(__dirname, "..", "img", "logo.png");
const contratoController = {};

const obtenerPlantillaYCliente = async (plantillaId, clienteId, usuarioId) => {
  const plantilla = await PlantillaContrato.findOne({
    _id: plantillaId,
    usuario: usuarioId,
  })
    .populate("items")
    .populate("encabezado");
  const cliente = await Cliente.findOne({ _id: clienteId, usuario: usuarioId });

  if (!plantilla || !cliente) {
    throw new Error("Plantilla o cliente no encontrado");
  }

  return { plantilla, cliente };
};

const reemplazarVariablesEnEncabezado = (
  encabezadoContenido,
  cliente,
  usuario
) => {
  return encabezadoContenido
    .replace("[Nombre del Cliente]", cliente.nombreCompleto)
    .replace("[Tipo de Documento]", cliente.tipoDocumento)
    .replace("[Número de Documento]", cliente.documento)
    .replace("[Fecha]", new Date().toLocaleDateString())
    .replace("[Nombre del Empleador]", usuario.nombre)
    .replace("[Tipo de Documento Empleador]", usuario.tipo)
    .replace("[Número de Documento Empleador]", usuario.documento);
};

const crearContenidoDelContrato = (encabezado, items) => {
  let contratoContenido = `${encabezado}\n\n`;
  let clausulaCount = 0;
  items.forEach((item) => {
    contratoContenido += `\n\n${++clausulaCount}. ${item.titulo}\n${
      item.contenido
    }`;
  });
  return contratoContenido;
};

const crearPDFBuffer = async (
  contratoContenido,
  cliente,
  usuario,
  plantilla
) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument({ margin: 50 });
    const chunks = [];
    const stream = new PassThrough();

    stream._read = () => {}; // no-op
    doc.on("data", (chunk) => chunks.push(chunk));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", (err) => reject(err));

    doc.pipe(stream);

    // Encabezado del PDF
    doc
      // .image(logoPath, 50, 45, { width: 50 })
      .fontSize(20)
      .text("", 110, 57, { width: 45 })
      .moveDown();

    // Información del cliente
    doc
      .fontSize(12)
      .text(`Cliente: ${cliente.nombreCompleto}`, { align: "right" })
      .text(`Documento: ${cliente.tipoDocumento} ${cliente.documento}`, {
        align: "right",
      })
      .moveDown();

    // Título del contrato
    doc.fontSize(16).text(plantilla.nombre, { align: "center" }).moveDown();

    // Contenido del contrato
    doc.fontSize(12).text(contratoContenido, doc.x - 50, doc.y, {
      align: "justify",
      ellipsis: true,
    });

    doc.moveDown(4);
    const signatureY = doc.y;
    doc
      .text("_________________________", 50, signatureY)
      .text("_________________________", 350, signatureY)
      .moveDown()
      .text("Firma del Empleador", 50, signatureY + 15)
      .text("Firma del Empleado", 350, signatureY + 15);

    doc.end();
  });
};

const guardarPDF = (contratoContenido, clienteNombre) => {
  return new Promise((resolve, reject) => {
    const doc = new PDFDocument();
    const contractsDir = path.join(__dirname, "contracts");

    if (!fs.existsSync(contractsDir)) {
      fs.mkdirSync(contractsDir);
    }

    const pdfPath = path.join(contractsDir, `Contrato_${clienteNombre}.pdf`);
    const pdfStream = fs.createWriteStream(pdfPath);

    doc.pipe(pdfStream);
    doc.text(contratoContenido, { align: "justify" });
    doc.end();

    pdfStream.on("finish", () => resolve(pdfPath));
    pdfStream.on("error", (err) => reject(err));
  });
};

contratoController.generarContrato = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id);
    const { plantillaId, clienteId } = req.body;

    const { plantilla, cliente } = await obtenerPlantillaYCliente(
      plantillaId,
      clienteId,
      usuario.id
    );
    const contratoExistente = await Contrato.find({
      cliente: clienteId,
      estado: "activo",
    });
    if (contratoExistente.length > 0) {
      // return res.status(400).json({ error: 'Este cliente ya cuenta con un contrato activo' });
    }
    const encabezadoContenido = reemplazarVariablesEnEncabezado(
      plantilla.encabezado.contenido,
      cliente,
      usuario
    );
    const contratoContenido = crearContenidoDelContrato(
      encabezadoContenido,
      plantilla.items,
      plantilla.nombre
    );
    const pdfBuffer = await crearPDFBuffer(
      contratoContenido,
      cliente,
      usuario,
      plantilla
    );
    const nuevoContrato = new Contrato({
      cliente: cliente._id,
      plantillaContrato: plantilla._id,
      contenido: contratoContenido,
      usuario: usuario.id,
      pdf: pdfBuffer,
      estado: "activo",
    });
    await nuevoContrato.save();

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Contrato_${cliente.documento}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(pdfBuffer);

    //Envio al email de los clientes
    const resend = new Resend("re_7HbkqAjW_B9i2kU2jCj15G4Mi5EWqwdg7");
    const correoCliente = await Cliente.findOne({
      _id: clienteId,
    });

    const { data, error } = await resend.emails.send({
      from: "NextGen <onboarding@resend.dev>",
      to: ["dasolarter@udistrital.edu.co"],
      subject: "Se ha generado su nuevo contrato.",
      text: "Se ha generado su nuevo contrato; por favor descarguelo, firmelo y reenvielo al correo nextGen@gmail.com.",
      attachments: [
        {
          filename: "Contrato.pdf",
          content: pdfBuffer,
        },
      ],
    });
    if (error) {
      return console.error({ error });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

contratoController.descargarContrato = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    const contratoId = req.params.id;
    const contrato = await Contrato.findOne({
      _id: contratoId,
      usuario: usuarioId,
    }).populate("cliente");

    if (!contrato) {
      return res.status(404).json({ error: "Contrato no encontrado" });
    }

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Contrato_${contrato.cliente.documento}.pdf`
    );
    res.setHeader("Content-Type", "application/pdf");
    res.send(contrato.pdf);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

contratoController.allContratos = async (req, res) => {
  try {
    const usuarioId = req.user.id;
    let filtroConsulta = { usuario: usuarioId };

    if (req.query.clienteId) {
      filtroConsulta.cliente = req.query.clienteId;
    }
    const contratos = await Contrato.find(filtroConsulta)
      .populate("cliente plantillaContrato")
      .select("-contenido -pdf");

    if (!contratos) {
      return res.status(404).json({ error: "Contratos no encontrados" });
    }

    res.status(200).json(contratos);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export { contratoController };
