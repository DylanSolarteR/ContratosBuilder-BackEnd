import Item from '../models/item.model.js';
const itemController = {};

itemController.all = async (req,res)=>{
    try{
        const clausulas = await Item.find({});
        res.status(200).json(clausulas);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

itemController.create = async (req,res)=>{
    try{
        console.log(req.user);
        const usuario = req.user.id;
        const newItem = { ...req.body, usuario }; 
        const item = await Item.create(newItem);
        res.status(200).json(item);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

export {itemController};