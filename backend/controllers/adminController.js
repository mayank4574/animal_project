const jwt = require('jsonwebtoken');
const BusinessListing = require('../models/BusinessListing');
const Correction = require('../models/Correction');
const Provider = require('../models/Provider');
const asyncHandler = require('../middleware/asyncHandler');

// POST /api/admin/login
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const expectedEmail = process.env.ADMIN_EMAIL || 'admin@practoforanimals.com';
  const expectedPassword = process.env.ADMIN_PASSWORD || 'Admin@Practo2024!';

  if (!email || !password) {
    return res.status(400).json({ success: false, message: 'Email and password are required' });
  }

  if (email.trim().toLowerCase() !== expectedEmail.toLowerCase() || password !== expectedPassword) {
    return res.status(401).json({ success: false, message: 'Invalid admin credentials' });
  }

  const token = jwt.sign(
    { email: expectedEmail, role: 'admin' },
    process.env.JWT_SECRET || 'practo-jwt-secret-key-2024',
    { expiresIn: '24h' }
  );

  res.json({
    success: true,
    message: 'Admin authentication successful',
    token,
    admin: { email: expectedEmail, role: 'admin' },
  });
});

// GET /api/admin/stats
exports.getStats = asyncHandler(async (_req, res) => {
  const [
    totalSubmissions,
    pendingBusinesses,
    approvedBusinesses,
    rejectedBusinesses,
    totalCorrections,
    pendingCorrections,
    resolvedCorrections,
    totalProviders,
  ] = await Promise.all([
    BusinessListing.countDocuments(),
    BusinessListing.countDocuments({ status: 'pending' }),
    BusinessListing.countDocuments({ status: 'approved' }),
    BusinessListing.countDocuments({ status: 'rejected' }),
    Correction.countDocuments(),
    Correction.countDocuments({ status: 'pending' }),
    Correction.countDocuments({ status: 'resolved' }),
    Provider.countDocuments({ verificationStatus: 'verified', isActive: { $ne: false } }),
  ]);

  res.json({
    success: true,
    data: {
      totalSubmissions,
      pendingBusinesses,
      approvedBusinesses,
      rejectedBusinesses,
      totalCorrections,
      pendingCorrections,
      resolvedCorrections,
      totalProviders,
    },
  });
});

// GET /api/admin/business-listings
exports.getBusinessListings = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, status, category, search } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }
  if (category) {
    filter.category = category;
  }
  if (search) {
    const s = new RegExp(search.trim(), 'i');
    filter.$or = [
      { businessName: s },
      { ownerName: s },
      { city: s },
      { email: s },
      { phone: s },
    ];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const total = await BusinessListing.countDocuments(filter);
  const data = await BusinessListing.find(filter)
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.max(1, Math.ceil(total / limitNum)),
    },
  });
});

// GET /api/admin/business-listings/:id
exports.getBusinessListing = asyncHandler(async (req, res) => {
  const listing = await BusinessListing.findById(req.params.id).populate('providerId');
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Business listing not found' });
  }
  res.json({ success: true, data: listing });
});

// PUT /api/admin/business-listings/:id/approve
exports.approveBusinessListing = asyncHandler(async (req, res) => {
  const listing = await BusinessListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Business listing not found' });
  }

  // Prevent duplicate provider records
  let provider;
  if (listing.providerId) {
    provider = await Provider.findById(listing.providerId);
    if (provider) {
      provider.verificationStatus = 'verified';
      provider.isActive = true;
      await provider.save();
    }
  }

  if (!provider) {
    // Check if provider with same name exists
    const existing = await Provider.findOne({
      name: new RegExp(`^${listing.businessName.trim()}$`, 'i'),
    });

    if (existing) {
      provider = existing;
      provider.verificationStatus = 'verified';
      provider.isActive = true;
      await provider.save();
    } else {
      const body = req.body || {};
      // Create new verified public provider record
      provider = await Provider.create({
        name: listing.businessName,
        category: listing.category,
        description:
          listing.description ||
          `${listing.businessName} provides trusted and compassionate ${listing.category} services.`,
        image:
          body.image ||
          'https://images.unsplash.com/photo-1584820927498-cfe5211fd8bf?auto=format&fit=crop&w=800&q=80',
        phone: listing.phone,
        email: listing.email,
        website: listing.website || '',
        address: listing.address,
        city: listing.city,
        state: listing.state || '',
        pincode: listing.pincode || '',
        services: body.services && body.services.length > 0 ? body.services : [listing.category],
        rating: 4.5,
        reviewCount: 0,
        isOpen: true,
        isActive: true,
        verificationStatus: 'verified',
      });
    }
  }

  listing.status = 'approved';
  listing.providerId = provider._id;
  await listing.save();

  res.json({
    success: true,
    message: 'Business listing approved successfully and published to directory',
    data: { listing, provider },
  });
});

// PUT /api/admin/business-listings/:id/reject
exports.rejectBusinessListing = asyncHandler(async (req, res) => {
  const listing = await BusinessListing.findById(req.params.id);
  if (!listing) {
    return res.status(404).json({ success: false, message: 'Business listing not found' });
  }

  listing.status = 'rejected';
  await listing.save();

  // If it was previously linked to a provider, set verificationStatus to rejected
  if (listing.providerId) {
    await Provider.findByIdAndUpdate(listing.providerId, {
      verificationStatus: 'rejected',
      isActive: false,
    });
  }

  res.json({
    success: true,
    message: 'Business listing rejected',
    data: listing,
  });
});

// GET /api/admin/corrections
exports.getCorrections = asyncHandler(async (req, res) => {
  const { page = 1, limit = 15, status, issueType, search } = req.query;
  const filter = {};

  if (status && status !== 'all') {
    filter.status = status;
  }
  if (issueType) {
    filter.issueType = issueType;
  }
  if (search) {
    const s = new RegExp(search.trim(), 'i');
    filter.$or = [{ providerName: s }, { description: s }, { userEmail: s }];
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Number(limit));
  const total = await Correction.countDocuments(filter);
  const data = await Correction.find(filter)
    .populate('providerId')
    .sort({ createdAt: -1 })
    .skip((pageNum - 1) * limitNum)
    .limit(limitNum);

  res.json({
    success: true,
    data,
    pagination: {
      page: pageNum,
      limit: limitNum,
      total,
      pages: Math.max(1, Math.ceil(total / limitNum)),
    },
  });
});

// GET /api/admin/corrections/:id
exports.getCorrection = asyncHandler(async (req, res) => {
  const correction = await Correction.findById(req.params.id).populate('providerId');
  if (!correction) {
    return res.status(404).json({ success: false, message: 'Correction not found' });
  }
  res.json({ success: true, data: correction });
});

// PUT /api/admin/corrections/:id/approve
exports.approveCorrection = asyncHandler(async (req, res) => {
  const correction = await Correction.findById(req.params.id);
  if (!correction) {
    return res.status(404).json({ success: false, message: 'Correction request not found' });
  }

  // Find associated provider
  let provider = null;
  if (correction.providerId) {
    provider = await Provider.findById(correction.providerId);
  }
  if (!provider && correction.providerName) {
    provider = await Provider.findOne({
      name: new RegExp(`^${correction.providerName.trim()}$`, 'i'),
    });
  }

  const changesAudit = {};

  if (provider) {
    // 1. Permanently closed business -> mark inactive without deleting record
    if (correction.issueType === 'closed_business') {
      provider.isActive = false;
      provider.isOpen = false;
      changesAudit.isActive = false;
      changesAudit.isOpen = false;
      changesAudit.note = 'Marked permanently closed / inactive via approved correction';
    } else {
      // 2. Apply field modifications if provided in request body
      const allowedFields = ['name', 'address', 'phone', 'category', 'website', 'city', 'pincode', 'description'];
      const updates = (req.body && req.body.updatedFields) || {};

      allowedFields.forEach((field) => {
        if (updates[field] !== undefined) {
          changesAudit[field] = { before: provider[field], after: updates[field] };
          provider[field] = updates[field];
        }
      });
    }

    // PRESERVE RATINGS AND REVIEW COUNTS
    // provider.rating and provider.reviewCount are untouched
    await provider.save();
    correction.providerId = provider._id;
  }

  correction.status = 'resolved';
  correction.reviewedBy = req.admin?.email || 'admin';
  correction.reviewedAt = new Date();
  correction.appliedChanges = changesAudit;
  await correction.save();

  res.json({
    success: true,
    message: 'Correction approved and applied to provider record successfully',
    data: { correction, provider },
  });
});

// PUT /api/admin/corrections/:id/reject
exports.rejectCorrection = asyncHandler(async (req, res) => {
  const correction = await Correction.findById(req.params.id);
  if (!correction) {
    return res.status(404).json({ success: false, message: 'Correction request not found' });
  }

  correction.status = 'rejected';
  correction.reviewedBy = req.admin?.email || 'admin';
  correction.reviewedAt = new Date();
  await correction.save();

  // Rejected correction does NOT touch provider
  res.json({
    success: true,
    message: 'Correction rejected; provider records remain unchanged',
    data: correction,
  });
});

// PUT /api/admin/corrections/:id/review
exports.markCorrectionReviewed = asyncHandler(async (req, res) => {
  const correction = await Correction.findById(req.params.id);
  if (!correction) {
    return res.status(404).json({ success: false, message: 'Correction request not found' });
  }

  correction.status = 'reviewed';
  correction.reviewedBy = req.admin?.email || 'admin';
  correction.reviewedAt = new Date();
  await correction.save();

  res.json({
    success: true,
    message: 'Correction marked as reviewed',
    data: correction,
  });
});

