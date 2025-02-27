const express = require('express');
const AuthController= require('../controller/authenController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from Authentication Route' });
  });

router.post('/login', AuthController.login);
router.post('/signUp', AuthController.signUp);
router.post('/logout', AuthController.logout);

module.exports = router;
