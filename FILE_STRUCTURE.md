# IHN TOPUP - Complete File Structure

```
ihntopup/
│
├── 📄 Configuration Files
│   ├── package.json                 # Dependencies & scripts
│   ├── tsconfig.json               # TypeScript configuration
│   ├── tailwind.config.js          # Tailwind CSS configuration
│   ├── next.config.js              # Next.js configuration
│   └── postcss.config.js           # PostCSS configuration
│
├── 📚 Documentation
│   ├── README.md                   # Main documentation
│   ├── SETUP.md                    # Setup guide
│   ├── INSTALLATION.md             # Quick start guide
│   ├── PROJECT_SUMMARY.md          # Project overview
│   └── FILE_STRUCTURE.md           # This file
│
└── 📁 src/
    │
    ├── 📁 app/ (Next.js App Router)
    │   │
    │   ├── 🎨 Core Files
    │   │   ├── layout.tsx          # Root layout with Header/Footer/Nav
    │   │   ├── page.tsx            # Home page
    │   │   ├── globals.css         # Global styles & Tailwind
    │   │   ├── loading.tsx         # Loading state
    │   │   └── not-found.tsx       # 404 page
    │   │
    │   ├── 🔐 Authentication
    │   │   ├── login/
    │   │   │   └── page.tsx        # Login page
    │   │   └── register/
    │   │       └── page.tsx        # Registration page
    │   │
    │   ├── 💎 Top-Up & Orders
    │   │   ├── topup/
    │   │   │   └── [offerId]/
    │   │   │       └── page.tsx    # Dynamic top-up page
    │   │   └── orders/
    │   │       └── page.tsx        # Order history
    │   │
    │   ├── 💰 Wallet & Profile
    │   │   ├── wallet/
    │   │   │   └── page.tsx        # Wallet management
    │   │   └── profile/
    │   │       └── page.tsx        # User profile
    │   │
    │   ├── 👨‍💼 Admin
    │   │   └── admin/
    │   │       └── page.tsx        # Admin dashboard
    │   │
    │   ├── 📄 Information Pages
    │   │   ├── about/
    │   │   │   └── page.tsx        # About us
    │   │   ├── privacy-policy/
    │   │   │   └── page.tsx        # Privacy policy
    │   │   ├── terms/
    │   │   │   └── page.tsx        # Terms & conditions
    │   │   └── refund-policy/
    │   │       └── page.tsx        # Refund policy
    │   │
    │   └── 🔌 API Routes
    │       └── api/
    │           ├── auth/
    │           │   ├── login/
    │           │   │   └── route.ts    # Login API
    │           │   └── register/
    │           │       └── route.ts    # Register API
    │           ├── orders/
    │           │   └── route.ts        # Orders API
    │           └── wallet/
    │               └── route.ts        # Wallet API
    │
    ├── 🧩 components/
    │   ├── DataInitializer.tsx     # Initialize demo data
    │   │
    │   ├── layout/
    │   │   ├── Header.tsx          # Top header with wallet/profile
    │   │   ├── Footer.tsx          # Footer with links
    │   │   └── BottomNav.tsx       # Mobile bottom navigation
    │   │
    │   ├── home/
    │   │   ├── HeroSlider.tsx      # Auto-scrolling banner
    │   │   └── OfferCard.tsx       # Offer card component
    │   │
    │   └── topup/
    │       ├── DiamondPackCard.tsx # Diamond pack selector
    │       └── PaymentMethodCard.tsx # Payment method selector
    │
    ├── 🔧 lib/
    │   ├── mockData.ts             # Demo data (offers, packs, banners)
    │   └── initializeData.ts       # LocalStorage initialization
    │
    └── 📝 types/
        └── index.ts                # TypeScript type definitions

```

## 📊 File Count Summary

| Category | Count |
|----------|-------|
| **Pages** | 18 |
| **Components** | 9 |
| **API Routes** | 4 |
| **Type Definitions** | 1 |
| **Utilities** | 2 |
| **Config Files** | 5 |
| **Documentation** | 5 |
| **Total Files** | 44+ |

## 🎯 Key Directories Explained

### `/src/app/` - Next.js Pages
All routes and pages using Next.js 14 App Router with file-based routing.

### `/src/components/` - React Components
Reusable UI components organized by feature (layout, home, topup).

### `/src/lib/` - Utilities
Helper functions, mock data, and initialization logic.

### `/src/types/` - TypeScript Types
Type definitions for User, Order, Transaction, Offer, etc.

## 🚀 Entry Points

1. **Development**: `npm run dev` → `http://localhost:3000`
2. **Production**: `npm run build` → `npm start`
3. **Entry File**: `src/app/layout.tsx` (Root Layout)
4. **Home Page**: `src/app/page.tsx`

## 📱 Dynamic Routes

- `/topup/[offerId]` - Dynamic top-up page for each offer
  - Example: `/topup/uid-topup`, `/topup/weekly-offer`

## 🔄 Data Flow

```
User Action → Component → LocalStorage/API → Update State → Re-render
```

Currently uses LocalStorage for demo. Ready to integrate with real backend.

---

**All files created and organized successfully!** ✅

