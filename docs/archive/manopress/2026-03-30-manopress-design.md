# ManoPress — Next.js Conversion Design Spec
**Date:** 2026-03-30
**Status:** Approved

---

## Overview

Convert the ManoPress Lovable project (React + Vite + React Router) into a full-stack Next.js application. Preserve all ManoPress design, content, branding, and assets. Add authentication, admin dashboard, and a custom order flow tailored to a sublimation printing business.

The gadget-store project will be deleted after the manopress project is complete.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| Styling | Tailwind CSS + shadcn/ui |
| Database | Supabase (PostgreSQL) |
| Auth | Supabase Auth |
| Storage | Supabase Storage (design file uploads) |
| Icons | Lucide React |
| Forms | React Hook Form + Zod |

---

## Project Structure

```
manopress/
├── app/
│   ├── layout.tsx                  # Root layout (navbar, fonts)
│   ├── page.tsx                    # Homepage
│   ├── about/page.tsx
│   ├── blog/page.tsx
│   ├── blog/[slug]/page.tsx
│   ├── contact/page.tsx
│   ├── privacy-policy/page.tsx
│   ├── terms-of-service/page.tsx
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── signup/page.tsx
│   ├── order/page.tsx              # Custom order form
│   ├── orders/page.tsx             # User order history
│   └── admin/
│       ├── layout.tsx              # Admin sidebar layout
│       ├── page.tsx                # Dashboard (stats + recent orders)
│       ├── orders/page.tsx         # Manage all orders + status updates
│       ├── products/page.tsx       # Manage product types + pricing
│       └── users/page.tsx          # Manage users + admin toggle
├── components/
│   ├── ui/                         # shadcn components
│   ├── Header.tsx                  # Sticky nav (from ManoPress)
│   ├── Hero.tsx                    # Hero section (from ManoPress)
│   ├── Footer.tsx                  # Footer (from ManoPress)
│   ├── Services.tsx                # 6 services grid
│   ├── HowToOrder.tsx              # 4-step process
│   ├── InquiryForm.tsx             # Contact/inquiry form
│   ├── TshirtDesigns.tsx           # T-shirt gallery section
│   ├── MugsDesigns.tsx             # Mugs gallery section
│   ├── NetCapsDesigns.tsx
│   ├── MousepadsDesigns.tsx
│   ├── PlatesDesigns.tsx
│   ├── JigsawPuzzlesDesigns.tsx
│   ├── MetalSheetDesigns.tsx
│   ├── OtherProducts.tsx
│   ├── DesignCarousel.tsx
│   ├── FeaturedVideo.tsx
│   ├── ImageGallery.tsx
│   ├── VideoGallery.tsx
│   ├── AvailableColors.tsx
│   └── admin/
│       ├── AdminSidebar.tsx
│       └── OrderStatusSelect.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts               # Browser client
│   │   └── server.ts               # Server client
│   └── utils.ts
├── data/
│   └── blogPosts.ts                # Blog content (from ManoPress)
├── public/
│   └── assets/                     # All ManoPress images + videos
└── supabase/
    └── schema.sql                  # Full DB schema
```

---

## Pages

### Homepage (`/`)
Migrated from ManoPress `Index.tsx`. Sections in order:
1. Hero (with "Message Us" CTA + "Place an Order" button → `/order`)
2. Welcome to ManoPress text section
3. Services (6 product types)
4. Product design sections (T-shirts, Mugs, Net Caps, Mousepads, Plates, Puzzles, Metal Sheets)
5. How to Order (4-step process)
6. Why Sublimation section
7. Customer Guide / Design Checklist
8. Blog preview (3 posts)
9. Inquiry Form

### About (`/about`)
From ManoPress `AboutUs.tsx` — mission, why choose us, sublimation explanation.

### Blog (`/blog`)
List all blog posts from `data/blogPosts.ts`.

### Blog Post (`/blog/[slug]`)
Individual post by slug from `data/blogPosts.ts`.

### Contact (`/contact`)
From ManoPress `ContactUs.tsx` — location, hours, FAQ, InquiryForm.

### Privacy Policy + Terms of Service
Static pages from ManoPress.

### Login (`/login`) + Signup (`/signup`)
Supabase Auth forms. Redirect to `/` on success.

### Custom Order Form (`/order`)
Protected (requires login). Flow:
1. Select product type (dropdown: T-Shirt, Mug, Net Cap, Mousepad, Plate, Jigsaw Puzzle, Metal Sheet, Other)
2. Enter quantity
3. Select size (if applicable — T-Shirt: XS–5XL; others: N/A)
4. Upload design file (image/PDF, max 10MB → Supabase Storage)
5. Enter notes/special instructions
6. Enter contact name, phone number, delivery address
7. Submit → order saved → confirmation message

### My Orders (`/orders`)
Protected. List of user's submitted orders with:
- Order ID, product type, quantity, design file link
- Status badge (Pending / In Production / Ready / Delivered)
- Date submitted

### Admin Dashboard (`/admin`)
Protected (admin only). Stats cards:
- Total Orders
- Pending Orders
- Total Revenue
- Total Users

Recent orders table (10 most recent).

### Admin Orders (`/admin/orders`)
Table of all orders. Columns: Order ID, Customer, Product Type, Qty, Date, Status (editable dropdown), Design File (link).
Filter by status.

### Admin Products (`/admin/products`)
Manage product catalog with pricing. Columns: Product Name, Category, Price (PHP), Description.
Add/Edit/Delete product entries.

### Admin Users (`/admin/users`)
List all users. Search by email. Toggle admin status.

---

## Custom Order Flow Detail

```
/order (protected)
  ↓
User fills form:
  - product_type (select)
  - quantity (number)
  - size (optional text)
  - design_file (file upload → Supabase Storage bucket: "designs")
  - notes (textarea)
  - contact_name, contact_phone, delivery_address

  ↓
On submit:
  1. Upload file to Supabase Storage → get public URL
  2. Insert into orders table
  3. Show success message + link to /orders

/orders (protected)
  - Fetch orders WHERE user_id = auth.uid()
  - Show order status
```

---

## Database Schema

### `profiles`
```sql
id uuid primary key references auth.users(id)
email text not null
is_admin boolean default false
created_at timestamptz default now()
```

### `products`
```sql
id uuid primary key default gen_random_uuid()
name text not null               -- e.g. "Custom T-Shirt"
category text not null           -- e.g. "T-Shirts"
price numeric not null           -- PHP
description text
image_url text
in_stock boolean default true
created_at timestamptz default now()
```

### `orders`
```sql
id uuid primary key default gen_random_uuid()
user_id uuid references auth.users(id)
product_type text not null       -- e.g. "T-Shirt"
product_id uuid references products(id)
quantity integer not null
size text                        -- optional
design_file_url text             -- Supabase Storage URL
notes text
contact_name text not null
contact_phone text not null
delivery_address text not null
status text default 'Pending'    -- Pending / In Production / Ready / Delivered
total_amount numeric
created_at timestamptz default now()
```

### RLS Policies
- Users can insert and read their own orders
- Admins can read and update all orders
- Admins can manage products
- Users read own profile; admins read/update all profiles

---

## Asset Migration

All ManoPress assets (images + videos) copied from:
`Downloads/manopress-extracted/manopress-main/src/assets/`
to:
`manopress/public/assets/`

Components reference assets via `/assets/filename.ext` (Next.js public folder).

---

## Branding

- **Business name:** ManoPress
- **Tagline:** Custom Sublimation Printing in Santa Rosa, Laguna
- **Facebook:** m.me/ManoPress
- **Address:** Santa Rosa, Laguna, Philippines
- **Hours:** 9AM–6PM, Monday–Saturday
- **Colors:** Inherit from ManoPress Tailwind config (semantic CSS variables)

---

## What is NOT included

- Payment gateway (orders are manual / COD / GCash arranged via Messenger)
- Real-time notifications
- CMS for blog (static data file)
- Email notifications (inquiry form uses existing Supabase Edge Function)
