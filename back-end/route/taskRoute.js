const express = require('express');
const TasksController = require('../controller/taskController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Tasks Route' });
  });

router.post('/getSprintByProject', TasksController.getSprintByProject);
router.post('/getCurrentSprint', TasksController.getCurrentSprint);
router.post('/getPersonFilterOption', TasksController.getPersonFilterOption);
router.post('/getTasks', TasksController.getTask);
router.post('/getTaskStatus', TasksController.getTaskStatus);
router.post('/updateTaskStatus', TasksController.updateTaskStatus);
router.post('/addNewSprint', TasksController.addNewSprint);
router.post('/updateSprint', TasksController.updateSprint);
router.post('/updateTask', TasksController.updateTask);
router.post('/insertTask', TasksController.insertTask);
router.post('/deleteTask', TasksController.deleteTask);

module.exports = router;
