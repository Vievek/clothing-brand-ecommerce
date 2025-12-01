import { z } from 'zod';

// Constants for magic numbers
const PRODUCT_NAME_MAX_LENGTH = 100;
const PRODUCT_DESCRIPTION_MAX_LENGTH = 1000;
const PRODUCT_PRICE_MAX = 10000;
const IMAGE_URL_MAX_LENGTH = 500;
const STOCK_MAX = 10000;
const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 10;

export const productCreateSchema = z.object({
  name: z
    .string()
    .min(1, 'Product name is required')
    .max(
      PRODUCT_NAME_MAX_LENGTH,
      `Product name cannot exceed ${PRODUCT_NAME_MAX_LENGTH} characters`
    ),
  description: z
    .string()
    .min(1, 'Product description is required')
    .max(
      PRODUCT_DESCRIPTION_MAX_LENGTH,
      `Description cannot exceed ${PRODUCT_DESCRIPTION_MAX_LENGTH} characters`
    ),
  price: z
    .number()
    .positive('Price must be positive')
    .max(PRODUCT_PRICE_MAX, `Price cannot exceed $${PRODUCT_PRICE_MAX}`),
  imageUrl: z
    .string()
    .url('Please provide a valid image URL')
    .max(IMAGE_URL_MAX_LENGTH, 'Image URL too long'),
  category: z.enum(['Men', 'Women', 'Kids'], {
    errorMap: () => ({ message: 'Category must be Men, Women, or Kids' }),
  }),
  sizes: z
    .array(z.enum(['S', 'M', 'L', 'XL']))
    .min(1, 'At least one size must be selected'),
  stock: z
    .number()
    .int('Stock must be an integer')
    .min(0, 'Stock cannot be negative')
    .max(STOCK_MAX, `Stock cannot exceed ${STOCK_MAX}`),
});

export const productQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .default(DEFAULT_PAGE.toString())
    .transform(Number),
  limit: z
    .string()
    .optional()
    .default(DEFAULT_LIMIT.toString())
    .transform(Number),
  category: z.enum(['Men', 'Women', 'Kids']).optional(),
  size: z.enum(['S', 'M', 'L', 'XL']).optional(),
  minPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  maxPrice: z
    .string()
    .optional()
    .transform((val) => (val ? Number(val) : undefined)),
  search: z.string().optional(),
});
