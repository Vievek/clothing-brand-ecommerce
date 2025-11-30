import mongoose from "mongoose";

// Constants for magic numbers
const MAX_NAME_LENGTH = 100;
const MAX_DESCRIPTION_LENGTH = 1000;
const MIN_PRICE = 0;
const MIN_STOCK = 0;

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [MAX_NAME_LENGTH, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [
        MAX_DESCRIPTION_LENGTH,
        "Description cannot exceed 1000 characters",
      ],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [MIN_PRICE, "Price cannot be negative"],
    },
    imageUrl: {
      type: String,
      required: [true, "Product image is required"],
      validate: {
        validator: function (url) {
          return /^https?:\/\/.+\..+/.test(url);
        },
        message: "Please provide a valid image URL",
      },
    },
    category: {
      type: String,
      required: [true, "Product category is required"],
      enum: {
        values: ["Men", "Women", "Kids"],
        message: "Category must be Men, Women, or Kids",
      },
    },
    sizes: [
      {
        type: String,
        enum: ["S", "M", "L", "XL"],
        required: true,
      },
    ],
    stock: {
      type: Number,
      required: [true, "Stock quantity is required"],
      min: [MIN_STOCK, "Stock cannot be negative"],
      default: 0,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

// Index for search functionality
productSchema.index({ name: "text", description: "text" });
productSchema.index({ category: 1, price: 1 });

export default mongoose.model("Product", productSchema);
