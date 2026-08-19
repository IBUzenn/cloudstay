'use strict';

const router       = require('express').Router();
const ctrl         = require('../controllers/hostel.controller');
const v            = require('../validators/hostel.validator');
const { validate } = require('../middleware/validate.middleware');
const { authenticate }  = require('../middleware/auth.middleware');
const { requireRole }   = require('../middleware/role.middleware');

// Public
router.get('/',    ctrl.getAll);
router.get('/:id', ctrl.getById);

// Admin only
router.post('/',    authenticate, requireRole(['admin']), v.create, validate, ctrl.create);
router.put('/:id',  authenticate, requireRole(['admin']), v.update, validate, ctrl.update);
router.delete('/:id', authenticate, requireRole(['admin']), ctrl.remove);

module.exports = router;
