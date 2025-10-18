# Supabase Backend Setup Guide for IHN TOPUP

This guide will help you set up the Supabase backend for your IHN TOPUP application.

## Prerequisites

- A Supabase account (sign up at https://supabase.com)
- Your Supabase project created

## Step 1: Get Your Supabase Credentials

1. Go to your Supabase project dashboard
2. Navigate to **Settings** > **API**
3. Copy the following values:
   - **Project URL** (something like `https://xxxxx.supabase.co`)
   - **anon/public key** (starts with `eyJh...`)
   - **service_role key** (starts with `eyJh...`) - **Keep this secret!**

## Step 2: Configure Environment Variables

1. Copy the `env-template.txt` file content to a new file named `.env.local` in the root directory
2. Fill in your Supabase credentials:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here

# Set your admin credentials
NEXT_PUBLIC_ADMIN_EMAIL=admin@ihntopup.com
NEXT_PUBLIC_ADMIN_PASSWORD=your-secure-password

# Set your site URL
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

**Important:** Never commit the `.env.local` file to version control!

## Step 3: Set Up Database Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Click **New query**
4. Copy the entire content of `supabase-schema.sql`
5. Paste it into the SQL editor
6. Click **Run** to execute the schema

This will create all the necessary tables, indexes, functions, and Row Level Security policies.

## Step 4: Seed Initial Data

1. In the SQL Editor, create another new query
2. Copy the entire content of `supabase-seed.sql`
3. Paste it into the SQL editor
4. Click **Run** to execute

This will populate your database with:
- Default categories (Discount Offers, Regular Top-Up, Weekly Membership, Monthly Membership)
- Sample diamond packs with pricing
- Sample banners
- Sample top-up cards
- Admin settings

## Step 5: Configure Authentication

### Enable Email Authentication

1. Go to **Authentication** > **Providers**
2. Make sure **Email** provider is enabled
3. Configure email templates if needed

### Enable Google OAuth (Optional)

1. Go to **Authentication** > **Providers**
2. Enable **Google** provider
3. You'll need to:
   - Create a Google Cloud project
   - Enable Google+ API
   - Create OAuth 2.0 credentials
   - Add authorized redirect URIs:
     - `https://your-project.supabase.co/auth/v1/callback`
     - `http://localhost:3000/auth/callback` (for local development)
4. Copy the **Client ID** and **Client Secret** to Supabase

### Configure Email Settings

1. Go to **Authentication** > **Email Templates**
2. Customize the templates if needed
3. You can disable email confirmation for testing by going to **Authentication** > **Settings** and unchecking **Enable email confirmations**

## Step 6: Set Up Storage Buckets

1. Go to **Storage**
2. Create three new buckets:
   - **banners** (for banner images)
   - **cards** (for top-up card images)
   - **profiles** (for user profile pictures)

3. For each bucket, configure policies:
   - Click on the bucket
   - Go to **Policies**
   - Add these policies:

**For public read access (all buckets):**
```sql
CREATE POLICY "Public Access"
ON storage.objects FOR SELECT
USING ( bucket_id = 'bucket-name' );
```

**For authenticated upload (all buckets):**
```sql
CREATE POLICY "Authenticated users can upload"
ON storage.objects FOR INSERT
WITH CHECK ( bucket_id = 'bucket-name' AND auth.role() = 'authenticated' );
```

Replace `'bucket-name'` with the actual bucket name (banners, cards, or profiles).

## Step 7: Test the Setup

1. Start your development server:
```bash
npm run dev
```

2. Open http://localhost:3000

3. Test user registration:
   - Go to `/register`
   - Create a new account
   - Check your email for verification (if enabled)

4. Test user login:
   - Go to `/login`
   - Log in with your credentials
   - Try Google login if configured

5. Test admin panel:
   - Go to `/admin/login`
   - Log in with the admin email and password you set in `.env.local`
   - You should see the admin dashboard

## Troubleshooting

### Issue: "Invalid API key"
- Double-check your Supabase URL and keys in `.env.local`
- Make sure there are no extra spaces or quotes
- Restart your dev server after changing `.env.local`

### Issue: "Email not confirmed"
- Go to Supabase Authentication > Users
- Find your user and click the menu (•••)
- Click "Send confirmation email" or manually verify the user

### Issue: "Row Level Security policy violation"
- Make sure you ran the `supabase-schema.sql` completely
- Check that RLS policies were created successfully
- You can view policies in the Table Editor > Select table > Policies tab

### Issue: Admin login not working
- Verify `NEXT_PUBLIC_ADMIN_EMAIL` and `NEXT_PUBLIC_ADMIN_PASSWORD` in `.env.local`
- Make sure they match exactly (case-sensitive)
- Clear browser cache and try again

### Issue: Google OAuth not working
- Verify redirect URIs in Google Cloud Console
- Make sure the Client ID and Secret are correct in Supabase
- Check that the provider is enabled in Supabase Authentication

## Database Structure

The database includes the following tables:

- **users** - User profiles (extends auth.users)
- **orders** - Diamond top-up orders
- **transactions** - Wallet transactions
- **banners** - Homepage banners
- **diamond_packs** - Diamond packages and pricing
- **categories** - Category sections for the homepage
- **topup_cards** - Top-up card offerings
- **support_tickets** - Customer support tickets
- **admin_settings** - Admin configuration

## Security Notes

1. **Never expose your service role key** - It bypasses all RLS policies
2. Keep your `.env.local` file secure and never commit it
3. Use strong admin passwords
4. Enable email confirmation in production
5. Configure proper CORS and authentication settings in Supabase

## Next Steps

After setup is complete:

1. Customize the default data (categories, diamond packs, banners)
2. Update the banners with your own images
3. Configure payment gateways (when ready)
4. Set up proper email templates
5. Configure your production environment variables
6. Deploy your application

## Support

If you encounter any issues:
1. Check the Supabase logs in your dashboard
2. Check the browser console for errors
3. Review the SQL execution logs
4. Ensure all environment variables are set correctly

Happy coding! 🚀

