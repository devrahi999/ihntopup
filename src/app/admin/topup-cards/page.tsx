'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaCreditCard, FaPlus, FaEdit, FaTrash, FaBox, FaTimes } from 'react-icons/fa';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import FileUpload from '@/components/admin/FileUpload';

export default function TopupCardManagement() {
  const [categories, setCategories] = useState<any[]>([]);
  const [topupCards, setTopupCards] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    category_id: '',
    image_url: '',
    card_type: 'topup',
    is_active: true,
    display_order: 1,
    packs: [] as Array<{
      id?: string;
      pack_type: 'diamond' | 'other';
      diamond_count?: number;
      description?: string;
      price: number;
    }>
  });

  const supabase = createBrowserClient();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      // Load categories
      const { data: categoriesData, error: categoriesError } = await supabase
        .from('categories')
        .select('*')
        .eq('is_active', true)
        .order('display_order', { ascending: true });

      // Load topup cards with their packs
      const { data: cardsData, error: cardsError } = await supabase
        .from('topup_cards')
        .select(`
          *,
          card_packs (*)
        `)
        .order('display_order', { ascending: true });

      if (categoriesError) throw categoriesError;
      if (cardsError) throw cardsError;

      setCategories(categoriesData || []);
      setTopupCards(cardsData || []);

      if (categoriesData && categoriesData.length > 0 && !formData.category_id) {
        setFormData(prev => ({ ...prev, category_id: categoriesData[0].id }));
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
    console.log('Submitting topup card data:', formData);

    try {
      // First, create or update the topup card
      let cardId: string;
      
      if (editingCard) {
        const { data: cardData, error: cardError } = await supabase
          .from('topup_cards')
          .update({
            name: formData.name,
            category_id: formData.category_id,
            image_url: formData.image_url,
            card_type: formData.card_type,
            is_active: formData.is_active,
            display_order: formData.display_order
          })
          .eq('id', editingCard.id)
          .select()
          .single();

        if (cardError) throw cardError;
        cardId = editingCard.id;

        // Delete existing packs for this card
        await supabase
          .from('card_packs')
          .delete()
          .eq('card_id', editingCard.id);
      } else {
        const { data: cardData, error: cardError } = await supabase
          .from('topup_cards')
          .insert({
            name: formData.name,
            category_id: formData.category_id,
            image_url: formData.image_url,
            card_type: formData.card_type,
            is_active: formData.is_active,
            display_order: formData.display_order
          })
          .select()
          .single();

        if (cardError) throw cardError;
        cardId = cardData.id;
      }

      // Then, create all the packs
      if (formData.packs.length > 0) {
        const packsToInsert = formData.packs.map((pack, index) => ({
          card_id: cardId,
          pack_type: pack.pack_type,
          diamond_count: pack.pack_type === 'diamond' ? pack.diamond_count : null,
          description: pack.pack_type === 'other' ? pack.description : null,
          price: pack.price,
          display_order: index
        }));

        const { error: packsError } = await supabase
          .from('card_packs')
          .insert(packsToInsert);

        if (packsError) throw packsError;
      }

      console.log('Topup card saved successfully');
      await loadData();
      resetForm();
    } catch (error) {
      console.error('Error saving topup card:', error);
      alert('Error saving topup card: ' + (error as Error).message);
    }
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    setFormData({
      name: card.name,
      category_id: card.category_id,
      image_url: card.image_url || '',
      card_type: card.card_type,
      is_active: card.is_active,
      display_order: card.display_order || 1,
      packs: card.card_packs?.map((pack: any) => ({
        id: pack.id,
        pack_type: pack.pack_type,
        diamond_count: pack.diamond_count,
        description: pack.description,
        price: pack.price
      })) || []
    });
    setShowModal(true);
  };

  const handleDelete = async (cardId: string) => {
    if (confirm('Are you sure you want to delete this topup card and all its packs?')) {
      try {
        await supabase
          .from('topup_cards')
          .delete()
          .eq('id', cardId);
        await loadData();
      } catch (error) {
        console.error('Error deleting topup card:', error);
        alert('Error deleting topup card. Please try again.');
      }
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      category_id: categories[0]?.id || '',
      image_url: '',
      card_type: 'topup',
      is_active: true,
      display_order: topupCards.length + 1,
      packs: []
    });
    setEditingCard(null);
    setShowModal(false);
  };

  const addPack = () => {
    if (formData.card_type === 'topup') {
      setFormData(prev => ({
        ...prev,
        packs: [...prev.packs, { pack_type: 'diamond', diamond_count: 100, price: 50.00 }]
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        packs: [...prev.packs, { pack_type: 'other', description: '', price: 50.00 }]
      }));
    }
  };

  const removePack = (index: number) => {
    setFormData(prev => ({
      ...prev,
      packs: prev.packs.filter((_, i) => i !== index)
    }));
  };

  const updatePack = (index: number, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      packs: prev.packs.map((pack, i) => 
        i === index ? { ...pack, [field]: value } : pack
      )
    }));
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-6">
          <div className="flex justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-gray-600">Loading topup cards...</p>
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
          <h1 className="text-3xl font-bold text-gray-800">Topup Card Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add New Topup Card
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💳</span>
            <div>
              <div className="font-semibold text-blue-800 mb-1">What are Topup Cards?</div>
              <div className="text-sm text-blue-700">
                Topup cards are the main offers that appear on your homepage. Each card can contain multiple packs 
                (diamond packs or other items) that users can choose from when they click on the card.
              </div>
            </div>
          </div>
        </div>

        {/* Topup Cards List */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {topupCards.map((card) => {
            const category = categories.find(cat => cat.id === card.category_id);
            return (
              <div key={card.id} className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-3">
                    {card.image_url ? (
                      <img 
                        src={card.image_url} 
                        alt={card.name}
                        className="w-12 h-12 rounded-xl object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 bg-gradient-to-br from-primary to-primary-dark rounded-xl flex items-center justify-center">
                        <FaCreditCard className="text-white text-xl" />
                      </div>
                    )}
                    <div>
                      <h3 className="text-lg font-bold text-gray-800">{card.name}</h3>
                      <p className="text-sm text-gray-600">{category?.display_name}</p>
                    </div>
                  </div>
                  <span className={`px-3 py-1 rounded-full text-xs font-semibold ${card.is_active 
                      ? 'bg-green-100 text-green-700' 
                      : 'bg-red-100 text-red-700'
                  }`}>
                    {card.is_active ? 'Active' : 'Inactive'}
                  </span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Type:</span>
                    <span className="font-bold text-gray-800 capitalize">{card.card_type}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Packs:</span>
                    <span className="font-bold text-primary">{card.card_packs?.length || 0}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600">Order:</span>
                    <span className="font-bold text-gray-800">{card.display_order}</span>
                  </div>
                </div>

                {card.card_packs && card.card_packs.length > 0 && (
                  <div className="mb-4">
                    <div className="text-sm text-gray-600 mb-2">Available Packs:</div>
                    <div className="space-y-1 max-h-24 overflow-y-auto">
                      {card.card_packs.map((pack: any) => (
                        <div key={pack.id} className="flex justify-between items-center text-xs bg-gray-50 p-2 rounded">
                          <span>
                            {pack.pack_type === 'diamond' 
                              ? `${pack.diamond_count} Diamonds`
                              : pack.description
                            }
                          </span>
                          <span className="font-bold">${pack.price}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleEdit(card)}
                    className="flex-1 bg-blue-100 text-blue-600 py-2 rounded-lg hover:bg-blue-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="flex-1 bg-red-100 text-red-600 py-2 rounded-lg hover:bg-red-200 transition-colors flex items-center justify-center gap-2"
                  >
                    <FaTrash /> Delete
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        {topupCards.length === 0 && (
          <div className="text-center py-12 bg-white rounded-xl shadow-lg">
            <FaBox className="text-6xl text-gray-300 mx-auto mb-4" />
            <p className="text-gray-500">No topup cards added yet</p>
            <button
              onClick={() => setShowModal(true)}
              className="mt-4 text-primary font-semibold hover:underline"
            >
              Add your first topup card
            </button>
          </div>
        )}

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {editingCard ? 'Edit Topup Card' : 'Add Topup Card'}
                  </h3>
                  <button
                    onClick={resetForm}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                  >
                    ✕
                  </button>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="p-6 space-y-6">
                {/* Basic Information */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Name *
                    </label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="e.g., Diamond Offers"
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
                    Card Image
                  </label>
                  <FileUpload
                    bucket="TOPUP_CARDS"
                    value={formData.image_url}
                    onChange={(url) => setFormData({ ...formData, image_url: url })}
                    onError={(error) => alert(`Upload error: ${error}`)}
                    previewClassName="w-full h-32 object-cover rounded-lg"
                  />
                  <p className="text-xs text-gray-500 mt-2">
                    Upload a card image (PNG, JPG, GIF up to 5MB)
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Card Type *
                    </label>
                    <select
                      value={formData.card_type}
                      onChange={(e) => {
                        const newType = e.target.value as 'topup' | 'others';
                        setFormData({ 
                          ...formData, 
                          card_type: newType,
                          packs: [] // Clear packs when type changes
                        });
                      }}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      required
                    >
                      <option value="topup">Topup</option>
                      <option value="others">Others</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Display Order
                    </label>
                    <input
                      type="number"
                      value={formData.display_order}
                      onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) || 1 })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      min="1"
                    />
                  </div>
                </div>

                {/* Packs Section */}
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <label className="block text-sm font-semibold text-gray-700">
                      {formData.card_type === 'topup' ? 'Diamond Packs' : 'Other Packs'} *
                    </label>
                    <button
                      type="button"
                      onClick={addPack}
                      className="flex items-center gap-2 bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 transition-colors"
                    >
                      <FaPlus /> Add Pack
                    </button>
                  </div>

                  {formData.packs.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-xl">
                      <p className="text-gray-500">No packs added yet</p>
                      <p className="text-sm text-gray-400 mt-1">
                        Click "Add Pack" to add {formData.card_type === 'topup' ? 'diamond packs' : 'other packs'}
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {formData.packs.map((pack, index) => (
                        <div key={index} className="bg-gray-50 rounded-xl p-4">
                          <div className="flex items-center justify-between mb-3">
                            <span className="font-semibold text-gray-700">
                              Pack {index + 1}
                            </span>
                            <button
                              type="button"
                              onClick={() => removePack(index)}
                              className="text-red-500 hover:text-red-700 transition-colors"
                            >
                              <FaTimes />
                            </button>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            {formData.card_type === 'topup' ? (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Diamond Quantity
                                  </label>
                                  <input
                                    type="number"
                                    value={pack.diamond_count || ''}
                                    onChange={(e) => updatePack(index, 'diamond_count', parseInt(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                                    min="1"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Price ($)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={pack.price}
                                    onChange={(e) => updatePack(index, 'price', parseFloat(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                                    min="0"
                                    required
                                  />
                                </div>
                              </>
                            ) : (
                              <>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Description
                                  </label>
                                  <input
                                    type="text"
                                    value={pack.description || ''}
                                    onChange={(e) => updatePack(index, 'description', e.target.value)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                                    placeholder="e.g., 100 Diamonds + 50 Bonus"
                                    required
                                  />
                                </div>
                                <div>
                                  <label className="block text-xs font-semibold text-gray-600 mb-1">
                                    Price ($)
                                  </label>
                                  <input
                                    type="number"
                                    step="0.01"
                                    value={pack.price}
                                    onChange={(e) => updatePack(index, 'price', parseFloat(e.target.value) || 0)}
                                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:border-primary transition-colors"
                                    min="0"
                                    required
                                  />
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
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
                    {editingCard ? 'Update Card' : 'Add Card'}
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
