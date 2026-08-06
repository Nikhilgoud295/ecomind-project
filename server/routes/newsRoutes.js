const express = require('express');
const router = express.Router();
const { getNews, getAiDigest, getAiStrategicRecommendations } = require('../controllers/newsController');

router.get('/', getNews);
router.get('/ai-digest', getAiDigest);
router.post('/ai-recommendations', getAiStrategicRecommendations);

module.exports = router;
