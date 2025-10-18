'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaGem, FaPlus, FaEdit, FaTrash, FaBox } from 'react-icons/fa';
import { getAllCategoriesClient, getDiamondPacksClient, createDiamondPack, updateDiamondPack, deleteDiamondPack } from '@/lib/supabase/queries';

export default function DiamondPackManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [diamondPacks, setDiamondPacks] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingPack, setEditingPack] = useState<any>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('');
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    diamond_count: 100,
    price: 50.00,
    original_price: 60.00,
    discount_percent: 0,
    category_id: '',
    image_url: '',
    is_featured: false,
    is_active: true,
    display_order: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [cats, packs] = await Promise.all([
        getAllCategoriesClient(),
        getDiamondPacksClient()
      ]);
      setCategories(cats || []);
      setDiamondPacks(packs || []);
      if (cats && cats.length > 0 && !selectedCategory) {
        setSelectedCategory(cats[0].id);
        setFormData(prev => ({ ...prev, category_id: cats[0].id }));
      }
    } catch (error) {
      console.error('Error loading data:', error);
      alert('Failed to load data. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting diamond pack data:', formData);

    try {
      if (editingPack) {
        console.log('Updating diamond pack:', editingPack.id);
        await updateDiamondPack(editingPack.id, formData);
      } else {
        console.log('Creating new diamond pack');
        await createDiamondPack(formData);
      }
      console.log('Diamond pack saved successfully');
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving diamond pack:', error);
      alert('Error saving diamond pack: ' + (error as Error).message);
    }
  };

  const handleEdit = (pack: any) => {
    setEditingPack(pack);
    setFormData({
      name: pack.name,
      description: pack.description,
      diamond_count: pack.diamond_count,
      price: pack.price,
      original_price: pack.original_price || pack.price,
      discount_percent: pack.discount_percent || 0,
      category_id: pack.category_id,
      image_url: pack.image_url || '',
      is_featured: pack.is_featured,
      is_active: pack.is_active,
      display_order: pack.display_order || 1
    });
    setShowModal(true);
  };

  const handleDelete = async (packId: string) => {
    if (confirm('Are you sure you want to delete this diamond pack?')) {
      try {
        await deleteDiamondPack(packId);
        await loadData();
      } catch (error) {
        console.error('Error deleting diamond pack:', error);
        alert('Error deleting diamond pack. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      description: '',
      diamond_count: 100,
      price: 50.00,
      original_price: 60.00,
      discount_percent: 0,
      category_id: selectedCategory || (categories[0]?.id || ''),
      image_url: '',
      is_featured: false,
      is_active: true,
      display_order: diamondPacks.length + 1
    });
    setEditingPack(null);
    setShowModal(false);
  };

  const calculateDiscount = () => {
    if (formData.original_price > formData.price) {
      return Math.round(((formData.original_price - formData.price) / formData.original_price) * 100);
    }
    return 0;
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading diamond packs...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Diamond Pack Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add New Diamond Pack
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💎</span>
            <div>
              <div className="font-semibold text-blue-800 mb-1">What are Diamond Packs?</div>
              <div className="text-sm text-blue-700">
                Diamond packs are the actual offers that appear as cards within each category section on your homepage. 
                Each pack contains a specific number of diamonds with pricing and discount information.
              </div>
            </div>
          </div>
        </div>

        {/* Filter by Category */}
        <div className="mb-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Filter by Category
          </label>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full max-w-xs border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
          >
            <option value="">All Categories</option>
            {categories.map(category => (
              <option key={category.id} value={category.id}>
                {category.display_name}
              </option>
            ))}
          </select>
        </div>

        {/* Diamond Packs List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {diamondPacks
            .filter(pack => !selectedCategory || pack.category_id === selectedCategory)
            .map((pack) => {
              const category = categories.find(cat => cat.id === pack.category_id);
              return (
                <div key={pack.id} className="bg-white rounded-xl shadow-lg p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                        <FaGem className="text-white text-xl" />
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">{pack.name}</h3>
                        <p className="text-sm text-gray-600">{category?.display_name}</p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${pack.is_active 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-red-100 text-red-700'
                    }`}>
                      {pack.is_active ? 'Active' : 'Inactive'}
                    </span>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Diamonds:</span>
                      <span className="font-bold text-gray-800">{pack.diamond_count.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Price:</span>
                      <div className="flex items-center gap-2">
                        {pack.discount_percent > 0 && (
                          <span className="text-sm text-gray-400 line-through">${pack.original_price}</span>
                        )}
                        <span className="font-bold text-primary">${pack.price}</span>
                      </div>
                    </div>
                    {pack.discount_percent > 0 && (
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Discount:</span>
                        <span className="font-bold text-green-600">{pack.discount_percent}% OFF</span>
                      </div>
                    )}
                  </div>

                  {pack.description && (
                    <p className="text-sm text-gray-600 mb-4">{pack.description}</p>
                  )}

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(pack)}
                      className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaEdit /> Edit
                    </button>
                    <button
                      onClick={() => handleDelete(pack.id)}
                      className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                    >
                      <FaTrash /> Delete
                    </button>
                  </div>
                </div>
              );
            })}
        </div>

        {diamondPacks.filter(pack => !selectedCategory || pack.category_id === selectedCategory).length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No diamond packs added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Add your first diamond pack
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {editingPack ? 'Edit Diamond Pack' : 'Add Diamond Pack'}
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
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Pack Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Starter Pack"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category *
                    </label>
                    <select
                      value={formData.category_id}
                      onChange={(e) => setFormData({ ...formData, category_id: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                    >
                      <option value="">Select Category</option>
                      {categories.map(category => (
                        <option key={category.id} value={category.id}>
                          {category.display_name}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Description
                  </label>
                  <input
                    type="text"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    placeholder="Brief description of this pack"
                  />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Diamond Count *
                    </label>
                    <input
                      type="number"
                      value={formData.diamond_count}
                      onChange={(e) => setFormData({ ...formData, diamond_count: parseInt(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                      min="1"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Price ($) *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) || 0 })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                      min="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Original Price ($)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.original_price}
                      onChange={(e) => setFormData({ ...formData, original_price: parseFloat(e.target.value) || formData.price })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      min="0"
                    />
                  </div>
                </div>

                {formData.original_price > formData.price && (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                    <div className="text-sm text-green-800">
                      <strong>Discount:</strong> {calculateDiscount()}% OFF (Save ${(formData.original_price - formData.price).toFixed(2)})
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-2 gap-4">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isFeatured"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({ ...formData, is_featured: e.target.checked })}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isFeatured" className="text-sm font-semibold text-gray-700">
                      Featured Pack
                    </label>
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <label htmlFor="isActive" className="text-sm font-semibold text-gray-700">
                      Active (Show on homepage)
                    </label>
                  </div>
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
                    {editingPack ? 'Update Pack' : 'Add Pack'}
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
