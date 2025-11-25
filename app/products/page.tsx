'use client';

import { useEffect, useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import ProductGrid from '@/components/products/ProductGrid';
import { Product } from '@/lib/types';
import Button from '@/components/ui/Button';

// Loading fallback component
function ProductsLoading() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">Loading Products...</h1>
        <p className="text-gray-600">
          Discover our collection of premium anime merchandise
        </p>
      </div>
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    </div>
  );
}

// Component that uses useSearchParams - must be wrapped in Suspense
function ProductsContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const category = searchParams.get('category');
  const anime = searchParams.get('anime');
  const featured = searchParams.get('featured');
  const search = searchParams.get('search');

  useEffect(() => {
    fetchProducts();
  }, [page, category, anime, featured, search]);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: '12',
      });

      if (category) params.append('category', category);
      if (anime) params.append('anime', anime);
      if (featured) params.append('featured', 'true');
      if (search) params.append('search', search);

      const res = await fetch(`/api/products?${params}`);
      const data = await res.json();

      setProducts(data.products || []);
      setTotalPages(data.pagination?.pages || 1);
    } catch (error) {
      console.error('Error fetching products:', error);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-4">
          {featured ? 'Featured Products' : category ? `${category.charAt(0).toUpperCase() + category.slice(1)}s` : anime ? anime : search ? `Search: "${search}"` : 'All Products'}
        </h1>
        <p className="text-gray-600">
          Discover our collection of premium anime merchandise
        </p>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
        </div>
      ) : (
        <>
          <ProductGrid products={products} />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center gap-2 mt-12">
              <Button
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
                variant="outline"
              >
                Previous
              </Button>
              <div className="flex items-center px-4">
                Page {page} of {totalPages}
              </div>
              <Button
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                variant="outline"
              >
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}

// Main page component with proper Suspense boundary
export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsLoading />}>
      <ProductsContent />
    </Suspense>
  );
}
