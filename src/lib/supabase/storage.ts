import { createClient } from './client';

export const supabase = createClient();

// Storage buckets
export const BUCKETS = {
  BANNERS: 'banners',
  TOPUP_CARDS: 'topup-cards',
  USER_AVATARS: 'user-avatars'
};

// File upload function
export async function uploadFile(
  bucket: string,
  file: File,
  folder?: string
): Promise<{ data: string | null; error: string | null }> {
  try {
    // Generate unique file name
    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    console.log('Uploading file:', { bucket, filePath, size: file.size, type: file.type });

    // Upload file to Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Upload error:', error);
      return { data: null, error: error.message };
    }

    console.log('Upload successful, getting public URL...');

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(filePath);

    console.log('Public URL:', publicUrl);

    return { data: publicUrl, error: null };
  } catch (error) {
    console.error('Upload exception:', error);
    return { data: null, error: 'Upload failed' };
  }
}

// Delete file function
export async function deleteFile(
  bucket: string,
  filePath: string
): Promise<{ error: string | null }> {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error('Delete error:', error);
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Delete exception:', error);
    return { error: 'Delete failed' };
  }
}

// Get file URL from storage path
export function getFileUrl(bucket: string, filePath: string): string {
  const { data: { publicUrl } } = supabase.storage
    .from(bucket)
    .getPublicUrl(filePath);
  return publicUrl;
}

// Check if bucket exists and create if not
export async function ensureBucketExists(bucket: string): Promise<{ error: string | null }> {
  try {
    const { data, error } = await supabase.storage.getBucket(bucket);
    
    if (error && error.message.includes('not found')) {
      // Bucket doesn't exist, create it
      const { error: createError } = await supabase.storage.createBucket(bucket, {
        public: true,
        fileSizeLimit: 5242880, // 5MB
        allowedMimeTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp', 'image/gif']
      });
      
      if (createError) {
        return { error: createError.message };
      }
    } else if (error) {
      return { error: error.message };
    }

    return { error: null };
  } catch (error) {
    console.error('Bucket check error:', error);
    return { error: 'Bucket check failed' };
  }
}

// Initialize all required buckets
export async function initializeStorageBuckets(): Promise<void> {
  const buckets = Object.values(BUCKETS);
  
  for (const bucket of buckets) {
    const { error } = await ensureBucketExists(bucket);
    if (error) {
      console.warn(`Failed to initialize bucket ${bucket}:`, error);
    } else {
      console.log(`Bucket ${bucket} is ready`);
    }
  }
}
