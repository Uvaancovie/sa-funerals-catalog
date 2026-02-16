# Restricted Pricing System - Setup Guide

## ✅ Implementation Complete

I've successfully implemented the restricted pricing and admin portal system for SA Funeral Supplies. Here's what has been built:

### 🏗️ Infrastructure Created

#### Backend API (Vercel Serverless Functions)
- **`/api/lib/mongodb.ts`** - MongoDB connection handler with connection pooling
- **`/api/lib/auth.ts`** - JWT authentication middleware and utilities
- **`/api/auth/register.ts`** - Customer registration endpoint
- **`/api/auth/login.ts`** - Authentication endpoint
- **`/api/admin/customers.ts`** - Admin customer management (list & add)
- **`/api/admin/customers/[id].ts`** - Admin customer approval/decline

#### Frontend Components
- **`/src/services/auth.service.ts`** - Authentication state management
- **`/src/pages/register.component.ts`** - Customer registration page
- **`/src/pages/login.component.ts`** - Login page
- **`/src/pages/admin/admin-dashboard.component.ts`** - Admin portal with customer management

#### Configuration
- **`/src/app.config.ts`** - Added HttpClient provider
- **`/src/app.routes.ts`** - Added routes for login, register, and admin
- **`/src/components/navbar.component.ts`** - Updated with auth status display
- **`/api/tsconfig.json`** - TypeScript config for API functions

---

## 🚀 Next Steps to Deploy

### 1. Set Up MongoDB Atlas (Free Tier)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a new cluster (M0 Free tier)
4. Create a database user with password
5. Whitelist your IP address (or use `0.0.0.0/0` for all IPs)
6. Get your connection string (looks like: `mongodb+srv://username:password@cluster.mongodb.net/`)

### 2. Configure Environment Variables

Create/update `.env.local` with:

```bash
MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@YOUR_CLUSTER.mongodb.net/safuneral?retryWrites=true&w=majority
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
ADMIN_EMAIL=admin@safuneralsupplies.co.za
ADMIN_PASSWORD=Admin123!
```

### 3. Add Environment Variables to Vercel

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add:
   - `MONGODB_URI` → Your MongoDB connection string
   - `JWT_SECRET` → A secure random string (use a password generator)

### 4. First Admin Login (Auto Bootstrap)

The API now auto-creates the first admin user when no admin exists in the `users` collection.

- Default admin email: `admin@safuneralsupplies.co.za`
- Default admin password: `Admin123!`
- These can be overridden via `ADMIN_EMAIL` and `ADMIN_PASSWORD` environment variables.

Recommended production step: change `ADMIN_PASSWORD` to a strong secret before first login.

---

## 📋 How the System Works

### For Customers:
1. **Register** at `/register` with company details
2. Account is created with `status: 'pending'`
3. **Cannot see pricing** until approved
4. Receives message: "Your account is pending review"

### For Admins:
1. **Login** at `/login` with admin credentials
2. Access **Admin Portal** at `/admin`
3. View all customers with status filters (Pending, Approved, Declined)
4. **Approve** or **Decline** customers with one click
5. **Manually add** known customers directly

### Pricing Visibility Logic:
- **Guest (not logged in)**: No pricing shown, "Register to View Pricing" button
- **Pending Customer**: "Awaiting Approval for Pricing" message
- **Approved Customer**: Full pricing visible
- **Admin**: Full pricing visible + access to admin portal

---

## 🧪 Testing the System

### Test Flow:
1. **Register a test customer** at `http://localhost:52189/#/register`
2. **Login as admin** at `http://localhost:52189/#/login`
3. **Go to admin portal** at `http://localhost:52189/#/admin`
4. **Approve the test customer**
5. **Logout and login as the customer** to verify pricing is now visible

---

## 🔐 Security Features

✅ **Password Hashing** - bcrypt with 10 salt rounds  
✅ **JWT Tokens** - 7-day expiration  
✅ **Role-Based Access Control** - Admin, Approved, Pending, Guest  
✅ **Protected API Routes** - Middleware checks authentication  
✅ **CORS Headers** - Configured for Vercel deployment  

---

## 📦 Packages Installed

```json
{
  "mongodb": "^7.1.0",
  "bcryptjs": "^3.0.3",
  "jsonwebtoken": "^9.0.3",
  "@vercel/node": "^5.6.3",
  "@angular/forms": "^18.2.0",
  "@types/bcryptjs": "^2.4.6",
  "@types/jsonwebtoken": "^9.0.10"
}
```

---

## 🎨 Next Enhancements (Optional)

- [ ] Email notifications when customers are approved/declined
- [ ] Password reset functionality
- [ ] Customer profile editing
- [ ] Quote history for approved customers
- [ ] Audit log of admin actions
- [ ] Export customer list to CSV

---

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check your `MONGODB_URI` is correct
- Verify IP whitelist in MongoDB Atlas
- Ensure database user has read/write permissions

### "Invalid token" errors
- Clear localStorage in browser
- Check `JWT_SECRET` is set in environment variables
- Verify token hasn't expired (7 days)

### TypeScript errors in `/api` folder
- Run `npm install` to ensure all packages are installed
- Check `/api/tsconfig.json` exists

---

## 📞 Support

If you encounter any issues during setup, check:
1. MongoDB Atlas connection string format
2. Environment variables are set correctly in Vercel
3. First admin user is created in the database

The system is now ready to protect your pricing from competitors! 🎉
