# IHN TOPUP - Free Fire Diamond Top-Up Platform

A modern, responsive web application for purchasing Free Fire diamonds built with Next.js 14, React, TypeScript, and Tailwind CSS.

## 🚀 Features

- **User Authentication** - Login/Register with demo account support
- **Home Page** - Auto-scrolling hero banner and discount offer cards
- **Top-Up System** - Select diamond packs, enter Player UID, and choose payment method
- **Wallet Management** - Add money, view balance, and transaction history
- **Order Tracking** - View order history with detailed status updates
- **User Profile** - Manage account information and view statistics
- **Responsive Design** - Mobile-first design with bottom navigation
- **Mock Backend** - LocalStorage-based data persistence for demo purposes

## 🎨 Design

- **Primary Color:** Lime Green (#32CD32)
- **Typography:** Poppins & Inter fonts
- **Theme:** Clean, modern, and mobile-first
- **Components:** Cards with rounded corners and subtle shadows

## 📦 Tech Stack

- **Frontend:** Next.js 14 (App Router), React 18, TypeScript
- **Styling:** Tailwind CSS
- **Icons:** React Icons
- **Slider:** Swiper
- **State:** LocalStorage (mock backend)

## 🛠️ Installation

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd ihntopup
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

4. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 📱 Pages

### Public Pages
- `/` - Home page with offers
- `/login` - User login
- `/register` - User registration
- `/about` - About us
- `/privacy-policy` - Privacy policy
- `/terms` - Terms & conditions
- `/refund-policy` - Refund policy

### Protected Pages
- `/topup/[offerId]` - Top-up details and purchase
- `/wallet` - Wallet management
- `/orders` - Order history
- `/profile` - User profile

### Admin Pages
- `/admin` - Admin panel for order management and revenue tracking

## 🔑 Demo Account

For testing purposes, use these credentials:

- **Email:** demo@ihntopup.com
- **Password:** demo123
- **Welcome Bonus:** ৳500

## 📊 Data Structure

The application uses localStorage to simulate a backend. Data is stored in the following keys:

- `users` - User accounts
- `user` - Current logged-in user
- `orders` - Order history
- `transactions` - Transaction history

## 🎯 Key Features

### 1. **Top-Up Flow**
   - Browse offer cards on home page
   - Select diamond pack
   - Enter Free Fire Player UID
   - Choose payment method (Wallet/Instant Pay)
   - Confirm and complete order

### 2. **Wallet System**
   - View current balance
   - Add money via bKash/Nagad/Rocket
   - Transaction history with credit/debit tracking

### 3. **Order Management**
   - View all orders with status (Pending/Completed/Cancelled)
   - Detailed order information
   - Real-time status updates

### 4. **User Profile**
   - Edit profile information
   - View statistics (Balance, Total Spent, Total Orders)
   - Logout functionality

## 🎨 Color Scheme

- **Primary:** #32CD32 (Lime Green)
- **Primary Dark:** #28a428
- **Background:** #FFFFFF (White)
- **Secondary BG:** Light Gray
- **Text:** Dark Gray / Black

## 📱 Mobile Navigation

The bottom navigation bar includes:
- 🏠 Home
- 💰 Wallet
- 📦 My Orders
- 👤 Profile

Active tab is highlighted in primary green color.

## 🔧 API Routes

Located in `src/app/api/`:

- `/api/auth/login` - User authentication
- `/api/auth/register` - User registration
- `/api/orders` - Order management
- `/api/wallet` - Wallet operations

## 🌐 Payment Methods

- **Wallet** - Use account balance
- **bKash** - Mobile financial service
- **Nagad** - Mobile financial service
- **Rocket** - Mobile financial service

## 📝 Development

### Build for Production
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Lint Code
```bash
npm run lint
```

## 🔐 Security Note

This is a demo application using localStorage for data persistence. For production:
- Implement proper backend with database
- Add real authentication (JWT, OAuth)
- Integrate actual payment gateways
- Add server-side validation
- Implement HTTPS

## 📄 License

This project is created for demonstration purposes.

## 👥 Support

For questions or support:
- Email: support@ihntopup.com
- Phone: +880 1712-345678

---

**Made with ❤️ for Free Fire gamers in Bangladesh**

