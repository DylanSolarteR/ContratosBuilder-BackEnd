import { Schema , model } from "mongoose";

const contratoSchema = new Schema(
  {
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    plantillaContrato: {
        type: Schema.Types.ObjectId,
        required: true,
        ref: 'PlantillaContrato'
    },
    usuario: {
      type: Schema.Types.ObjectId,
      ref: 'Usuario',
      required: true
    },
    contenido:String,
    pdf:Buffer
  },
  {
    timestamps: true,
  }
);

const Contrato = model("Contrato", contratoSchema);

export default Contrato;
