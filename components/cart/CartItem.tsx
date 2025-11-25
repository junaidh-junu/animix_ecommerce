'use client';

import React from 'react';
import Image from 'next/image';
import { Trash2, Plus, Minus } from 'lucide-react';
import { CartItem as CartItemType } from '@/lib/store/cartStore';
import { formatPrice } from '@/lib/utils/helpers';
import { motion } from 'framer-motion';

interface CartItemProps {
  item: CartItemType;
  onUpdateQuantity: (quantity: number) => void;
  onRemove: () => void;
}

export default function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -100 }}
      className="flex gap-4 py-4 border-b"
    >
      <div className="relative w-24 h-24 flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden">
        <Image src={item.image} alt={item.name} fill className="object-cover" />
      </div>

      <div className="flex-1">
        <h3 className="font-semibold text-gray-800">{item.name}</h3>
        <div className="text-sm text-gray-500 mt-1">
          {item.size && <span>Size: {item.size}</span>}
          {item.size && item.color && <span> | </span>}
          {item.color && <span>Color: {item.color}</span>}
        </div>
        <div className="text-primary-600 font-bold mt-2">{formatPrice(item.price)}</div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <button
          onClick={onRemove}
          className="text-red-500 hover:text-red-700 transition-colors"
        >
          <Trash2 size={18} />
        </button>

        <div className="flex items-center gap-2">
          <button
            onClick={() => onUpdateQuantity(item.quantity - 1)}
            disabled={item.quantity <= 1}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <Minus size={16} />
          </button>
          <span className="w-8 text-center font-semibold">{item.quantity}</span>
          <button
            onClick={() => onUpdateQuantity(item.quantity + 1)}
            disabled={item.quantity >= item.stock}
            className="p-1 rounded-md hover:bg-gray-100 disabled:opacity-50"
          >
            <Plus size={16} />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
