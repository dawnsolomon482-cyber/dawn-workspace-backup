# ManoPress Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build ManoPress — a custom sublimation printing business site with a guest order form (no customer accounts) and an admin-only dashboard to monitor orders.

**Architecture:** Next.js 15 App Router, Supabase for auth/database/storage, shadcn/ui + Tailwind CSS. ManoPress assets copied from the Lovable export. Navy blue color scheme. **No customer signup/login** — order form is public/guest. Only admin can log in to manage orders.

**UPDATED:** No customer auth. Order form is public (no login required). Admin login only at `/admin/login`.

**Tech Stack:** Next.js 15, TypeScript, Tailwind CSS, shadcn/ui, Supabase (auth + PostgreSQL + Storage), Lucide React, React Hook Form + Zod

---

## Phase 1: Project Setup

### Task 1: Delete gadget-store, scaffold manopress

**Files:**
- Delete: `gadget-store/` (entire folder)
- Create: `manopress/` (new Next.js project)

- [ ] **Step 1: Delete gadget-store**
```bash
rm -rf "gadget-store"
```

- [ ] **Step 2: Scaffold new Next.js project**
```bash
cd "C:/Users/R Y Z E N/OneDrive/Desktop/Claude Code"
npx create-next-app@latest manopress --typescript --tailwind --eslint --app --src-dir=no --import-alias="@/*" --yes
```

- [ ] **Step 3: Install dependencies**
```bash
cd manopress
npm install @supabase/supabase-js @supabase/ssr lucide-react react-hook-form @hookform/resolvers zod
npx shadcn@latest init -y
npx shadcn@latest add button input label textarea select card badge toast sonner dialog alert separator
```

- [ ] **Step 4: Commit**
```bash
git init
git add .
git commit -m "feat: scaffold manopress next.js project"
```

---

### Task 2: Copy assets and configure theme

**Files:**
- Create: `manopress/public/assets/` (all ManoPress images/videos)
- Modify: `manopress/app/globals.css`
- Modify: `manopress/tailwind.config.ts`

- [ ] **Step 1: Copy assets from Lovable export**
```bash
cp -r "C:/Users/R Y Z E N/Downloads/manopress-extracted/manopress-main/src/assets/." "manopress/public/assets/"
```

- [ ] **Step 2: Set navy blue theme in globals.css**

Replace contents of `manopress/app/globals.css`:
```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;500;700;900&family=DM+Sans:wght@300;400;500;600&display=swap');

@layer base {
  :root {
    --background: 0 0% 100%;
    --foreground: 222 47% 11%;
    --card: 0 0% 100%;
    --card-foreground: 222 47% 11%;
    --popover: 0 0% 100%;
    --popover-foreground: 222 47% 11%;
    --primary: 224 76% 32%;
    --primary-foreground: 0 0% 100%;
    --secondary: 224 50% 95%;
    --secondary-foreground: 224 76% 32%;
    --muted: 220 20% 96%;
    --muted-foreground: 220 16% 46%;
    --accent: 224 50% 95%;
    --accent-foreground: 224 76% 32%;
    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;
    --border: 220 20% 88%;
    --input: 220 20% 88%;
    --ring: 224 76% 32%;
    --radius: 0.625rem;
  }
}

@layer base {
  * { @apply border-border; }
  body { @apply bg-background text-foreground; font-family: 'DM Sans', sans-serif; }
  h1, h2, h3 { font-family: 'Playfair Display', serif; }
}
```

- [ ] **Step 3: Create .env.local**
```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: add assets, configure navy blue theme"
```

---

### Task 3: Supabase client setup

**Files:**
- Create: `manopress/lib/supabase/client.ts`
- Create: `manopress/lib/supabase/server.ts`
- Create: `manopress/middleware.ts`

- [ ] **Step 1: Create browser client** `lib/supabase/client.ts`
```ts
import { createBrowserClient } from '@supabase/ssr'

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  )
}
```

- [ ] **Step 2: Create server client** `lib/supabase/server.ts`
```ts
import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'

export async function createClient() {
  const cookieStore = await cookies()
  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch {}
        },
      },
    }
  )
}
```

- [ ] **Step 3: Create middleware** `middleware.ts`
```ts
import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request })
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return request.cookies.getAll() },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
          supabaseResponse = NextResponse.next({ request })
          cookiesToSet.forEach(({ name, value, options }) =>
            supabaseResponse.cookies.set(name, value, options)
          )
        },
      },
    }
  )

  const { data: { user } } = await supabase.auth.getUser()
  const path = request.nextUrl.pathname

  const protectedPaths = ['/order', '/orders', '/admin']
  const isProtected = protectedPaths.some(p => path.startsWith(p))

  if (isProtected && !user) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (path.startsWith('/admin')) {
    const { data: profile } = await supabase
      .from('profiles')
      .select('is_admin')
      .eq('id', user!.id)
      .single()
    if (!profile?.is_admin) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  return supabaseResponse
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|assets/).*)'],
}
```

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: supabase client + middleware auth guard"
```

---

### Task 4: Database schema

**Files:**
- Create: `manopress/supabase/schema.sql`

- [ ] **Step 1: Create schema.sql**
```sql
-- Profiles (auto-created on signup)
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  is_admin boolean not null default false,
  created_at timestamptz default now()
);

alter table profiles enable row level security;
create policy "Users read own profile" on profiles for select using (auth.uid() = id);
create policy "Admins read all profiles" on profiles for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins update profiles" on profiles for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Auto-create profile on signup
create or replace function handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email) values (new.id, new.email);
  return new;
end;
$$ language plpgsql security definer;
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users for each row execute procedure handle_new_user();

-- Products (product types + pricing)
create table if not exists products (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  category text not null,
  price numeric not null,
  description text,
  image_url text,
  in_stock boolean default true,
  created_at timestamptz default now()
);

alter table products enable row level security;
create policy "Anyone can read products" on products for select using (true);
create policy "Admins manage products" on products for all using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Orders
create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_type text not null,
  product_id uuid references products(id) on delete set null,
  quantity integer not null default 1,
  size text,
  design_file_url text,
  notes text,
  contact_name text not null,
  contact_phone text not null,
  delivery_address text not null,
  status text not null default 'Pending',
  total_amount numeric,
  created_at timestamptz default now()
);

alter table orders enable row level security;
create policy "Users read own orders" on orders for select using (auth.uid() = user_id);
create policy "Users insert own orders" on orders for insert with check (auth.uid() = user_id);
create policy "Admins read all orders" on orders for select using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);
create policy "Admins update orders" on orders for update using (
  exists (select 1 from profiles where id = auth.uid() and is_admin = true)
);

-- Seed products
insert into products (name, category, price, description) values
  ('Custom T-Shirt', 'T-Shirts', 250, 'Full-color sublimation on white polyester tee. XS to 5XL.'),
  ('Sublimation Mug', 'Mugs', 150, 'Wrap-around ceramic mug print. Dishwasher-safe.'),
  ('Net Cap', 'Caps', 200, 'Sublimation on net cap / trucker hat.'),
  ('Mousepad', 'Mousepads', 180, 'Thick mousepad with non-slip rubber base.'),
  ('Ceramic Plate', 'Plates', 220, 'Photo plate, decorative or personalized gift.'),
  ('Jigsaw Puzzle', 'Puzzles', 300, 'Custom photo puzzle. Multiple piece counts.'),
  ('Metal Sheet Print', 'Metal Sheets', 350, 'Full-color print on aluminum sheet.')
on conflict do nothing;
```

- [ ] **Step 2: Run schema in Supabase SQL editor** (manual step — paste and run in Supabase dashboard)

- [ ] **Step 3: Create Supabase Storage bucket**
In Supabase dashboard → Storage → New bucket → name: `designs` → Public: true

- [ ] **Step 4: Commit**
```bash
git add .
git commit -m "feat: database schema + seed products"
```

---

## Phase 2: Layout & Public Pages

### Task 5: Blog data + Root layout + Navbar

**Files:**
- Create: `manopress/data/blogPosts.ts`
- Create: `manopress/components/Navbar.tsx`
- Modify: `manopress/app/layout.tsx`

- [ ] **Step 1: Copy blogPosts.ts from Lovable export**
```bash
cp "C:/Users/R Y Z E N/Downloads/manopress-extracted/manopress-main/src/data/blogPosts.ts" "manopress/data/blogPosts.ts"
```

- [ ] **Step 2: Create Navbar** `components/Navbar.tsx`
```tsx
'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { Menu, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { createClient } from '@/lib/supabase/client'

export default function Navbar() {
  const [open, setOpen] = useState(false)
  const [user, setUser] = useState<any>(null)
  const supabase = createClient()

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user))
  }, [])

  const links = [
    { href: '/about', label: 'About' },
    { href: '/#services', label: 'Services' },
    { href: '/blog', label: 'Blog' },
    { href: '/contact', label: 'Contact' },
  ]

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur border-b border-border h-16 flex items-center px-6 md:px-12 justify-between shadow-sm">
      <Link href="/" className="flex items-center gap-2">
        <Image src="/assets/manopress-logo-new.png" alt="ManoPress" width={36} height={36} className="object-contain" />
        <span className="font-serif font-black text-xl tracking-wide">
          MANO<span className="text-primary">PRESS</span>
        </span>
      </Link>

      {/* Desktop */}
      <div className="hidden md:flex items-center gap-8">
        {links.map(l => (
          <Link key={l.href} href={l.href} className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
            {l.label}
          </Link>
        ))}
        {user ? (
          <div className="flex items-center gap-3">
            <Link href="/orders" className="text-sm font-medium text-muted-foreground hover:text-foreground">My Orders</Link>
            <Button asChild size="sm"><Link href="/order">Place an Order</Link></Button>
          </div>
        ) : (
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild><Link href="/login">Login</Link></Button>
            <Button size="sm" asChild><Link href="/order">Place an Order</Link></Button>
          </div>
        )}
      </div>

      {/* Mobile */}
      <button className="md:hidden" onClick={() => setOpen(!open)}>
        {open ? <X size={22} /> : <Menu size={22} />}
      </button>
      {open && (
        <div className="absolute top-16 left-0 right-0 bg-white border-b border-border p-6 flex flex-col gap-4 md:hidden shadow-lg">
          {links.map(l => (
            <Link key={l.href} href={l.href} className="text-sm font-medium" onClick={() => setOpen(false)}>{l.label}</Link>
          ))}
          <Button asChild><Link href="/order" onClick={() => setOpen(false)}>Place an Order</Link></Button>
        </div>
      )}
    </nav>
  )
}
```

- [ ] **Step 3: Create Footer** `components/Footer.tsx`
```tsx
import Link from 'next/link'
import { MapPin, Clock, Facebook } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-[#0f1f40] text-white/65 pt-14 pb-8 px-6 md:px-16">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10 pb-10 border-b border-white/10 mb-8">
        <div>
          <span className="font-serif font-black text-xl text-white block mb-3">
            MANO<span className="text-blue-400">PRESS</span>
          </span>
          <p className="text-sm leading-relaxed mb-4">Custom sublimation printing in Santa Rosa, Laguna. Vibrant colors, lasting quality.</p>
          <a href="https://www.facebook.com/profile.php?id=61587380491479" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-blue-400 text-sm hover:text-blue-300">
            <Facebook size={14} /> Follow us on Facebook
          </a>
        </div>
        <div>
          <p className="font-serif font-bold text-white text-sm mb-4">Services</p>
          <ul className="space-y-2 text-sm">
            {['T-Shirts','Mugs','Net Caps','Mousepads','Plates','Jigsaw Puzzles','Metal Sheets'].map(s => (
              <li key={s}><Link href="/#products" className="hover:text-white/90 transition-colors">{s}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-serif font-bold text-white text-sm mb-4">Company</p>
          <ul className="space-y-2 text-sm">
            {[['About Us','/about'],['Blog','/blog'],['Contact','/contact'],['How to Order','/#how-to-order']].map(([label,href]) => (
              <li key={href}><Link href={href} className="hover:text-white/90 transition-colors">{label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="font-serif font-bold text-white text-sm mb-4">Contact</p>
          <ul className="space-y-3 text-sm">
            <li className="flex items-start gap-2"><MapPin size={14} className="mt-0.5 shrink-0 text-blue-400" />Santa Rosa, Laguna, Philippines</li>
            <li className="flex items-center gap-2"><Clock size={14} className="text-blue-400" />Mon–Sat, 9AM–6PM</li>
            <li><Link href="/privacy-policy" className="hover:text-white/90">Privacy Policy</Link></li>
            <li><Link href="/terms-of-service" className="hover:text-white/90">Terms of Service</Link></li>
          </ul>
        </div>
      </div>
      <div className="max-w-6xl mx-auto flex justify-between text-xs opacity-40 flex-wrap gap-2">
        <span>© {new Date().getFullYear()} ManoPress. All rights reserved.</span>
        <span>📍 Santa Rosa, Laguna, Philippines</span>
      </div>
    </footer>
  )
}
```

- [ ] **Step 4: Update root layout** `app/layout.tsx`
```tsx
import type { Metadata } from 'next'
import './globals.css'
import Navbar from '@/components/Navbar'

export const metadata: Metadata = {
  title: 'ManoPress — Custom Sublimation Printing in Santa Rosa, Laguna',
  description: 'ManoPress offers professional sublimation printing on t-shirts, mugs, caps, mousepads, plates, puzzles, and metal sheets.',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <Navbar />
        <main className="pt-16">{children}</main>
      </body>
    </html>
  )
}
```

- [ ] **Step 5: Commit**
```bash
git add .
git commit -m "feat: navbar, footer, root layout"
```

---

### Task 6: Homepage

**Files:**
- Create: `manopress/app/page.tsx`
- Create: `manopress/components/Hero.tsx`
- Create: `manopress/components/ServicesSection.tsx`
- Create: `manopress/components/ProductsGallery.tsx`
- Create: `manopress/components/HowToOrder.tsx`
- Create: `manopress/components/BlogPreview.tsx`
- Create: `manopress/components/InquiryForm.tsx`

- [ ] **Step 1: Create Hero** `components/Hero.tsx`
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Facebook } from 'lucide-react'

export default function Hero() {
  return (
    <section className="relative w-full overflow-hidden bg-blue-50">
      <Image
        src="/assets/hero-cover-v4.png"
        alt="ManoPress Custom Sublimation Printing"
        width={1920} height={900}
        className="w-full max-h-[88vh] object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent" />
      <div className="absolute bottom-10 left-8 md:left-16 flex gap-3 flex-wrap z-10">
        <Button asChild size="lg"><Link href="/order">Place an Order</Link></Button>
        <Button variant="outline" size="lg" asChild>
          <a href="https://www.facebook.com/profile.php?id=61587380491479" target="_blank" rel="noopener noreferrer">
            <Facebook size={16} className="mr-2" /> Message Us
          </a>
        </Button>
      </div>
    </section>
  )
}
```

- [ ] **Step 2: Create ServicesSection** `components/ServicesSection.tsx`
```tsx
import { Shirt, Coffee, HardHat, MousePointer2, Circle, Puzzle, Layers } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

const services = [
  { num:'01', icon: Shirt, name:'Custom T-Shirts', desc:'Full-color sublimation on white polyester tees. XS to 5XL.' },
  { num:'02', icon: Coffee, name:'Sublimation Mugs', desc:'Wrap-around ceramic mug prints. Dishwasher-safe, fade-proof.' },
  { num:'03', icon: HardHat, name:'Net Cap Printing', desc:'Custom sublimation on net caps. Great for teams and events.' },
  { num:'04', icon: MousePointer2, name:'Mousepads', desc:'Thick mousepads with non-slip rubber base. Various sizes.' },
  { num:'05', icon: Circle, name:'Ceramic Plates', desc:'Photo plates and decorative ceramics — perfect gifts.' },
  { num:'06', icon: Puzzle, name:'Jigsaw Puzzles', desc:'Custom photo puzzles. Fun and unique gifts.' },
  { num:'07', icon: Layers, name:'Metal Sheet Prints', desc:'Full-color on aluminum. Durable, great for signage.' },
]

export default function ServicesSection() {
  return (
    <section id="services" className="py-20 px-6 md:px-16 bg-muted/40">
      <div className="max-w-6xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// What We Print</p>
        <h2 className="text-4xl font-serif font-bold mb-12">Our Services</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {services.map(s => (
            <Card key={s.num} className="hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
              <CardContent className="pt-6">
                <p className="font-mono text-[10px] text-primary mb-4">{s.num}</p>
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <s.icon size={22} className="text-primary" />
                </div>
                <h3 className="font-serif font-bold text-lg mb-2">{s.name}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 3: Create ProductsGallery** `components/ProductsGallery.tsx`
```tsx
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

const products = [
  { name:'Custom T-Shirt', category:'Sublimation', price:'₱250', img:'/assets/tshirt-design-2.jpg' },
  { name:'Mousepad', category:'Sublimation', price:'₱180', img:'/assets/mousepad-design-2.jpg' },
  { name:'Net Cap', category:'Sublimation', price:'₱200', img:'/assets/netcap-design-2.jpg' },
  { name:'Ceramic Plate', category:'Sublimation', price:'₱220', img:'/assets/plate-design-2.jpg' },
  { name:'Jigsaw Puzzle', category:'Sublimation', price:'₱300', img:'/assets/puzzle-design-1.jpg' },
  { name:'Metal Sheet Print', category:'Sublimation', price:'₱350', img:'/assets/metalsheet-design-2.jpg' },
]

export default function ProductsGallery() {
  return (
    <section id="products" className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-12 flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Design Gallery</p>
            <h2 className="text-4xl font-serif font-bold">Sample Prints</h2>
          </div>
          <Button variant="outline" asChild><Link href="/order">Order Now →</Link></Button>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {products.map(p => (
            <div key={p.name} className="rounded-xl overflow-hidden border border-border hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1 bg-muted/30">
              <div className="aspect-[4/3] overflow-hidden">
                <Image src={p.img} alt={p.name} width={400} height={300} className="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
              </div>
              <div className="p-4">
                <p className="font-mono text-[10px] uppercase tracking-widest text-primary mb-1">{p.category}</p>
                <h3 className="font-serif font-bold text-lg">{p.name}</h3>
                <p className="text-sm text-muted-foreground">Starting at <span className="font-mono font-semibold text-primary">{p.price}</span></p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 4: Create HowToOrder** `components/HowToOrder.tsx`
```tsx
import { Upload, CheckCircle, Clock, Truck } from 'lucide-react'

const steps = [
  { num:'1', icon: Upload, title:'Send Your Design', desc:'Upload your artwork via our order form. PNG, JPG, PDF, and vector files accepted.' },
  { num:'2', icon: CheckCircle, title:'Confirm Details', desc:'We review product type, quantity, and size — then confirm pricing before production.' },
  { num:'3', icon: Clock, title:'Production', desc:'Standard turnaround is 2–3 business days from design approval.' },
  { num:'4', icon: Truck, title:'Receive Your Order', desc:'Pick up in Santa Rosa or have it delivered. We\'ll update your order status.' },
]

export default function HowToOrder() {
  return (
    <section id="how-to-order" className="py-20 px-6 md:px-16 bg-muted/40 text-center">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// The Process</p>
        <h2 className="text-4xl font-serif font-bold mb-3">How to Order</h2>
        <p className="text-muted-foreground mb-14">Simple 4-step process from your design to your doorstep.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          {steps.map((s, i) => (
            <div key={s.num} className="flex flex-col items-center">
              <div className="w-16 h-16 rounded-full bg-white border-2 border-border flex items-center justify-center mb-5 shadow-sm hover:border-primary hover:bg-primary/5 transition-all">
                <s.icon size={24} className="text-primary" />
              </div>
              <h3 className="font-serif font-bold text-lg mb-2">{s.title}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 5: Create BlogPreview** `components/BlogPreview.tsx`
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import { Button } from '@/components/ui/button'

export default function BlogPreview() {
  return (
    <section className="py-20 px-6 md:px-16 bg-white">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-10 flex-wrap gap-4">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// From Our Blog</p>
            <h2 className="text-4xl font-serif font-bold">Tips & Guides</h2>
          </div>
          <Button variant="outline" asChild><Link href="/blog">All Articles →</Link></Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
          {blogPosts.slice(0,3).map(post => (
            <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
              <div className="bg-muted/30 border border-border rounded-xl p-6 h-full hover:border-primary hover:shadow-lg transition-all duration-200 hover:-translate-y-1">
                <p className="font-mono text-xs text-primary mb-3">{post.date} · {post.readTime}</p>
                <h3 className="font-serif font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">{post.title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                  Read more <ArrowRight size={12} />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
```

- [ ] **Step 6: Create InquiryForm** `components/InquiryForm.tsx`
```tsx
'use client'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'

const schema = z.object({
  name: z.string().min(2),
  contact: z.string().min(5),
  orderType: z.string().min(1),
  message: z.string().min(10),
})
type FormData = z.infer<typeof schema>

export default function InquiryForm() {
  const [sent, setSent] = useState(false)
  const { register, handleSubmit, setValue, formState: { errors, isSubmitting } } = useForm<FormData>({ resolver: zodResolver(schema) })

  async function onSubmit(data: FormData) {
    await new Promise(r => setTimeout(r, 800))
    setSent(true)
  }

  if (sent) return (
    <section className="py-20 px-6 md:px-16 bg-primary text-white text-center">
      <h2 className="text-3xl font-serif font-bold mb-3">Message Sent!</h2>
      <p className="text-white/80">We'll get back to you within 24 hours.</p>
    </section>
  )

  return (
    <section id="contact-form" className="py-20 px-6 md:px-16 bg-primary/5">
      <div className="max-w-2xl mx-auto">
        <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Get in Touch</p>
        <h2 className="text-4xl font-serif font-bold mb-8">Send an Inquiry</h2>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1.5">
              <Label>Name</Label>
              <Input {...register('name')} placeholder="Your name" />
              {errors.name && <p className="text-xs text-destructive">{errors.name.message}</p>}
            </div>
            <div className="space-y-1.5">
              <Label>Email or Phone</Label>
              <Input {...register('contact')} placeholder="email@example.com or 09xx" />
              {errors.contact && <p className="text-xs text-destructive">{errors.contact.message}</p>}
            </div>
          </div>
          <div className="space-y-1.5">
            <Label>Order Type</Label>
            <Select onValueChange={v => setValue('orderType', v)}>
              <SelectTrigger><SelectValue placeholder="Select a product" /></SelectTrigger>
              <SelectContent>
                {['T-Shirt','Mug','Net Cap','Mousepad','Plate','Jigsaw Puzzle','Metal Sheet','Other'].map(o => (
                  <SelectItem key={o} value={o}>{o}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.orderType && <p className="text-xs text-destructive">Please select a product</p>}
          </div>
          <div className="space-y-1.5">
            <Label>Message</Label>
            <Textarea {...register('message')} placeholder="Tell us about your order — quantity, design details, etc." rows={4} />
            {errors.message && <p className="text-xs text-destructive">{errors.message.message}</p>}
          </div>
          <Button type="submit" className="w-full" size="lg" disabled={isSubmitting}>
            {isSubmitting ? 'Sending...' : 'Send Inquiry'}
          </Button>
        </form>
      </div>
    </section>
  )
}
```

- [ ] **Step 7: Assemble homepage** `app/page.tsx`
```tsx
import Hero from '@/components/Hero'
import ServicesSection from '@/components/ServicesSection'
import ProductsGallery from '@/components/ProductsGallery'
import HowToOrder from '@/components/HowToOrder'
import BlogPreview from '@/components/BlogPreview'
import InquiryForm from '@/components/InquiryForm'
import Footer from '@/components/Footer'

export default function HomePage() {
  return (
    <>
      <Hero />

      {/* Welcome */}
      <section className="py-16 px-6 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="text-4xl font-serif font-bold mb-5">Welcome to ManoPress</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            ManoPress is your trusted partner for high-quality custom sublimation printing based in Santa Rosa, Laguna. We specialize in transforming your designs, photos, and ideas into vibrant, long-lasting prints on a wide variety of products.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Our sublimation technology ensures that every print is embedded directly into the material — not just layered on top. Your custom products won't fade, crack, or peel, even after years of use.
          </p>
        </div>
      </section>

      <ServicesSection />
      <ProductsGallery />
      <HowToOrder />
      <BlogPreview />
      <InquiryForm />
      <Footer />
    </>
  )
}
```

- [ ] **Step 8: Run dev server and verify homepage**
```bash
npm run dev
```
Open http://localhost:3000 — hero, services, products, how to order, blog preview, inquiry form all visible.

- [ ] **Step 9: Commit**
```bash
git add .
git commit -m "feat: homepage with all sections"
```

---

### Task 7: Static pages (About, Blog, Contact, Privacy, Terms)

**Files:**
- Create: `manopress/app/about/page.tsx`
- Create: `manopress/app/blog/page.tsx`
- Create: `manopress/app/blog/[slug]/page.tsx`
- Create: `manopress/app/contact/page.tsx`
- Create: `manopress/app/privacy-policy/page.tsx`
- Create: `manopress/app/terms-of-service/page.tsx`

- [ ] **Step 1: About page** `app/about/page.tsx`
```tsx
import Footer from '@/components/Footer'
import { CheckCircle } from 'lucide-react'

const reasons = [
  'True Sublimation Quality — ink fused into the material, not on top',
  'Wide Product Range — 7+ product types',
  'Fast Turnaround — standard 2–3 business days',
  'Affordable Pricing — competitive rates, bulk discounts available',
  'Personal Service — direct communication throughout your order',
  'Local Pickup — available in Santa Rosa, Laguna',
]

export default function AboutPage() {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-4xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Our Story</p>
          <h1 className="text-5xl font-serif font-bold mb-8">About ManoPress</h1>
          <p className="text-lg text-muted-foreground leading-relaxed mb-6">
            ManoPress is a custom sublimation printing business based in Santa Rosa, Laguna, Philippines. We help individuals, groups, and businesses bring their ideas to life with professional-quality prints on a wide range of products.
          </p>
          <p className="text-muted-foreground leading-relaxed mb-12">
            Sublimation printing works by using heat and pressure to infuse dye directly into polyester fabrics and coated surfaces at 180–200°C. The result is a seamless, full-color print that becomes part of the product itself — never fading, cracking, or peeling.
          </p>
          <h2 className="text-3xl font-serif font-bold mb-6">Why Choose Us</h2>
          <ul className="space-y-3">
            {reasons.map(r => (
              <li key={r} className="flex items-start gap-3">
                <CheckCircle size={18} className="text-primary mt-0.5 shrink-0" />
                <span className="text-muted-foreground">{r}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Blog list page** `app/blog/page.tsx`
```tsx
import Link from 'next/link'
import { ArrowRight } from 'lucide-react'
import { blogPosts } from '@/data/blogPosts'
import Footer from '@/components/Footer'

export default function BlogPage() {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Knowledge Base</p>
          <h1 className="text-5xl font-serif font-bold mb-12">Tips & Guides</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {blogPosts.map(post => (
              <Link key={post.slug} href={`/blog/${post.slug}`} className="block group">
                <div className="bg-muted/30 border border-border rounded-xl p-6 h-full hover:border-primary hover:shadow-md transition-all hover:-translate-y-1">
                  <p className="font-mono text-xs text-primary mb-3">{post.date} · {post.readTime}</p>
                  <h2 className="font-serif font-bold text-lg leading-snug mb-3 group-hover:text-primary transition-colors">{post.title}</h2>
                  <p className="text-sm text-muted-foreground leading-relaxed">{post.excerpt}</p>
                  <span className="inline-flex items-center gap-1 mt-4 text-xs font-semibold uppercase tracking-wide text-primary">
                    Read more <ArrowRight size={12} />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 3: Blog post page** `app/blog/[slug]/page.tsx`
```tsx
import { notFound } from 'next/navigation'
import { blogPosts } from '@/data/blogPosts'
import Footer from '@/components/Footer'

export async function generateStaticParams() {
  return blogPosts.map(p => ({ slug: p.slug }))
}

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = blogPosts.find(p => p.slug === params.slug)
  if (!post) notFound()
  return (
    <>
      <article className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <p className="font-mono text-xs text-primary mb-3">{post.date} · {post.readTime}</p>
          <h1 className="text-4xl font-serif font-bold mb-8 leading-tight">{post.title}</h1>
          <div className="prose prose-slate max-w-none">
            {post.content.map((para, i) => (
              <p key={i} className="text-muted-foreground leading-relaxed mb-4">{para}</p>
            ))}
          </div>
        </div>
      </article>
      <Footer />
    </>
  )
}
```

- [ ] **Step 4: Contact page** `app/contact/page.tsx`
```tsx
import { MapPin, Clock, Facebook, MessageCircle } from 'lucide-react'
import InquiryForm from '@/components/InquiryForm'
import Footer from '@/components/Footer'

const faqs = [
  { q: 'How long does production take?', a: 'Standard turnaround is 2–3 business days from design approval.' },
  { q: 'Is there a minimum order quantity?', a: 'No minimum — we accept single-piece orders.' },
  { q: 'What materials work with sublimation?', a: 'Sublimation works best on white or light-colored polyester fabrics and coated hard surfaces.' },
  { q: 'How do I pay?', a: 'We accept GCash, bank transfer, and cash on pickup.' },
  { q: 'Do you offer delivery?', a: 'Yes, we ship nationwide via courier. Shipping fee is shouldered by the buyer.' },
]

export default function ContactPage() {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-16">
          <div>
            <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Reach Us</p>
            <h1 className="text-4xl font-serif font-bold mb-8">Contact Us</h1>
            <ul className="space-y-5 mb-12">
              <li className="flex items-start gap-3"><MapPin size={18} className="text-primary mt-0.5 shrink-0" /><span className="text-muted-foreground">Santa Rosa, Laguna, Philippines</span></li>
              <li className="flex items-center gap-3"><Clock size={18} className="text-primary shrink-0" /><span className="text-muted-foreground">Monday – Saturday, 9AM – 6PM</span></li>
              <li className="flex items-center gap-3"><Facebook size={18} className="text-primary shrink-0" /><a href="https://www.facebook.com/profile.php?id=61587380491479" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Facebook Page</a></li>
              <li className="flex items-center gap-3"><MessageCircle size={18} className="text-primary shrink-0" /><a href="https://www.facebook.com/profile.php?id=61587380491479" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Send us a message</a></li>
            </ul>
            <h2 className="text-2xl font-serif font-bold mb-5">FAQ</h2>
            <div className="space-y-5">
              {faqs.map(f => (
                <div key={f.q}>
                  <p className="font-semibold text-sm mb-1">{f.q}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{f.a}</p>
                </div>
              ))}
            </div>
          </div>
          <div><InquiryForm /></div>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 5: Privacy + Terms pages** `app/privacy-policy/page.tsx`
```tsx
import Footer from '@/components/Footer'
export default function PrivacyPage() {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8">Privacy Policy</h1>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>ManoPress collects personal information (name, contact details, delivery address) solely for order processing. We do not sell or share your data with third parties.</p>
            <p>Design files you upload are stored securely and used only for your order. Files may be deleted after 30 days of order completion.</p>
            <p>By placing an order, you consent to our collection and use of your information as described above.</p>
            <p>For questions, contact us via our Facebook page.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

`app/terms-of-service/page.tsx`
```tsx
import Footer from '@/components/Footer'
export default function TermsPage() {
  return (
    <>
      <section className="py-20 px-6 md:px-16 bg-white">
        <div className="max-w-3xl mx-auto">
          <h1 className="text-4xl font-serif font-bold mb-8">Terms of Service</h1>
          <div className="prose prose-slate max-w-none text-muted-foreground space-y-4">
            <p>By placing an order with ManoPress, you agree to the following terms:</p>
            <p><strong>Design Ownership:</strong> You confirm that you own or have rights to the design files you submit. ManoPress is not responsible for copyright infringement from customer-supplied designs.</p>
            <p><strong>Order Approval:</strong> Production begins only after you approve the final design mockup. No changes can be made after approval.</p>
            <p><strong>Refund Policy:</strong> We do not accept returns on custom-printed items unless there is a production defect on our part. Please review your order carefully before approval.</p>
            <p><strong>Payment:</strong> Full payment is required before or upon pickup/delivery.</p>
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 6: Commit**
```bash
git add .
git commit -m "feat: about, blog, contact, privacy, terms pages"
```

---

## Phase 3: Auth

### Task 8: Login + Signup pages

**Files:**
- Create: `manopress/app/(auth)/login/page.tsx`
- Create: `manopress/app/(auth)/signup/page.tsx`

- [ ] **Step 1: Login page** `app/(auth)/login/page.tsx`
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function LoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true); setError('')
    const { error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold mb-1">Welcome back</h1>
        <p className="text-sm text-muted-foreground mb-6">Sign in to your ManoPress account</p>
        {error && <p className="text-sm text-destructive mb-4 bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In'}
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">
          No account? <Link href="/signup" className="text-primary hover:underline">Sign up</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Signup page** `app/(auth)/signup/page.tsx`
```tsx
'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password.length < 6) { setError('Password must be at least 6 characters'); return }
    setLoading(true); setError('')
    const { error } = await supabase.auth.signUp({ email, password })
    if (error) { setError(error.message); setLoading(false) }
    else router.push('/')
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-muted/30">
      <div className="w-full max-w-sm bg-white rounded-2xl border border-border p-8 shadow-sm">
        <h1 className="text-2xl font-serif font-bold mb-1">Create account</h1>
        <p className="text-sm text-muted-foreground mb-6">Join ManoPress to place custom orders</p>
        {error && <p className="text-sm text-destructive mb-4 bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}
        <form onSubmit={handleSignup} className="space-y-4">
          <div className="space-y-1.5">
            <Label>Email</Label>
            <Input type="email" value={email} onChange={e => setEmail(e.target.value)} required />
          </div>
          <div className="space-y-1.5">
            <Label>Password</Label>
            <Input type="password" value={password} onChange={e => setPassword(e.target.value)} required />
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account'}
          </Button>
        </form>
        <p className="text-sm text-center mt-4 text-muted-foreground">
          Already have an account? <Link href="/login" className="text-primary hover:underline">Sign in</Link>
        </p>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: login and signup pages"
```

---

## Phase 4: Custom Order Flow

### Task 9: Order form page

**Files:**
- Create: `manopress/app/order/page.tsx`

- [ ] **Step 1: Create order page** `app/order/page.tsx`
```tsx
'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import Footer from '@/components/Footer'

const schema = z.object({
  product_type: z.string().min(1, 'Select a product'),
  quantity: z.number().min(1),
  size: z.string().optional(),
  notes: z.string().optional(),
  contact_name: z.string().min(2),
  contact_phone: z.string().min(7),
  delivery_address: z.string().min(5),
})
type FormData = z.infer<typeof schema>

const productTypes = ['T-Shirt','Mug','Net Cap','Mousepad','Ceramic Plate','Jigsaw Puzzle','Metal Sheet Print','Other']

export default function OrderPage() {
  const router = useRouter()
  const supabase = createClient()
  const [user, setUser] = useState<any>(null)
  const [file, setFile] = useState<File | null>(null)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const { register, handleSubmit, setValue, formState: { errors } } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { quantity: 1 }
  })

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (!data.user) router.push('/login')
      else setUser(data.user)
    })
  }, [])

  async function onSubmit(data: FormData) {
    setSubmitting(true); setError('')
    try {
      let design_file_url = null
      if (file) {
        const ext = file.name.split('.').pop()
        const path = `${user.id}/${Date.now()}.${ext}`
        const { error: uploadError } = await supabase.storage.from('designs').upload(path, file)
        if (uploadError) throw uploadError
        const { data: urlData } = supabase.storage.from('designs').getPublicUrl(path)
        design_file_url = urlData.publicUrl
      }

      const { error: insertError } = await supabase.from('orders').insert({
        user_id: user.id,
        ...data,
        design_file_url,
      })
      if (insertError) throw insertError
      router.push('/orders?success=1')
    } catch (e: any) {
      setError(e.message || 'Something went wrong')
      setSubmitting(false)
    }
  }

  return (
    <>
      <section className="py-16 px-6 md:px-16 bg-white min-h-screen">
        <div className="max-w-2xl mx-auto">
          <p className="text-xs font-mono uppercase tracking-widest text-primary mb-2">// Custom Order</p>
          <h1 className="text-4xl font-serif font-bold mb-2">Place an Order</h1>
          <p className="text-muted-foreground mb-8">Fill in the details below and upload your design file. We'll confirm pricing before starting production.</p>

          {error && <p className="text-sm text-destructive mb-5 bg-destructive/10 px-3 py-2 rounded-lg">{error}</p>}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="space-y-1.5">
              <Label>Product Type</Label>
              <Select onValueChange={v => setValue('product_type', v)}>
                <SelectTrigger><SelectValue placeholder="Choose a product" /></SelectTrigger>
                <SelectContent>
                  {productTypes.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
                </SelectContent>
              </Select>
              {errors.product_type && <p className="text-xs text-destructive">{errors.product_type.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label>Quantity</Label>
                <Input type="number" min={1} {...register('quantity', { valueAsNumber: true })} />
                {errors.quantity && <p className="text-xs text-destructive">{errors.quantity.message}</p>}
              </div>
              <div className="space-y-1.5">
                <Label>Size <span className="text-muted-foreground text-xs">(optional)</span></Label>
                <Input placeholder="e.g. XL, 11oz" {...register('size')} />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label>Upload Design File <span className="text-muted-foreground text-xs">(PNG, JPG, PDF — max 10MB)</span></Label>
              <Input
                type="file"
                accept=".png,.jpg,.jpeg,.pdf,.svg,.ai"
                onChange={e => setFile(e.target.files?.[0] || null)}
                className="cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <Label>Notes / Special Instructions <span className="text-muted-foreground text-xs">(optional)</span></Label>
              <Textarea placeholder="Color preferences, placement details, event date, etc." rows={3} {...register('notes')} />
            </div>

            <div className="border-t border-border pt-6 space-y-4">
              <h3 className="font-serif font-bold text-lg">Delivery Details</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label>Full Name</Label>
                  <Input placeholder="Your full name" {...register('contact_name')} />
                  {errors.contact_name && <p className="text-xs text-destructive">{errors.contact_name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label>Phone Number</Label>
                  <Input placeholder="09xx xxx xxxx" {...register('contact_phone')} />
                  {errors.contact_phone && <p className="text-xs text-destructive">{errors.contact_phone.message}</p>}
                </div>
              </div>
              <div className="space-y-1.5">
                <Label>Delivery Address</Label>
                <Textarea placeholder="Full address for delivery, or 'Pickup in Santa Rosa'" rows={2} {...register('delivery_address')} />
                {errors.delivery_address && <p className="text-xs text-destructive">{errors.delivery_address.message}</p>}
              </div>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitting}>
              {submitting ? 'Submitting Order...' : 'Submit Order'}
            </Button>
          </form>
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "feat: custom order form with file upload"
```

---

### Task 10: My Orders page

**Files:**
- Create: `manopress/app/orders/page.tsx`

- [ ] **Step 1: Create orders page** `app/orders/page.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ExternalLink } from 'lucide-react'
import Footer from '@/components/Footer'

const statusColor: Record<string, string> = {
  'Pending': 'bg-yellow-100 text-yellow-800',
  'In Production': 'bg-blue-100 text-blue-800',
  'Ready': 'bg-green-100 text-green-800',
  'Delivered': 'bg-gray-100 text-gray-600',
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const searchParams = useSearchParams()
  const success = searchParams.get('success')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('orders').select('*').order('created_at', { ascending: false })
      .then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [])

  return (
    <>
      <section className="py-16 px-6 md:px-16 bg-white min-h-screen">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-between items-center mb-8 flex-wrap gap-4">
            <div>
              <h1 className="text-4xl font-serif font-bold">My Orders</h1>
              <p className="text-muted-foreground mt-1">Track all your custom print orders</p>
            </div>
            <Button asChild><Link href="/order">+ New Order</Link></Button>
          </div>

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-800 rounded-xl px-4 py-3 mb-6 text-sm">
              Order submitted successfully! We'll confirm details and pricing shortly.
            </div>
          )}

          {loading ? (
            <p className="text-muted-foreground">Loading orders...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-muted-foreground mb-4">No orders yet.</p>
              <Button asChild><Link href="/order">Place Your First Order</Link></Button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map(order => (
                <div key={order.id} className="border border-border rounded-xl p-5 hover:border-primary/50 transition-colors">
                  <div className="flex justify-between items-start flex-wrap gap-3 mb-3">
                    <div>
                      <p className="font-mono text-xs text-muted-foreground mb-1">#{order.id.slice(0,8).toUpperCase()}</p>
                      <h3 className="font-serif font-bold text-lg">{order.product_type}</h3>
                    </div>
                    <span className={`text-xs font-semibold px-3 py-1 rounded-full ${statusColor[order.status] || 'bg-gray-100 text-gray-600'}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm text-muted-foreground">
                    <div><span className="font-medium text-foreground block">Quantity</span>{order.quantity}</div>
                    {order.size && <div><span className="font-medium text-foreground block">Size</span>{order.size}</div>}
                    <div><span className="font-medium text-foreground block">Date</span>{new Date(order.created_at).toLocaleDateString()}</div>
                    {order.total_amount && <div><span className="font-medium text-foreground block">Total</span>₱{order.total_amount}</div>}
                  </div>
                  {order.design_file_url && (
                    <a href={order.design_file_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 mt-3 text-xs text-primary hover:underline">
                      <ExternalLink size={12} /> View Design File
                    </a>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      <Footer />
    </>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "feat: my orders page"
```

---

## Phase 5: Admin Dashboard

### Task 11: Admin layout + sidebar

**Files:**
- Create: `manopress/app/admin/layout.tsx`
- Create: `manopress/components/admin/AdminSidebar.tsx`

- [ ] **Step 1: Create AdminSidebar** `components/admin/AdminSidebar.tsx`
```tsx
'use client'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { LayoutDashboard, ShoppingBag, Package, Users, LogOut } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'

const links = [
  { href: '/admin', icon: LayoutDashboard, label: 'Dashboard' },
  { href: '/admin/orders', icon: ShoppingBag, label: 'Orders' },
  { href: '/admin/products', icon: Package, label: 'Products' },
  { href: '/admin/users', icon: Users, label: 'Users' },
]

export default function AdminSidebar() {
  const pathname = usePathname()
  const router = useRouter()
  const supabase = createClient()

  async function handleLogout() {
    await supabase.auth.signOut()
    router.push('/')
  }

  return (
    <aside className="w-56 shrink-0 bg-[#0f1f40] text-white min-h-screen flex flex-col">
      <div className="p-5 border-b border-white/10">
        <span className="font-serif font-black text-lg">MANO<span className="text-blue-400">PRESS</span></span>
        <p className="text-xs text-white/40 mt-0.5">Admin Panel</p>
      </div>
      <nav className="flex-1 p-3">
        {links.map(l => {
          const active = pathname === l.href
          return (
            <Link key={l.href} href={l.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium mb-1 transition-colors ${active ? 'bg-primary text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
              <l.icon size={16} />
              {l.label}
            </Link>
          )
        })}
      </nav>
      <div className="p-3 border-t border-white/10">
        <button onClick={handleLogout} className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm text-white/60 hover:text-white hover:bg-white/10 w-full transition-colors">
          <LogOut size={16} /> Logout
        </button>
      </div>
    </aside>
  )
}
```

- [ ] **Step 2: Create admin layout** `app/admin/layout.tsx`
```tsx
import AdminSidebar from '@/components/admin/AdminSidebar'

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      <AdminSidebar />
      <div className="flex-1 overflow-auto p-8">{children}</div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: admin layout and sidebar"
```

---

### Task 12: Admin dashboard page

**Files:**
- Create: `manopress/app/admin/page.tsx`

- [ ] **Step 1: Create dashboard** `app/admin/page.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ShoppingBag, Clock, Users, Package } from 'lucide-react'

export default function AdminDashboard() {
  const [stats, setStats] = useState({ total: 0, pending: 0, users: 0, products: 0 })
  const [recent, setRecent] = useState<any[]>([])
  const supabase = createClient()

  useEffect(() => {
    async function load() {
      const [{ count: total }, { count: pending }, { count: users }, { count: products }, { data: orders }] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'Pending'),
        supabase.from('profiles').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('*, profiles(email)').order('created_at', { ascending: false }).limit(8),
      ])
      setStats({ total: total||0, pending: pending||0, users: users||0, products: products||0 })
      setRecent(orders || [])
    }
    load()
  }, [])

  const cards = [
    { label: 'Total Orders', value: stats.total, icon: ShoppingBag, color: 'text-blue-600 bg-blue-50' },
    { label: 'Pending Orders', value: stats.pending, icon: Clock, color: 'text-yellow-600 bg-yellow-50' },
    { label: 'Total Users', value: stats.users, icon: Users, color: 'text-green-600 bg-green-50' },
    { label: 'Products', value: stats.products, icon: Package, color: 'text-purple-600 bg-purple-50' },
  ]

  const statusColor: Record<string,string> = {
    'Pending':'bg-yellow-100 text-yellow-800',
    'In Production':'bg-blue-100 text-blue-800',
    'Ready':'bg-green-100 text-green-800',
    'Delivered':'bg-gray-100 text-gray-600',
  }

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {cards.map(c => (
          <div key={c.label} className="bg-white rounded-xl border border-border p-5">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-3 ${c.color}`}>
              <c.icon size={18} />
            </div>
            <p className="text-2xl font-serif font-bold">{c.value}</p>
            <p className="text-xs text-muted-foreground mt-0.5">{c.label}</p>
          </div>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="font-serif font-bold">Recent Orders</h2>
        </div>
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {recent.map(o => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0,8).toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.profiles?.email || o.contact_name}</td>
                <td className="px-4 py-3">{o.product_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${statusColor[o.status]||'bg-gray-100 text-gray-600'}`}>{o.status}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "feat: admin dashboard with stats and recent orders"
```

---

### Task 13: Admin Orders page

**Files:**
- Create: `manopress/app/admin/orders/page.tsx`

- [ ] **Step 1: Create admin orders page** `app/admin/orders/page.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { ExternalLink } from 'lucide-react'

const statuses = ['Pending','In Production','Ready','Delivered']
const statusColor: Record<string,string> = {
  'Pending':'bg-yellow-100 text-yellow-800',
  'In Production':'bg-blue-100 text-blue-800',
  'Ready':'bg-green-100 text-green-800',
  'Delivered':'bg-gray-100 text-gray-600',
}

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<any[]>([])
  const [filter, setFilter] = useState('All')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('orders').select('*, profiles(email)').order('created_at', { ascending: false })
      .then(({ data }) => setOrders(data || []))
  }, [])

  async function updateStatus(id: string, status: string) {
    await supabase.from('orders').update({ status }).eq('id', id)
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o))
  }

  const filtered = filter === 'All' ? orders : orders.filter(o => o.status === filter)

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Orders</h1>

      <div className="flex gap-2 mb-5 flex-wrap">
        {['All', ...statuses].map(s => (
          <button key={s} onClick={() => setFilter(s)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${filter===s ? 'bg-primary text-white' : 'bg-white border border-border text-muted-foreground hover:border-primary'}`}>
            {s}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Order ID</th>
              <th className="px-4 py-3 text-left">Customer</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Qty</th>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Design</th>
              <th className="px-4 py-3 text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(o => (
              <tr key={o.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 font-mono text-xs">#{o.id.slice(0,8).toUpperCase()}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{o.profiles?.email || o.contact_name}</td>
                <td className="px-4 py-3 font-medium">{o.product_type}</td>
                <td className="px-4 py-3 text-muted-foreground">{o.quantity}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(o.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  {o.design_file_url
                    ? <a href={o.design_file_url} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline inline-flex items-center gap-1 text-xs"><ExternalLink size={11} />View</a>
                    : <span className="text-muted-foreground text-xs">—</span>}
                </td>
                <td className="px-4 py-3">
                  <select value={o.status} onChange={e => updateStatus(o.id, e.target.value)}
                    className={`text-xs font-semibold rounded-full px-2 py-0.5 border-0 cursor-pointer ${statusColor[o.status]||'bg-gray-100 text-gray-600'}`}>
                    {statuses.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <p className="text-center py-10 text-muted-foreground text-sm">No orders found.</p>}
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Commit**
```bash
git add .
git commit -m "feat: admin orders management"
```

---

### Task 14: Admin Products + Users pages

**Files:**
- Create: `manopress/app/admin/products/page.tsx`
- Create: `manopress/app/admin/users/page.tsx`

- [ ] **Step 1: Admin products page** `app/admin/products/page.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pencil, Trash2, Plus } from 'lucide-react'

export default function AdminProductsPage() {
  const [products, setProducts] = useState<any[]>([])
  const [editing, setEditing] = useState<any>(null)
  const [form, setForm] = useState({ name:'', category:'', price:'', description:'' })
  const supabase = createClient()

  useEffect(() => { loadProducts() }, [])
  async function loadProducts() {
    const { data } = await supabase.from('products').select('*').order('created_at')
    setProducts(data || [])
  }

  async function saveProduct() {
    const payload = { ...form, price: Number(form.price) }
    if (editing) {
      await supabase.from('products').update(payload).eq('id', editing.id)
    } else {
      await supabase.from('products').insert(payload)
    }
    setEditing(null); setForm({ name:'', category:'', price:'', description:'' })
    loadProducts()
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    loadProducts()
  }

  function startEdit(p: any) {
    setEditing(p)
    setForm({ name: p.name, category: p.category, price: String(p.price), description: p.description || '' })
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-serif font-bold">Products</h1>
        <Button size="sm" onClick={() => { setEditing(null); setForm({ name:'', category:'', price:'', description:'' }) }}>
          <Plus size={14} className="mr-1" /> Add Product
        </Button>
      </div>

      {(editing !== null || form.name !== '') && (
        <div className="bg-white border border-border rounded-xl p-5 mb-6">
          <h2 className="font-serif font-bold mb-4">{editing ? 'Edit Product' : 'New Product'}</h2>
          <div className="grid grid-cols-2 gap-3 mb-3">
            <Input placeholder="Product name" value={form.name} onChange={e => setForm({...form, name:e.target.value})} />
            <Input placeholder="Category" value={form.category} onChange={e => setForm({...form, category:e.target.value})} />
            <Input placeholder="Price (₱)" type="number" value={form.price} onChange={e => setForm({...form, price:e.target.value})} />
            <Input placeholder="Description" value={form.description} onChange={e => setForm({...form, description:e.target.value})} />
          </div>
          <div className="flex gap-2">
            <Button size="sm" onClick={saveProduct}>Save</Button>
            <Button size="sm" variant="ghost" onClick={() => { setEditing(null); setForm({ name:'', category:'', price:'', description:'' }) }}>Cancel</Button>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-left">Price</th>
              <th className="px-4 py-3 text-left">Description</th>
              <th className="px-4 py-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-muted-foreground">{p.category}</td>
                <td className="px-4 py-3 font-mono text-primary">₱{p.price}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs max-w-xs truncate">{p.description}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => startEdit(p)} className="text-muted-foreground hover:text-primary"><Pencil size={14}/></button>
                    <button onClick={() => deleteProduct(p.id)} className="text-muted-foreground hover:text-destructive"><Trash2 size={14}/></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 2: Admin users page** `app/admin/users/page.tsx`
```tsx
'use client'
import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'

export default function AdminUsersPage() {
  const [users, setUsers] = useState<any[]>([])
  const [search, setSearch] = useState('')
  const supabase = createClient()

  useEffect(() => {
    supabase.from('profiles').select('*').order('created_at', { ascending: false })
      .then(({ data }) => setUsers(data || []))
  }, [])

  async function toggleAdmin(id: string, current: boolean) {
    await supabase.from('profiles').update({ is_admin: !current }).eq('id', id)
    setUsers(prev => prev.map(u => u.id === id ? { ...u, is_admin: !current } : u))
  }

  const filtered = users.filter(u => u.email.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <h1 className="text-2xl font-serif font-bold mb-6">Users</h1>
      <Input placeholder="Search by email..." value={search} onChange={e => setSearch(e.target.value)} className="max-w-xs mb-5" />
      <div className="bg-white rounded-xl border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/40 text-xs uppercase tracking-wide text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-left">Joined</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(u => (
              <tr key={u.id} className="border-t border-border hover:bg-muted/20">
                <td className="px-4 py-3 text-muted-foreground">{u.email}</td>
                <td className="px-4 py-3 text-muted-foreground text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
                <td className="px-4 py-3">
                  <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${u.is_admin ? 'bg-primary text-white' : 'bg-muted text-muted-foreground'}`}>
                    {u.is_admin ? 'Admin' : 'User'}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <button onClick={() => toggleAdmin(u.id, u.is_admin)}
                    className="text-xs text-primary hover:underline font-medium">
                    {u.is_admin ? 'Remove Admin' : 'Make Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
```

- [ ] **Step 3: Commit**
```bash
git add .
git commit -m "feat: admin products and users management"
```

---

## Phase 6: Deploy

### Task 15: Deploy to Vercel

- [ ] **Step 1: Push to GitHub**
```bash
git remote add origin https://github.com/YOUR_USERNAME/manopress.git
git push -u origin main
```

- [ ] **Step 2: Connect to Vercel**
1. Go to vercel.com → New Project → Import from GitHub → select `manopress`
2. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
3. Click Deploy

- [ ] **Step 3: Set up custom domain**
In Vercel → Settings → Domains → Add `manopress.uk`
Update DNS records at your domain registrar to point to Vercel.

- [ ] **Step 4: Verify live site**
Open `https://manopress.uk` — homepage, order form, admin login all working.
