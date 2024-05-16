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

export {plantillaController};