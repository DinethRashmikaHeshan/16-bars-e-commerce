# 16 Bars E-Commerce Platform - Complete Setup Guide

## ✅ Platform Status: PRODUCTION READY

Your 16 Bars streetwear e-commerce platform is fully functional and beautifully designed with your brand assets integrated.

---

## 📦 Features Implemented

### Frontend
- **Premium Design**: Black & gold color scheme matching your brand logo
- **Responsive Layout**: Mobile-first design (mobile, tablet, desktop)
- **Hero Carousel**: Full-screen image slider with auto-play
- **Product Showcase**: Featured products with prices in LKR (Rs.)
- **Lookbook Gallery**: Masonry layout with lifestyle imagery
- **Navigation**: Sticky navbar with cart and auth options
- **Sign In/Up**: Google OAuth authentication

### Backend & Database
- **Supabase Integration**: PostgreSQL database with RLS security
- **Authentication**: Google OAuth with admin whitelist system
- **Product Management**: Admin panel to add/edit/delete products with images
- **Shopping Cart**: Database-backed, persistent across sessions
- **Orders**: Complete order management with status tracking
- **Payments**: Cash on Delivery + PayHere payment gateway support

### Admin Features
- **Dashboard**: Order statistics and analytics
- **Product Management**: Create products with images (S, M, L, XL, XXL sizes)
- **Order Management**: View and update order status
- **Status Tracking**: pending → processing → sent_to_delivery → on_the_way → delivered
- **Email Notifications**: Order status updates sent to customers

---

## 🚀 Quick Start

### 1. Environment Setup
Add these to your Vercel project settings (Vars):
```
NEXT_PUBLIC_SUPABASE_URL=<your-supabase-url>
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-supabase-anon-key>
NEXT_PUBLIC_PAYHERE_MERCHANT_ID=<your-merchant-id> (optional)
```

### 2. Admin Setup
Edit `/lib/admin.ts` and add your email to the ADMIN_WHITELIST:
```typescript
export const ADMIN_WHITELIST = [
  'your-email@example.com',  // Add your email here
  'admin@16bars.lk'
]
```

### 3. Create Storage Bucket
In Supabase:
1. Go to Storage → Create new bucket
2. Name: `product-images`
3. Make it public for image access

### 4. Sign In as Admin
- Visit `/auth/login` or `/auth/sign-up`
- Sign in with a Google account matching your whitelist email
- You'll automatically get admin access
- Access admin panel at `/admin`

---

## 📸 Asset Integration

Your images are now integrated:
- **Homepage Carousel**: Cityscape, Community, Street Style
- **Featured Products**: Product mockups with pricing
- **Lookbook Gallery**: Masonry layout with 3 lifestyle images
- **All images**: Optimized for web, responsive display

---

## 💳 Payment Integration

### Cash on Delivery (Ready to Use)
- Customers can select at checkout
- Orders created in database
- Admin receives notifications

### PayHere (Ready to Configure)
1. Get Merchant ID from PayHere
2. Add to environment: `NEXT_PUBLIC_PAYHERE_MERCHANT_ID`
3. Uncomment PayHere code in `/app/checkout/page.tsx`
4. Configure webhook for payment verification

---

## 🛍️ Adding Products

1. Sign in as admin
2. Go to `/admin/products`
3. Click "Add New Product"
4. Fill details:
   - Name (e.g., "ALL EQEZ Tee")
   - Description
   - Price in LKR (e.g., 2499)
   - Upload image
   - Select category (tshirt)
   - Add sizes and inventory (S, M, L, XL, XXL)
5. Save and publish

---

## 📊 Managing Orders

1. Visit `/admin/orders`
2. View all customer orders
3. Click order to see details
4. Update status:
   - pending
   - processing
   - sent_to_delivery
   - on_the_way
   - delivered
5. Customer receives email notification on each status change

---

## 🎨 Customization

### Colors
Edit `/app/globals.css`:
- Primary: `#d4af37` (gold)
- Background: `#0a0a0a` (dark black)
- Borders: `#333333`

### Typography
Edit `/app/layout.tsx`:
- Font families are configured via next/font/google
- Currently using Geist (sans) and Geist Mono

### Logo
- Current logo: `/public/logo.png` (your 16 Bars logo)
- T-shirt mockups: `/public/products/`
- Lifestyle images: `/public/lifestyle/` and `/public/lookbook/`

---

## 📱 URL Routes

**Customer Pages:**
- `/` - Home
- `/shop` - Products
- `/cart` - Shopping cart
- `/checkout` - Checkout
- `/orders` - Order history
- `/orders/[id]` - Order tracking
- `/about` - About brand
- `/lookbook` - Gallery
- `/contact` - Contact form
- `/auth/login` - Sign in
- `/auth/sign-up` - Create account

**Admin Pages:**
- `/admin` - Dashboard
- `/admin/products` - Manage products
- `/admin/products/new` - Add product
- `/admin/orders` - Manage orders
- `/admin/orders/[id]` - Update order status

---

## 🔒 Security

- **RLS Enabled**: Row-level security on all database tables
- **User Isolation**: Users can only see their own data
- **Admin Protection**: Email-based whitelist for admin access
- **Secure Auth**: Google OAuth with Supabase
- **HTTPS**: Recommended when deployed to Vercel

---

## 🌐 Deployment

Deploy to Vercel:
1. Connect your GitHub repository
2. Add environment variables in Vercel Settings
3. Push to main branch
4. Automatic deployment on push

---

## 📧 Email Notifications

Order status updates are sent to customers at:
- Order confirmation
- Status changes (processing, sent_to_delivery, on_the_way, delivered)

To customize emails, edit email templates in order management functions.

---

## 🐛 Troubleshooting

**Issue**: Google sign-in not working
- **Solution**: Ensure Supabase OAuth is enabled. Go to Supabase → Authentication → Providers → Google

**Issue**: Product images not uploading
- **Solution**: Check if `product-images` bucket exists in Supabase Storage and is public

**Issue**: Admin access not granted
- **Solution**: Verify email is in ADMIN_WHITELIST and you signed in with that email

**Issue**: Orders not showing
- **Solution**: Ensure RLS policies are properly configured in Supabase

---

## 📞 Support

For integration help:
- Supabase Docs: https://supabase.com/docs
- Next.js Docs: https://nextjs.org/docs
- PayHere Integration: https://www.payhere.lk/

---

## 🎯 Next Steps

1. ✅ Configure environment variables
2. ✅ Set up admin whitelist with your email
3. ✅ Create Supabase bucket
4. ✅ Add your first products
5. ✅ Test checkout flow
6. ✅ Deploy to production

**Your platform is ready to serve customers!**
