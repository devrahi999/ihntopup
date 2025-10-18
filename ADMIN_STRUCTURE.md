# Admin Panel Structure

## 📐 Architecture Overview

```
IHN TOPUP Admin Panel
│
├── 🔐 Authentication Layer
│   └── /admin/login → Validates Admin Credentials → Creates Session
│
├── 🎨 Admin Layout (Sidebar Navigation)
│   ├── Logo & Brand
│   ├── Collapsible Menu
│   └── 8 Navigation Links
│
└── 📊 8 Core Admin Pages
    ├── 1. Dashboard
    ├── 2. Users
    ├── 3. Orders
    ├── 4. Support
    ├── 5. Banners
    ├── 6. Diamonds
    ├── 7. Categories
    └── 8. Cards
```

---

## 🗂️ File Structure

```
src/
├── app/
│   └── admin/
│       ├── page.tsx                  → Redirect Handler
│       ├── login/
│       │   └── page.tsx             → 🔐 Admin Login
│       ├── dashboard/
│       │   └── page.tsx             → 📊 Dashboard
│       ├── users/
│       │   └── page.tsx             → 👥 User Management
│       ├── orders/
│       │   └── page.tsx             → 📦 Order Management
│       ├── support/
│       │   └── page.tsx             → 🎧 Support Tickets
│       ├── banners/
│       │   └── page.tsx             → 🖼️ Banner Management
│       ├── diamonds/
│       │   └── page.tsx             → 💎 Diamond Pricing
│       ├── categories/
│       │   └── page.tsx             → 🗂️ Category Sections
│       └── cards/
│           └── page.tsx             → 💳 Top-up Cards
│
└── components/
    └── admin/
        └── AdminLayout.tsx          → 📐 Main Layout Component
```

---

## 🔄 Data Flow

### Authentication Flow
```
User → /admin/login
  ↓
Enter Credentials
  ↓
Validate (admin123 / admin@123)
  ↓
Create Session (localStorage)
  ↓
Redirect to /admin/dashboard
  ↓
All pages check authentication
  ↓
If no session → Redirect to login
```

### Page Access Flow
```
Any Admin Route
  ↓
Check localStorage for 'adminAuth'
  ↓
  ├── Found → Load Page
  └── Not Found → Redirect to /admin/login
```

---

## 💾 Data Storage

### localStorage Keys

```javascript
{
  // Authentication
  'adminAuth': {
    adminId: 'admin123',
    loginTime: '2025-10-14T...',
    isAdmin: true
  },
  
  // User Data
  'users': [
    { id, name, email, walletBalance, ... }
  ],
  
  // Orders
  'orders': [
    { id, item, amount, status, ... }
  ],
  
  // Banners
  'banners': [
    { id, title, imageUrl, link, order, isActive }
  ],
  
  // Diamond Packs
  'diamondPacks': [
    { id, quantity, price, discount, category, ... }
  ],
  
  // Categories
  'categories': [
    { id, name, displayName, icon, color, order, ... }
  ],
  
  // Top-up Cards
  'topupCards': [
    { id, title, cardType, imageUrl, packs, ... }
  ]
}
```

---

## 🎯 Feature Mapping

### 1. Dashboard
```
Data Sources:
- users (count)
- orders (count, revenue, status breakdown)

Displays:
- Total statistics
- Order status cards
- Today's performance

Actions:
- View-only (no modifications)
```

### 2. Users
```
Data Source: users

Displays:
- User list with search
- Wallet balance
- Order statistics

Actions:
- Search users
- Ban/Unban accounts
```

### 3. Orders
```
Data Source: orders

Displays:
- Order list with filters
- Order details modal

Actions:
- Search orders
- Filter by status
- Update status (Complete/Cancel)
```

### 4. Support
```
Data Source: Mock tickets (can be localStorage)

Displays:
- Support ticket list
- Ticket details with replies

Actions:
- View tickets
- Reply to customers
- Mark as resolved
```

### 5. Banners
```
Data Source: banners

Displays:
- Banner grid with images
- Active/Inactive status

Actions:
- Add banner
- Edit banner
- Delete banner
- Toggle visibility
```

### 6. Diamonds
```
Data Source: diamondPacks

Displays:
- Diamond pack cards
- Price information
- Category breakdown

Actions:
- Add pack
- Edit pack
- Delete pack
- Set discount/bonus
```

### 7. Categories
```
Data Source: categories

Displays:
- Category section list
- Order, icon, color

Actions:
- Add category
- Edit category
- Delete category
- Reorder (up/down)
```

### 8. Cards
```
Data Source: topupCards

Displays:
- Top-up card grid
- Card type, packs

Actions:
- Add card
- Edit card
- Delete card
- Manage packs/options
```

---

## 🔗 Relationships

### Homepage Integration
```
Categories (Sections)
    ↓ contains
Top-up Cards
    ↓ uses
Diamond Packs (for pricing)
```

### Example Flow:
```
1. Create Category: "Discount Offers"
2. Add Diamond Pack: 100 diamonds @ ৳74
3. Create Card: "UID Topup" → Assign to "Discount Offers"
4. Result: Card appears in "Discount Offers" section on homepage
```

---

## 🎨 UI Component Hierarchy

### Admin Layout
```
AdminLayout
├── Sidebar
│   ├── Header (Logo + Toggle)
│   ├── Navigation Menu
│   │   ├── Dashboard Link
│   │   ├── Users Link
│   │   ├── Orders Link
│   │   ├── Support Link
│   │   ├── Banners Link
│   │   ├── Diamonds Link
│   │   ├── Categories Link
│   │   └── Cards Link
│   └── Logout Button
│
└── Main Content Area
    └── {children} (Page Content)
```

### Typical Page Structure
```
Admin Page
├── Header Section
│   ├── Title
│   └── Primary Action Button
│
├── Stats/Filters Section (optional)
│   ├── Search Bar
│   └── Filter Buttons
│
├── Main Content
│   ├── Table/Grid
│   └── Action Buttons
│
└── Modal (when editing)
    ├── Form Fields
    └── Submit/Cancel Buttons
```

---

## 🔐 Security Model

### Current Implementation
```
Client-Side Security (Demo)
├── localStorage session
├── Route guards (useEffect)
├── Redirect on unauthorized
└── Logout clears session
```

### Production Recommendations
```
Backend Security
├── JWT Authentication
├── API Routes with auth middleware
├── Database integration
├── Password hashing (bcrypt)
├── Rate limiting
├── CSRF protection
└── Role-based access control
```

---

## 📊 State Management

### Per-Page State
```javascript
// Common pattern across pages
const [items, setItems] = useState([]);
const [showModal, setShowModal] = useState(false);
const [editingItem, setEditingItem] = useState(null);
const [formData, setFormData] = useState({...});

// Load data on mount
useEffect(() => {
  const stored = localStorage.getItem('key');
  setItems(JSON.parse(stored || '[]'));
}, []);

// CRUD operations update both state and localStorage
```

---

## 🎯 User Journey Map

### First Time Admin
```
1. Visit /admin
   ↓
2. Redirect to /admin/login
   ↓
3. Enter credentials
   ↓
4. Redirect to /admin/dashboard
   ↓
5. See overview stats
   ↓
6. Explore sidebar menu
   ↓
7. Manage content
```

### Daily Admin Routine
```
1. Login to /admin/login
   ↓
2. Check /admin/dashboard for stats
   ↓
3. Process orders at /admin/orders
   ↓
4. Reply to tickets at /admin/support
   ↓
5. Update content as needed
   ↓
6. Logout
```

---

## 🚀 Quick Reference

### Key Routes
| Route | Purpose | Auth Required |
|-------|---------|---------------|
| `/admin` | Redirect handler | No |
| `/admin/login` | Authentication | No |
| `/admin/dashboard` | Overview | Yes |
| `/admin/users` | User management | Yes |
| `/admin/orders` | Order processing | Yes |
| `/admin/support` | Support tickets | Yes |
| `/admin/banners` | Banner management | Yes |
| `/admin/diamonds` | Diamond pricing | Yes |
| `/admin/categories` | Category sections | Yes |
| `/admin/cards` | Top-up cards | Yes |

### Key Components
| Component | Purpose |
|-----------|---------|
| `AdminLayout` | Sidebar + layout wrapper |
| `page.tsx` files | Individual admin pages |

### Key Data
| localStorage Key | Data Type | Used By |
|-----------------|-----------|---------|
| `adminAuth` | Object | Authentication |
| `users` | Array | Users page |
| `orders` | Array | Orders page |
| `banners` | Array | Banners page |
| `diamondPacks` | Array | Diamonds page |
| `categories` | Array | Categories page |
| `topupCards` | Array | Cards page |

---

## 📈 Scalability Considerations

### Current Limits
- ✅ Unlimited users
- ✅ Unlimited orders
- ✅ Unlimited products
- ⚠️ localStorage size limit (~5-10MB)

### Future Enhancements
```
When scaling to production:
1. Replace localStorage with API calls
2. Add database (PostgreSQL/MongoDB)
3. Implement pagination
4. Add caching layer
5. Use server-side rendering
6. Add real-time updates (WebSocket)
```

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** - React framework
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **React Icons** - Icon library

### State & Storage
- **React Hooks** - State management
- **localStorage** - Client-side storage

### Routing
- **Next.js App Router** - File-based routing
- **useRouter** - Navigation

---

## ✅ Feature Checklist

### Implemented ✅
- [x] Secure admin login
- [x] Protected routes
- [x] Sidebar navigation
- [x] 8 admin pages
- [x] CRUD operations
- [x] Search & filter
- [x] Modal editing
- [x] Real-time updates
- [x] Mobile responsive
- [x] Beautiful UI/UX

### Future Enhancements 🔮
- [ ] Backend API integration
- [ ] Database connection
- [ ] Real-time notifications
- [ ] Analytics & reports
- [ ] Bulk operations
- [ ] Export functionality
- [ ] Email integration
- [ ] Advanced permissions

---

**This structure provides a complete overview of the admin panel architecture.**

