const express = require('express');
const router = express.Router();
const { getAnalytics } = require('../controllers/analyticsController');
const { authenticateToken } = require('../middleware/auth');

router.use(authenticateToken);

router.get('/', getAnalytics);

module.exports = router;
