export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  walletBalance: number;
  profilePicture?: string;
}

export interface DiamondPack {
  id: string;
  diamonds: number;
  price: number;
  discount?: number;
  bonus?: number;
  final_price?: number;
  category?: string;
}

export interface Offer {
  id: string;
  title: string;
  image: string;
  category: 'uid' | 'weekly' | 'monthly' | 'event' | 'diamond';
  description?: string;
  packs: DiamondPack[];
}

export interface Order {
  id: string;
  userId: string;
  cardId: string;
  packId: string;
  playerUid: string;
  amount: number;
  diamonds: number;
  paymentMethod: 'wallet' | 'instant';
  status: 'pending' | 'completed' | 'cancelled';
  item: string;
  createdAt: string;
}

export interface Transaction {
  id: string;
  userId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  method?: string;
  createdAt: string;
}

export interface Banner {
  id: string;
  image_url: string;
  title: string;
  link?: string;
  isActive?: boolean;
  description?: string;
  created_at?: string;
  updated_at?: string;
  display_order?: number;
}
