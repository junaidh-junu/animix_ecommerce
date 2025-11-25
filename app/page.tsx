import Link from 'next/link';
import Button from '@/components/ui/Button';
import ProductGrid from '@/components/products/ProductGrid';
import { motion } from 'framer-motion';

async function getFeaturedProducts() {
  try {
    const res = await fetch(`${process.env.NEXTAUTH_URL}/api/products?featured=true&limit=8`, {
      cache: 'no-store',
    });
    if (!res.ok) return { products: [] };
    const data = await res.json();
    return data;
  } catch (error) {
    return { products: [] };
  }
}

export default async function Home() {
  const { products } = await getFeaturedProducts();

  return (
    <div>
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white py-20 overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-10 left-10 w-32 h-32 bg-accent-500 rounded-full blur-3xl animate-float"></div>
          <div className="absolute bottom-10 right-10 w-40 h-40 bg-secondary-500 rounded-full blur-3xl animate-float" style={{ animationDelay: '1s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Welcome to AnimiX ⚡
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-gray-100">
              Premium anime merchandise for true fans
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/products">
                <Button size="lg" variant="secondary">
                  Shop Now
                </Button>
              </Link>
              <Link href="/products?featured=true">
                <Button size="lg" variant="outline" className="bg-white/10 border-white text-white hover:bg-white/20">
                  Featured Products
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12 text-gray-800">
            Shop by Category
          </h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {[
              { name: 'T-Shirts', emoji: '👕', category: 't-shirt' },
              { name: 'Hoodies', emoji: '🧥', category: 'hoodie' },
              { name: 'Posters', emoji: '🖼️', category: 'poster' },
              { name: 'Figures', emoji: '🎭', category: 'figure' },
            ].map((cat) => (
              <Link
                key={cat.category}
                href={`/products?category=${cat.category}`}
                className="group"
              >
                <div className="bg-gradient-to-br from-primary-50 to-secondary-50 rounded-xl p-8 text-center hover:shadow-lg transition-all duration-300 group-hover:scale-105">
                  <div className="text-5xl mb-3">{cat.emoji}</div>
                  <h3 className="font-semibold text-gray-800 group-hover:text-primary-600 transition-colors">
                    {cat.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      {products && products.length > 0 && (
        <section className="py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center mb-12">
              <h2 className="text-3xl font-bold text-gray-800">Featured Products</h2>
              <Link href="/products?featured=true" className="text-primary-500 hover:text-primary-600 font-semibold">
                View All →
              </Link>
            </div>
            <ProductGrid products={products} />
          </div>
        </section>
      )}

      {/* Benefits Section */}
      <section className="py-16 bg-dark-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl mb-4">🚚</div>
              <h3 className="text-xl font-semibold mb-2">Free Shipping</h3>
              <p className="text-gray-400">On orders over $100</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">✨</div>
              <h3 className="text-xl font-semibold mb-2">Premium Quality</h3>
              <p className="text-gray-400">Authentic merchandise</p>
            </div>
            <div className="text-center">
              <div className="text-4xl mb-4">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Secure Payment</h3>
              <p className="text-gray-400">Safe & encrypted checkout</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
