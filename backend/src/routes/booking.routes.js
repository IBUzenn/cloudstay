'use strict';

const router        = require('express').Router();
const ctrl          = require('../controllers/booking.controller');
const v             = require('../validators/booking.validator');
const { validate }  = require('../middleware/validate.middleware');
const { authenticate }  = require('../middleware/auth.middleware');
const { requireRole }   = require('../middleware/role.middleware');
const { uploadSingle }  = require('../middleware/upload.middleware');

// Student routes
router.post('/',            authenticate, requireRole(['student']), v.create,       validate, ctrl.create);
router.get('/my',           authenticate, requireRole(['student']),                           ctrl.getMyBookings);
router.put('/:id/cancel',   authenticate, requireRole(['student']),                           ctrl.cancel);
router.post('/:id/receipt', authenticate, requireRole(['student']), uploadSingle('receipt'),  ctrl.uploadReceipt);

// Student + Admin/Manager
router.get('/:id',          authenticate, ctrl.getById);
router.get('/:id/receipt',  authenticate, ctrl.getReceipt);

// Admin + Manager routes
router.get('/',             authenticate, requireRole(['admin','manager']),                   ctrl.getAll);
router.put('/:id/status',   authenticate, requireRole(['admin','manager']), v.updateStatus, validate, ctrl.updateStatus);

module.exports = router;
