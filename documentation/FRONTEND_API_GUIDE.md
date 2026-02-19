# Frontend API Integration Guide

This guide explains how to use the Angular services to communicate with the SA Funeral Supplies .NET API.

## Configuration

### 1. Proxy Configuration
The Angular development server is configured to proxy API requests to the .NET backend:
- **Frontend**: `http://localhost:4200` (or default Angular port)
- **Backend**: `http://localhost:5000`
- **Proxy**: All `/api/*` requests are forwarded to the backend

### 2. HTTP Interceptor
The `authInterceptor` automatically adds the JWT token to all API requests. It's configured in [app.config.ts](../app.config.ts).

## Services

### AuthService
**Location**: `src/services/auth.service.ts`

Handles user authentication and manages the current user session.

#### Usage Example:
```typescript
import { AuthService } from './services/auth.service';

constructor(private authService: AuthService) {}

// Login
login() {
  this.authService.login('user@example.com', 'password').subscribe({
    next: (response) => {
      console.log('Logged in:', response.user);
      // Token is automatically stored and added to future requests
    },
    error: (err) => {
      console.error('Login failed:', err.error?.error);
    }
  });
}

// Check authentication state
if (this.authService.isAuthenticated()) {
  console.log('User is logged in');
}

// Check if user is admin
if (this.authService.isAdmin()) {
  console.log('User is an admin');
}

// Check if user is approved
if (this.authService.isApproved()) {
  console.log('User is approved');
}

// Logout
logout() {
  this.authService.logout();
}
```

### ProductsService
**Location**: `src/services/products.service.ts`

Manages product operations (public viewing and admin CRUD).

#### Usage Example:
```typescript
import { ProductsService } from './services/products.service';

constructor(private productsService: ProductsService) {}

// Get all products
loadProducts() {
  this.productsService.getProducts().subscribe({
    next: (products) => {
      console.log('Products:', products);
    }
  });
}

// Filter products
filterProducts() {
  this.productsService.getProducts({ 
    category: 'casket', 
    search: 'oxford' 
  }).subscribe({
    next: (products) => {
      console.log('Filtered products:', products);
    }
  });
}

// Get single product
getProduct(id: string) {
  this.productsService.getProduct(id).subscribe({
    next: (product) => {
      console.log('Product:', product);
      
      // Parse JSON fields
      const images = this.productsService.parseImages(product);
      const features = this.productsService.parseFeatures(product);
      const specs = this.productsService.parseSpecifications(product);
    }
  });
}

// Admin: Create product
createProduct() {
  const newProduct = {
    id: 'premium-casket',
    name: 'Premium Casket',
    category: 'casket',
    description: 'High-quality casket',
    price: 5000,
    priceOnRequest: false,
    inStock: true,
    featured: true
  };

  this.productsService.createProduct(newProduct).subscribe({
    next: (product) => {
      console.log('Created:', product);
    },
    error: (err) => {
      console.error('Failed to create:', err.error?.error);
    }
  });
}

// Admin: Update product
updateProduct(id: string) {
  const updates = {
    name: 'Updated Name',
    price: 6000
  };

  this.productsService.updateProduct(id, updates).subscribe({
    next: (product) => {
      console.log('Updated:', product);
    }
  });
}

// Admin: Delete product
deleteProduct(id: string) {
  this.productsService.deleteProduct(id).subscribe({
    next: (response) => {
      console.log(response.message);
    }
  });
}
```

### CustomersService (Admin Only)
**Location**: `src/services/customers.service.ts`

Manages customer accounts (admin only).

#### Usage Example:
```typescript
import { CustomersService } from './services/customers.service';

constructor(private customersService: CustomersService) {}

// Get all customers
loadCustomers() {
  this.customersService.getCustomers().subscribe({
    next: (response) => {
      console.log('Customers:', response.customers);
    }
  });
}

// Filter customers
filterCustomers() {
  this.customersService.getCustomers({
    status: 'pending',
    search: 'funeral'
  }).subscribe({
    next: (response) => {
      console.log('Pending customers:', response.customers);
    }
  });
}

// Create customer
createCustomer() {
  const newCustomer = {
    email: 'new@customer.com',
    password: 'securePassword123',
    companyName: 'ABC Funeral Home',
    contactPerson: 'John Doe',
    phone: '+27123456789',
    address: '123 Main St',
    status: 'pending'
  };

  this.customersService.createCustomer(newCustomer).subscribe({
    next: (customer) => {
      console.log('Created customer:', customer);
    },
    error: (err) => {
      console.error('Failed:', err.error?.error);
    }
  });
}

// Approve customer
approveCustomer(customerId: number) {
  this.customersService.updateCustomerStatus(customerId, {
    status: 'approved'
  }).subscribe({
    next: (response) => {
      console.log(response.message);
    }
  });
}

// Decline customer
declineCustomer(customerId: number) {
  this.customersService.updateCustomerStatus(customerId, {
    status: 'declined',
    reason: 'Does not meet requirements'
  }).subscribe({
    next: (response) => {
      console.log(response.message);
    }
  });
}

// Helper methods
getPendingCustomers() {
  return this.customersService.getPendingCustomers();
}
```

## Signals

All services use Angular signals for reactive state management:

```typescript
// AuthService signals
authService.currentUser()      // Current user or null
authService.token()             // JWT token or null
authService.isAuthenticated()  // Boolean
authService.isAdmin()          // Boolean
authService.isApproved()       // Boolean
authService.isPending()        // Boolean

// ProductsService signals
productsService.products()     // Product[]
productsService.loading()      // Boolean
productsService.error()        // string | null

// CustomersService signals
customersService.customers()   // Customer[]
customersService.loading()     // Boolean
customersService.error()       // string | null
```

## API Endpoints

### Authentication
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/register` - Disabled (customers created by admin only)

### Products (Public)
- `GET /api/products` - List all products (optional: ?category=&search=)
- `GET /api/products/{id}` - Get single product

### Products (Admin Only)
- `POST /api/products` - Create product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Customers (Admin Only)
- `GET /api/admin/customers` - List all customers (optional: ?status=&search=)
- `POST /api/admin/customers` - Create customer
- `PATCH /api/admin/customers/{id}` - Update customer status

## Error Handling

All services return observables with standard error handling:

```typescript
this.authService.login(email, password).subscribe({
  next: (response) => {
    // Success
  },
  error: (err) => {
    // Error object structure:
    // err.error.error - Error message
    // err.error.details - Additional details (if available)
    console.error(err.error?.error || 'An error occurred');
  }
});
```

## Type Safety

Import types from `src/types/api.types.ts`:

```typescript
import { 
  User, 
  LoginResponse, 
  Product, 
  Customer,
  CreateCustomerRequest,
  UpdateCustomerStatusRequest,
  ProductFilters,
  CustomerFilters
} from './types/api.types';
```

## Running the Application

1. **Start the .NET API**:
   ```bash
   cd SAFuneralSuppliesAPI
   dotnet run
   ```
   API will run on `http://localhost:5000`

2. **Start the Angular app**:
   ```bash
   ng serve --proxy-config proxy.conf.json
   ```
   Frontend will run on `http://localhost:4200`

3. **Access the application**:
   - Frontend: http://localhost:4200
   - API: http://localhost:5000
   - Swagger: http://localhost:5000/swagger

## Notes

- JWT tokens are automatically stored in localStorage
- Tokens persist across browser sessions
- All admin operations require authentication with admin role
- Customer registration is disabled; customers must be created by admin
- Product images, features, and specifications are stored as JSON strings
