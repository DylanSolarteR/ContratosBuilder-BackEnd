const express = require('express');
// const CONTRATOS_DB_URI = 'mongodb://user:pass@127.0.0.1:27017/contratos';
const CONTRATOS_DB_URI = 'mongodb://127.0.0.1:27017/contratos';
const PORT = process.env.PORT || 3001;
const BASE_URL = '/api/v1';
const bcrypt = require('bcryptjs');
const User = require('./models/users.model.js');
const crypto = require('crypto');
const API_SECRET_KEY = 'd00bb28082b4919e4055bf207589c7eb5b7e865463a996fade07b954da88f5e3';

const mongoose = require('mongoose');
const app = express();
app.use(express.json());
mongoose.connect(CONTRATOS_DB_URI)
    .then(() => {
        console.log('Connected to databse successfully');
        app.listen(PORT, () => {
            console.log(`Express server running on port:  ${PORT}`);
        });
    }
);
const generateSecretKey = () => {
    return crypto.randomBytes(32).toString('hex');
};

// Imprimir la clave secreta generada
app.get(`${BASE_URL}/`, (req, res) => {
    res.json({'message':"Welcome"});
});

app.post(`${BASE_URL}/register`, async (req,res)=>{
    try{
        const { tipo, nombre, documento, email, password } = req.body;

        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10); // 10 es el costo de encriptación

        // Crear el usuario con la contraseña encriptada
        const user = await User.create({
            tipo,
            nombre,
            documento,
            email,
            password: hashedPassword // Guardar la contraseña encriptada en lugar de la original
        });
        res.status(200).json(user);
    }catch(error){
        res.status(500).json({error:error.message});
    }
});

const jwt = require('jsonwebtoken'); // Para generar tokens JWT

// Controlador para el endpoint de login
app.post(`${BASE_URL}/login`, async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(401).json({ error: 'Correo electrónico o contraseña incorrectos' });
        }

        const token = jwt.sign({ userId: user._id }, API_SECRET_KEY,{expiresIn: '1h'}); // La cadena 'secreto' debería ser reemplazada por una clave secreta más segura

        res.json({ token });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
