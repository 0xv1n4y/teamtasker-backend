const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');   

router.post('/signup', signup);  // POST /api/auth/signup
router.post('/login', login);    // POST /api/auth/login

module.exports = router;