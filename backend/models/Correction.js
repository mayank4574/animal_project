const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema(
  {
    providerName: { type: String, required: true },
    issueType: {
      type: String,
      required: true,
      enum: ['incorrect_name', 'incorrect_address', 'wrong_phone', 'incorrect_category', 'closed_business', 'other'],
    },
    description: { type: String, required: true },
    userEmail: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Correction', correctionSchema);
