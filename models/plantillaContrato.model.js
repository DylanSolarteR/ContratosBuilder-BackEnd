import { Schema, model } from "mongoose";

const plantillaContratoSchema = new Schema(
  {
    nombre: {
      type: String,
      required: true
    },

    items: [{
        type: Schema.Types.ObjectId,
        ref: 'Item'
    }],
    status:{
      type: String,
      enum: ["aprobada", "revision","borrador","rechazada"],
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

const PlantillaContrato = model("PlantillaContrato", plantillaContratoSchema);

export default PlantillaContrato;
