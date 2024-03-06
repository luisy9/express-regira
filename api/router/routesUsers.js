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

router.post('/login', async (req, res, next) => {
    const { name, email } = req.body;
    console.log(name, email)
});


module.exports = router;