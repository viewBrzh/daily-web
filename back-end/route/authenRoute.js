const express = require('express');
const AuthController= require('../controller/authenController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from Authentication Route' });
  });

router.post('/login', AuthController.login);

module.exports = router;
