const express = require('express');
const dropDownUserController = require('../controller/dropDownUserController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Tasks Route' });
  });

router.post('/getDropDownUser', dropDownUserController.getDropDownUser);
// router.post('/addMyTasksProjectLists', MyTasksController.getMyTasks);

module.exports = router;
