import Usuario from "../models/user.model.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const API_SECRET_KEY =
  "d00bb28082b4919e4055bf207589c7eb5b7e865463a996fade07b954da88f5e3";
const authController = {};
import PlantillaContrato from "../models/plantillaContrato.model.js";
import Item from "../models/item.model.js";
authController.signup = async (req, res) => {
  try {
    const { tipo, nombre, documento, email, password } = req.body;
    if (!validarContrasena(password)) {
      return res.status(400).json({
        error:
          "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un carácter especial y al menos 8 caracteres de longitud",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await Usuario.create({
      tipo,
      nombre,
      documento,
      email,
      password: hashedPassword,
    });
    generarPlantillasPredeterminadas(user._id);
    generarEncabezados(user._id);
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const generarEncabezados = async (usuarioId) => {
  const encabezadosPredeterminados = [
    {
      titulo: "Encabezado del contrato",
      tipo: "encabezado",
      contenido:
        "Este contrato se celebra el [Fecha], entre [Nombre del Cliente],  identificado con el [Tipo de Documento] número [Número de Documento], en adelante denominado 'El Empleado', y [Nombre del Empleador], identificado con el [Tipo de Documento Empleador] número [Número de Documento Empleador], en adelante denominado 'El Empleador'. Las partes acuerdan lo siguiente:",
      usuario: usuarioId,
    },
  ];
  const idsEncabezados = [];
  for (const encabezado of encabezadosPredeterminados) {
    encabezado.usuario = usuarioId;
    let item = await Item.create(encabezado);
    idsEncabezados.push(item._id);
  }
};

const generarPlantillasPredeterminadas = async (usuarioId) => {
  const clausulasPredeterminadasObraLabor = [
    {
      titulo: "Objeto del contrato por obra y labor",
      tipo: "clausula",
      contenido:
        "El Empleador contrata los servicios del Empleado para prestar sus servicios en la obra o labor de [Obra y labor].",
      usuario: usuarioId,
    },
    {
      titulo: "Duración del contrato por obra y labor",
      tipo: "clausula",
      contenido:
        "El contrato se celebrará por el tiempo que dure la obra o labor, sin que pueda exceder de tres (3) años.",
      usuario: usuarioId,
    },
    {
      titulo: "Salario del empleado por obra y labor",
      tipo: "clausula",
      contenido:
        "El Empleador pagará al Empleado un salario mensual de [Valor del salario] pesos colombianos.",
      usuario: usuarioId,
    },
    {
      titulo: "Jornada laboral del empleado por obra y labor",
      tipo: "clausula",
      contenido:
        "La jornada laboral será de [Número de horas] horas diarias, de [Hora de inicio] a [Hora de finalización].",
      usuario: usuarioId,
    },
  ];

  const clausulasPredeterminadasTerminoIndefinido = [
    {
      titulo: "Objeto del contrato a termino indefinido",
      tipo: "clausula",
      contenido:
        "El Empleador contrata los servicios del Empleado para prestar sus servicios en la actividad de [Actividad].",
      usuario: usuarioId,
    },
    {
      titulo: "Duración del contrato a termino indefinido",
      tipo: "clausula",
      contenido:
        "El contrato se celebrará por tiempo indefinido, sin perjuicio de la facultad de cualquiera de las partes de darlo por terminado en cualquier momento.",
      usuario: usuarioId,
    },
    {
      titulo: "Salario del empleado a termino indefinido",
      tipo: "clausula",
      contenido:
        "El Empleador pagará al Empleado un salario mensual de [Valor del salario] pesos colombianos.",
      usuario: usuarioId,
    },
    {
      titulo: "Jornada laboral del empleado a termino indefinido",
      tipo: "clausula",
      contenido:
        "La jornada laboral será de [Número de horas] horas diarias, de [Hora de inicio] a [Hora de finalización].",
      usuario: usuarioId,
    },
  ];

  const clausulasPredeterminadasTerminoFijo = [
    {
      titulo: "Objeto del contrato a termino fijo",
      tipo: "clausula",
      contenido:
        "El Empleador contrata los servicios del Empleado para prestar sus servicios en la actividad de [Actividad].",
      usuario: usuarioId,
    },
    {
      titulo: "Duración del contrato a termino fijo",
      tipo: "clausula",
      contenido:
        "El contrato se celebrará por un término de [Número de meses] meses, contados a partir de la fecha de inicio.",
      usuario: usuarioId,
    },
    {
      titulo: "Salario del empleado a termino fijo",
      tipo: "clausula",
      contenido:
        "El Empleador pagará al Empleado un salario mensual de [Valor del salario] pesos colombianos.",
      usuario: usuarioId,
    },
    {
      titulo: "Jornada laboral del empleado a termino fijo",
      tipo: "clausula",
      contenido:
        "La jornada laboral será de [Número de horas] horas diarias, de [Hora de inicio] a [Hora de finalización].",
      usuario: usuarioId,
    },
  ];

  const clausulasPredeterminadasPrestacionServicios = [
    {
      titulo: "Objeto del contrato de prestación de servicios",
      tipo: "clausula",
      contenido:
        "El Empleador contrata los servicios del Empleado para prestar sus servicios en la actividad de [Actividad].",
      usuario: usuarioId,
    },
    {
      titulo: "Duración del contrato de prestación de servicios",
      tipo: "clausula",
      contenido:
        "El contrato se celebrará por el tiempo que dure la prestación del servicio, sin que pueda exceder de tres (3) años.",
      usuario: usuarioId,
    },
    {
      titulo: "Valor del contrato de prestación de servicios",
      tipo: "clausula",
      contenido:
        "El Empleador pagará al Empleado un valor total de [Valor del contrato] pesos colombianos.",
      usuario: usuarioId,
    },
    {
      titulo: "Jornada laboral del empleado de prestación de servicios",
      tipo: "clausula",
      contenido:
        "El Empleado prestará sus servicios de manera autónoma, sin que exista subordinación.",
      usuario: usuarioId,
    },
  ];

  const idsClausulasObraLabor = [];
  for (const clausula of clausulasPredeterminadasObraLabor) {
    clausula.usuario = usuarioId;
    let item = await Item.create(clausula);
    idsClausulasObraLabor.push(item._id);
  }

  const idsClausulasTerminoIndefinido = [];
  for (const clausula of clausulasPredeterminadasTerminoIndefinido) {
    clausula.usuario = usuarioId;
    let item = await Item.create(clausula);
    idsClausulasTerminoIndefinido.push(item._id);
  }

  const idsClausulasTerminoFijo = [];
  for (const clausula of clausulasPredeterminadasTerminoFijo) {
    clausula.usuario = usuarioId;
    let item = await Item.create(clausula);
    idsClausulasTerminoFijo.push(item._id);
  }

  const idsClausulasPrestacionServicios = [];
  for (const clausula of clausulasPredeterminadasPrestacionServicios) {
    clausula.usuario = usuarioId;
    let item = await Item.create(clausula);
    idsClausulasPrestacionServicios.push(item._id);
  }

  const plantillasPredeterminadas = [
    {
      nombre: "Contrato de obra y labor",
      encabezado: "665f642ea00ddd336ae0a6f7",
      items: idsClausulasObraLabor,
      status: "borrador",
      usuario: usuarioId,
    },
    {
      nombre: "Contrato a termino indefinido",
      encabezado: "665f642ea00ddd336ae0a6f7",
      items: idsClausulasTerminoIndefinido,
      status: "borrador",
      usuario: usuarioId,
    },
    {
      nombre: "Contrato a termino fijo",
      encabezado: "665f642ea00ddd336ae0a6f7",
      items: idsClausulasTerminoFijo,
      status: "borrador",
      usuario: usuarioId,
    },
    {
      nombre: "Contrato de prestación de servicios",
      encabezado: "665f642ea00ddd336ae0a6f7",
      items: idsClausulasPrestacionServicios,
      status: "borrador",
      usuario: usuarioId,
    },
  ];

  for (const plantilla of plantillasPredeterminadas) {
    plantilla.usuario = usuarioId;
    await PlantillaContrato.create(plantilla);
  }
};

authController.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await Usuario.findOne({ email });
    const invalidCredentialsMsg = "Correo electrónico o contraseña incorrectos";
    if (!user) {
      return res.status(401).json({ error: invalidCredentialsMsg });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: invalidCredentialsMsg });
    }

    const token = jwt.sign({ userId: user._id }, API_SECRET_KEY, {
      expiresIn: "1d",
    });

    res.json({ token });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

authController.changePassword = async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    const usuario = await Usuario.findById(req.user.id);
    const passwordMatch = await bcrypt.compare(oldPassword, usuario.password);
    if (!passwordMatch) {
      return res.status(401).json({ error: invalidCredentialsMsg });
    }
    const newHashedPassword = await bcrypt.hash(newPassword, 10);
    usuario.password = newHashedPassword;
    await usuario.save();

    res.status(200).json({ message: "Contraseña cambiada exitosamente" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

authController.my = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user.id).select("-password");

    res.status(200).json(usuario);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

authController.update = async (req, res) => {
  try {
    const usuarioId = req.user.id;

    const usuarioActualizado = await Usuario.findOneAndUpdate(
      { _id: usuarioId },
      req.body,
      { new: true, runValidators: true }
    );

    if (!usuarioActualizado) {
      return res.status(404).json({
        error: "Usuario no encontrado o no tienes permisos para actualizarlo",
      });
    }

    res.status(200).json(usuarioActualizado);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

const validarContrasena = (contrasena) => {
  const regex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return regex.test(contrasena);
};

export { authController };
