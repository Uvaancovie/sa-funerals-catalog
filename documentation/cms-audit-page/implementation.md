# Implementation Plan - Product Audit Trails (CMS Features)

The goal is to enhance the Product Management system to function more like a CMS by tracking all changes made to products (Create, Update, Delete). This will provide accountability and a history of inventory changes.

## User Review Required

> [!IMPORTANT]
> This change requires a database schema update (New `ProductAuditLogs` table).
> You will need to run entity framework migrations or let the application update the database if configured to do so automatically.
> I will provide the migration steps.

## Proposed Changes

### Backend (SAFuneralSuppliesAPI)

#### [NEW] `Models/ProductAuditLog.cs`
Create a new entity `ProductAuditLog` to store:
- `ProductId` (string/int)
- `ProductName` (string) - snapshot in case product is deleted
- `Action` (Create, Update, Delete)
- `Changes` (JSON string containing old vs new values)
- `ChangedBy` (Email/User)
- `Timestamp`

#### [MODIFY] `Data/ApplicationDbContext.cs`
- Add `DbSet<ProductAuditLog> ProductAuditLogs { get; set; }`

#### [MODIFY] `Controllers/ProductsController.cs`
- Inject `IHttpContextAccessor` or use `User.Identity` to get the current admin user.
- **Create**: Log the creation event.
- **Update**: Compare existing product with new values, generate a "diff" (e.g., `{ "Price": { "old": 100, "new": 150 } }`), and save it to `ProductAuditLogs`.
- **Delete**: Log the deletion event.
- **New Endpoint**: `GET /api/products/{id}/history` to fetch the audit log for a specific product.

### Frontend (Angular)

#### [MODIFY] `src/services/products.service.ts`
- Add method `getProductHistory(productId: string)`.
- Add interface `ProductAuditLog`.

#### [MODIFY] `src/pages/admin/admin-products.component.ts`
- Add "History" button to the product list actions.
- Add a Modal or "View History" section.
- Display the timeline of changes:
  - "Updated by admin@example.com on Jan 1, 2024"
  - "Price changed from R100 to R200"
  - "Stock status changed to Out of Stock"

## Verification Plan

### Automated Tests
I will verify the API endpoints using `curl` or a test script to ensure:
1. Creating a product creates a log.
2. Updating a product creates a log with correct diff.
3. Fetching history returns the logs.

### Manual Verification
- **Create**: Create a new product "Test Casket". Verify in "History" that "Created" event exists.
- **Update**: Change price from 5000 to 6000. Verify in "History" that it shows the price change.
- **Delete**: Delete "Test Casket". (Although we can't see history of deleted item in the main list, we can check database or a global "Product Audit Logs" if requested. For now, we'll focus on existing product history).