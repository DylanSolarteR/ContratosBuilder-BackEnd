import Usuario from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
const API_SECRET_KEY = 'd00bb28082b4919e4055bf207589c7eb5b7e865463a996fade07b954da88f5e3';
const authController = {}
authController.signup = async (req,res)=>{
    try{
        const { tipo, nombre, documento, email, password } = req.body;
        if(!validarContrasena(password)){
            return res.status(400).json({
                error:"La contraseña debe tener al menos una letra mayúscula,una letra minúscula, un carácter especial y al menos 8 caracteres de longitud"});
        }
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

        const token = jwt.sign({ userId: user._id }, API_SECRET_KEY,{expiresIn: '1d'}); 

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

authController.changePassword = async(req,res) =>{
    try{
        const {oldPassword,newPassword} = req.body;
        const usuario = await  Usuario.findById(req.user.id);
        const passwordMatch = await bcrypt.compare(oldPassword, usuario.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: invalidCredentialsMsg });
        }
        const newHashedPassword = await bcrypt.hash(newPassword, 10); 
        usuario.password = newHashedPassword;
        await usuario.save();

        res.status(200).json({ message: 'Contraseña cambiada exitosamente' });

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

authController.my = async(req,res) =>{
    try{
        const usuario = await  Usuario.findById(req.user.id).select('-password');

        res.status(200).json(usuario);

    }catch(error){
        res.status(500).json({ error: error.message });
    }
}

const validarContrasena = (contrasena) =>{
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return regex.test(contrasena);
}
  

export {authController}