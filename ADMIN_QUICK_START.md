# Admin Panel - Quick Start Guide 🚀

## 📍 Access the Admin Panel

### Step 1: Login
Navigate to: **http://localhost:3000/admin/login**

Use these credentials:
```
Admin ID: admin123
Password: admin@123
```

### Step 2: You're In!
After login, you'll see the dashboard with all statistics.

---

## 🎯 Quick Actions

### 1. Process an Order (Most Common)
1. Click **Orders** in sidebar
2. Find the pending order
3. Click **View Details**
4. Click **Mark as Completed**
5. Done! ✅

### 2. Add a New Diamond Pack
1. Click **Diamond & Pricing** in sidebar
2. Click **Add Diamond Pack**
3. Fill in:
   - Quantity: `500`
   - Price: `400`
   - Discount: `10` (optional)
   - Category: Select one
4. Click **Add Pack**
5. Done! 💎

### 3. Create a Banner
1. Click **Banner Management** in sidebar
2. Click **Add New Banner**
3. Fill in:
   - Title: "Weekend Special"
   - Image URL: (paste your image URL)
   - Order: `1`
   - Check **Active**
4. Click **Add Banner**
5. Done! 🖼️

### 4. Reply to Support Ticket
1. Click **Support Requests** in sidebar
2. Find the ticket
3. Click **View & Reply**
4. Type your reply
5. Click **Send Reply & Resolve**
6. Done! 💬

### 5. Add a New Top-up Card
1. Click **Top-up Cards** in sidebar
2. Click **Add Top-up Card**
3. Fill in:
   - Title: "UID Topup"
   - Card Type: Select type
   - Image URL: (paste image)
   - Category: Select section
4. Add options/packs
5. Click **Add Card**
6. Done! 💳

---

## 📋 All Admin Pages

| Page | Route | What You Can Do |
|------|-------|----------------|
| **Dashboard** | `/admin/dashboard` | View all statistics |
| **Users** | `/admin/users` | Manage user accounts |
| **Orders** | `/admin/orders` | Process orders |
| **Support** | `/admin/support` | Handle tickets |
| **Banners** | `/admin/banners` | Manage homepage banners |
| **Diamonds** | `/admin/diamonds` | Set diamond prices |
| **Categories** | `/admin/categories` | Create homepage sections |
| **Cards** | `/admin/cards` | Add top-up cards |

---

## 🎨 Understanding Card Types

### Diamond Cards (Regular Top-up)
- Use for: Standard diamond purchases
- Add: Multiple quantities with prices
- Example: 100 diamonds = ৳74

### Weekly/Monthly Cards
- Use for: Subscription passes
- Add: Types like "1x Weekly", "3x Monthly"
- Example: 1x Weekly = ৳199

### Evo/Elite Cards
- Use for: Special access passes
- Add: Durations like "3D", "7D", "30D"
- Example: 7D Evo = ৳299

---

## 💡 Pro Tips

### Tip 1: Organize Your Content
1. Create categories first
2. Then add cards to those categories
3. Cards will appear in their sections on homepage

### Tip 2: Use Good Images
- Use high-quality banner images
- Card images should be clear
- Use placeholder services for testing:
  - `https://via.placeholder.com/800x300`

### Tip 3: Price Strategy
- Check competitor prices
- Add discounts to attract customers
- Use bonus diamonds for special offers

### Tip 4: Daily Routine
- ✅ Check dashboard statistics
- ✅ Process pending orders
- ✅ Reply to support tickets
- ✅ Update banners weekly

---

## 🔧 Troubleshooting

### Can't Login?
- Use exact credentials: `admin123` / `admin@123`
- Try clearing browser cache
- Check if caps lock is on

### Sidebar Not Showing?
- Click the hamburger menu (☰) icon
- Sidebar is collapsible

### Changes Not Saving?
- Check browser console for errors
- Data is saved in localStorage
- Don't use incognito mode

### Redirected to Login?
- Your session expired
- Just login again

---

## 📱 Mobile Access

The admin panel works on mobile!
- Use landscape mode for better view
- Tables scroll horizontally
- Sidebar adapts to mobile screen

---

## 🔐 Security Reminders

**Current Setup (Demo):**
- ✅ Great for testing
- ✅ Perfect for development
- ✅ Easy to use

**For Production:**
- ⚠️ Add backend authentication
- ⚠️ Use secure password hashing
- ⚠️ Implement JWT tokens
- ⚠️ Add HTTPS

---

## 🎊 You're Ready!

That's it! You now know how to:
- ✅ Login to admin panel
- ✅ Manage orders
- ✅ Add products
- ✅ Handle support
- ✅ Update content

**Start exploring the admin panel now!** 🚀

---

### Need Detailed Help?
📖 Read the complete guide: `ADMIN_PANEL_GUIDE.md`

### Questions?
Check the documentation or test features in the demo.

---

**Happy Admin-ing! 🎉**

