# IHN TOPUP - Setup Guide

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Access the Application
Open [http://localhost:3000](http://localhost:3000) in your browser.

## Demo Account

The application comes with a pre-configured demo account:

- **Email:** demo@ihntopup.com
- **Password:** demo123
- **Starting Balance:** ৳500

## Pages & Features

### User Pages
- **Home (/)** - Browse diamond offers
- **Top-up (/topup/[offerId])** - Purchase diamonds
- **Wallet (/wallet)** - Manage balance & transactions
- **Orders (/orders)** - View order history
- **Profile (/profile)** - Manage account settings

### Admin Panel
- **Admin (/admin)** - Manage orders, update status, track revenue
  - View all orders
  - Update order status (Pending → Completed/Cancelled)
  - Track revenue and statistics

### Authentication
- **Login (/login)** - User authentication
- **Register (/register)** - New user registration with ৳500 welcome bonus

### Information Pages
- **About (/about)** - Company information
- **Privacy Policy (/privacy-policy)** - Data privacy details
- **Terms (/terms)** - Terms and conditions
- **Refund Policy (/refund-policy)** - Refund guidelines

## Data Storage

Currently uses **localStorage** for demo purposes:

- `users` - User accounts
- `user` - Current session
- `orders` - Order history
- `transactions` - Transaction records

### Initial Data

On first load, the app automatically creates:
- Demo user account
- Sample welcome bonus transaction
- Sample completed order

## Admin Functions

Access the admin panel at `/admin` to:

1. **View Statistics**
   - Total orders
   - Pending orders count
   - Completed orders count
   - Cancelled orders count
   - Total revenue

2. **Manage Orders**
   - Filter by status
   - Update pending orders to completed
   - Cancel pending orders
   - View order details

3. **Process Orders Manually**
   - Mark orders as completed after manual diamond transfer
   - Cancel orders if needed

## Payment Integration (Future)

To integrate real payment gateways:

1. **bKash/Nagad/Rocket**
   - Sign up for merchant accounts
   - Get API credentials
   - Add to `.env` file
   - Update payment handlers in `/app/api/wallet/route.ts`

2. **Database**
   - Replace localStorage with actual database (MongoDB, PostgreSQL, etc.)
   - Update API routes to use database queries
   - Add proper authentication middleware

## Building for Production

### Build
```bash
npm run build
```

### Start Production Server
```bash
npm start
```

### Deploy
Deploy to platforms like:
- Vercel (recommended for Next.js)
- Netlify
- Railway
- DigitalOcean

## Environment Variables

Copy `.env.example` to `.env.local` and configure:

```bash
cp .env.example .env.local
```

## Security Considerations

⚠️ **Important for Production:**

1. Replace localStorage with secure backend database
2. Implement proper JWT authentication
3. Add server-side validation for all inputs
4. Use HTTPS for all communications
5. Implement rate limiting
6. Add CSRF protection
7. Encrypt sensitive data
8. Set up proper error logging

## Mobile Responsiveness

The app is mobile-first with:
- Bottom navigation on mobile devices
- Responsive grid layouts
- Touch-friendly buttons and cards
- Optimized for all screen sizes

## Color Customization

Edit colors in `tailwind.config.js`:

```js
colors: {
  primary: '#32CD32',        // Main brand color
  'primary-dark': '#28a428', // Hover state
}
```

## Support

For questions or issues:
- Email: support@ihntopup.com
- Documentation: README.md

---

Happy coding! 🚀

