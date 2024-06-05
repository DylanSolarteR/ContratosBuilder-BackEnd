import { Router } from 'express';
import {itemController } from '../controllers/item.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.get('/',extractUserFromToken, itemController.all);
router.post('/',extractUserFromToken, itemController.create);
router.delete('/:id',extractUserFromToken, itemController.delete);
router.post('/multiple',extractUserFromToken, itemController.createMultiple);


export default router;