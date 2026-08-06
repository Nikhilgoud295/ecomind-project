const express = require('express');
const router = express.Router();
const { analyzeSustainability, getLatestAIReport, chatWithAI } = require('../controllers/aiController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { analyzeSchema } = require('../schemas/aiSchema');

router.use(authenticateToken);

router.post('/analyze', validate(analyzeSchema), analyzeSustainability);
router.post('/report', getLatestAIReport);
router.get('/latest', getLatestAIReport);
router.post('/chat', chatWithAI);

module.exports = router;
