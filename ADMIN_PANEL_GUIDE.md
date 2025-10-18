# Admin Panel - Complete Guide

## 🔐 Admin Authentication

### Login Credentials
The admin panel is now fully secured with authentication:

**Demo Admin Accounts:**
- **Admin ID:** `admin123` | **Password:** `admin@123`
- **Admin ID:** `superadmin` | **Password:** `super@123`

### Security Features
- ✅ Protected admin routes - unauthorized users are redirected to login
- ✅ Session-based authentication using localStorage
- ✅ Auto-redirect to dashboard after successful login
- ✅ Logout functionality to clear session

### Accessing Admin Panel
1. Navigate to `/admin` or `/admin/login`
2. Enter your Admin ID and Password
3. Click "Sign In to Admin Panel"
4. You'll be redirected to the dashboard

## 🎨 Admin Layout

### Clean Professional Design
- **No Header/Footer** - Pure admin interface
- **Sidebar Navigation** - Collapsible left sidebar with all menu items
- **Responsive** - Works on all screen sizes
- **Dark Theme Sidebar** - Professional dark gradient design

### Sidebar Features
- **Collapsible** - Click the hamburger icon to expand/collapse
- **Active State** - Current page is highlighted in green
- **Icons** - Each menu item has a descriptive icon
- **Logout** - Logout button at the bottom

## 📊 Dashboard (Home)

**Route:** `/admin/dashboard`

### Overview Statistics
- **Total Users** - Count of registered users
- **Total Orders** - All orders placed
- **Total Revenue** - Completed orders revenue
- **Today's Orders** - Orders placed today

### Order Status Cards
- **Pending Orders** - Yellow indicator
- **Completed Orders** - Green indicator
- **Cancelled Orders** - Red indicator

### Today's Performance
- Real-time stats for current day
- Orders and revenue tracking

## 👥 User Management

**Route:** `/admin/users`

### Features
- **Search Users** - By name or email
- **View User Details** - Name, email, phone, wallet balance
- **Order Statistics** - Total orders and amount spent per user
- **Ban/Unban Users** - Toggle user account status
- **User Status** - Active (green) or Banned (red) badges

### User Information Displayed
- Profile icon and name
- Email and phone number
- Wallet balance
- Total orders count
- Total amount spent
- Account status

## 📦 Order Management

**Route:** `/admin/orders`

### Features
- **Search Orders** - By Order ID or Item name
- **Filter by Status** - All, Pending, Completed, Cancelled
- **View Order Details** - Full modal with all information
- **Update Status** - Mark as Completed or Cancelled
- **Real-time Updates** - Changes reflect immediately

### Order Information
- Order ID
- Item/Product name
- Player UID (if applicable)
- Amount paid
- Payment method
- Status with color coding
- Date and time
- Quick action buttons

## 🎧 Support Requests

**Route:** `/admin/support`

### Features
- **View All Tickets** - Support requests from users
- **Priority Levels** - High, Medium, Low
- **Status Tracking** - Open, In Progress, Resolved
- **Reply System** - Send replies to customers
- **Auto-Resolve** - Automatically mark as resolved when replying

### Ticket Information
- Ticket ID
- Customer name, email, phone
- Subject and message
- Priority level (color-coded)
- Status (with icons)
- Creation date
- Reply history

### Support Stats
- Open Tickets count
- In Progress count
- Resolved count

## 🖼️ Banner Management

**Route:** `/admin/banners`

### Features
- **Add Banners** - Create new homepage banners
- **Edit Banners** - Update existing banners
- **Delete Banners** - Remove unwanted banners
- **Toggle Visibility** - Show/Hide banners
- **Order Management** - Set display order

### Banner Properties
- Title
- Image URL (with preview)
- Link (optional)
- Display order (numeric)
- Active status (Show/Hide)

### Banner Display
- Grid layout with image previews
- Active/Inactive badges
- Edit, Hide/Show, Delete buttons

## 💎 Diamond & Pricing Management

**Route:** `/admin/diamonds`

### Features
- **Add Diamond Packs** - Create new packs
- **Edit Packs** - Update quantity or price
- **Delete Packs** - Remove packs
- **Category System** - Regular, Weekly, Monthly, Special
- **Discount Support** - Add percentage discounts
- **Bonus Diamonds** - Add bonus diamonds to packs

### Pack Information
- Diamond quantity
- Original price
- Discount percentage (optional)
- Final price (auto-calculated)
- Bonus diamonds (optional)
- Category type

### Categories
- **Regular** - Standard diamond packs
- **Weekly** - Weekly special packs
- **Monthly** - Monthly special packs
- **Special** - Limited time offers

### Stats Dashboard
- Total packs count
- Regular packs count
- Weekly packs count
- Special packs count

## 🗂️ Category Section Management

**Route:** `/admin/categories`

### What are Category Sections?
Category sections are the different sections displayed on your homepage like:
- Discount Offers
- Regular Top-Up
- Special Events
- And more...

### Features
- **Add Sections** - Create new homepage sections
- **Edit Sections** - Update section details
- **Delete Sections** - Remove sections
- **Reorder Sections** - Move up/down to change display order
- **Toggle Visibility** - Show/Hide sections

### Section Properties
- **Display Name** - Shown to users (e.g., "Discount Offers")
- **Section ID** - Internal identifier (e.g., "discount-offers")
- **Description** - Brief description
- **Icon** - Emoji icon (e.g., 🔥)
- **Theme Color** - Hex color code with color picker
- **Active Status** - Show/Hide on homepage

### Ordering
- Up/Down arrows to change order
- Order number automatically updated
- Changes reflect on homepage immediately

## 💳 Top-up Card Management

**Route:** `/admin/cards`

### What are Top-up Cards?
Top-up cards are the individual product cards shown under each category section (like UID Topup, Weekly Pass, etc.)

### Card Types

#### 1. **Diamond Top-up Cards**
For regular diamond purchases
- Add multiple quantity/price combinations
- Example: 100 Diamonds - ৳74, 240 Diamonds - ৳182

#### 2. **Weekly Pass Cards**
For weekly subscriptions
- Define types like "1x Weekly", "3x Weekly"
- Set price for each type

#### 3. **Monthly Pass Cards**
For monthly subscriptions
- Define types like "1x Monthly", "3x Monthly"
- Set price for each type

#### 4. **Evo Access Cards**
For Evo Access passes
- Define durations like "3D", "7D", "30D"
- Set price for each duration

#### 5. **Elite Pass Cards**
For Elite Pass purchases
- Define durations like "3D", "7D", "30D"
- Set price for each duration

### Features
- **Add Cards** - Create new top-up cards
- **Edit Cards** - Update card details
- **Delete Cards** - Remove cards
- **Category Assignment** - Assign to a category section
- **Multiple Options** - Add multiple packs/options per card
- **Image Preview** - See card image before saving

### Card Properties
- Title (e.g., "UID Topup")
- Card Type (Diamond, Weekly, Monthly, Evo, Elite)
- Description
- Image URL (with preview)
- Category Section (where it appears)
- Packs/Options (based on card type)

### Stats Dashboard
- Total cards count
- Diamond cards count
- Weekly cards count
- Monthly cards count
- Evo/Elite cards count

## 🎯 Complete Workflow Examples

### Example 1: Creating a New Diamond Pack
1. Go to `/admin/diamonds`
2. Click "Add Diamond Pack"
3. Enter quantity (e.g., 500)
4. Enter price (e.g., 400)
5. Add discount (optional, e.g., 10%)
6. Add bonus (optional, e.g., 50 diamonds)
7. Select category (e.g., Special)
8. Click "Add Pack"

### Example 2: Creating a Homepage Section
1. Go to `/admin/categories`
2. Click "Add New Section"
3. Enter Display Name (e.g., "Flash Sale")
4. Enter Section ID (e.g., "flash-sale")
5. Add description
6. Choose icon (e.g., ⚡)
7. Pick theme color
8. Check "Active" to show on homepage
9. Click "Add Section"

### Example 3: Adding a Weekly Pass Card
1. Go to `/admin/cards`
2. Click "Add Top-up Card"
3. Enter title (e.g., "Weekly Diamond Pass")
4. Select card type: "Weekly Pass"
5. Add description
6. Enter image URL
7. Assign to category section
8. Click "Add Option" to add passes:
   - "1x Weekly" - ৳199
   - "3x Weekly" - ৳549
9. Click "Add Card"

### Example 4: Managing Orders
1. Go to `/admin/orders`
2. Use search to find specific order
3. Filter by status if needed
4. Click "View Details" on an order
5. Review order information
6. Click "Mark as Completed" or "Cancel Order"
7. Order status updates immediately

### Example 5: Handling Support Tickets
1. Go to `/admin/support`
2. Click "View & Reply" on a ticket
3. Read customer's message
4. Type your reply in the text area
5. Click "Send Reply & Resolve"
6. Ticket is marked as resolved
7. Customer receives your reply

## 🔧 Technical Details

### Data Storage
All admin data is stored in localStorage:
- `adminAuth` - Admin authentication session
- `users` - User accounts
- `orders` - All orders
- `banners` - Homepage banners
- `diamondPacks` - Diamond pricing
- `categories` - Category sections
- `topupCards` - Top-up cards

### Session Management
- Login creates `adminAuth` object with:
  - `adminId` - Admin's ID
  - `loginTime` - Timestamp
  - `isAdmin` - Boolean flag
- Logout removes `adminAuth` from localStorage
- All admin routes check for `adminAuth` on load

### Route Protection
Every admin page checks authentication:
```javascript
useEffect(() => {
  const adminAuth = localStorage.getItem('adminAuth');
  if (!adminAuth) {
    router.push('/admin/login');
  }
}, [router]);
```

## 🚀 Quick Access Links

### Admin Routes
- **Login:** `/admin/login`
- **Dashboard:** `/admin/dashboard`
- **Users:** `/admin/users`
- **Orders:** `/admin/orders`
- **Support:** `/admin/support`
- **Banners:** `/admin/banners`
- **Diamonds:** `/admin/diamonds`
- **Categories:** `/admin/categories`
- **Cards:** `/admin/cards`

## 📱 Mobile Responsive

All admin pages are fully responsive:
- ✅ Sidebar adapts to mobile screens
- ✅ Tables scroll horizontally on small screens
- ✅ Forms stack vertically on mobile
- ✅ Touch-friendly buttons and controls
- ✅ Modals fit mobile screens

## 🎨 Design Features

### Color Coding
- **Primary Green (#32CD32)** - Main actions, active states
- **Blue** - Informational, edit actions
- **Green** - Success, completed status
- **Yellow** - Warning, pending status
- **Red** - Danger, delete actions, cancelled status

### Icons
- Each menu item has a descriptive icon
- Status indicators use color + icon
- Action buttons show icons for clarity

### Animations
- Smooth transitions on hover
- Fade-in animations for modals
- Loading spinners for redirects

## 💡 Tips & Best Practices

1. **Regular Backups** - Export data from localStorage regularly
2. **Test Changes** - Always preview on the actual site after changes
3. **Image URLs** - Use reliable CDN or hosting for images
4. **Pricing Strategy** - Set competitive prices based on market
5. **Support Response** - Reply to tickets within 24 hours
6. **Order Management** - Process pending orders quickly
7. **Category Organization** - Group similar cards in same category
8. **Banner Rotation** - Update banners weekly for freshness

## 🔒 Security Notes

⚠️ **Important:** This is a demo implementation. For production:
- Implement proper backend authentication
- Use JWT tokens instead of localStorage
- Add role-based access control (RBAC)
- Implement API rate limiting
- Add audit logs for admin actions
- Use HTTPS for all communications
- Implement CSRF protection
- Add two-factor authentication (2FA)

## 📞 Support

For any issues or questions:
- Check the documentation first
- Review the demo credentials
- Test in a clean browser session
- Clear localStorage if experiencing issues

---

**Version:** 2.0  
**Last Updated:** October 2025  
**Author:** IHN Development Team

