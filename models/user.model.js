import { Schema, model } from "mongoose";

const usuarioSchema = new Schema(
  {
    tipo: {
      type: String,
      enum: ["persona", "empresa","cc","nit"],
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
    },
  },
  {
    timestamps: true,
  }
);

const Usuario = model("Usuario", usuarioSchema);

export default Usuario;
