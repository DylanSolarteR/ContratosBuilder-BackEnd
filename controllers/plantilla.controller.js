import PlantillaContrato from '../models/plantillaContrato.model.js';
const plantillaController = {};

plantillaController.all = async (req,res)=>{
    try{
        const usuarioId = req.user.id;
        const plantillas = await PlantillaContrato.find({ usuario: usuarioId });
        res.status(200).json(plantillas);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

plantillaController.create = async (req,res)=>{
    try{
        const usuario = req.user.id;
        const newPlantilla = { ...req.body, usuario }; 
        const plantilla = await PlantillaContrato.create(newPlantilla);
        res.status(200).json(plantilla);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

plantillaController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;

        const plantillaActualizada = await PlantillaContrato.findOneAndUpdate(
            { _id: id, usuario: usuarioId }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!plantillaActualizada) {
            return res.status(404).json({ error: 'Plantilla no encontrada o no tienes permisos para actualizarla' });
        }

        res.status(200).json(plantillaActualizada);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

plantillaController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id; 

        const plantillaEliminada = await PlantillaContrato.findOneAndDelete(
            { _id: id, usuario: usuarioId } 
        );

        if (!plantillaEliminada) {
            return res.status(404).json({ error: 'Plantilla no encontrada o no tienes permisos para eliminarla' });
        }

        res.status(200).json({ message: 'Plantilla eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {plantillaController};