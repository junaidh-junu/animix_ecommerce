import mongoose, { Schema, models } from 'mongoose';

export interface IProduct {
  _id: string;
  name: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  anime: string;
  sizes: string[];
  colors: string[];
  stock: number;
  featured: boolean;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const ProductSchema = new Schema<IProduct>(
  {
    name: {
      type: String,
      required: [true, 'Please provide a product name'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a description'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a price'],
      min: 0,
    },
    images: {
      type: [String],
      required: [true, 'Please provide at least one image'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a category'],
      enum: ['t-shirt', 'hoodie', 'poster', 'mug', 'figure', 'accessory', 'other'],
    },
    anime: {
      type: String,
      required: [true, 'Please specify the anime'],
    },
    sizes: {
      type: [String],
      default: ['S', 'M', 'L', 'XL', 'XXL'],
    },
    colors: {
      type: [String],
      default: ['Black', 'White'],
    },
    stock: {
      type: Number,
      required: true,
      min: 0,
      default: 0,
    },
    featured: {
      type: Boolean,
      default: false,
    },
    tags: {
      type: [String],
      default: [],
    },
  },
  {
    timestamps: true,
  }
);

ProductSchema.index({ name: 'text', description: 'text', anime: 'text' });

const Product = models.Product || mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
