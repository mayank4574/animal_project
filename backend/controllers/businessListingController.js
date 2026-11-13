const { validationResult, body } = require('express-validator');
const BusinessListing = require('../models/BusinessListing');
const asyncHandler = require('../middleware/asyncHandler');

exports.validate = [
  body('businessName').notEmpty().withMessage('Business name is required'),
  body('ownerName').notEmpty().withMessage('Owner name is required'),
  body('email').isEmail().withMessage('Valid email is required'),
  body('phone').matches(/^[6-9]\d{9}$/).withMessage('Valid 10-digit Indian mobile number required'),
  body('category').notEmpty().withMessage('Category is required'),
  body('address').notEmpty().withMessage('Address is required'),
  body('city').notEmpty().withMessage('City is required'),
];

exports.createListing = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }
  const listing = await BusinessListing.create(req.body);
  res.status(201).json({ success: true, data: listing });
});

exports.getListings = asyncHandler(async (req, res) => {
  const listings = await BusinessListing.find().sort({ createdAt: -1 });
  res.json({ success: true, count: listings.length, data: listings });
});
