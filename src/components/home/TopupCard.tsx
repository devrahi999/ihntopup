'use client';

import Link from 'next/link';
import { FaCreditCard } from 'react-icons/fa';

interface TopupCardProps {
  card: {
    id: string;
    name: string;
    image_url?: string;
    card_type: string;
  };
}

export default function TopupCard({ card }: TopupCardProps) {
  return (
    <Link href={`/topup/${card.id}`}>
      <div className="flex flex-col">
        {/* Card Image Only - Full Square */}
        <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-all duration-300 hover:scale-105 cursor-pointer aspect-square">
          <div className="relative w-full h-full bg-gradient-to-br from-primary to-primary-dark">
            {card.image_url ? (
              <img
                src={card.image_url}
                alt={card.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x300?text=Card+Image';
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaCreditCard className="text-white text-4xl" />
              </div>
            )}
            
            {/* Card Type Badge */}
            <div className="absolute top-2 right-2">
              <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                card.card_type === 'topup' 
                  ? 'bg-blue-500 text-white' 
                  : 'bg-purple-500 text-white'
              }`}>
                {card.card_type === 'topup' ? 'Topup' : 'Others'}
              </span>
            </div>
          </div>
        </div>
        
        {/* Card Name - Outside Below the Card */}
        <div className="mt-2 text-center">
          <h3 className="text-sm font-bold text-gray-800 line-clamp-2">
            {card.name}
          </h3>
        </div>
      </div>
    </Link>
  );
}
