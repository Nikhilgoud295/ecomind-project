const express = require('express');
const router = express.Router();
const { addUsage, getUsage, updateUsage, deleteUsage } = require('../controllers/usageController');
const { authenticateToken } = require('../middleware/auth');
const validate = require('../middleware/validate');
const { usageInputSchema, usageQuerySchema, uuidParamSchema } = require('../schemas/usageSchema');

router.use(authenticateToken);

router.post('/', validate(usageInputSchema), addUsage);
router.get('/', validate(usageQuerySchema, 'query'), getUsage);
router.put('/:id', validate(uuidParamSchema, 'params'), validate(usageInputSchema), updateUsage);
router.delete('/:id', validate(uuidParamSchema, 'params'), deleteUsage);

module.exports = router;
