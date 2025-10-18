<!-- 7c13bcbf-91f0-4772-b123-6f92a86b8ade 295e4b0d-60d8-4b21-97c0-20a89a3108b2 -->
# Supabase Backend Integration Plan

## Phase 1: Setup & Configuration

### 1.1 Install Dependencies

Install Supabase client library:

- `@supabase/supabase-js` - Supabase JavaScript client
- `@supabase/auth-helpers-nextjs` - Next.js authentication helpers

### 1.2 Environment Variables

Create `.env.local` file with:

- `NEXT_PUBLIC_SUPABASE_URL` - Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Your Supabase anonymous key
- `SUPABASE_SERVICE_ROLE_KEY` - Service role key (for admin operations)
- `NEXT_PUBLIC_ADMIN_EMAIL` - Admin login email
- `NEXT_PUBLIC_ADMIN_PASSWORD_HASH` - Hashed admin password

### 1.3 Supabase Client Setup

Create `src/lib/supabase/client.ts` for browser-side client
Create `src/lib/supabase/server.ts` for server-side client

## Phase 2: Database Schema Setup

### 2.1 Create Tables in Supabase

Execute SQL in Supabase SQL Editor to create tables:

**users** (extends auth.users)

- id (uuid, references auth.users)
- name (text)
- phone (text)
- wallet_balance (numeric, default 0)
- profile_picture (text, nullable)
- created_at (timestamp)
- updated_at (timestamp)

**orders**

- id (uuid, primary key)
- user_id (uuid, references users)
- offer_id (text)
- pack_id (text)
- player_uid (text)
- amount (numeric)
- diamonds (integer)
- payment_method (text)
- status (text: pending/completed/cancelled)
- item (text)
- created_at (timestamp)

**transactions**

- id (uuid, primary key)
- user_id (uuid, references users)
- type (text: credit/debit)
- amount (numeric)
- description (text)
- method (text, nullable)
- created_at (timestamp)

**banners**

- id (uuid, primary key)
- title (text)
- image_url (text)
- link (text, nullable)
- is_active (boolean)
- order_number (integer)
- created_at (timestamp)

**diamond_packs**

- id (uuid, primary key)
- quantity (integer)
- price (numeric)
- discount (integer, default 0)
- category (text)
- bonus (integer, default 0)
- final_price (numeric)
- created_at (timestamp)

**categories**

- id (uuid, primary key)
- name (text)
- display_name (text)
- description (text)
- icon (text)
- color (text)
- is_active (boolean)
- order_number (integer)
- created_at (timestamp)

**topup_cards**

- id (uuid, primary key)
- title (text)
- image_url (text)
- category (text)
- card_type (text)
- description (text)
- packs (jsonb)
- created_at (timestamp)

**support_tickets**

- id (uuid, primary key)
- user_id (uuid, references users)
- user_name (text)
- user_email (text)
- user_phone (text)
- subject (text)
- message (text)
- status (text: open/in-progress/resolved)
- priority (text: low/medium/high)
- replies (jsonb)
- created_at (timestamp)
- updated_at (timestamp)

**admin_settings**

- id (uuid, primary key)
- key (text, unique)
- value (text)
- updated_at (timestamp)

### 2.2 Row Level Security (RLS) Policies

Enable RLS on all tables and create policies:

- Users can read/update their own data
- Orders: Users can read their own orders, insert new orders
- Transactions: Users can read their own transactions
- Public read access for: banners (active only), diamond_packs, categories (active only), topup_cards
- Support tickets: Users can create and read their own tickets
- Admin operations use service role key (bypass RLS)

## Phase 3: Authentication Setup

### 3.1 User Authentication (Email/Password + Google)

- Configure Supabase Auth settings in dashboard
- Enable Email provider
- Enable Google OAuth provider (configure credentials)
- Set up redirect URLs

### 3.2 Create Auth Context

Create `src/contexts/AuthContext.tsx`:

- Manage user session state
- Provide login, register, logout functions
- Handle Google OAuth flow
- Auto-sync user profile with custom users table

### 3.3 Update Auth Pages

Modify `src/app/login/page.tsx`:

- Replace localStorage with Supabase auth
- Add Google sign-in button

Modify `src/app/register/page.tsx`:

- Use Supabase signup
- Create user profile in users table
- Add Google sign-up option

### 3.4 Admin Authentication

Create `src/lib/admin-auth.ts`:

- Simple credential check against environment variables
- Hash-based password verification
- Session management using localStorage (admin-only)

Modify `src/app/admin/login/page.tsx`:

- Admin login form
- Verify against admin credentials

## Phase 4: API Routes Migration

### 4.1 Auth API Routes

Update `src/app/api/auth/login/route.ts`:

- Use Supabase authentication
- Handle session creation

Update `src/app/api/auth/register/route.ts`:

- Create user in Supabase auth
- Create profile in users table

### 4.2 Orders API

Update `src/app/api/orders/route.ts`:

- GET: Fetch user orders from Supabase
- POST: Create new order in Supabase
- Handle wallet deduction as transaction

### 4.3 Wallet API

Update `src/app/api/wallet/route.ts`:

- GET: Fetch transactions
- POST: Add wallet balance (create transaction)

## Phase 5: Frontend Components Migration

### 5.1 User Pages

Update `src/app/profile/page.tsx`:

- Fetch user data from Supabase
- Update profile functionality

Update `src/app/wallet/page.tsx`:

- Fetch transactions from Supabase
- Real-time wallet balance

Update `src/app/orders/page.tsx`:

- Fetch orders from Supabase
- Real-time order updates

### 5.2 Top-up Flow

Update `src/app/topup/[offerId]/page.tsx`:

- Fetch diamond packs from Supabase
- Create orders in Supabase
- Handle payment flow

### 5.3 Home Page

Update `src/app/page.tsx`:

- Fetch banners from Supabase
- Fetch categories and cards from Supabase
- Cache data appropriately

## Phase 6: Admin Panel Migration

### 6.1 Admin Layout

Update `src/components/admin/AdminLayout.tsx`:

- Verify admin auth on mount
- Protect routes

### 6.2 Admin Dashboard

Update `src/app/admin/dashboard/page.tsx`:

- Fetch stats from Supabase (count users, orders, revenue)
- Real-time updates

### 6.3 Admin Management Pages

Update all admin pages to use Supabase:

- `src/app/admin/users/page.tsx` - User management
- `src/app/admin/orders/page.tsx` - Order management
- `src/app/admin/support/page.tsx` - Support tickets
- `src/app/admin/banners/page.tsx` - Banner management
- `src/app/admin/diamonds/page.tsx` - Diamond packs
- `src/app/admin/categories/page.tsx` - Categories
- `src/app/admin/cards/page.tsx` - Top-up cards

## Phase 7: Storage Setup

### 7.1 Create Storage Buckets

Create buckets in Supabase Storage:

- `banners` - For banner images
- `cards` - For top-up card images
- `profiles` - For user profile pictures

### 7.2 Upload Functionality

Create `src/lib/supabase/storage.ts`:

- Upload image helper functions
- Get public URL functions

### 7.3 Update Image Uploads

Add image upload to:

- Banner management (admin)
- Card management (admin)
- Profile picture upload (users)

## Phase 8: Testing & Data Migration

### 8.1 Seed Initial Data

Create SQL script to insert:

- Default categories
- Sample diamond packs
- Default banners

### 8.2 Test All Features

- User registration/login (email + Google)
- Admin login
- Order creation
- Wallet operations
- All admin CRUD operations

### 8.3 Remove localStorage Dependencies

- Remove `src/lib/mockData.ts`
- Remove `src/components/DataInitializer.tsx`
- Clean up localStorage references

## Files to Create/Modify

**New Files:**

- `.env.local` - Environment variables
- `src/lib/supabase/client.ts` - Browser Supabase client
- `src/lib/supabase/server.ts` - Server Supabase client
- `src/lib/supabase/storage.ts` - Storage helpers
- `src/lib/admin-auth.ts` - Admin authentication
- `src/contexts/AuthContext.tsx` - Auth context provider
- `supabase-schema.sql` - Database schema SQL

**Modified Files:**

- `package.json` - Add Supabase dependencies
- `src/app/layout.tsx` - Wrap with AuthContext
- `src/app/login/page.tsx` - Supabase auth
- `src/app/register/page.tsx` - Supabase signup
- `src/app/profile/page.tsx` - Fetch from Supabase
- `src/app/wallet/page.tsx` - Fetch from Supabase
- `src/app/orders/page.tsx` - Fetch from Supabase
- `src/app/page.tsx` - Fetch from Supabase
- `src/app/topup/[offerId]/page.tsx` - Use Supabase
- All admin pages - Use Supabase
- `src/app/api/auth/login/route.ts` - Supabase auth
- `src/app/api/auth/register/route.ts` - Supabase auth
- `src/app/api/orders/route.ts` - Supabase queries
- `src/app/api/wallet/route.ts` - Supabase queries

**Files to Delete:**

- `src/lib/mockData.ts`
- `src/lib/initializeData.ts`
- `src/components/DataInitializer.tsx`

### To-dos

- [ ] Install Supabase dependencies (@supabase/supabase-js, @supabase/auth-helpers-nextjs)
- [ ] Create .env.local file with Supabase credentials and admin settings
- [ ] Create Supabase client utilities (client.ts, server.ts, storage.ts)
- [ ] Create and execute SQL schema for all tables (users, orders, transactions, banners, etc.)
- [ ] Set up Row Level Security policies for all tables
- [ ] Create AuthContext for user authentication state management
- [ ] Create admin authentication system (admin-auth.ts)
- [ ] Update login and register pages with Supabase auth and Google OAuth
- [ ] Update admin login page with new admin authentication
- [ ] Update API routes (auth, orders, wallet) to use Supabase
- [ ] Update user pages (profile, wallet, orders) to fetch from Supabase
- [ ] Update top-up flow to use Supabase for diamond packs and order creation
- [ ] Update home page to fetch banners, categories, and cards from Supabase
- [ ] Update admin dashboard to fetch stats from Supabase
- [ ] Update all admin management pages to use Supabase (users, orders, support, banners, diamonds, categories, cards)
- [ ] Create storage buckets and upload functionality for images
- [ ] Create and run SQL script to seed initial data (categories, diamond packs, banners)
- [ ] Remove localStorage dependencies (mockData.ts, DataInitializer.tsx, initializeData.ts)
- [ ] Test all features: user auth, admin auth, orders, wallet, admin CRUD operations