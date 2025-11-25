# 🎌 AnimiX - Anime E-commerce Platform

A modern, full-stack e-commerce platform built with Next.js 14, featuring anime-themed merchandise. Complete with user authentication, shopping cart, payment processing via Stripe, and an admin dashboard.

![Next.js](https://img.shields.io/badge/Next.js-14-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Latest-green)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3-38bdf8)

## ✨ Features

### Frontend
- 🎨 **Anime-themed UI** with vibrant colors and smooth animations
- 📱 **Fully responsive** design for all devices
- 🛒 **Shopping cart** with persistent state (Zustand + local storage)
- 🔍 **Product search and filtering** by category, anime, and featured status
- ⚡ **Dynamic product pages** with size and color selection
- 🎭 **Smooth animations** using Framer Motion

### Backend
- 🔐 **User authentication** with NextAuth.js (credentials provider)
- 💳 **Payment processing** via Stripe Checkout
- 📦 **Order management** system
- 👤 **User profiles** and order history
- 🛡️ **Admin dashboard** for product and order management
- 🗄️ **MongoDB database** with Mongoose ODM

### E-commerce Features
- Product catalog with pagination
- Featured products section
- Category-based browsing
- Size and color variants
- Stock management
- Tax and shipping calculations
- Free shipping over $100

## 🚀 Tech Stack

- **Framework:** Next.js 14 (App Router)
- **Language:** TypeScript
- **Styling:** Tailwind CSS
- **Database:** MongoDB
- **ORM:** Mongoose
- **Authentication:** NextAuth.js
- **State Management:** Zustand
- **Payments:** Stripe
- **Animations:** Framer Motion
- **UI Components:** Custom components with Lucide icons
- **Notifications:** React Hot Toast

## 📋 Prerequisites

Before you begin, ensure you have:

- Node.js 18+ installed
- MongoDB instance (local or MongoDB Atlas)
- Stripe account for payments
- Git installed

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone <repository-url>
cd animix_ecommerce
```

### 2. Install dependencies

```bash
npm install
```

### 3. Set up environment variables

Copy `.env.example` to `.env.local` and fill in your values:

```bash
cp .env.example .env.local
```

Update the following variables in `.env.local`:

```env
# MongoDB
MONGODB_URI=mongodb://localhost:27017/animix_ecommerce
# or for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/animix_ecommerce

# NextAuth
NEXTAUTH_SECRET=your-secret-key-here
# Generate with: openssl rand -base64 32
NEXTAUTH_URL=http://localhost:3000

# Stripe (get from https://dashboard.stripe.com/apikeys)
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_key_here
STRIPE_SECRET_KEY=sk_test_your_key_here
STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Admin (this email will be granted admin privileges)
ADMIN_EMAIL=admin@animix.com
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 🗄️ Database Setup

### MongoDB Local Setup

1. Install MongoDB locally or use Docker:
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

2. The application will automatically connect and create collections on first run.

### MongoDB Atlas Setup

1. Create a free account at [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a new cluster
3. Get your connection string and add it to `MONGODB_URI`
4. Whitelist your IP address or allow access from anywhere (0.0.0.0/0)

## 💳 Stripe Setup

1. Create a Stripe account at [stripe.com](https://stripe.com)
2. Get your test API keys from the [Dashboard](https://dashboard.stripe.com/test/apikeys)
3. Add the keys to your `.env.local` file
4. For webhooks (optional in development):
   - Install Stripe CLI: https://stripe.com/docs/stripe-cli
   - Run: `stripe listen --forward-to localhost:3000/api/webhook/stripe`

## 👤 Creating Admin Account

1. Start the application
2. Sign up with the email you set as `ADMIN_EMAIL` in `.env.local`
3. This account will automatically have admin privileges
4. Access the admin dashboard at `/admin`

## 📦 Adding Sample Products

As an admin, you can add products through the admin dashboard at `/admin`:

**Example Product:**
- Name: "Naruto Hokage T-Shirt"
- Anime: "Naruto"
- Price: 29.99
- Stock: 100
- Category: t-shirt
- Description: "Show your ninja way with this premium Hokage t-shirt"
- Images: "https://example.com/image1.jpg, https://example.com/image2.jpg"

## 🌐 Deployment to Vercel

### 1. Push to GitHub

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

### 2. Deploy to Vercel

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click "New Project"
3. Import your GitHub repository
4. Configure environment variables (copy from `.env.local`)
5. Click "Deploy"

### 3. Set up MongoDB Atlas (for production)

1. Create a MongoDB Atlas cluster
2. Add the connection string to Vercel environment variables
3. Whitelist Vercel's IP addresses

### 4. Configure Stripe Webhook (for production)

1. In Stripe Dashboard, go to Webhooks
2. Add endpoint: `https://your-domain.vercel.app/api/webhook/stripe`
3. Select events: `checkout.session.completed`
4. Copy the webhook secret to Vercel environment variables

## 📁 Project Structure

```
animix_ecommerce/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   ├── auth/            # Authentication endpoints
│   │   ├── products/        # Product CRUD
│   │   ├── orders/          # Order management
│   │   └── checkout/        # Stripe checkout
│   ├── products/            # Product pages
│   ├── cart/                # Shopping cart
│   ├── checkout/            # Checkout flow
│   ├── orders/              # Order history
│   ├── admin/               # Admin dashboard
│   └── auth/                # Auth pages
├── components/              # React components
│   ├── ui/                  # UI components
│   ├── layout/              # Layout components
│   ├── products/            # Product components
│   └── cart/                # Cart components
├── lib/                     # Utilities
│   ├── db/                  # Database connection
│   ├── models/              # Mongoose models
│   ├── store/               # Zustand stores
│   ├── utils/               # Helper functions
│   └── types/               # TypeScript types
└── public/                  # Static assets
```

## 🎨 Customization

### Changing Theme Colors

Edit `tailwind.config.ts`:

```typescript
colors: {
  primary: { /* Your primary color shades */ },
  secondary: { /* Your secondary color shades */ },
  accent: { /* Your accent color shades */ },
}
```

### Adding New Product Categories

1. Update the `Product` model in `lib/models/Product.ts`
2. Add the category to the enum in the schema
3. Update the admin dashboard dropdown

## 🔧 Available Scripts

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products (with filtering)
- `GET /api/products/[id]` - Get single product
- `POST /api/products` - Create product (admin)
- `PUT /api/products/[id]` - Update product (admin)
- `DELETE /api/products/[id]` - Delete product (admin)

### Orders
- `GET /api/orders` - Get user orders
- `POST /api/orders` - Create order

### Auth
- `POST /api/auth/register` - Register new user
- `POST /api/auth/signin` - Sign in user

### Checkout
- `POST /api/checkout` - Create Stripe checkout session

## 🐛 Troubleshooting

### MongoDB Connection Issues
- Ensure MongoDB is running
- Check connection string format
- Verify network access in MongoDB Atlas

### Stripe Payment Issues
- Verify API keys are correct
- Check if using test mode keys in development
- Ensure webhook secret matches

### Build Errors
- Clear `.next` folder: `rm -rf .next`
- Delete `node_modules` and reinstall: `rm -rf node_modules && npm install`

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For support, email support@animix.com or open an issue on GitHub.

## 🎯 Roadmap

- [ ] Add product reviews and ratings
- [ ] Implement wishlist functionality
- [ ] Add email notifications
- [ ] Social media authentication
- [ ] Advanced search with filters
- [ ] Product recommendations
- [ ] Multi-currency support
- [ ] Internationalization (i18n)

---

Made with ❤️ for anime fans worldwide
