const express = require('express');
const ProjectController = require('../controller/projectController'); 
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from Project Route' });
  });


router.post('/getMyProjectLists', ProjectController.getMyProject);
router.post('/addProject', ProjectController.addProject);
router.post('/getViewProject', ProjectController.getViewProject);
router.post('/updateProject', ProjectController.updateProject);
router.post('/getAllProject', ProjectController.getAllProject);

module.exports = router;
