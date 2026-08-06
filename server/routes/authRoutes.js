const express = require('express');
const router = express.Router();
const { register, login, faceLogin, fingerprintLogin, getProfile, updateProfile } = require('../controllers/authController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { registerSchema, loginSchema, updateProfileSchema } = require('../schemas/authSchema');
const { authLimiter } = require('../middleware/rateLimiter');

router.post('/register', authLimiter, validate(registerSchema), register);
router.post('/login', authLimiter, validate(loginSchema), login);
router.post('/face-login', authLimiter, faceLogin);
router.post('/fingerprint-login', authLimiter, fingerprintLogin);
router.get('/profile', authenticateToken, getProfile);
router.put('/profile', authenticateToken, validate(updateProfileSchema), updateProfile);

module.exports = router;
