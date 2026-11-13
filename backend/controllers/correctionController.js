const { validationResult, body } = require('express-validator');
const Correction = require('../models/Correction');
const Provider = require('../models/Provider');
const asyncHandler = require('../middleware/asyncHandler');

const validIssueTypes = [
  'incorrect_name',
  'incorrect_address',
  'wrong_phone',
  'incorrect_category',
  'closed_business',
  'incorrect_website',
  'other',
];

exports.validate = [
  body('providerName').notEmpty().withMessage('Provider name is required'),
  body('issueType').isIn(validIssueTypes).withMessage('Valid issue type is required'),
  body('description').notEmpty().withMessage('Description is required'),
];

exports.createCorrection = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, message: 'Validation failed', errors: errors.array() });
  }

  const payload = { ...req.body, status: 'pending' };

  // Look up matching provider ID if not explicitly provided
  if (!payload.providerId && payload.providerName) {
    const existing = await Provider.findOne({
      name: new RegExp(`^${payload.providerName.trim()}$`, 'i'),
    });
    if (existing) {
      payload.providerId = existing._id;
    }
  }

  const correction = await Correction.create(payload);
  res.status(201).json({
    success: true,
    message: 'Correction submitted successfully and is pending review',
    data: correction,
  });
});
