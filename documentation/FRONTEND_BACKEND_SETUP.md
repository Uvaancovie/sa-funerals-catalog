# Frontend-Backend Integration Setup

This document provides step-by-step instructions for setting up the complete frontend-backend integration.

## Prerequisites

- Node.js v18 or higher
- .NET 8.0 SDK
- SQL Server (LocalDB or full installation)

## Quick Start

### 1. Setup Backend (.NET API)

```powershell
# Navigate to the API directory
cd SAFuneralSuppliesAPI

# Restore dependencies
dotnet restore

# Setup database (create migrations)
dotnet ef database update

# Run the API
dotnet run
```

The API will start on `http://localhost:5000`

**Verify**: Open http://localhost:5000/swagger to see the API documentation.

### 2. Setup Frontend (Angular)

```powershell
# Navigate to the project root
cd d:\sa-funeral-supplies

# Install dependencies (if not already done)
npm install

# Start the development server with proxy
ng serve --proxy-config proxy.conf.json
```

The frontend will start on `http://localhost:4200`

**Verify**: Open http://localhost:4200 to see the application.

## Project Structure

```
sa-funeral-supplies/
├── SAFuneralSuppliesAPI/          # .NET Core API
│   ├── Controllers/               # API endpoints
│   ├── Services/                  # Business logic
│   ├── Models/                    # Database models
│   └── DTOs/                      # Data transfer objects
│
├── src/
│   ├── services/                  # Angular services
│   │   ├── auth.service.ts       # Authentication
│   │   ├── products.service.ts   # Products management
│   │   └── customers.service.ts  # Customer management (admin)
│   │
│   ├── interceptors/             # HTTP interceptors
│   │   └── auth.interceptor.ts   # Auto-adds JWT token
│   │
│   └── types/                    # TypeScript types
│       └── api.types.ts          # API interface definitions
│
└── proxy.conf.json               # API proxy configuration
```

## Configuration Files

### Frontend Proxy (`proxy.conf.json`)
```json
{
  "/api": {
    "target": "http://localhost:5000",
    "secure": false,
    "changeOrigin": true,
    "logLevel": "debug"
  }
}
```

This forwards all `/api/*` requests from the Angular dev server to the .NET API.

### Backend CORS (`Program.cs`)
The API is configured to allow requests from the Angular dev server.

## Testing the Integration

### 1. Test Authentication

Use the Swagger UI (http://localhost:5000/swagger) or create a test login:

```typescript
// In your Angular component
constructor(private authService: AuthService) {}

testLogin() {
  this.authService.login('admin@example.com', 'password').subscribe({
    next: (response) => {
      console.log('Login successful:', response);
    },
    error: (err) => {
      console.error('Login failed:', err.error?.error);
    }
  });
}
```

### 2. Test Products API

```typescript
constructor(private productsService: ProductsService) {}

testProducts() {
  // Load all products
  this.productsService.getProducts().subscribe({
    next: (products) => {
      console.log('Products:', products);
    }
  });
  
  // Get single product
  this.productsService.getProduct('oxford-casket').subscribe({
    next: (product) => {
      console.log('Product:', product);
    }
  });
}
```

### 3. Test Admin Operations

```typescript
// Must be logged in as admin
testAdminOperations() {
  // Create customer
  this.customersService.createCustomer({
    email: 'test@customer.com',
    password: 'Password123',
    companyName: 'Test Funeral Home',
    contactPerson: 'John Doe',
    phone: '+27123456789',
    status: 'pending'
  }).subscribe({
    next: (customer) => {
      console.log('Created:', customer);
    }
  });
}
```

## Default Admin Account

After running the database migrations, you can seed an admin account:

```powershell
# In SAFuneralSuppliesAPI directory
dotnet run seedadmin
```

Or manually create via SQL:

```sql
INSERT INTO Users (Email, Password, Role, Status, CreatedAt)
VALUES (
  'admin@safuneralsupplies.com',
  '$2a$11$...',  -- BCrypt hash of 'Admin@123'
  'admin',
  'approved',
  GETUTCDATE()
);
```

## Common Issues

### Issue: CORS Errors

**Symptom**: Console shows "Access-Control-Allow-Origin" errors

**Solution**: 
1. Verify the API is running on http://localhost:5000
2. Check that CORS is configured in `Program.cs`
3. Restart both servers

### Issue: 401 Unauthorized

**Symptom**: API returns 401 for authenticated requests

**Solution**:
1. Check that you're logged in: `authService.isAuthenticated()`
2. Verify the token is being sent (check Network tab in DevTools)
3. Verify the JWT secret in `appsettings.json` matches

### Issue: Proxy Not Working

**Symptom**: Requests go to wrong URL or 404 errors

**Solution**:
1. Ensure you start Angular with: `ng serve --proxy-config proxy.conf.json`
2. Verify `proxy.conf.json` has correct target URL
3. Check console for proxy logs

### Issue: Database Connection Failed

**Symptom**: API fails to start with database error

**Solution**:
1. Verify SQL Server is running
2. Check connection string in `appsettings.json`
3. Run migrations: `dotnet ef database update`

## Development Workflow

### Running Both Servers Together

Option 1: **Use two terminals**
```powershell
# Terminal 1: Backend
cd SAFuneralSuppliesAPI
dotnet run

# Terminal 2: Frontend
cd d:\sa-funeral-supplies
ng serve --proxy-config proxy.conf.json
```

Option 2: **Create a start script** (Windows PowerShell)

Create `start-dev.ps1`:
```powershell
# Start backend in background
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd SAFuneralSuppliesAPI; dotnet run"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start frontend
ng serve --proxy-config proxy.conf.json
```

Run it:
```powershell
.\start-dev.ps1
```

### Hot Reload

Both servers support hot reload:
- **Frontend**: Angular automatically reloads on code changes
- **Backend**: .NET watches for C# file changes and recompiles

## API Endpoints Reference

### Authentication
- `POST /api/auth/login` - Login

### Products (Public)
- `GET /api/products` - List products
- `GET /api/products/{id}` - Get product

### Products (Admin)
- `POST /api/products` - Create
- `PUT /api/products/{id}` - Update
- `DELETE /api/products/{id}` - Delete

### Customers (Admin)
- `GET /api/admin/customers` - List customers
- `POST /api/admin/customers` - Create customer
- `PATCH /api/admin/customers/{id}` - Update status

## Next Steps

1. **Review the API Guide**: See [FRONTEND_API_GUIDE.md](./FRONTEND_API_GUIDE.md) for detailed service usage
2. **Explore Example Component**: Check `src/components/api-example.component.ts` for implementation examples
3. **Check Types**: Review `src/types/api.types.ts` for TypeScript interfaces
4. **Test with Swagger**: Use http://localhost:5000/swagger to test endpoints directly

## Additional Resources

- [.NET API Getting Started](../SAFuneralSuppliesAPI/GETTING_STARTED.md)
- [API Quick Start](../SAFuneralSuppliesAPI/QUICKSTART.md)
- [Migration Guide](../SAFuneralSuppliesAPI/MIGRATION_GUIDE.md)
