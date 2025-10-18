'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import FileUpload from '@/components/admin/FileUpload';
import { FaImage, FaPlus, FaEdit, FaTrash, FaEye, FaEyeSlash } from 'react-icons/fa';
import { createClient as createBrowserClient } from '@/lib/supabase/client';

export default function BannerManagement() {
  const [banners, setBanners] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingBanner, setEditingBanner] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    image_url: '',
    link: '',
    isActive: true
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    loadBanners();
  }, []);

  const loadBanners = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('banners')
        .select('*')
        .order('created_at', { ascending: true });

      if (error) throw error;
      setBanners(data || []);
    } catch (error) {
      console.error('Error loading banners:', error);
      alert('Failed to load banners. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      if (editingBanner) {
        // Update existing banner in Supabase
        const { error } = await supabase
          .from('banners')
          .update({
            title: formData.title,
            image_url: formData.image_url,
            link: formData.link,
            isActive: formData.isActive
          })
          .eq('id', editingBanner.id);

        if (error) throw error;
      } else {
        // Add new banner to Supabase
        const { error } = await supabase
          .from('banners')
          .insert({
            title: formData.title,
            image_url: formData.image_url,
            link: formData.link,
            isActive: formData.isActive
          });

        if (error) throw error;
      }

      await loadBanners();
      resetForm();
    } catch (error) {
      console.error('Error saving banner:', error);
      alert('Error saving banner: ' + (error as Error).message);
    }
  };

  const handleEdit = (banner: any) => {
    setEditingBanner(banner);
    setFormData({
      title: banner.title,
      image_url: banner.image_url,
      link: banner.link,
      isActive: banner.isActive
    });
    setShowModal(true);
  };

  const handleDelete = async (bannerId: string) => {
    if (confirm('Are you sure you want to delete this banner?')) {
      try {
        const { error } = await supabase
          .from('banners')
          .delete()
          .eq('id', bannerId);

        if (error) throw error;
        await loadBanners();
      } catch (error) {
        console.error('Error deleting banner:', error);
        alert('Error deleting banner. Please try again.');
      }
    }
  };

  const toggleBannerStatus = async (bannerId: string) => {
    try {
      const banner = banners.find(b => b.id === bannerId);
      const { error } = await supabase
        .from('banners')
        .update({ isActive: !banner.isActive })
        .eq('id', bannerId);

      if (error) throw error;
      await loadBanners();
    } catch (error) {
      console.error('Error updating banner status:', error);
      alert('Error updating banner status. Please try again.');
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      image_url: '',
      link: '',
      isActive: true
    });
    setEditingBanner(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading banners...</p>
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Banner Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add New Banner
          </button>
        </div>

        {/* Banners Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {banners.map((banner) => (
            <div key={banner.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                <img
                  src={banner.image_url}
                  alt={banner.title}
                  className="w-full h-48 object-cover"
                />
                <div className={`absolute top-4 right-4 px-3 py-1 rounded-full text-xs font-semibold ${
                  banner.isActive ? 'bg-green-500 text-white' : 'bg-red-500 text-white'
                }`}>
                  {banner.isActive ? 'Active' : 'Inactive'}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{banner.title}</h3>
                {banner.link && (
                  <p className="text-xs text-gray-500 mb-4 truncate">Link: {banner.link}</p>
                )}
                
                <div className="flex gap-2">
                  <button
                    onClick={() => toggleBannerStatus(banner.id)}
                    className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-sm font-semibold transition-colors ${
                      banner.isActive
                        ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200'
                        : 'bg-green-100 text-green-700 hover:bg-green-200'
                    }`}
                  >
                    {banner.isActive ? <FaEyeSlash /> : <FaEye />}
                    {banner.isActive ? 'Hide' : 'Show'}
                  </button>
                  <button
                    onClick={() => handleEdit(banner)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(banner.id)}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {banners.length === 0 && (
            <div className="col-span-full text-center py-12">
              <FaImage className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No banners added yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Add your first banner
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full">
              <div className="bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {editingBanner ? 'Edit Banner' : 'Add New Banner'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Title *
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="e.g., Big Discount on Weekly Topup!"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Banner Image *
                  </label>
                  <FileUpload
                    bucket="BANNERS"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    onError={(error) => alert(`Upload error: ${error}`)}
                    previewClassName="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a banner image (PNG, JPG, GIF up to 5MB)
                  </p>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Link (Optional)
                  </label>
                  <input
                    type="text"
                    value={formData.link}
                    onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="/topup/weekly-offer"
                  />
                </div>

                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={formData.isActive}
                    onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                    className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                  />
                  <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                    Active (Show on homepage)
                  </label>
                </div>

                <div className="flex gap-4 pt-4 border-t">
                  <button
                    type="button"
                    onClick={resetForm}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-xl font-semibold hover:bg-gray-300 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 bg-primary text-white py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                  >
                    {editingBanner ? 'Update Banner' : 'Add Banner'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
