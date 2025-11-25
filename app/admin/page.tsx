'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import { Product, Order } from '@/lib/types';
import { formatPrice } from '@/lib/utils/helpers';
import toast from 'react-hot-toast';

export default function AdminPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'products' | 'orders'>('products');

  const [newProduct, setNewProduct] = useState({
    name: '',
    description: '',
    price: '',
    anime: '',
    category: 't-shirt',
    stock: '',
    images: '',
    featured: false,
  });

  useEffect(() => {
    if (status === 'unauthenticated' || (session && (session.user as any).role !== 'admin')) {
      router.push('/');
    } else if (status === 'authenticated') {
      fetchData();
    }
  }, [status, session]);

  const fetchData = async () => {
    try {
      const [productsRes, ordersRes] = await Promise.all([
        fetch('/api/products?limit=100'),
        fetch('/api/orders'),
      ]);
      const productsData = await productsRes.json();
      const ordersData = await ordersRes.json();
      setProducts(productsData.products || []);
      setOrders(ordersData.orders || []);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateProduct = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch('/api/products', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...newProduct,
          price: parseFloat(newProduct.price),
          stock: parseInt(newProduct.stock),
          images: newProduct.images.split(',').map((img) => img.trim()),
          sizes: ['S', 'M', 'L', 'XL', 'XXL'],
          colors: ['Black', 'White'],
        }),
      });

      if (!res.ok) throw new Error('Failed to create product');

      toast.success('Product created successfully!');
      setNewProduct({
        name: '',
        description: '',
        price: '',
        anime: '',
        category: 't-shirt',
        stock: '',
        images: '',
        featured: false,
      });
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create product');
    }
  };

  const handleDeleteProduct = async (id: string) => {
    if (!confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete product');

      toast.success('Product deleted successfully!');
      fetchData();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete product');
    }
  };

  if (loading || status === 'loading') {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Admin Dashboard</h1>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Products</h3>
          <p className="text-3xl font-bold text-primary-600">{products.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Total Orders</h3>
          <p className="text-3xl font-bold text-secondary-600">{orders.length}</p>
        </Card>
        <Card className="p-6">
          <h3 className="text-gray-600 text-sm font-semibold uppercase mb-2">Revenue</h3>
          <p className="text-3xl font-bold text-accent-600">
            {formatPrice(orders.reduce((sum, order) => sum + order.totalPrice, 0))}
          </p>
        </Card>
      </div>

      {/* Tabs */}
      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setActiveTab('products')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'products'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Products
        </button>
        <button
          onClick={() => setActiveTab('orders')}
          className={`px-6 py-2 rounded-lg font-semibold transition-colors ${
            activeTab === 'orders'
              ? 'bg-primary-500 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Orders
        </button>
      </div>

      {/* Products Tab */}
      {activeTab === 'products' && (
        <div>
          <Card className="p-6 mb-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Create New Product</h2>
            <form onSubmit={handleCreateProduct} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input
                  label="Product Name"
                  value={newProduct.name}
                  onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                  required
                />
                <Input
                  label="Anime"
                  value={newProduct.anime}
                  onChange={(e) => setNewProduct({ ...newProduct, anime: e.target.value })}
                  required
                />
                <Input
                  label="Price"
                  type="number"
                  step="0.01"
                  value={newProduct.price}
                  onChange={(e) => setNewProduct({ ...newProduct, price: e.target.value })}
                  required
                />
                <Input
                  label="Stock"
                  type="number"
                  value={newProduct.stock}
                  onChange={(e) => setNewProduct({ ...newProduct, stock: e.target.value })}
                  required
                />
              </div>
              <Input
                label="Description"
                value={newProduct.description}
                onChange={(e) => setNewProduct({ ...newProduct, description: e.target.value })}
                required
              />
              <Input
                label="Images (comma separated URLs)"
                value={newProduct.images}
                onChange={(e) => setNewProduct({ ...newProduct, images: e.target.value })}
                required
              />
              <div className="flex items-center gap-4">
                <select
                  value={newProduct.category}
                  onChange={(e) => setNewProduct({ ...newProduct, category: e.target.value })}
                  className="px-4 py-2.5 border-2 border-gray-200 rounded-lg focus:border-primary-500 focus:outline-none"
                >
                  <option value="t-shirt">T-Shirt</option>
                  <option value="hoodie">Hoodie</option>
                  <option value="poster">Poster</option>
                  <option value="mug">Mug</option>
                  <option value="figure">Figure</option>
                  <option value="accessory">Accessory</option>
                  <option value="other">Other</option>
                </select>
                <label className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    checked={newProduct.featured}
                    onChange={(e) => setNewProduct({ ...newProduct, featured: e.target.checked })}
                    className="w-4 h-4"
                  />
                  <span>Featured</span>
                </label>
              </div>
              <Button type="submit">Create Product</Button>
            </form>
          </Card>

          <Card className="p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">All Products</h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Anime</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product._id} className="border-t">
                      <td className="px-4 py-3 text-sm text-gray-800">{product.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.anime}</td>
                      <td className="px-4 py-3 text-sm font-semibold">{formatPrice(product.price)}</td>
                      <td className="px-4 py-3 text-sm text-gray-600">{product.stock}</td>
                      <td className="px-4 py-3 text-sm">
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className="text-red-500 hover:text-red-700 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </div>
      )}

      {/* Orders Tab */}
      {activeTab === 'orders' && (
        <Card className="p-6">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">All Orders</h2>
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="border-b pb-4">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <p className="font-semibold">Order #{order._id.slice(-8).toUpperCase()}</p>
                    <p className="text-sm text-gray-600">{order.shippingAddress.fullName}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-primary-600">{formatPrice(order.totalPrice)}</p>
                    <span
                      className={`text-sm px-2 py-1 rounded ${
                        order.status === 'delivered'
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }`}
                    >
                      {order.status}
                    </span>
                  </div>
                </div>
                <p className="text-sm text-gray-500">
                  {order.orderItems.length} items • {order.isPaid ? 'Paid' : 'Unpaid'}
                </p>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
