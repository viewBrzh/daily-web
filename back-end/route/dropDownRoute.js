const express = require('express');
const dropDownUserController = require('../controller/dropDownController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Tasks Route' });
  });

router.post('/getDropDownUser', dropDownUserController.getDropDownUser);
router.post('/getTaskFilterDropdownUser', dropDownUserController.getTaskfilterDropdown);
router.post('/getDropdownUserByProject', dropDownUserController.getDropDownUserByProject);

module.exports = router;
