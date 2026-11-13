const router = require('express').Router();
const { validate, createListing, getListings } = require('../controllers/businessListingController');
const adminAuth = require('../middleware/adminAuth');

router.post('/', validate, createListing);
router.get('/', adminAuth, getListings);

module.exports = router;
