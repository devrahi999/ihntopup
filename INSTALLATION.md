# Quick Installation Guide

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager

## Installation Steps

### 1. Install Dependencies
```bash
npm install
```

### 2. Run Development Server
```bash
npm run dev
```

### 3. Open in Browser
Navigate to: **http://localhost:3000**

## Demo Login Credentials

- **Email:** demo@ihntopup.com
- **Password:** demo123

## Features to Explore

1. **Home Page** - Browse discount offers
2. **Top-Up Flow** - Select diamond pack → Enter UID → Choose payment → Confirm
3. **Wallet** - Add money and view transaction history
4. **Orders** - Track your diamond purchases
5. **Profile** - Manage account information
6. **Admin Panel** - Access at `/admin` to manage orders

## Project Structure

```
ihntopup/
├── src/
│   ├── app/              # Next.js pages
│   ├── components/       # Reusable components
│   ├── lib/             # Utilities & mock data
│   └── types/           # TypeScript types
├── public/              # Static assets
└── package.json         # Dependencies
```

## Build for Production

```bash
npm run build
npm start
```

## Need Help?

Check `README.md` and `SETUP.md` for detailed documentation.

