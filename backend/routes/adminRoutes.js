const router = require('express').Router();
const adminAuth = require('../middleware/adminAuth');
const {
  login,
  getStats,
  getBusinessListings,
  getBusinessListing,
  approveBusinessListing,
  rejectBusinessListing,
  getCorrections,
  getCorrection,
  approveCorrection,
  rejectCorrection,
  markCorrectionReviewed,
} = require('../controllers/adminController');

// Public admin login
router.post('/login', login);

// Protected admin routes
router.use(adminAuth);

router.get('/stats', getStats);

// Business listing management
router.get('/business-listings', getBusinessListings);
router.get('/business-listings/:id', getBusinessListing);
router.put('/business-listings/:id/approve', approveBusinessListing);
router.put('/business-listings/:id/reject', rejectBusinessListing);

// Correction management
router.get('/corrections', getCorrections);
router.get('/corrections/:id', getCorrection);
router.put('/corrections/:id/approve', approveCorrection);
router.put('/corrections/:id/reject', rejectCorrection);
router.put('/corrections/:id/review', markCorrectionReviewed);

module.exports = router;

