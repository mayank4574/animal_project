const router = require('express').Router();
const { validate, createCorrection } = require('../controllers/correctionController');

router.post('/', validate, createCorrection);

module.exports = router;
