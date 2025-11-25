'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import { useCartStore } from '@/lib/store/cartStore';
import { ShoppingCart, Menu, X, User, LogOut, Package, Settings } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { data: session } = useSession();
  const totalItems = useCartStore((state) => state.getTotalItems());

  const isAdmin = (session?.user as any)?.role === 'admin';

  return (
    <nav className="bg-gradient-to-r from-primary-600 via-primary-500 to-secondary-500 text-white shadow-lg sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <motion.div
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className="text-2xl font-bold"
            >
              ⚡
            </motion.div>
            <span className="text-xl font-bold">AnimiX</span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link href="/products" className="hover:text-accent-300 transition-colors">
              Shop
            </Link>
            <Link href="/products?featured=true" className="hover:text-accent-300 transition-colors">
              Featured
            </Link>
            {isAdmin && (
              <Link href="/admin" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                <Settings size={16} />
                Admin
              </Link>
            )}
          </div>

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <Link href="/cart" className="relative hover:text-accent-300 transition-colors">
              <ShoppingCart size={24} />
              {totalItems > 0 && (
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  className="absolute -top-2 -right-2 bg-accent-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center font-bold"
                >
                  {totalItems}
                </motion.span>
              )}
            </Link>

            {/* User Menu */}
            {session ? (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/orders" className="hover:text-accent-300 transition-colors flex items-center gap-1">
                  <Package size={18} />
                  Orders
                </Link>
                <button
                  onClick={() => signOut()}
                  className="hover:text-accent-300 transition-colors flex items-center gap-1"
                >
                  <LogOut size={18} />
                  Logout
                </button>
              </div>
            ) : (
              <div className="hidden md:flex items-center space-x-4">
                <Link href="/auth/signin" className="hover:text-accent-300 transition-colors">
                  Sign In
                </Link>
                <Link
                  href="/auth/signup"
                  className="bg-white text-primary-500 px-4 py-2 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                >
                  Sign Up
                </Link>
              </div>
            )}

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="md:hidden bg-primary-700"
          >
            <div className="px-4 py-4 space-y-3">
              <Link href="/products" className="block hover:text-accent-300 transition-colors">
                Shop
              </Link>
              <Link href="/products?featured=true" className="block hover:text-accent-300 transition-colors">
                Featured
              </Link>
              {isAdmin && (
                <Link href="/admin" className="block hover:text-accent-300 transition-colors">
                  Admin Dashboard
                </Link>
              )}
              {session ? (
                <>
                  <Link href="/orders" className="block hover:text-accent-300 transition-colors">
                    My Orders
                  </Link>
                  <button
                    onClick={() => signOut()}
                    className="block w-full text-left hover:text-accent-300 transition-colors"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <>
                  <Link href="/auth/signin" className="block hover:text-accent-300 transition-colors">
                    Sign In
                  </Link>
                  <Link href="/auth/signup" className="block hover:text-accent-300 transition-colors">
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
