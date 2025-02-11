const express = require('express');
const CalendarController = require('../controller/calendarController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Calendar Route' });
  });

router.post('/getAllCalendar', CalendarController.getAllCalendar);

module.exports = router;
