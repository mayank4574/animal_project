const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/providers
exports.getProviders = asyncHandler(async (req, res) => {
  const {
    page = 1,
    limit = 12,
    category,
    city,
    area,
    location,
    pincode,
    minRating,
    search,
    isOpen,
    openNow,
    sort = 'relevance',
  } = req.query;

  const andClauses = [
    { verificationStatus: 'verified', isActive: { $ne: false } },
  ];

  if (category) {
    const trimmed = category.trim();
    const base = trimmed.replace(/s$/i, '');
    andClauses.push({ category: new RegExp(`^${base}s?$`, 'i') });
  }

  if (city) {
    andClauses.push({ city: new RegExp(city.trim(), 'i') });
  }

  if (area) {
    andClauses.push({ address: new RegExp(area.trim(), 'i') });
  }

  if (pincode) {
    andClauses.push({ pincode: pincode.trim() });
  }

  if (location) {
    const loc = location.trim();
    const locRe = new RegExp(loc, 'i');
    andClauses.push({
      $or: [{ city: locRe }, { address: locRe }, { pincode: loc }],
    });
  }

  if (minRating) {
    const ratingNum = Number(minRating);
    if (!isNaN(ratingNum)) {
      andClauses.push({ rating: { $gte: ratingNum } });
    }
  }

  if (isOpen === 'true' || openNow === 'true') {
    andClauses.push({ isOpen: true });
  }

  if (search) {
    const s = search.trim();
    const sRe = new RegExp(s, 'i');
    andClauses.push({
      $or: [
        { name: sRe },
        { description: sRe },
        { address: sRe },
        { city: sRe },
        { pincode: sRe },
      ],
    });
  }

  const filter = andClauses.length > 0 ? { $and: andClauses } : {};

  // Relevance and safe sorting
  let sortObj = { rating: -1, reviewCount: -1 };
  if (sort === 'name' || sort === 'name-asc') {
    sortObj = { name: 1 };
  } else if (sort === '-name' || sort === 'name-desc') {
    sortObj = { name: -1 };
  } else if (sort === 'rating' || sort === '-rating' || sort === 'rating-desc') {
    sortObj = { rating: -1, reviewCount: -1 };
  } else if (sort && sort !== 'relevance') {
    sortObj = {};
    sort.split(',').forEach((field) => {
      const trimmed = field.trim();
      if (trimmed.startsWith('-')) {
        sortObj[trimmed.slice(1)] = -1;
      } else {
        sortObj[trimmed] = 1;
      }
    });
    // Fallback if empty
    if (Object.keys(sortObj).length === 0) {
      sortObj = { rating: -1, reviewCount: -1 };
    }
  }

  const pageNum = Math.max(1, Number(page));
  const limitNum = Math.max(1, Math.min(100, Number(limit)));
  const total = await Provider.countDocuments(filter);
  const data = await Provider.find(filter)
    .sort(sortObj)
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

// GET /api/providers/featured
exports.getFeatured = asyncHandler(async (_req, res) => {
  const data = await Provider.find({
    verificationStatus: 'verified',
    isActive: { $ne: false },
  })
    .sort({ rating: -1, reviewCount: -1 })
    .limit(6);
  res.json({ success: true, data });
});

// GET /api/providers/:idOrSlug
exports.getProvider = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const provider = await Provider.findOne({
    ...query,
    verificationStatus: 'verified',
    isActive: { $ne: false },
  });
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found or currently inactive' });
  }
  res.json({ success: true, data: provider });
});
