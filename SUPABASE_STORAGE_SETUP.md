# Supabase Storage Setup Guide for IHN TOPUP

This guide will help you set up Supabase Storage for file uploads in your admin panel.

## 📋 Prerequisites

- Supabase project created
- Supabase URL and anon key configured in your environment
- Admin access to your Supabase project

## 🚀 Step 1: Enable Storage in Supabase

### Method 1: Using Supabase Dashboard (Recommended)

1. **Go to your Supabase Dashboard**
   - Navigate to [https://supabase.com/dashboard](https://supabase.com/dashboard)
   - Select your project

2. **Enable Storage**
   - In the left sidebar, click on **"Storage"**
   - If you see a message about enabling Storage, click **"Enable Storage"**

3. **Create Storage Buckets**
   - Click **"Create a new bucket"**
   - Create the following buckets with these settings:

   #### Bucket 1: `banners`
   - **Name:** `banners`
   - **Public:** ✅ Yes
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp, image/gif`

   #### Bucket 2: `topup-cards`
   - **Name:** `topup-cards`
   - **Public:** ✅ Yes
   - **File size limit:** 5MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp, image/gif`

   #### Bucket 3: `user-avatars`
   - **Name:** `user-avatars`
   - **Public:** ✅ Yes
   - **File size limit:** 2MB
   - **Allowed MIME types:** `image/jpeg, image/jpg, image/png, image/webp`

### Method 2: Using SQL (Alternative)

If you prefer using SQL, run this in your Supabase SQL Editor:

```sql
-- Create banners bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('banners', 'banners', true, 5242880, '{"image/jpeg","image/jpg","image/png","image/webp","image/gif"}');

-- Create topup-cards bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('topup-cards', 'topup-cards', true, 5242880, '{"image/jpeg","image/jpg","image/png","image/webp","image/gif"}');

-- Create user-avatars bucket
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES ('user-avatars', 'user-avatars', true, 2097152, '{"image/jpeg","image/jpg","image/png","image/webp"}');

-- Set up storage policies for public read access
CREATE POLICY "Public Access for banners" ON storage.objects
FOR SELECT USING (bucket_id = 'banners');

CREATE POLICY "Public Access for topup-cards" ON storage.objects
FOR SELECT USING (bucket_id = 'topup-cards');

CREATE POLICY "Public Access for user-avatars" ON storage.objects
FOR SELECT USING (bucket_id = 'user-avatars');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload banners" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'banners' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload topup-cards" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'topup-cards' 
  AND auth.role() = 'authenticated'
);

CREATE POLICY "Authenticated users can upload user-avatars" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'user-avatars' 
  AND auth.role() = 'authenticated'
);
```

## 🔧 Step 2: Update Environment Variables

Make sure your `.env.local` file includes the Supabase configuration:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

## 🎯 Step 3: Test the File Upload System

### Testing Steps:

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Access the admin panel:**
   - Go to `/admin`
   - Navigate to **Banner Management** or **Topup Card Management**

3. **Test file upload:**
   - Click "Add New Banner" or "Add New Topup Card"
   - In the form, use the file upload component
   - Try uploading an image from your device
   - The image should upload and display a preview

### Expected Behavior:

- ✅ File selection via click or drag & drop
- ✅ Image preview after selection
- ✅ Upload progress indicator
- ✅ Success message when upload completes
- ✅ Image URL saved to database
- ✅ Images accessible via public URLs

## 🔍 Step 4: Verify Storage Setup

### Check Storage Buckets:

1. **In Supabase Dashboard:**
   - Go to **Storage** → **banners**
   - You should see uploaded banner images
   - Repeat for **topup-cards** bucket

2. **Test Public URLs:**
   - Copy the public URL of an uploaded image
   - Open it in a new browser tab
   - The image should display correctly

## 🔧 Step 5: Fix Row-Level Security Policies

If you're getting "new row violates row-level security policy" error when uploading files, you need to set up proper storage policies.

### Quick Fix:
Run the SQL commands in `fix-storage-policies.sql` in your Supabase SQL Editor:

1. Go to your Supabase Dashboard → SQL Editor
2. Copy and paste the entire content from `fix-storage-policies.sql`
3. Run the SQL commands

This will:
- Drop any conflicting existing policies
- Create proper policies for public read access
- Allow authenticated users to upload, update, and delete files
- Set up policies for all three storage buckets

## 🛠️ Step 6: Troubleshooting

### Common Issues:

**Issue 1: "Row-level security policy" error**
- Solution: Run the `fix-storage-policies.sql` SQL commands in Supabase SQL Editor

**Issue 2: "Bucket not found" error**
- Solution: Make sure buckets are created exactly as named: `banners`, `topup-cards`, `user-avatars`

**Issue 3: "Policy not found" error**
- Solution: Run the SQL commands in `fix-storage-policies.sql` to create storage policies

**Issue 4: Upload fails silently**
- Solution: Check browser console for errors and verify environment variables

**Issue 5: Images not displaying**
- Solution: Verify the bucket is set to public and policies allow public read access

**Issue 6: File size too large**
- Solution: Ensure file is under 5MB for banners/topup-cards, 2MB for avatars

### Debug Commands:

```sql
-- Check if buckets exist
SELECT * FROM storage.buckets;

-- Check storage policies
SELECT * FROM pg_policies WHERE schemaname = 'storage';

-- List files in a bucket
SELECT * FROM storage.objects WHERE bucket_id = 'banners';
```

## 📁 File Structure Overview

```
src/
├── lib/supabase/
│   ├── storage.ts          # Storage configuration and functions
│   ├── client.ts           # Supabase client
│   └── server.ts           # Server-side client
├── components/admin/
│   └── FileUpload.tsx      # File upload component
└── app/admin/
    ├── banners/page.tsx    # Updated with file upload
    └── topup-cards/page.tsx # Updated with file upload
```

## 🔒 Security Considerations

1. **File Validation:**
   - Only image files are allowed
   - File size limits enforced
   - MIME type validation

2. **Access Control:**
   - Public read access for images
   - Authenticated users only can upload
   - Bucket-level security policies

3. **File Management:**
   - Automatic file naming to prevent conflicts
   - No overwrite protection (unique filenames)
   - Consider implementing file cleanup for deleted items

## 🚀 Production Deployment

### Before Going Live:

1. **Update environment variables** with production Supabase credentials
2. **Test file uploads** in production environment
3. **Verify CORS settings** in Supabase Storage
4. **Set up monitoring** for storage usage
5. **Implement backup strategy** for important images

### CORS Configuration (if needed):

If you encounter CORS issues, add your domain to Supabase CORS settings:

1. Go to **Settings** → **API** in Supabase Dashboard
2. Add your production domain to "Additional URLs"
3. Save changes

## 📞 Support

If you encounter issues:

1. Check the browser console for error messages
2. Verify Supabase Storage buckets and policies
3. Ensure environment variables are correct
4. Test with different image files and sizes

## 🎉 Success Checklist

- [ ] Storage buckets created (`banners`, `topup-cards`, `user-avatars`)
- [ ] Storage policies configured for public read
- [ ] Environment variables set correctly
- [ ] File upload working in admin panel
- [ ] Images displaying correctly on frontend
- [ ] Error handling working as expected

Your file upload system is now ready! 🚀
