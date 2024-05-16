import { Schema , model } from "mongoose";

const clienteSchema = new Schema(
  {
    nombreCompleto: {
      type: String,
      required: true,
    },
    tipoDocumento: {
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
    telefono: {
        type: String
    },
    direccion: {
        type: String
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
  },
  {
    timestamps: true,
  }
);

const Cliente = model("Cliente", clienteSchema);

export default Cliente;
