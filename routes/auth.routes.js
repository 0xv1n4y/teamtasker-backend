const express = require('express');
const router = express.Router();
const { signup } = require('../controllers/auth.controller');   

router.post('/signup', signup);  // POST /api/auth/signup

module.exports = router;