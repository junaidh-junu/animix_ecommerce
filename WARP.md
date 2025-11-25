# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

AnimiX is a full-stack anime e-commerce platform built with Next.js 14 (App Router), TypeScript, MongoDB, Stripe, and NextAuth.js. It features a shopping cart with persistent state, admin dashboard, and complete payment processing.

## Development Commands

### Essential Commands
```bash
npm run dev      # Start development server at http://localhost:3000
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Build Issues
If encountering build errors:
```bash
rm -rf .next                        # Clear Next.js cache
rm -rf node_modules && npm install  # Reinstall dependencies
```

## Environment Setup

Required environment variables (`.env.local`):
- `MONGODB_URI` - MongoDB connection string
- `NEXTAUTH_SECRET` - Generate with: `openssl rand -base64 32`
- `NEXTAUTH_URL` - Application URL (http://localhost:3000 in dev)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe publishable key
- `STRIPE_SECRET_KEY` - Stripe secret key
- `STRIPE_WEBHOOK_SECRET` - Stripe webhook secret (optional in dev)
- `ADMIN_EMAIL` - Email address that gets admin role on signup

### Stripe Development Workflow
For local webhook testing:
```bash
stripe listen --forward-to localhost:3000/api/webhook/stripe
```

## Architecture

### Tech Stack
- **Framework:** Next.js 14 with App Router and React Server Components
- **Language:** TypeScript with path alias `@/*` → root directory
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** NextAuth.js v5 (beta) with credentials provider
- **State Management:** Zustand with persist middleware for cart
- **Payments:** Stripe Checkout
- **Styling:** Tailwind CSS v4
- **Animations:** Framer Motion
- **UI:** Custom components with Lucide React icons
- **Notifications:** React Hot Toast

### Application Structure

#### Core Directory Layout
```
app/                     # Next.js App Router
├── api/                # API routes (server-side only)
│   ├── auth/          # NextAuth handlers and registration
│   ├── products/      # Product CRUD (GET all/create, GET/PUT/DELETE by ID)
│   ├── orders/        # Order creation and retrieval
│   └── checkout/      # Stripe checkout session creation
├── products/          # Product catalog and detail pages
├── cart/              # Shopping cart page
├── checkout/          # Checkout flow and success page
├── orders/            # User order history
├── admin/             # Admin dashboard (protected)
└── auth/              # Sign in/Sign up pages

lib/                    # Shared utilities
├── db/                # MongoDB connection (singleton pattern with caching)
├── models/            # Mongoose schemas (User, Product, Order)
├── store/             # Zustand stores (cartStore with localStorage persistence)
├── types/             # TypeScript interfaces
└── utils/             # Helper functions

components/
├── ui/                # Reusable UI components (Button, Input, Card, etc.)
├── layout/            # Navbar and Footer
├── products/          # Product-specific components
└── cart/              # Cart-specific components
```

### Database Schema

#### Product Model
- **Category enum:** 't-shirt', 'hoodie', 'poster', 'mug', 'figure', 'accessory', 'other'
- **Indexed fields:** name, description, anime (text search)
- **Default values:** sizes ['S', 'M', 'L', 'XL', 'XXL'], colors ['Black', 'White']
- **Required:** name, description, price, images (array), category, anime, stock

#### User Model
- **Role enum:** 'user', 'admin'
- **Admin detection:** User with email matching `ADMIN_EMAIL` env variable automatically gets admin role
- **Password:** Hashed with bcryptjs (minlength: 6)

#### Order Model
- **Status enum:** 'pending', 'processing', 'shipped', 'delivered', 'cancelled'
- **Embedded schemas:** orderItems (product refs), shippingAddress
- **Payment tracking:** isPaid, paidAt, paymentResult (Stripe data)
- **Pricing:** itemsPrice, taxPrice, shippingPrice, totalPrice

### Authentication Flow

NextAuth.js is configured in `lib/auth.ts`:
- **Provider:** Credentials (email/password)
- **Session strategy:** JWT
- **Custom pages:** Sign in at `/auth/signin`
- **JWT callback:** Adds user role and ID to token
- **Session callback:** Adds role and ID to session object

For protected routes, use:
```typescript
import { getToken } from 'next-auth/jwt';
const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
```

### State Management

Cart state uses Zustand with localStorage persistence:
- **Store name:** 'animix-cart'
- **Item uniqueness:** Combination of product ID, size, and color
- **Stock validation:** Prevents adding more items than available stock
- **Methods:** addItem, removeItem, updateQuantity, clearCart, getTotalItems, getTotalPrice

### API Patterns

#### Product Filtering
The products API (`/api/products`) supports:
- Pagination: `?page=1&limit=12`
- Category: `?category=t-shirt`
- Anime: `?anime=Naruto`
- Search: `?search=hokage` (uses MongoDB text search)
- Featured: `?featured=true`
- Sorting: `?sort=-createdAt` (default) or `sort=price`

#### Error Handling
All API routes follow the pattern:
```typescript
try {
  await connectDB();
  // operation
  return NextResponse.json({ data });
} catch (error: any) {
  console.error('Description:', error);
  return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
}
```

### Database Connection

MongoDB connection uses a singleton pattern with global caching to prevent connection exhaustion in serverless environments. The `connectDB()` function is called at the start of every API route.

### Payment Flow

1. User proceeds to checkout from cart
2. Order is created in database with `isPaid: false`
3. Stripe checkout session created with order ID in metadata
4. User redirected to Stripe Checkout
5. On success, user redirected to `/checkout/success?session_id={...}&order_id={...}`
6. Webhook handler (if configured) updates order status to paid

**Test card:** 4242 4242 4242 4242, any future expiry, any 3-digit CVC

## Development Guidelines

### Adding New Product Categories
1. Update the category enum in `lib/models/Product.ts`
2. Update the admin dashboard dropdown in `app/admin/page.tsx`

### Creating Admin Features
Check user role from session:
```typescript
import { auth } from '@/app/api/auth/[...nextauth]/route';
const session = await auth();
if (session?.user?.role !== 'admin') {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
}
```

### Image Handling
- Next.js Image component configured to allow all HTTPS hostnames
- Product images stored as array of URLs (comma-separated in admin form)
- Use external image hosting (Cloudinary, S3, etc.)

### TypeScript Configuration
- Build errors ignored: `typescript.ignoreBuildErrors: true` in next.config.ts
- Path alias: `@/*` maps to project root
- When adding new types, consider adding to `lib/types/index.ts`

### Styling Conventions
- Tailwind CSS v4 with custom color scheme (primary, secondary, accent gradients)
- Anime-themed vibrant colors with gradient backgrounds
- Framer Motion for smooth page transitions and animations
- Mobile-first responsive design

## Testing

### Local Testing Flow
1. Start MongoDB (Docker: `docker run -d -p 27017:27017 --name mongodb mongo:latest`)
2. Run `npm run dev`
3. Sign up with admin email to get admin role
4. Add products via `/admin`
5. Test shopping flow with Stripe test card

### Before Deployment
- Ensure all environment variables are set in Vercel
- Use MongoDB Atlas (not local MongoDB)
- Configure Stripe webhook endpoint with production URL
- Generate new `NEXTAUTH_SECRET` for production

## Common Issues

### MongoDB Connection Errors
- Verify `MONGODB_URI` format: `mongodb://localhost:27017/animix_ecommerce` or `mongodb+srv://...`
- For MongoDB Atlas, whitelist IP addresses (or use 0.0.0.0/0 for testing)

### Stripe Payment Issues
- Ensure using test keys in development (`pk_test_...` and `sk_test_...`)
- Webhook secret only needed for order status updates (optional in dev)

### NextAuth Issues
- `NEXTAUTH_SECRET` must be set and match between environments
- `NEXTAUTH_URL` should match the deployment URL
- Session strategy is JWT, not database
