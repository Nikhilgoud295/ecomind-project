const express = require('express');
const router = express.Router();
const { getNews, getAiDigest } = require('../controllers/newsController');

router.get('/', getNews);
router.get('/ai-digest', getAiDigest);

module.exports = router;
