import Usuario from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const API_SECRET_KEY = 'd00bb28082b4919e4055bf207589c7eb5b7e865463a996fade07b954da88f5e3';
const authController = {}
authController.signup = async (req,res)=>{
    try{
        const { tipo, nombre, documento, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10); 

        const user = await Usuario.create({
            tipo,
            nombre,
            documento,
            email,
            password: hashedPassword 
        });
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({error:error.message});
    }
};

authController.login =  async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await Usuario.findOne({ email });
        const invalidCredentialsMsg = 'Correo electrónico o contraseña incorrectos';
        if (!user) {
            return res.status(401).json({ error:  invalidCredentialsMsg});
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: invalidCredentialsMsg });
        }

        const token = jwt.sign({ userId: user._id }, API_SECRET_KEY,{expiresIn: '1h'}); 

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export {authController}