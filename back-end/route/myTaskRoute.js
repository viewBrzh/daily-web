const express = require('express');
const MyTasksController = require('../controller/myTaskController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Tasks Route' });
  });

// router.post('/getMyTasksProjectLists', MyTasksController.getMyTasks);
// router.post('/addMyTasksProjectLists', MyTasksController.getMyTasks);

module.exports = router;
