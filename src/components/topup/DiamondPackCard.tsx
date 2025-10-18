'use client';

import Link from 'next/link';
import { DiamondPack } from '@/types';

interface DiamondPackCardProps {
  pack: DiamondPack;
  isSelected?: boolean;
  onSelect?: () => void;
  className?: string;
}

export default function DiamondPackCard({ pack, isSelected = false, onSelect, className = '' }: DiamondPackCardProps) {
  const isInteractive = !!onSelect;
  const discount = pack.discount || 0;
  const bonus = pack.bonus || 0;
  const finalPrice = discount > 0 ? (pack.final_price || pack.price) : pack.price;
  const priceClass = discount > 0 ? 'line-through text-gray-400' : 'font-bold text-gray-800';

  const cardContent = (
    <div className={`card p-4 text-center transition-all duration-200 ${isSelected ? 'ring-2 ring-primary bg-primary/5' : 'hover:bg-gray-50'} ${className}`}>
      <div className="flex items-center justify-center mb-2">
        <span className="text-2xl">💎</span>
      </div>
      <div className="font-semibold text-gray-800 mb-1">{pack.diamonds} Diamonds</div>
      {bonus > 0 && (
        <div className="text-xs text-green-600 mb-1">+{bonus} Bonus</div>
      )}
      <div className="flex items-center justify-center gap-2 mb-2">
        {discount > 0 && (
          <div className="text-sm font-bold text-primary">৳{finalPrice}</div>
        )}
        <div className={`text-sm ${priceClass}`}>৳{pack.price}</div>
      </div>
      {discount > 0 && (
        <div className="text-xs text-red-500 font-semibold">
          {discount}% OFF
        </div>
      )}
      <div className="text-xs text-gray-500 mt-2">
        Instant Delivery
      </div>
    </div>
  );

  if (isInteractive) {
    return (
      <button onClick={onSelect} className="w-full">
        {cardContent}
      </button>
    );
  }

  return (
    <Link href={`/topup/${pack.id}`} className="w-full block">
      {cardContent}
    </Link>
  );
}
