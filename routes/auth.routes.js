import { Router } from 'express';
import {authController } from '../controllers/auth.controller.js'
import extractUserFromToken from '../middlewares/requireToken.js';

const router = Router();

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.get('/my',extractUserFromToken, authController.my);
router.put('/my',extractUserFromToken, authController.update);
router.post('/change-password',extractUserFromToken, authController.changePassword);



export default router;