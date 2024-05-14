const mongoose = require("mongoose");

const Schema = mongoose.Schema;

// Definir el esquema para el modelo de usuario
const usuarioSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: ["persona", "empresa"],
      required: true,
    },
    nombre: {
      type: String,
      required: true,
    },
    documento: {
      type: String,
      required: true,
      unique: true, // Asumiendo que cada documento/NIT debe ser único
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
