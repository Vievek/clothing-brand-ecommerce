import Product from '../models/Product.js';
import asyncHandler from '../utils/asyncHandler.js';
import { productQuerySchema } from '../validations/productValidation.js';

const createPriceQuery = (minPrice, maxPrice) => {
  const priceQuery = {};
  if (minPrice !== undefined) {
    priceQuery.$gte = minPrice;
  }
  if (maxPrice !== undefined) {
    priceQuery.$lte = maxPrice;
  }
  return priceQuery;
};

const buildProductQuery = (validatedQuery) => {
  const { category, size, minPrice, maxPrice, search } = validatedQuery;
  const query = { isActive: true };

  if (category) {
    query.category = category;
  }
  if (size) {
    query.sizes = size;
  }

  if (minPrice !== undefined || maxPrice !== undefined) {
    query.price = createPriceQuery(minPrice, maxPrice);
  }

  if (search) {
    query.$text = { $search: search };
  }

  return query;
};

const calculatePagination = (total, page, limit) => {
  const totalPages = Math.ceil(total / limit);
  const hasNext = page < totalPages;
  const hasPrev = page > 1;

  return {
    page,
    limit,
    total,
    totalPages,
    hasNext,
    hasPrev,
  };
};

export const getProducts = asyncHandler(async (req, res) => {
  const validatedQuery = productQuerySchema.parse(req.query);
  const { page, limit } = validatedQuery;

  const query = buildProductQuery(validatedQuery);
  const skip = (page - 1) * limit;

  const [products, total] = await Promise.all([
    Product.find(query).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
    Product.countDocuments(query),
  ]);

  const pagination = calculatePagination(total, page, limit);

  res.json({
    status: 'success',
    data: {
      products,
      pagination,
    },
  });
});

export const getProductById = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);

  if (!product || !product.isActive) {
    const notFoundCode = 404;
    return res.status(notFoundCode).json({
      status: 'fail',
      message: 'Product not found',
    });
  }

  return res.json({
    status: 'success',
    data: { product },
  });
});

export const getProductCategories = asyncHandler(async (_req, res) => {
  const categories = await Product.distinct('category', { isActive: true });

  return res.json({
    status: 'success',
    data: { categories },
  });
});
