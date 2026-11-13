const mongoose = require('mongoose');

const businessListingSchema = new mongoose.Schema(
  {
    businessName: { type: String, required: true },
    ownerName: { type: String, required: true },
    email: { type: String, required: true },
    phone: { type: String, required: true },
    category: { type: String, required: true },
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    pincode: String,
    description: String,
    website: String,
    status: {
      type: String,
      enum: ['pending', 'approved', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('BusinessListing', businessListingSchema);
