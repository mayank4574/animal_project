const router = require('express').Router();
const { validate, createListing, getListings } = require('../controllers/businessListingController');

router.post('/', validate, createListing);
router.get('/', getListings);

module.exports = router;
