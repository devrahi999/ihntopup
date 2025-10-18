'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaThLarge, FaPlus, FaEdit, FaTrash, FaArrowUp, FaArrowDown } from 'react-icons/fa';
import { getAllCategoriesClient, createCategory, updateCategory, deleteCategory } from '@/lib/supabase/queries';

export default function CategoryManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<any>(null);
  const [formData, setFormData] = useState({
    name: '',
    display_name: '',
    description: '',
    icon: '',
    color: '#32CD32',
    is_active: true,
    display_order: 1
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCategories();
  }, []);

  const loadCategories = async () => {
    setLoading(true);
    try {
      console.log('Loading categories...');
      const cats = await getAllCategoriesClient();
      console.log('Categories loaded:', cats);
      setCategories(cats || []);
      if (cats && cats.length > 0) {
        setFormData(prev => ({ ...prev, display_order: cats[cats.length - 1].display_order + 1 }));
      }
    } catch (error) {
      console.error('Error loading categories:', error);
      alert('Failed to load categories. Check console for details.');
      setCategories([]); // Set empty array on error to prevent infinite loading
    } finally {
      setLoading(false);
      console.log('Loading complete');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Submitting form data:', formData);

    try {
      if (editingCategory) {
        console.log('Updating category:', editingCategory.id);
        await updateCategory(editingCategory.id, formData);
      } else {
        console.log('Creating new category');
        await createCategory(formData);
      }
      console.log('Category saved successfully');
      await loadCategories();
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
      alert('Error saving category section: ' + (error as Error).message);
    }
  };

  const handleEdit = (category: any) => {
    setEditingCategory(category);
    setFormData({
      name: category.name,
      display_name: category.display_name,
      description: category.description,
      icon: category.icon,
      color: category.color,
      is_active: category.is_active,
      display_order: category.display_order
    });
    setShowModal(true);
  };

  const handleDelete = async (categoryId: string) => {
    if (confirm('Are you sure you want to delete this category section?')) {
      try {
        await deleteCategory(categoryId);
        await loadCategories();
      } catch (error) {
        console.error('Error deleting category:', error);
        alert('Error deleting category section. Please try again.');
      }
    }
  };

  const moveCategory = async (categoryId: string, direction: 'up' | 'down') => {
    const index = categories.findIndex(cat => cat.id === categoryId);
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === categories.length - 1)
    ) {
      return;
    }

    const newCategories = [...categories];
    const swapIndex = direction === 'up' ? index - 1 : index + 1;
    const tempOrder = newCategories[index].display_order;
    newCategories[index].display_order = newCategories[swapIndex].display_order;
    newCategories[swapIndex].display_order = tempOrder;

    try {
      await Promise.all([
        updateCategory(newCategories[index].id, { display_order: newCategories[index].display_order }),
        updateCategory(newCategories[swapIndex].id, { display_order: newCategories[swapIndex].display_order })
      ]);
      await loadCategories();
    } catch (error) {
      console.error('Error moving category:', error);
      alert('Error moving category. Please try again.');
    }
  };

  const resetForm = () => {
    const nextOrder = categories.length > 0 ? Math.max(...categories.map(c => c.display_order)) + 1 : 1;
    setFormData({
      name: '',
      display_name: '',
      description: '',
      icon: '',
      color: '#32CD32',
      is_active: true,
      display_order: nextOrder
    });
    setEditingCategory(null);
    setShowModal(false);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading categories...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Category Section Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add New Section
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-blue-800 mb-1">What are Category Sections?</div>
              <div className="text-sm text-blue-700">
                Category sections are the different sections on your homepage like "Discount Offers", "Regular Top-Up", etc. 
                Each section can contain multiple top-up cards. You can customize the order and appearance of these sections.
              </div>
            </div>
          </div>
        </div>

        {/* Categories List */}
        <div className="space-y-4">
          {categories.sort((a, b) => a.display_order - b.display_order).map((category, index) => (
            <div key={category.id} className="bg-white rounded-xl shadow-lg p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4 flex-1">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center text-3xl"
                    style={{ backgroundColor: `${category.color}20` }}
                  >
                    {category.icon}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-1">
                      <h3 className="text-xl font-bold text-gray-800">{category.display_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-semibold ${category.is_active 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-red-100 text-red-700'
                      }`}>
                        {category.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{category.description}</p>
                    <div className="flex items-center gap-4 text-xs text-gray-500">
                      <span>ID: {category.name}</span>
                      <span>Order: {category.display_order}</span>
                      <span className="flex items-center gap-1">
                        Color: 
                        <div 
                          className="w-4 h-4 rounded border border-gray-300"
                          style={{ backgroundColor: category.color }}
                        />
                      </span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  {/* Order controls */}
                  <div className="flex flex-col gap-1">
                    <button
                      onClick={() => moveCategory(category.id, 'up')}
                      disabled={index === 0}
                      className={`p-2 rounded-lg transition-colors ${
                        index === 0
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title="Move Up"
                    >
                      <FaArrowUp />
                    </button>
                    <button
                      onClick={() => moveCategory(category.id, 'down')}
                      disabled={index === categories.length - 1}
                      className={`p-2 rounded-lg transition-colors ${
                        index === categories.length - 1
                          ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                          : 'bg-blue-100 text-blue-600 hover:bg-blue-200'
                      }`}
                      title="Move Down"
                    >
                      <FaArrowDown />
                    </button>
                  </div>

                  {/* Edit/Delete */}
                  <button
                    onClick={() => handleEdit(category)}
                    className="p-3 bg-blue-100 text-blue-600 rounded-lg hover:bg-blue-200 transition-colors"
                    title="Edit"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="p-3 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                    title="Delete"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {categories.length === 0 && (
            <div className="text-center py-12 bg-white rounded-xl shadow-lg">
              <FaThLarge className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No category sections added yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Add your first category section
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {editingCategory ? 'Edit Category Section' : 'Add Category Section'}
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
                      Display Name *
                    </label>
                    <input
                      type="text"
                      value={formData.display_name}
                      onChange={(e) => setFormData({ ...formData, display_name: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Discount Offers"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Section ID *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., discount-offers"
                      required
                    />
                    <p className="text-xs text-gray-500 mt-1">Lowercase, use hyphens for spaces</p>
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
                    placeholder="Brief description of this section"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Icon (Emoji)
                    </label>
                    <input
                      type="text"
                      value={formData.icon}
                      onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors text-2xl"
                      placeholder="🔥"
                      maxLength={2}
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Theme Color
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="color"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="h-12 w-20 border-2 border-gray-200 rounded-xl cursor-pointer"
                      />
                      <input
                        type="text"
                        value={formData.color}
                        onChange={(e) => setFormData({ ...formData, color: e.target.value })}
                        className="flex-1 border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
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

                {/* Preview */}
                <div className="bg-gray-50 rounded-xl p-4">
                  <div className="text-sm text-gray-600 mb-3">Preview:</div>
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
                      style={{ backgroundColor: `${formData.color}20` }}
                    >
                      {formData.icon || '💎'}
                    </div>
                    <div>
                      <div className="font-bold text-gray-800" style={{ color: formData.color }}>
                        {formData.display_name || 'Section Name'} {formData.icon}
                      </div>
                      <div className="text-sm text-gray-600">{formData.description}</div>
                    </div>
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
                    {editingCategory ? 'Update Section' : 'Add Section'}
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
