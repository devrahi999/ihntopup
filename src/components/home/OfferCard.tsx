import Link from 'next/link';
import { Offer } from '@/types';

interface OfferCardProps {
  offer: Offer;
}

export default function OfferCard({ offer }: OfferCardProps) {
  return (
    <Link href={`/topup/${offer.id}`}>
      <div className="card p-4 hover:scale-105 transition-transform duration-200">
        {/* Offer Image/Icon */}
        <div className="relative h-32 bg-gradient-to-br from-primary/20 to-primary/5 rounded-lg mb-3 flex items-center justify-center">
          <div className="text-4xl">💎</div>
        </div>
        
        {/* Offer Title */}
        <h3 className="font-semibold text-center text-gray-800 mb-1">{offer.title}</h3>
        
        {/* Discount Badge if applicable */}
        {offer.packs.some(pack => pack.discount) && (
          <div className="text-center">
            <span className="inline-block bg-red-500 text-white text-xs font-bold px-2 py-1 rounded">
              UP TO {Math.max(...offer.packs.filter(p => p.discount).map(p => p.discount || 0))}% OFF
            </span>
          </div>
        )}
      </div>
    </Link>
  );
}

