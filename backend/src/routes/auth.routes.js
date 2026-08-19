'use strict';

const router      = require('express').Router();
const ctrl        = require('../controllers/auth.controller');
const v           = require('../validators/auth.validator');
const { validate }= require('../middleware/validate.middleware');
const { authenticate } = require('../middleware/auth.middleware');

router.post('/register', v.register, validate, ctrl.register);
router.post('/login',    v.login,    validate, ctrl.login);
router.post('/refresh',  v.refresh,  validate, ctrl.refreshToken);
router.post('/logout',   authenticate, ctrl.logout);

module.exports = router;
