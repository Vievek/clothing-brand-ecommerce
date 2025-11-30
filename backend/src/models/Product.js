import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Product name is required"],
      trim: true,
      maxlength: [100, "Product name cannot exceed 100 characters"],
    },
    description: {
      type: String,
      required: [true, "Product description is required"],
      maxlength: [1000, "Description cannot exceed 1000 characters"],
    },
    price: {
      type: Number,
      required: [true, "Product price is required"],
      min: [0, "Price cannot be negative"],
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
      min: [0, "Stock cannot be negative"],
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
