# Backend Implementation Plan

## 1. Configuration & Setup
- [x] Update `.env.local` with the new MongoDB connection string.
- [x] Update `api/lib/mongodb.ts` to ensure it connects to the `safs-product-catalog` database.
- [x] Standardize database name usage across all API endpoints (refactor hardcoded 'safuneral' to use environment variable or constant).

## 2. Product API Endpoints
Create/Update Vercel Serverless Functions for product management:
- [x] `GET /api/products`: Retrieve all products (with pagination/filtering).
- [x] `GET /api/products/:id`: Retrieve a single product by ID.
- [x] `POST /api/products`: Create a new product (Admin only).
- [x] `PUT /api/products/:id`: Update an existing product (Admin only).
- [x] `DELETE /api/products/:id`: Delete a product (Admin only).

## 3. Data Migration/Seeding
- [x] Create a script or endpoint to seed the `safs-product-catalog` database with initial product data (likely migrating from `src/assets/products.json` if it exists, or the current `safuneral` db).

## 4. Frontend Integration
- [x] Update Angular Product Service to point to the new `/api/products` endpoints instead of local JSON or old endpoints.
- [ ] Ensure the Product Detail page (`src/pages/product-detail.component.ts`) fetches data from the API.
- [ ] Update Admin Portal to use the new write endpoints.

## 5. Testing
- [ ] Verify database connection.
- [ ] Test all CRUD operations.
- [ ] Verify frontend displays data correctly.