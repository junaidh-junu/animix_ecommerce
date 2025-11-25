import React from 'react';
import Link from 'next/link';
import { Github, Twitter, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-dark-900 text-white mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div>
            <h3 className="text-2xl font-bold mb-4 text-primary-400">⚡ AnimiX</h3>
            <p className="text-gray-400">
              Your ultimate destination for anime-themed merchandise. Quality products for true anime fans.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Shop</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-400 hover:text-primary-400 transition-colors">
                  All Products
                </Link>
              </li>
              <li>
                <Link href="/products?category=t-shirt" className="text-gray-400 hover:text-primary-400 transition-colors">
                  T-Shirts
                </Link>
              </li>
              <li>
                <Link href="/products?category=hoodie" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Hoodies
                </Link>
              </li>
              <li>
                <Link href="/products?featured=true" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Featured
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Support</h4>
            <ul className="space-y-2">
              <li>
                <Link href="/about" className="text-gray-400 hover:text-primary-400 transition-colors">
                  About Us
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/shipping" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Shipping Info
                </Link>
              </li>
              <li>
                <Link href="/returns" className="text-gray-400 hover:text-primary-400 transition-colors">
                  Returns
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-lg font-semibold mb-4">Follow Us</h4>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-primary-400 transition-colors">
                <Github size={24} />
              </a>
            </div>
            <p className="mt-4 text-gray-400 text-sm">
              Stay updated with our latest releases and exclusive offers!
            </p>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} AnimiX. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
