'use client';

import { useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Button from '@/components/ui/Button';
import { CheckCircle } from 'lucide-react';
import { useCartStore } from '@/lib/store/cartStore';

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('order_id');
  const clearCart = useCartStore((state) => state.clearCart);

  useEffect(() => {
    clearCart();
  }, [clearCart]);

  return (
    <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 py-20 text-center">
      <CheckCircle size={80} className="mx-auto text-green-500 mb-6" />
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Order Successful!</h1>
      <p className="text-xl text-gray-600 mb-8">
        Thank you for your purchase. Your order has been confirmed.
      </p>
      {orderId && (
        <p className="text-gray-500 mb-8">
          Order ID: <span className="font-mono font-semibold">{orderId}</span>
        </p>
      )}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/orders">
          <Button size="lg">View Orders</Button>
        </Link>
        <Link href="/products">
          <Button size="lg" variant="outline">
            Continue Shopping
          </Button>
        </Link>
      </div>
    </div>
  );
}
