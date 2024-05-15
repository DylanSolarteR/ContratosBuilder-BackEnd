const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const contratoSchema = new Schema(
  {
    cliente: {
      type: Schema.Types.ObjectId,
      ref: 'Cliente',
      required: true
    },
    plantillaContrato: {
        type: Schema.types.ObjectId,
        required: true,
        ref: 'PlantillaContrato'
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

const Contrato = model("Contrato", contratoSchema);

export default Contrato;
