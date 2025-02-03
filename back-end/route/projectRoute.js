const express = require('express');
const ProjectController = require('../controller/ProjectController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from Project Route' });
  });


router.post('/getMyProjectLists', ProjectController.getMyProject);
router.post('/addProject', ProjectController.addProject);
router.post('/getViewProject', ProjectController.getViewProject);

module.exports = router;
