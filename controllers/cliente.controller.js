import Cliente from '../models/cliente.model.js';
const clienteController = {};

clienteController.all = async (req,res)=>{
    try{
        const usuarioId = req.user.id;
        const clientes = await Cliente.find({ usuario: usuarioId });
        res.status(200).json(clientes);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};



clienteController.create = async (req,res)=>{
    try{
        const usuario = req.user.id;
        const newCliente = { ...req.body, usuario }; 
        const cliente = await Cliente.create(newCliente);
        res.status(200).json(cliente);
    }catch(error){
        res.status(500).json({ error: error.message });
    }
};

export {clienteController};