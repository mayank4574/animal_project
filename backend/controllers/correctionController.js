const { validationResult, body } = require('express-validator');
const Correction = require('../models/Correction');
const asyncHandler = require('../middleware/asyncHandler');

const validIssueTypes = ['incorrect_name', 'incorrect_address', 'wrong_phone', 'incorrect_category', 'closed_business', 'other'];

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
  const correction = await Correction.create(req.body);
  res.status(201).json({ success: true, data: correction });
});
