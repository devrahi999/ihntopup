'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { usePopup } from '@/contexts/PopupContext';
import { createClient as createBrowserClient } from '@/lib/supabase/client';
import { FaCheckCircle, FaShieldAlt, FaBolt, FaCreditCard, FaWallet, FaMoneyBillWave, FaSignInAlt } from 'react-icons/fa';

export default function CardDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { user, loading: authLoading } = useAuth();
  const { showPopup } = usePopup();
  const cardId = params.cardId as string;

  const [card, setCard] = useState<any>(null);
  const [packs, setPacks] = useState<any[]>([]);
  const [selectedPack, setSelectedPack] = useState<any>(null);
  const [playerUid, setPlayerUid] = useState('');
  const [paymentMethod, setPaymentMethod] = useState<'wallet' | 'instant' | null>(null);
  const [walletBalance, setWalletBalance] = useState(500);
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [quantity, setQuantity] = useState(1);

  const supabase = createBrowserClient();

  useEffect(() => {
    loadCardData();
    loadWallet();
  }, [cardId]);

  const loadCardData = async () => {
    setLoading(true);
    try {
      // Load card details
      const { data: cardData, error: cardError } = await supabase
        .from('topup_cards')
        .select('*')
        .eq('id', cardId)
        .single();

      if (cardError) throw cardError;

      // Load packs for this card
      const { data: packsData, error: packsError } = await supabase
        .from('card_packs')
        .select('*')
        .eq('card_id', cardId)
        .order('price', { ascending: true });

      if (packsError) throw packsError;

      setCard(cardData);
      setPacks(packsData || []);
      
      // Auto-select the first pack
      if (packsData && packsData.length > 0) {
        setSelectedPack(packsData[0]);
      }
    } catch (error) {
      console.error('Error loading card data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadWallet = async () => {
    if (!user) return;
    
    try {
      const { data: userData, error } = await supabase
        .from('users')
        .select('wallet_balance')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Error fetching wallet balance:', error);
        return;
      }

      setWalletBalance(parseFloat(userData.wallet_balance) || 0);
    } catch (error) {
      console.error('Error loading wallet:', error);
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Loading card details...</p>
        </div>
      </div>
    );
  }

  if (!card) {
    return (
      <div className="page-container">
        <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-8 text-center">
          <div className="text-6xl mb-4">😕</div>
          <h2 className="text-2xl font-bold text-gray-800">Card not found</h2>
          <button onClick={() => router.push('/')} className="mt-4 text-primary hover:underline">
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  const handlePayNow = () => {
    // Check if user is logged in
    if (!user) {
      setShowLoginModal(true);
      return;
    }

    if (!selectedPack) {
      showPopup('error', 'Selection Required', 'Please select a pack');
      return;
    }
    if (!playerUid) {
      showPopup('error', 'Player UID Required', 'Please enter your Free Fire Player UID');
      return;
    }
    if (!paymentMethod) {
      showPopup('error', 'Payment Method Required', 'Please select a payment method');
      return;
    }

    const totalAmount = card.card_type === 'others' ? selectedPack.price * quantity : selectedPack.price;
    
    if (paymentMethod === 'wallet' && walletBalance < totalAmount) {
      showPopup('error', 'Insufficient Balance', 'Insufficient wallet balance');
      return;
    }
    
    setShowConfirmModal(true);
  };

  const confirmOrder = async () => {
    if (!user) {
      showPopup('error', 'Authentication Error', 'User not logged in');
      return;
    }

    try {
      console.log('Starting order placement...');
      
      const totalAmount = card.card_type === 'others' ? selectedPack.price * quantity : selectedPack.price;
      const totalDiamonds = card.card_type === 'others' ? selectedPack.diamond_count * quantity : selectedPack.diamond_count;
      
      // Handle wallet payment (existing flow)
      if (paymentMethod === 'wallet') {
        // Create order in Supabase
        const orderData = {
          user_id: user.id,
          card_id: card.id,
          pack_id: selectedPack.id,
          player_uid: playerUid,
          amount: totalAmount,
          diamonds: totalDiamonds,
          payment_method: paymentMethod,
          status: 'pending', // All orders should start as pending
          item_name: card.card_type === 'others' 
            ? `${selectedPack.description || 'Custom Item'} (${quantity}x) - ${card.name}`
            : `${selectedPack.diamond_count} Diamonds - ${card.name}`,
          card_name: card.name,
          pack_name: card.card_type === 'others' 
            ? `${selectedPack.description || 'Custom Item'} (${quantity}x)`
            : `${selectedPack.diamond_count} Diamonds`,
          quantity: card.card_type === 'others' ? quantity : 1,
          created_at: new Date().toISOString(),
        };

        console.log('Order data:', orderData);

        // Insert order into Supabase
        const { data: order, error: orderError } = await supabase
          .from('orders')
          .insert([orderData])
          .select()
          .single();

        if (orderError) {
          console.error('Order insertion error:', orderError);
          throw new Error(`Order insertion failed: ${orderError.message}`);
        }

        console.log('Order created successfully:', order);

        // Deduct from user's balance
        console.log('Processing wallet payment...');
        const newBalance = (user.walletBalance || 0) - totalAmount;
        
        // Update user wallet balance in Supabase
        const { error: walletError } = await supabase
          .from('users')
          .update({ wallet_balance: newBalance })
          .eq('id', user.id);

        if (walletError) {
          console.error('Wallet update error:', walletError);
          throw new Error(`Wallet update failed: ${walletError.message}`);
        }

        console.log('Wallet updated successfully');

        // Update local state immediately
        setWalletBalance(newBalance);

        // Create transaction record
        const { error: transactionError } = await supabase
          .from('transactions')
          .insert([{
            user_id: user.id,
            type: 'debit',
            amount: totalAmount,
            description: card.card_type === 'others'
              ? `${selectedPack.description || 'Custom Item'} (${quantity}x) purchased from ${card.name}`
              : `${selectedPack.diamond_count} Diamonds purchased from ${card.name}`,
            method: 'wallet',
            order_id: order.id,
            created_at: new Date().toISOString(),
          }]);

        if (transactionError) {
          console.error('Transaction creation error:', transactionError);
          throw new Error(`Transaction creation failed: ${transactionError.message}`);
        }

        console.log('Transaction created successfully');

        setShowConfirmModal(false);
        showPopup('success', 'Order Placed!', `Order placed successfully! Order ID: ${order.id}`);
        router.push('/orders');

      } else if (paymentMethod === 'instant') {
        // Handle instant payment using RupantorPay
        console.log('Processing instant payment...');
        
        // Prepare payment initiation request - let backend generate UUID
        const paymentBody = {
          userId: user.id,
          amount: totalAmount,
          fullname: (user.name || '').trim() || 'Anonymous User',
          email: (user.email || '').trim() || 'user@ihntopup.com',
          phone: (user.phone || '').trim() || '',
          packId: selectedPack.id,
          playerUid: playerUid,
          diamonds: totalDiamonds,
          itemName: card.card_type === 'others' 
            ? `${selectedPack.description || 'Custom Item'} (${quantity}x) - ${card.name}`
            : `${selectedPack.diamond_count} Diamonds - ${card.name}`,
          quantity: card.card_type === 'others' ? quantity : 1,
          cardId: card.id,
          cardName: card.name,
        };

        console.log('Sending payment initiation request:', paymentBody);

        // Call order payment initiation API
        const response = await fetch('/api/orders/initiate-payment', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(paymentBody),
        });

        const data = await response.json();
        console.log('Payment initiation response:', data);

        if (!response.ok || !data.success) {
          throw new Error(data.error || 'Failed to initiate payment');
        }

        setShowConfirmModal(false);
        showPopup('info', 'Payment Started', 'Redirecting to payment gateway...');
        
        // Redirect to payment gateway
        window.location.href = data.payment_url;
      }
    } catch (error) {
      console.error('Error placing order:', error);
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      showPopup('error', 'Order Failed', `Failed to place order: ${errorMessage}. Please try again.`);
    }
  };

  return (
    <div className="page-container">
      <div className="w-full max-w-6xl mx-auto px-3 sm:px-4 py-4 sm:py-6">
        {/* Back Button */}
        <div className="mb-4">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-2 text-gray-600 hover:text-primary transition-colors"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back</span>
          </button>
        </div>

        {/* Card Banner */}
        <div className="relative h-32 sm:h-40 bg-gradient-to-r from-primary via-primary-dark to-primary rounded-2xl mb-6 flex items-center justify-center overflow-hidden shadow-2xl">
          <div className="absolute inset-0 bg-black/10"></div>
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"></div>
          <div className="absolute bottom-0 left-0 w-24 h-24 bg-white/10 rounded-full -ml-12 -mb-12"></div>
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-white text-center px-4 relative z-10">
            {card.name}
          </h1>
        </div>

        {/* Features */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="glass-card p-3 sm:p-4 text-center">
            <FaBolt className="text-2xl sm:text-3xl text-primary mx-auto mb-2" />
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Instant</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <FaShieldAlt className="text-2xl sm:text-3xl text-blue-500 mx-auto mb-2" />
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Secure</div>
          </div>
          <div className="glass-card p-3 sm:p-4 text-center">
            <FaCheckCircle className="text-2xl sm:text-3xl text-green-500 mx-auto mb-2" />
            <div className="text-xs sm:text-sm font-semibold text-gray-700">Verified</div>
          </div>
        </div>

        {/* Step 1: Select Pack */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">1</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">
              {card.card_type === 'others' ? 'Select Item' : 'Select Diamond Pack'}
            </h2>
          </div>
          
          <div className="card p-4 sm:p-6">
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
              {packs.map((pack) => (
                <div
                  key={pack.id}
                  onClick={() => setSelectedPack(pack)}
                  className={`border-2 rounded-xl p-3 sm:p-4 cursor-pointer transition-all duration-200 ${
                    selectedPack?.id === pack.id
                      ? 'border-primary bg-primary/5 shadow-lg'
                      : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
                  }`}
                >
                  <div className="text-center">
                    <div className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 sm:mb-2">
                      {card.card_type === 'others' ? (
                        pack.description || 'Custom Item'
                      ) : (
                        `${pack.diamond_count} 💎`
                      )}
                    </div>
                    <div className="text-base sm:text-lg font-bold text-primary mb-1">
                      ৳{pack.price}
                    </div>
                    {pack.bonus && pack.bonus > 0 && (
                      <div className="text-xs sm:text-sm text-green-600 font-semibold mb-1 sm:mb-2">
                        +{pack.bonus} Bonus
                      </div>
                    )}
                    {pack.discount && pack.discount > 0 && (
                      <div className="text-xs text-red-600 line-through">
                        ৳{Math.round(pack.price / (1 - pack.discount / 100))}
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {packs.length === 0 && (
              <div className="text-center py-8">
                <FaCreditCard className="text-6xl text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">No packs available for this card</p>
              </div>
            )}
          </div>
        </section>

        {/* Quantity Selection for Others Type */}
        {card.card_type === 'others' && selectedPack && (
          <section className="mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">2</div>
              <h2 className="text-lg sm:text-xl font-bold text-gray-800">Select Quantity</h2>
            </div>
            
            <div className="card p-4 sm:p-6">
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                How many would you like to purchase?
              </label>
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  -
                </button>
                <div className="text-2xl font-bold text-gray-800 min-w-12 text-center">
                  {quantity}
                </div>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center text-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  +
                </button>
                <div className="ml-auto text-lg font-bold text-primary">
                  Total: ৳{selectedPack.price * quantity}
                </div>
              </div>
              <div className="flex items-start gap-2 mt-3 p-3 bg-green-50 rounded-lg border-l-4 border-green-500">
                <span className="text-green-600 text-lg">💡</span>
                <p className="text-xs sm:text-sm text-green-800">
                  You can adjust the quantity as needed. The total price will update automatically.
                </p>
              </div>
            </div>
          </section>
        )}

        {/* Step 2: Enter Player UID */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">
              {card.card_type === 'others' ? '3' : '2'}
            </div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Enter Player UID</h2>
          </div>
          
          <div className="card p-4 sm:p-6">
            <label className="block text-sm font-semibold text-gray-700 mb-2">
              Free Fire Player UID <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Enter your Free Fire Player UID"
              value={playerUid}
              onChange={(e) => setPlayerUid(e.target.value)}
              className="input-field"
            />
            <div className="flex items-start gap-2 mt-3 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-500">
              <span className="text-blue-600 text-lg">ℹ️</span>
              <p className="text-xs sm:text-sm text-blue-800">
                Find your Player UID in Free Fire: <strong>Profile → UID</strong>. Make sure you enter the correct UID to receive diamonds.
              </p>
            </div>
          </div>
        </section>

        {/* Step 3: Choose Payment Method */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-primary to-primary-dark text-white rounded-full flex items-center justify-center font-bold text-sm sm:text-base shadow-lg">3</div>
            <h2 className="text-lg sm:text-xl font-bold text-gray-800">Choose Payment Method</h2>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* My Wallet Option */}
            <div
              onClick={() => setPaymentMethod('wallet')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                paymentMethod === 'wallet'
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  paymentMethod === 'wallet' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <FaWallet className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">My Wallet</h3>
                  <p className="text-sm text-gray-600">Balance: ৳{walletBalance}</p>
                </div>
                {paymentMethod === 'wallet' && (
                  <FaCheckCircle className="text-primary text-xl" />
                )}
              </div>
            </div>

            {/* Instant Pay Option */}
            <div
              onClick={() => setPaymentMethod('instant')}
              className={`border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                paymentMethod === 'instant'
                  ? 'border-primary bg-primary/5 shadow-lg'
                  : 'border-gray-200 hover:border-primary/50 hover:bg-gray-50'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-3 rounded-full ${
                  paymentMethod === 'instant' ? 'bg-primary text-white' : 'bg-gray-100 text-gray-600'
                }`}>
                  <FaMoneyBillWave className="text-xl" />
                </div>
                <div className="flex-1">
                  <h3 className="font-bold text-gray-800">Instant Pay</h3>
                  <p className="text-sm text-gray-600">bKash, Nagad, Rocket</p>
                </div>
                {paymentMethod === 'instant' && (
                  <FaCheckCircle className="text-primary text-xl" />
                )}
              </div>
            </div>
          </div>
        </section>

        {/* Order Summary */}
        {selectedPack && (
          <div className="card-gradient p-4 sm:p-6 mb-6">
            <h3 className="text-lg font-bold text-gray-800 mb-3">Order Summary</h3>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Card:</span>
                <span className="font-bold text-gray-800">{card.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">
                  {card.card_type === 'others' ? 'Item:' : 'Diamonds:'}
                </span>
                <span className="font-bold text-gray-800">
                  {card.card_type === 'others' ? (
                    selectedPack.description || 'Custom Item'
                  ) : (
                    `${selectedPack.diamond_count} 💎`
                  )}
                </span>
              </div>
              {card.card_type === 'others' && quantity > 1 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Quantity:</span>
                  <span className="font-bold text-gray-800">{quantity}</span>
                </div>
              )}
              {selectedPack.bonus && selectedPack.bonus > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Bonus:</span>
                  <span className="font-bold text-green-600">+{selectedPack.bonus} Diamonds</span>
                </div>
              )}
              {selectedPack.discount && selectedPack.discount > 0 && (
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount:</span>
                  <span className="font-bold text-green-600">{selectedPack.discount}% OFF</span>
                </div>
              )}
              <div className="flex items-center justify-between pt-2 border-t border-gray-200">
                <span className="text-lg font-bold text-gray-800">Total:</span>
                <span className="text-2xl font-bold text-primary">
                  ৳{card.card_type === 'others' ? selectedPack.price * quantity : selectedPack.price}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Pay Now Button */}
        <button
          onClick={handlePayNow}
          disabled={!selectedPack || !playerUid || !paymentMethod}
          className="btn-primary w-full text-lg py-4 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {selectedPack ? `Pay ৳${card.card_type === 'others' ? selectedPack.price * quantity : selectedPack.price} Now` : 'Select a Pack to Continue'}
        </button>

        {/* Confirmation Modal */}
        {showConfirmModal && selectedPack && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6 sm:p-8 animate-fade-in-up">
              <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6 text-center">Confirm Order</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Card:</span>
                  <span className="font-bold text-gray-800">{card.name}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">
                    {card.card_type === 'others' ? 'Item:' : 'Diamonds:'}
                  </span>
                  <span className="font-bold text-gray-800">
                    {card.card_type === 'others' ? (
                      selectedPack.description || 'Custom Item'
                    ) : (
                      `${selectedPack.diamond_count} 💎`
                    )}
                  </span>
                </div>
                {card.card_type === 'others' && quantity > 1 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Quantity:</span>
                    <span className="font-bold text-gray-800">{quantity}</span>
                  </div>
                )}
                {selectedPack.bonus && selectedPack.bonus > 0 && (
                  <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                    <span className="text-gray-600">Bonus:</span>
                    <span className="font-bold text-gray-800">+{selectedPack.bonus} Diamonds</span>
                  </div>
                )}
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Player UID:</span>
                  <span className="font-bold text-gray-800">{playerUid}</span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-xl">
                  <span className="text-gray-600">Payment:</span>
                  <span className="font-bold text-gray-800 capitalize">{paymentMethod}</span>
                </div>
                <div className="flex justify-between items-center p-4 bg-gradient-to-r from-primary/10 to-primary/5 rounded-xl border-2 border-primary/20">
                  <span className="text-lg font-bold text-gray-800">Total Amount:</span>
                  <span className="text-2xl font-bold text-primary">
                    ৳{card.card_type === 'others' ? selectedPack.price * quantity : selectedPack.price}
                  </span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmModal(false)}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmOrder}
                  className="flex-1 btn-primary"
                >
                  Confirm & Pay
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Login Required Modal */}
        {showLoginModal && (
          <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="glass-card max-w-md w-full p-6 sm:p-8 animate-fade-in-up">
              <div className="text-center">
                <div className="text-6xl mb-4">🔒</div>
                <h3 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-4">Login Required</h3>
                <p className="text-gray-600 mb-6">
                  Please log in to complete your purchase and access all features.
                </p>
                
                <div className="space-y-3">
                  <button
                    onClick={() => {
                      setShowLoginModal(false);
                      router.push('/login');
                    }}
                    className="btn-primary w-full flex items-center justify-center gap-2"
                  >
                    <FaSignInAlt />
                    Go to Login
                  </button>
                  <button
                    onClick={() => setShowLoginModal(false)}
                    className="w-full bg-gray-200 text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-300 transition-colors"
                  >
                    Continue Browsing
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
