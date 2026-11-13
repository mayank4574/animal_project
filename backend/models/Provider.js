const mongoose = require('mongoose');

const providerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    slug: { type: String, unique: true },
    category: {
      type: String,
      required: true,
      enum: ['Veterinary Clinic', 'Animal Hospital', 'Pet Boarding', 'Diagnostics', 'Animal Ambulance', 'Animal NGO'],
    },
    description: String,
    image: String,
    phone: String,
    email: String,
    website: String,
    address: { type: String, required: true },
    city: { type: String, required: true },
    state: String,
    pincode: String,
    services: [String],
    rating: { type: Number, min: 0, max: 5 },
    reviewCount: { type: Number, default: 0 },
    openingHours: Object,
    isOpen: Boolean,
    isActive: { type: Boolean, default: true },
    verificationStatus: {
      type: String,
      enum: ['pending', 'verified', 'rejected'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

providerSchema.pre('save', function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-');
  }
});

module.exports = mongoose.model('Provider', providerSchema);
