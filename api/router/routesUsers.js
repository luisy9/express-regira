const express = require('express');
const router = express.Router();

const multer = require('multer');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const SECRET_KEY = 'en-pinxo-li-va-dir-a-en-panxo'; // Clau secreta per a la generació de JWT
const { Usuario, Tag, Tarea, Comment, Proyecto } = require('../model'); // Importa els models de dades
const { listAllUsers } = require('../utils/utilsUsuario');

//CRUD
//CRUD
//CRUD
//CRUD
//CRUD
//CRUD

router.get(
  '/users',
  async (req, res, next) => await listAllUsers(req, res, Usuario)
);

//End poit para hacer el login de usuario
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    //Encontrar que hay un usuario con ese email
    const user = await Usuario.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ error: 'This User is not registered' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password); // Compara la contrasenya proporcionada amb la contrasenya encriptada de l'usuari

    if (!passwordMatch) {
      return res.status(400).json({ error: 'Password incorrect' });
    }

    //Si la contraseña existe generamos el token de autenticacion con nuestra SECRET_KEY
    const token = jwt.sign(
      { userId: user.id, userName: user.nombre }, // El JWT se hara con el id del usuario y el nombre del usuario
      SECRET_KEY, // SECRET_KEY para que haga el encriptacion a partir de esa clave
      { expiresIn: '2h' } // Genera un token JWT vàlid durant 2 hores
    );

    res.cookie('token', token, { httpOnly: false, maxAge: 7200000 }); // Estableix el token com una cookie

    res.json({ message: 'Login correcte' }); // Retorna missatge d'èxit
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

router.post('/register', async (req, res) => {
  const { nombre, email, password } = req.body;
  try {
    if (!nombre || !email || !password) {
      return res
        .status(400)
        .json({ error: 'Name, email and password are required' });
    }

    const existingUser = await Usuario.findOne({ where: { email } }); // Comprova si l'email ja està registrat
    if (existingUser) {
      return res.status(400).json({ error: 'El email ya existe' }); // Retorna error 400 si l'email ja està registrat
    }

    const usuario = await Usuario.create({ nombre, email, password });
    res.status(201).json(usuario);
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
});

module.exports = router;
