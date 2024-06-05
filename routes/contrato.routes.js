import { Router } from 'express';
import {contratoController } from '../controllers/contrato.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.post('/generate',extractUserFromToken, contratoController.generarContrato);
router.get('/download/:id',extractUserFromToken, contratoController.descargarContrato);
router.get('/',extractUserFromToken, contratoController.allContratos);



export default router;