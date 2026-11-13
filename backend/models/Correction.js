const mongoose = require('mongoose');

const correctionSchema = new mongoose.Schema(
  {
    providerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Provider',
    },
    providerName: { type: String, required: true },
    issueType: {
      type: String,
      required: true,
      enum: [
        'incorrect_name',
        'incorrect_address',
        'wrong_phone',
        'incorrect_category',
        'closed_business',
        'incorrect_website',
        'other',
      ],
    },
    description: { type: String, required: true },
    userEmail: String,
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'resolved', 'rejected'],
      default: 'pending',
    },
    reviewedBy: String,
    reviewedAt: Date,
    appliedChanges: mongoose.Schema.Types.Mixed,
  },
  { timestamps: true }
);

module.exports = mongoose.model('Correction', correctionSchema);
