import Item from '../models/item.model.js';
const itemController = {};

itemController.all = async (req,res)=>{
    try{
        const usuarioId = req.user.id;
        let filtro = { usuario: usuarioId };
        if(req.query.tipo){
            filtro.tipo = req.query.tipo;
        }
        const clausulas = await Item.find(filtro);
        res.status(200).json(clausulas);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};



itemController.create = async (req,res)=>{
    try{
        const usuario = req.user.id;
        const newItem = { ...req.body, usuario }; 
        const item = await Item.create(newItem);
        res.status(200).json(item);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

itemController.createMultiple = async (req, res) => {
    try {
        const usuario = req.user.id;
        const newItems = req.body.map(item => ({ ...item, usuario }));

        const items = await Item.insertMany(newItems);
        res.status(200).json(items);
    }catch (error) {
        res.status(500).json({ error: error.message });
    }
};

itemController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id; 

        const plantillaEliminada = await Item.findOneAndDelete({ _id: id, usuario: usuarioId } );

        if (!plantillaEliminada) {
            return res.status(404).json({ error: 'Plantilla no encontrada o no tienes permisos para eliminarla' });
        }

        res.status(200).json({ message: 'Plantilla eliminada correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


export {itemController};