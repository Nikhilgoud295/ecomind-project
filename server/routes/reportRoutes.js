const express = require('express');
const router = express.Router();
const { generateReport, getReports, getReportById } = require('../controllers/reportController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { generateReportSchema } = require('../schemas/reportSchema');

router.use(authenticateToken);

router.post('/generate', validate(generateReportSchema), generateReport);
router.get('/', getReports);
router.get('/:id', getReportById);

module.exports = router;
