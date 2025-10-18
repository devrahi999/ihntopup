import { Banner, Offer, DiamondPack } from '@/types';

export const banners: Banner[] = [
  {
    id: '1',
    image_url: '/banners/banner1.jpg',
    title: 'Big Discount on Weekly Topup!',
    link: '/topup/weekly'
  },
  {
    id: '2',
    image_url: '/banners/banner2.jpg',
    title: 'Special Event Top-Up Available Now!',
    link: '/topup/event'
  },
  {
    id: '3',
    image_url: '/banners/banner3.jpg',
    title: 'Get 10% Extra on Monthly Recharge',
    link: '/topup/monthly'
  }
];

const diamondPacks: DiamondPack[] = [
  { id: 'p1', diamonds: 25, price: 24 },
  { id: 'p2', diamonds: 50, price: 47 },
  { id: 'p3', diamonds: 100, price: 74 },
  { id: 'p4', diamonds: 115, price: 89 },
  { id: 'p5', diamonds: 240, price: 182 },
  { id: 'p6', diamonds: 355, price: 277 },
  { id: 'p7', diamonds: 480, price: 362 },
  { id: 'p8', diamonds: 600, price: 453 },
  { id: 'p9', diamonds: 610, price: 477 },
  { id: 'p10', diamonds: 800, price: 603 },
  { id: 'p11', diamonds: 1090, price: 891 },
  { id: 'p12', diamonds: 1240, price: 963 },
  { id: 'p13', diamonds: 1720, price: 1685 },
  { id: 'p14', diamonds: 2000, price: 1960 },
  { id: 'p15', diamonds: 2530, price: 1875 },
  { id: 'p16', diamonds: 4010, price: 2406 },
];

const weeklyPacks: DiamondPack[] = [
  { id: 'w1', diamonds: 25, price: 21, discount: 12 },
  { id: 'w2', diamonds: 100, price: 67, discount: 9 },
  { id: 'w3', diamonds: 240, price: 164, discount: 10 },
  { id: 'w4', diamonds: 480, price: 326, discount: 10 },
];

const monthlyPacks: DiamondPack[] = [
  { id: 'm1', diamonds: 50, price: 42, discount: 10 },
  { id: 'm2', diamonds: 115, price: 80, discount: 10 },
  { id: 'm3', diamonds: 355, price: 249, discount: 10 },
  { id: 'm4', diamonds: 600, price: 407, discount: 10 },
];

export const offers: Offer[] = [
  {
    id: 'uid-topup',
    title: 'UID TOPUP [BD]',
    image: '/offers/uid-topup.jpg',
    category: 'uid',
    description: 'Direct UID top-up with instant delivery',
    packs: diamondPacks
  },
  {
    id: 'weekly-offer',
    title: 'Weekly Offer',
    image: '/offers/weekly.jpg',
    category: 'weekly',
    description: 'Get up to 12% discount on weekly packs',
    packs: weeklyPacks
  },
  {
    id: 'monthly-offer',
    title: 'Monthly Offer',
    image: '/offers/monthly.jpg',
    category: 'monthly',
    description: 'Save 10% on all monthly diamond packs',
    packs: monthlyPacks
  },
  {
    id: 'event-topup',
    title: 'Event Topup',
    image: '/offers/event.jpg',
    category: 'event',
    description: 'Special event diamonds and rewards',
    packs: diamondPacks.slice(0, 8)
  },
  {
    id: 'diamond-topup',
    title: 'Diamond Topup',
    image: '/offers/diamond.jpg',
    category: 'diamond',
    description: 'Regular diamond top-up',
    packs: diamondPacks
  }
];

// Mock user data (in real app, this would come from authentication)
export const mockUser = {
  id: 'user123',
  name: 'John Doe',
  email: 'john@example.com',
  phone: '+8801712345678',
  walletBalance: 500,
  profilePicture: '/default-avatar.png'
};
