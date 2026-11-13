const mongoose = require('mongoose');
const Provider = require('../models/Provider');
const asyncHandler = require('../middleware/asyncHandler');

// GET /api/providers
exports.getProviders = asyncHandler(async (req, res) => {
  const { page = 1, limit = 12, category, city, pincode, minRating, search, sort } = req.query;

  const filter = {};
  if (category) filter.category = category;
  if (city) filter.city = new RegExp(city, 'i');
  if (pincode) filter.pincode = pincode;
  if (minRating) filter.rating = { $gte: Number(minRating) };
  if (search) {
    const re = new RegExp(search, 'i');
    filter.$or = [{ name: re }, { description: re }, { address: re }];
  }

  let sortObj = { rating: -1 };
  if (sort) {
    sortObj = {};
    sort.split(',').forEach((field) => {
      if (field.startsWith('-')) {
        sortObj[field.slice(1)] = -1;
      } else {
        sortObj[field] = 1;
      }
    });
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
    pagination: { page: pageNum, limit: limitNum, total, pages: Math.ceil(total / limitNum) },
  });
});

// GET /api/providers/featured
exports.getFeatured = asyncHandler(async (_req, res) => {
  const data = await Provider.find().sort({ rating: -1 }).limit(6);
  res.json({ success: true, data });
});

// GET /api/providers/:idOrSlug
exports.getProvider = asyncHandler(async (req, res) => {
  const { idOrSlug } = req.params;
  const query = mongoose.Types.ObjectId.isValid(idOrSlug)
    ? { _id: idOrSlug }
    : { slug: idOrSlug };

  const provider = await Provider.findOne(query);
  if (!provider) {
    return res.status(404).json({ success: false, message: 'Provider not found' });
  }
  res.json({ success: true, data: provider });
});
