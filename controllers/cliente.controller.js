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

clienteController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id;

        const clienteActualizado = await Cliente.findOneAndUpdate(
            { _id: id, usuario: usuarioId }, 
            req.body,
            { new: true, runValidators: true }
        );

        if (!clienteActualizado) {
            return res.status(404).json({ error: 'Cliente no encontrado o no tienes permisos para actualizarlo' });
        }

        res.status(200).json(clienteActualizado);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

clienteController.delete = async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioId = req.user.id; 

        const clienteEliminado = await Cliente.findOneAndDelete(
            { _id: id, usuario: usuarioId } 
        );

        if (!clienteEliminado) {
            return res.status(404).json({ error: 'Cliente no encontrado o no tienes permisos para eliminarlo' });
        }

        res.status(200).json({ message: 'Cliente eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {clienteController};