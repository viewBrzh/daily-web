const express = require('express');
const DashboardController = require('../controller/dashboardController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Dashboard Route' });
  });

router.post('/getProjectDashboard', DashboardController.getProjectDashboard);

module.exports = router;
