const express = require('express');
const ProjectController = require('../controller/ProjectController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from Project Route' });
  });

router.get('/get-all', ProjectController.getAllProject);

module.exports = router;
