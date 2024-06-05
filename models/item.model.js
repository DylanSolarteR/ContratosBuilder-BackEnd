import { Schema, model } from "mongoose";


const itemSchema = new Schema(
  {
    titulo:{
      type: String,
      required:true,
    },
    tipo: {
      type: String,
      enum: ["clausula", "encabezado"],
      required: true,
    },
    contenido:{
        type: String,
        required: true,
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

const Item = model("Item", itemSchema);

export default Item;
