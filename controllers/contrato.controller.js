import Cliente from '../models/cliente.model.js';
import Usuario from '../models/user.model.js';
import PlantillaContrato from '../models/plantillaContrato.model.js';
import Contrato from '../models/contrato.model.js';
import PDFDocument from 'pdfkit';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PassThrough  } from 'stream';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const contratoController = {};

const obtenerPlantillaYCliente = async (plantillaId, clienteId, usuarioId) => {
    const plantilla = await PlantillaContrato.findOne({ _id: plantillaId, usuario: usuarioId })
                                              .populate('items')
                                              .populate('encabezado');
    const cliente = await Cliente.findOne({ _id: clienteId, usuario: usuarioId });

    if (!plantilla || !cliente) {
        throw new Error('Plantilla o cliente no encontrado');
    }

    return { plantilla, cliente };
};


const reemplazarVariablesEnEncabezado = (encabezadoContenido, cliente,usuario) => {
    return encabezadoContenido.replace('[Nombre del Cliente]', cliente.nombreCompleto)
                              .replace('[Tipo de Documento]', cliente.tipoDocumento)
                              .replace('[Número de Documento]', cliente.documento)
                              .replace('[Fecha]', new Date().toLocaleDateString())
                              .replace('[Nombre del Empleador]', usuario.nombre)
                              .replace('[Tipo de Documento Empleador]', usuario.tipo)
                              .replace('[Número de Documento Empleador]', usuario.documento);
};

const crearContenidoDelContrato = (encabezado, items) => {
    let contratoContenido = `\n\n${encabezado}\n\n`;
    items.forEach(item => {
        contratoContenido += `\n\n${item.titulo}\n${item.contenido}`;
    });
    return contratoContenido;
};

const crearPDFBuffer = async (contratoContenido) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const chunks = [];
        const stream = new PassThrough();

        stream._read = () => {}; // no-op
        doc.on('data', chunk => chunks.push(chunk));
        doc.on('end', () => resolve(Buffer.concat(chunks)));
        doc.on('error', err => reject(err));

        doc.pipe(stream);
        doc.text(contratoContenido, { align: 'justify' });
        doc.end();
    });
};

const guardarPDF = (contratoContenido, clienteNombre) => {
    return new Promise((resolve, reject) => {
        const doc = new PDFDocument();
        const contractsDir = path.join(__dirname, 'contracts');

        if (!fs.existsSync(contractsDir)) {
            fs.mkdirSync(contractsDir);
        }

        const pdfPath = path.join(contractsDir, `Contrato_${clienteNombre}.pdf`);
        const pdfStream = fs.createWriteStream(pdfPath);

        doc.pipe(pdfStream);
        doc.text(contratoContenido, { align: 'justify' });
        doc.end();

        pdfStream.on('finish', () => resolve(pdfPath));
        pdfStream.on('error', (err) => reject(err));
    });
};

const crearYGuardarContrato = async (plantilla, cliente, usuario,pdfBuffer) => {
    
    // const pdfPath = await guardarPDF(contratoContenido, cliente.nombreCompleto);

    const nuevoContrato = new Contrato({
        cliente: cliente._id,
        plantillaContrato: plantilla._id,
        contenido: contratoContenido,
        usuario: usuario.id,
        pdf: pdfBuffer,
    });
    await nuevoContrato.save();

    return nuevoContrato;
};

contratoController.generarContrato = async (req, res) => {
    try {
        const usuario = await Usuario.findById(req.user.id);
        
        const { plantillaId, clienteId } = req.body;

        const { plantilla, cliente } = await obtenerPlantillaYCliente(plantillaId, clienteId, usuario.id);
        const encabezadoContenido = reemplazarVariablesEnEncabezado(plantilla.encabezado.contenido, cliente,usuario);
        const contratoContenido = crearContenidoDelContrato(encabezadoContenido, plantilla.items);
        const pdfBuffer = await crearPDFBuffer(contratoContenido);
        const nuevoContrato = new Contrato({
            cliente: cliente._id,
            plantillaContrato: plantilla._id,
            contenido: contratoContenido,
            usuario: usuario.id,
            pdf: pdfBuffer,
        });
        await nuevoContrato.save();

        res.setHeader('Content-Disposition', `attachment; filename=Contrato_${cliente.documento}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
        res.send(pdfBuffer);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


contratoController.descargarContrato = async (req, res) => {
    try {
        const usuarioId = req.user.id;
        const contratoId = req.params.id;
        const contrato = await Contrato.findByOne({_id:contratoId,usuario:usuarioId}).populate('cliente');

        if (!contrato) {
            return res.status(404).json({ error: 'Contrato no encontrado' });
        }

        res.setHeader('Content-Disposition', `attachment; filename=Contrato_${contrato.cliente.documento}.pdf`);
        res.setHeader('Content-Type', 'application/pdf');
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
                                .populate('cliente')
                                .select('-contenido -pdf');

        if (!contratos) {
            return res.status(404).json({ error: 'Contratos no encontrados' });
        }

        res.status(200).json(contratos);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export { contratoController };
