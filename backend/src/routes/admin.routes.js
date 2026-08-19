'use strict';

const router      = require('express').Router();
const ctrl        = require('../controllers/admin.controller');
const { body }    = require('express-validator');
const { validate }= require('../middleware/validate.middleware');
const { authenticate }  = require('../middleware/auth.middleware');
const { requireRole }   = require('../middleware/role.middleware');

router.use(authenticate, requireRole(['admin']));

router.get('/users',             ctrl.getUsers);
router.put('/users/:id/status',  [body('isActive').isBoolean().withMessage('isActive must be a boolean.')], validate, ctrl.toggleUserStatus);
router.get('/stats',             ctrl.getStats);

module.exports = router;
