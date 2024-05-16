import { Router } from 'express';
import {clienteController } from '../controllers/cliente.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.get('/',extractUserFromToken, clienteController.all);
router.post('/',extractUserFromToken, clienteController.create);

router.delete('/:id',extractUserFromToken, clienteController.delete);
router.put('/:id',extractUserFromToken, clienteController.update);


export default router;