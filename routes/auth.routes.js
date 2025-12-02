const express = require('express');
const router = express.Router();
const { signup, login } = require('../controllers/auth.controller');   
const {getProfile} = require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');

router.post('/signup', signup);  // POST /api/auth/signup
router.post('/login', login);    // POST /api/auth/login
router.get('/me', auth, getProfile); // GET /api/auth/profile

module.exports = router;