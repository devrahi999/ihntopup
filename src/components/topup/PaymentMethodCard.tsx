'use client';

interface PaymentMethodCardProps {
  type: 'wallet' | 'instant';
  isSelected: boolean;
  onSelect: () => void;
  walletBalance?: number;
}

export default function PaymentMethodCard({ 
  type, 
  isSelected, 
  onSelect,
  walletBalance = 0 
}: PaymentMethodCardProps) {
  return (
    <button
      onClick={onSelect}
      className={`card p-4 transition-all duration-200 w-full text-left ${
        isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50'
      }`}
    >
      {type === 'wallet' ? (
        <div>
          <div className="font-semibold text-gray-800 mb-1">Wallet</div>
          <div className="text-sm text-gray-600">
            Current Balance: <span className="text-primary font-bold">৳{walletBalance}</span>
          </div>
        </div>
      ) : (
        <div>
          <div className="font-semibold text-gray-800 mb-2">Instant Pay</div>
          <div className="flex items-center gap-2">
            <div className="bg-pink-500 text-white text-xs font-bold px-2 py-1 rounded">bKash</div>
            <div className="bg-orange-500 text-white text-xs font-bold px-2 py-1 rounded">Nagad</div>
            <div className="bg-purple-500 text-white text-xs font-bold px-2 py-1 rounded">Rocket</div>
          </div>
        </div>
      )}
    </button>
  );
}

