# Restricted Pricing & Admin Portal Implementation Plan

To protect SA Funeral Supplies' proprietary pricing and material data from competitors, we will implement a gated pricing system controlled by an Admin Portal.

## User Roles & Access Control

| Role | Access Level | Pricing Visibility |
| :--- | :--- | :--- |
| **Guest** | Public pages, products (no price) | Hidden |
| **Pending Customer** | Public pages, products (no price) | Hidden (shows "Awaiting Approval") |
| **Approved Customer** | Full catalog with pricing, quote history | **Visible** |
| **Admin** | Full catalog + Admin Portal | **Visible** |

## Data Models (Updated)

### Users / Customers Collection
```typescript
{
  _id: ObjectId,
  email: string,           // Unique
  password: string,        // Hashed
  companyName: string,
  contactPerson: string,
  phone: string,
  address: string,
  role: 'customer' | 'admin',
  status: 'pending' | 'approved' | 'declined',
  createdAt: Date,
  lastLogin: Date
}
```

## Security Workflow

### 1. Customer Registration
1. Customer fills out a Registration Form (Email, Company, Phone, etc.).
2. Account is created with `status: 'pending'`.
3. Customer cannot see prices yet. Showing a message: *"Your account is pending review. Pricing will be visible once approved."*
4. Admin receives notification (email or dashboard badge).

### 2. Admin Portal Features
- **Dashboard**: Overview of pending registrations and recent activity.
- **Customer Management**:
  - List all customers with status filters.
  - **Approve Button**: Changes status to `approved`.
  - **Decline Button**: Changes status to `declined` (optionally provide reason).
  - **Add Customer**: Manual entry for internal sales team to setup known clients.
- **Audit Logs**: Track who approved which customer.

### 3. Pricing Visibility Logic
```typescript
// Frontend Component Logic
@if (userStatus() === 'approved' || userRole() === 'admin') {
  <span class="text-2xl font-bold">R {{ product.price }}</span>
} @else if (userStatus() === 'pending') {
  <span class="text-sm text-safs-gold italic">Awaiting Approval for Pricing</span>
} @else {
  <button routerLink="/register" class="text-sm font-bold underline">Register to View Pricing</button>
}
```

## Technical Implementation Steps

### Phase 1: Authentication Infrastructure
- **JWT Implementation**: Secure tokens for API requests.
- **Middleware**: Create Vercel Functions middleware to check `isAdmin` and `isApproved`.
- **Encryption**: Use `bcryptjs` for password hashing.

### Phase 2: Registration & Login UI
- `[NEW]` [registration.component.ts](file:///d:/sa-funeral-supplies/src/pages/register.component.ts)
- `[NEW]` [login.component.ts](file:///d:/sa-funeral-supplies/src/pages/login.component.ts)

### Phase 3: Admin Portal UI
- `[NEW]` [admin-layout.component.ts](file:///d:/sa-funeral-supplies/src/pages/admin/admin-layout.component.ts)
- `[NEW]` [customer-management.component.ts](file:///d:/sa-funeral-supplies/src/pages/admin/customers.component.ts)

### Phase 4: API Endpoints (Vercel Functions)
- `POST /api/auth/register`: Public registration.
- `POST /api/auth/login`: Authentication.
- `GET /api/admin/customers`: (Admin Only) List users.
- `PATCH /api/admin/customers/:id`: (Admin Only) Approve/Decline.
- `POST /api/admin/customers`: (Admin Only) Manually add customer.

## Verification Plan

### Automated Tests
- Script to attempt price retrieval via API without a token (must fail).
- Script to attempt admin actions as a standard guest (must fail).

### Manual Verification
1. Register a new test account.
2. Verify pricing is hidden on the catalog.
3. Login as Admin.
4. Approve the test account.
5. Verify pricing is now visible for that account only.

---

## User Review Required

> [!IMPORTANT]
> **Privacy Consideration**: When an admin declines a customer, should we send an automated email notification?
> **Security Question**: Should we require Admin accounts to be created manually in the database for extra security, or have a first-time setup?