import { Router } from 'express';
import {plantillaController } from '../controllers/plantilla.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.get('/',extractUserFromToken, plantillaController.all);
router.post('/',extractUserFromToken, plantillaController.create);



export default router;