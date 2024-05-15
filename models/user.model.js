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
