import { createClient as createBrowserClient } from '@/lib/supabase/client';

// Client-side queries only (for admin pages)
export async function getCategoriesClient(): Promise<any[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('is_active', true)
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

export async function createDiamondPack(pack: any): Promise<any> {
  const supabase = createBrowserClient();
  const final_price = calculateFinalPrice(pack.price, pack.discount || 0);
  const { data, error } = await supabase
    .from('diamond_packs')
    .insert({ ...pack, final_price })
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateDiamondPack(id: string, pack: any): Promise<any> {
  const supabase = createBrowserClient();
  const final_price = calculateFinalPrice(pack.price, pack.discount || 0);
  const { data, error } = await supabase
    .from('diamond_packs')
    .update({ ...pack, final_price })
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteDiamondPack(id: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from('diamond_packs')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getDiamondPacksClient(category?: string): Promise<any[]> {
  const supabase = createBrowserClient();
  let query = supabase
    .from('diamond_packs')
    .select('*')
    .order('quantity', { ascending: true });
  if (category) {
    query = query.eq('category', category);
  }
  const { data, error } = await query;
  if (error) throw error;
  return data || [];
}

function calculateFinalPrice(price: number, discount: number): number {
  return discount > 0 ? price - (price * discount / 100) : price;
}

// Similar for categories
export async function createCategory(category: any): Promise<any> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('categories')
    .insert(category)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateCategory(id: string, category: any): Promise<any> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('categories')
    .update(category)
    .eq('id', id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteCategory(id: string): Promise<void> {
  const supabase = createBrowserClient();
  const { error } = await supabase
    .from('categories')
    .delete()
    .eq('id', id);
  if (error) throw error;
}

export async function getAllCategoriesClient(): Promise<any[]> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .order('display_order', { ascending: true });
  if (error) throw error;
  return data || [];
}

// For topup page
export async function getDiamondById(id: string): Promise<any | null> {
  const supabase = createBrowserClient();
  const { data, error } = await supabase
    .from('diamond_packs')
    .select('*')
    .eq('id', id)
    .single();
  if (error && error.code !== 'PGRST116') throw error; // No row not error
  return data;
}
