import { Schema, model } from "mongoose";

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
      unique: true, 
    },
    email: {
      type: String,
      required: true,
      unique: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Por favor, ingrese un correo electrónico válido",
      ],
    },
    password: {
      type: String,
      required: true,
      match: [
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
        "La contraseña debe tener al menos una letra mayúscula, una letra minúscula, un número y un carácter especial",
      ],
    },
  },
  {
    timestamps: true,
  }
);

const Usuario = model("Usuario", usuarioSchema);

export default Usuario;
