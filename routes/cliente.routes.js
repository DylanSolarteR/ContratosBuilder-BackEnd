import { Router } from 'express';
import {clienteController } from '../controllers/cliente.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.get('/',extractUserFromToken, clienteController.all);
router.post('/',extractUserFromToken, clienteController.create);



export default router;