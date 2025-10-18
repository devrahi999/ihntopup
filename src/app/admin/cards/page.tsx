'use client';

import { useState, useEffect } from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import { FaCreditCard, FaPlus, FaEdit, FaTrash, FaImage } from 'react-icons/fa';

export default function TopUpCardsManagement() {
  const [cards, setCards] = useState<any[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [formData, setFormData] = useState({
    title: '',
    imageUrl: '',
    category: '',
    cardType: 'diamond', // diamond, weekly, monthly, evo, elite
    description: '',
    packs: [] as any[]
  });

  useEffect(() => {
    loadCards();
    loadCategories();
  }, []);

  const loadCards = () => {
    const storedCards = JSON.parse(localStorage.getItem('topupCards') || '[]');
    setCards(storedCards);
  };

  const loadCategories = () => {
    const storedCategories = JSON.parse(localStorage.getItem('categories') || '[]');
    setCategories(storedCategories);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (editingCard) {
      const updatedCards = cards.map(card =>
        card.id === editingCard.id
          ? { ...card, ...formData }
          : card
      );
      setCards(updatedCards);
      localStorage.setItem('topupCards', JSON.stringify(updatedCards));
    } else {
      const newCard = {
        id: `card-${Date.now()}`,
        ...formData
      };
      const updatedCards = [...cards, newCard];
      setCards(updatedCards);
      localStorage.setItem('topupCards', JSON.stringify(updatedCards));
    }

    resetForm();
  };

  const handleEdit = (card: any) => {
    setEditingCard(card);
    setFormData({
      title: card.title,
      imageUrl: card.imageUrl,
      category: card.category,
      cardType: card.cardType,
      description: card.description,
      packs: card.packs || []
    });
    setShowModal(true);
  };

  const handleDelete = (cardId: string) => {
    if (confirm('Are you sure you want to delete this top-up card?')) {
      const updatedCards = cards.filter(card => card.id !== cardId);
      setCards(updatedCards);
      localStorage.setItem('topupCards', JSON.stringify(updatedCards));
    }
  };

  const addPack = () => {
    if (formData.cardType === 'diamond') {
      setFormData({
        ...formData,
        packs: [...formData.packs, { quantity: '', price: '' }]
      });
    } else if (formData.cardType === 'weekly' || formData.cardType === 'monthly') {
      setFormData({
        ...formData,
        packs: [...formData.packs, { type: '', price: '' }]
      });
    } else if (formData.cardType === 'evo' || formData.cardType === 'elite') {
      setFormData({
        ...formData,
        packs: [...formData.packs, { duration: '', price: '' }]
      });
    }
  };

  const updatePack = (index: number, field: string, value: string) => {
    const updatedPacks = [...formData.packs];
    updatedPacks[index] = { ...updatedPacks[index], [field]: value };
    setFormData({ ...formData, packs: updatedPacks });
  };

  const removePack = (index: number) => {
    setFormData({
      ...formData,
      packs: formData.packs.filter((_, i) => i !== index)
    });
  };

  const resetForm = () => {
    setFormData({
      title: '',
      imageUrl: '',
      category: '',
      cardType: 'diamond',
      description: '',
      packs: []
    });
    setEditingCard(null);
    setShowModal(false);
  };

  const getCardTypeLabel = (type: string) => {
    switch (type) {
      case 'diamond': return 'Diamond Top-up';
      case 'weekly': return 'Weekly Pass';
      case 'monthly': return 'Monthly Pass';
      case 'evo': return 'Evo Access';
      case 'elite': return 'Elite Pass';
      default: return type;
    }
  };

  return (
    <AdminLayout>
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-bold text-gray-800">Top-up Card Management</h1>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 bg-primary text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors shadow-lg hover:shadow-xl"
          >
            <FaPlus /> Add Top-up Card
          </button>
        </div>

        <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-xl mb-6">
          <div className="flex items-start gap-3">
            <span className="text-2xl">💡</span>
            <div>
              <div className="font-semibold text-blue-800 mb-1">How Top-up Cards Work</div>
              <div className="text-sm text-blue-700 space-y-1">
                <p><strong>Diamond Cards:</strong> Add multiple diamond quantities with prices (e.g., 100 diamonds - ৳74)</p>
                <p><strong>Weekly/Monthly Cards:</strong> Define types like "1x Weekly", "3x Monthly" with prices</p>
                <p><strong>Evo/Elite Cards:</strong> Define durations like "3D Evo Access", "7D Elite Pass" with prices</p>
              </div>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Total Cards</div>
            <div className="text-2xl font-bold text-gray-800">{cards.length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Diamond</div>
            <div className="text-2xl font-bold text-blue-600">{cards.filter(c => c.cardType === 'diamond').length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Weekly</div>
            <div className="text-2xl font-bold text-purple-600">{cards.filter(c => c.cardType === 'weekly').length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Monthly</div>
            <div className="text-2xl font-bold text-pink-600">{cards.filter(c => c.cardType === 'monthly').length}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-sm text-gray-600 mb-1">Evo/Elite</div>
            <div className="text-2xl font-bold text-yellow-600">{cards.filter(c => c.cardType === 'evo' || c.cardType === 'elite').length}</div>
          </div>
        </div>

        {/* Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.id} className="bg-white rounded-xl shadow-lg overflow-hidden">
              <div className="relative">
                {card.imageUrl ? (
                  <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-40 object-cover"
                  />
                ) : (
                  <div className="w-full h-40 bg-gradient-to-br from-gray-200 to-gray-300 flex items-center justify-center">
                    <FaImage className="text-4xl text-gray-400" />
                  </div>
                )}
                <div className="absolute top-3 right-3 px-3 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-xs font-semibold text-gray-700">
                  {getCardTypeLabel(card.cardType)}
                </div>
              </div>
              
              <div className="p-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">{card.title}</h3>
                <p className="text-sm text-gray-600 mb-3">{card.description}</p>
                
                <div className="mb-3">
                  <div className="text-xs text-gray-500 mb-2">Category: <span className="font-semibold">{card.category || 'None'}</span></div>
                  <div className="text-xs text-gray-500">
                    Packs: <span className="font-semibold">{card.packs?.length || 0}</span>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button
                    onClick={() => handleEdit(card)}
                    className="flex-1 flex items-center justify-center gap-2 bg-blue-100 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-200 transition-colors text-sm font-semibold"
                  >
                    <FaEdit /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(card.id)}
                    className="flex items-center justify-center gap-2 bg-red-100 text-red-600 px-4 py-2 rounded-lg hover:bg-red-200 transition-colors text-sm font-semibold"
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            </div>
          ))}

          {cards.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-xl shadow-lg">
              <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No top-up cards added yet</p>
              <button
                onClick={() => setShowModal(true)}
                className="mt-4 text-primary font-semibold hover:underline"
              >
                Add your first top-up card
              </button>
            </div>
          )}
        </div>

        {/* Add/Edit Modal */}
        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="sticky top-0 bg-gradient-to-r from-primary to-primary-dark text-white p-6 rounded-t-2xl z-10">
                <div className="flex items-center justify-between">
                  <h3 className="text-2xl font-bold">
                    {editingCard ? 'Edit Top-up Card' : 'Add Top-up Card'}
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
                {/* Basic Info */}
                <div className="space-y-4">
                  <h4 className="font-bold text-gray-800">Basic Information</h4>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Title *
                      </label>
                      <input
                        type="text"
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        placeholder="e.g., UID Topup"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Card Type *
                      </label>
                      <select
                        value={formData.cardType}
                        onChange={(e) => setFormData({ ...formData, cardType: e.target.value, packs: [] })}
                        className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                        required
                      >
                        <option value="diamond">Diamond Top-up</option>
                        <option value="weekly">Weekly Pass</option>
                        <option value="monthly">Monthly Pass</option>
                        <option value="evo">Evo Access</option>
                        <option value="elite">Elite Pass</option>
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
                      placeholder="Brief description"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Image URL *
                    </label>
                    <input
                      type="url"
                      value={formData.imageUrl}
                      onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                      placeholder="https://example.com/image.jpg"
                      required
                    />
                    {formData.imageUrl && (
                      <img
                        src={formData.imageUrl}
                        alt="Preview"
                        className="mt-3 w-full h-32 object-cover rounded-lg"
                        onError={(e) => {
                          (e.target as HTMLImageElement).src = 'https://via.placeholder.com/400x200?text=Invalid+Image+URL';
                        }}
                      />
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Category Section
                    </label>
                    <select
                      value={formData.category}
                      onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                      className="w-full border-2 border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:border-primary transition-colors"
                    >
                      <option value="">Select Category</option>
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.name}>{cat.displayName}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Packs Section */}
                <div className="space-y-4 border-t pt-4">
                  <div className="flex items-center justify-between">
                    <h4 className="font-bold text-gray-800">
                      {formData.cardType === 'diamond' && 'Diamond Packs'}
                      {(formData.cardType === 'weekly' || formData.cardType === 'monthly') && 'Pass Options'}
                      {(formData.cardType === 'evo' || formData.cardType === 'elite') && 'Duration Options'}
                    </h4>
                    <button
                      type="button"
                      onClick={addPack}
                      className="flex items-center gap-2 text-sm bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary-dark transition-colors"
                    >
                      <FaPlus /> Add Option
                    </button>
                  </div>

                  <div className="space-y-3">
                    {formData.packs.map((pack, index) => (
                      <div key={index} className="flex gap-3 items-start p-3 bg-gray-50 rounded-lg">
                        {formData.cardType === 'diamond' && (
                          <>
                            <input
                              type="number"
                              value={pack.quantity}
                              onChange={(e) => updatePack(index, 'quantity', e.target.value)}
                              placeholder="Quantity (e.g., 100)"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                            <input
                              type="number"
                              value={pack.price}
                              onChange={(e) => updatePack(index, 'price', e.target.value)}
                              placeholder="Price (৳)"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                          </>
                        )}

                        {(formData.cardType === 'weekly' || formData.cardType === 'monthly') && (
                          <>
                            <input
                              type="text"
                              value={pack.type}
                              onChange={(e) => updatePack(index, 'type', e.target.value)}
                              placeholder="e.g., 1x Weekly, 3x Monthly"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                            <input
                              type="number"
                              value={pack.price}
                              onChange={(e) => updatePack(index, 'price', e.target.value)}
                              placeholder="Price (৳)"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                          </>
                        )}

                        {(formData.cardType === 'evo' || formData.cardType === 'elite') && (
                          <>
                            <input
                              type="text"
                              value={pack.duration}
                              onChange={(e) => updatePack(index, 'duration', e.target.value)}
                              placeholder="e.g., 3D, 7D, 30D"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                            <input
                              type="number"
                              value={pack.price}
                              onChange={(e) => updatePack(index, 'price', e.target.value)}
                              placeholder="Price (৳)"
                              className="flex-1 border-2 border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:border-primary"
                              required
                            />
                          </>
                        )}

                        <button
                          type="button"
                          onClick={() => removePack(index)}
                          className="p-2 bg-red-100 text-red-600 rounded-lg hover:bg-red-200 transition-colors"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    ))}

                    {formData.packs.length === 0 && (
                      <div className="text-center py-6 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-500">No options added yet</p>
                      </div>
                    )}
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

