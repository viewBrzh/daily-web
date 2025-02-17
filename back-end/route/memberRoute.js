const express = require('express');
const MemberController = require('../controller/memberController');
const router = express.Router();

router.get('/', (req, res) => {
    res.json({ message: 'Hello from My Member Route' });
  });

router.post('/updateMember', MemberController.updateTeamMember);
router.post('/getUser', MemberController.getUser);

module.exports = router;
