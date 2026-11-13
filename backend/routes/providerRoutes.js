const router = require('express').Router();
const { getProviders, getFeatured, getProvider } = require('../controllers/providerController');

router.get('/featured', getFeatured);
router.get('/search', getProviders);
router.get('/', getProviders);
router.get('/:idOrSlug', getProvider);

module.exports = router;
