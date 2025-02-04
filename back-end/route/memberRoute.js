const express = require('express');
const MemberController = require('../controller/memberController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Member Route' });
  });

router.post('/updateMember', MemberController.updateTeamMember);

module.exports = router;
