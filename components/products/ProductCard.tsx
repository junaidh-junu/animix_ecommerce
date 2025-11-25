import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Product } from '@/lib/types';
import { formatPrice } from '@/lib/utils/helpers';
import Card from '@/components/ui/Card';
import { ShoppingCart } from 'lucide-react';

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  return (
    <Card hover className="group">
      <Link href={`/products/${product._id}`}>
        <div className="relative aspect-square overflow-hidden bg-gray-100">
          <Image
            src={product.images[0] || '/placeholder.png'}
            alt={product.name}
            fill
            className="object-cover group-hover:scale-110 transition-transform duration-300"
          />
          {product.featured && (
            <div className="absolute top-2 right-2 bg-accent-500 text-white px-2 py-1 rounded-md text-xs font-bold">
              Featured
            </div>
          )}
          {product.stock === 0 && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
              <span className="text-white font-bold text-lg">Out of Stock</span>
            </div>
          )}
        </div>
        <div className="p-4">
          <div className="text-xs text-secondary-500 font-semibold uppercase mb-1">
            {product.anime}
          </div>
          <h3 className="font-semibold text-gray-800 mb-2 line-clamp-2 group-hover:text-primary-500 transition-colors">
            {product.name}
          </h3>
          <div className="flex items-center justify-between">
            <span className="text-lg font-bold text-primary-600">
              {formatPrice(product.price)}
            </span>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-primary-500 text-white p-2 rounded-full hover:bg-primary-600 transition-colors"
              onClick={(e) => {
                e.preventDefault();
                // Add to cart functionality
              }}
            >
              <ShoppingCart size={18} />
            </motion.button>
          </div>
        </div>
      </Link>
    </Card>
  );
}
