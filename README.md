# E-commerce Web Application

A full-stack e-commerce platform with customer shopping features and comprehensive admin management capabilities. Built with Laravel 10 (Backend) and Next.js 13+ (Frontend).

## 🚀 Features

### Customer Features
- **User Registration & Authentication** - Secure customer account creation with email validation
- **Product Browsing** - View all products with detailed information including ratings
- **Advanced Search** - Filter products by brand, price range, rating, and product name
- **Shopping Cart** - Add, update quantities, and remove items from cart
- **Profile Management** - Edit customer information (name, email, contact)

### Admin Features
- **Dashboard Analytics** - View total products and customers at a glance
- **Product Management** - Full CRUD operations with image upload
  - Brand management
  - Stock quantity tracking
  - Cost and sell price configuration
  - Product ratings (1-5 scale)
  - Product activation/deactivation
- **Customer Management** - Search, view, activate/deactivate customer accounts
- **User Management** - Create and manage admin/user accounts with custom privileges
- **Role-Based Access Control** - Enable/disable specific permissions per user
- **Profile Management** - Edit admin/user information

### UI/UX Features
- **Fully Responsive Design** - Mobile, tablet, and desktop optimized
- **Light/Dark Mode** - Theme toggle for user preference
- **Modern UI Design** - Clean and attractive interface
- **Form Validation** - Client and server-side validation

## 🛠️ Tech Stack

### Backend
- **Framework**: Laravel 10
- **Database**: MySQL
- **Authentication**: Laravel Sanctum
- **Image Storage**: Laravel Storage (local)
- **Validation**: Laravel Form Requests

### Frontend
- **Framework**: Next.js 13+ (App Router)
- **Language**: TypeScript
- **HTTP Client**: Axios
- **State Management**: Zustand
- **Styling**: Tailwind CSS
- **UI Components**: shadcn/ui

## 📋 Prerequisites

Before you begin, ensure you have installed:
- PHP >= 8.1
- Composer
- Node.js >= 18.x
- npm or yarn
- MySQL >= 8.0
- Git

## 🔧 Installation & Setup

### Backend Setup (Laravel)

1. **Navigate to backend directory**
```bash
cd backend
```

2. **Install PHP dependencies**
```bash
composer install
```

3. **Create environment file**
```bash
cp .env.example .env
```

4. **Configure database in `.env` file**
```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=ecommerce_db
DB_USERNAME=root
DB_PASSWORD=your_password
```

5. **Generate application key**
```bash
php artisan key:generate
```

6. **Create database**
```sql
CREATE DATABASE ecommerce_db;
```

7. **Run migrations**
```bash
php artisan migrate
```

8. **Seed database (optional - creates default admin)**
```bash
php artisan db:seed
```

9. **Create storage symlink for images**
```bash
php artisan storage:link
```

10. **Start Laravel development server**
```bash
php artisan serve
```
Backend will run on `http://localhost:8000`

### Frontend Setup (Next.js)

1. **Navigate to frontend directory**
```bash
cd frontend
```

2. **Install dependencies**
```bash
npm install
# or
yarn install
```

3. **Create environment file**
```bash
cp .env.example .env.local
```

4. **Configure API URL in `.env.local`**
```env
NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

5. **Start development server**
```bash
npm run dev
# or
yarn dev
```
Frontend will run on `http://localhost:3000`

## 🗂️ Project Structure

### Backend Structure
```
backend/
├── app/
│   ├── Http/
│   │   ├── Controllers/
│   │   │   ├── AuthController.php
│   │   │   ├── ProductController.php
│   │   │   ├── CustomerController.php
│   │   │   ├── UserController.php
│   │   │   ├── CartController.php
│   │   │   └── DashboardController.php
│   │   ├── Requests/
│   │   │   ├── RegisterRequest.php
│   │   │   ├── LoginRequest.php
│   │   │   └── ProductRequest.php
│   │   └── Middleware/
│   │       ├── CheckAdmin.php
│   │       └── CheckPrivilege.php
│   ├── Models/
│   │   ├── User.php
│   │   ├── Customer.php
│   │   ├── Product.php
│   │   ├── Cart.php
│   │   ├── CartItem.php
│   │   └── UserPrivilege.php
│   └── ...
├── database/
│   ├── migrations/
│   └── seeders/
├── routes/
│   └── api.php
└── storage/
    └── app/
        └── public/
            └── products/
```

### Frontend Structure
```
frontend/
├── src/
│   ├── app/
│   │   ├── (auth)/
│   │   │   ├── login/
│   │   │   └── register/
│   │   ├── (customer)/
│   │   │   ├── page.tsx
│   │   │   ├── products/
│   │   │   ├── cart/
│   │   │   └── profile/
│   │   ├── (admin)/
│   │   │   ├── dashboard/
│   │   │   ├── products/
│   │   │   ├── customers/
│   │   │   └── users/
│   │   └── layout.tsx
│   ├── components/
│   │   ├── ui/
│   │   ├── layout/
│   │   │   ├── Navbar.tsx
│   │   │   ├── Sidebar.tsx
│   │   │   └── ThemeToggle.tsx
│   │   ├── products/
│   │   │   ├── ProductCard.tsx
│   │   │   ├── ProductFilter.tsx
│   │   │   └── ProductForm.tsx
│   │   └── ...
│   ├── lib/
│   │   ├── api.ts
│   │   └── utils.ts
│   ├── store/
│   │   ├── authStore.ts
│   │   ├── cartStore.ts
│   │   └── themeStore.ts
│   └── types/
│       └── index.ts
└── public/
```

## 🔐 Default Credentials

After running the seeder, you can login with:

**Admin Account**
- Email: `admin@ecommerce.com`
- Password: `password`

**Test Customer Account**
- Email: `customer@test.com`
- Password: `password`

> **Note:** Change these credentials in production!

## 🎯 API Endpoints

### Authentication
- `POST /api/register` - Customer registration
- `POST /api/login` - Customer/Admin/User login
- `POST /api/logout` - Logout
- `GET /api/user` - Get authenticated user

### Products (Public)
- `GET /api/products` - List all active products
- `GET /api/products/{id}` - Get single product
- `GET /api/products/search` - Search products with filters

### Products (Admin)
- `POST /api/admin/products` - Create product
- `PUT /api/admin/products/{id}` - Update product
- `DELETE /api/admin/products/{id}` - Delete product
- `PATCH /api/admin/products/{id}/toggle` - Activate/Deactivate

### Cart
- `GET /api/cart` - Get user's cart
- `POST /api/cart` - Add item to cart
- `PUT /api/cart/{id}` - Update cart item quantity
- `DELETE /api/cart/{id}` - Remove item from cart

### Customers (Admin)
- `GET /api/admin/customers` - List all customers
- `GET /api/admin/customers/search` - Search customers
- `PATCH /api/admin/customers/{id}/toggle` - Activate/Deactivate
- `DELETE /api/admin/customers/{id}` - Delete customer

### Users (Admin)
- `GET /api/admin/users` - List all users
- `POST /api/admin/users` - Create user
- `PUT /api/admin/users/{id}` - Update user
- `DELETE /api/admin/users/{id}` - Delete user
- `PATCH /api/admin/users/{id}/privileges` - Update user privileges

### Dashboard (Admin)
- `GET /api/admin/dashboard/stats` - Get dashboard statistics

## 🔒 User Roles & Privileges

### Roles
1. **Customer** - Can browse products, manage cart, edit own profile
2. **User** - Can access admin panel with assigned privileges
3. **Admin** - Full system access and control

### Configurable User Privileges
- Product Add
- Product Update
- Product Delete
- Customer Management
- User Management

## 🎨 Features Implementation

### Search Filters
Products can be filtered by:
1. Product Name (text search)
2. Brand (dropdown/select)
3. Price Range (min-max slider)
4. Rating (star rating filter)

### Image Upload
- Single product image per product
- Stored in `storage/app/public/products`
- Accessible via `/storage/products/{filename}`
- Validated for type and size

### Theme Toggle
- Light/Dark mode switch
- Persists user preference in localStorage
- Applies to entire application

### Form Validation
- Client-side: Real-time validation in forms
- Server-side: Laravel Form Requests
- Error messages displayed appropriately

## 🧪 Testing the Application

1. **Register as Customer**: Navigate to `/register` and create an account
2. **Browse Products**: View products on home page
3. **Use Search**: Try filtering by brand, price, rating
4. **Add to Cart**: Add products and manage quantities
5. **Admin Login**: Use default admin credentials
6. **Manage Products**: Add, edit, delete products
7. **Manage Users**: Create users with specific privileges
8. **Test Privileges**: Login as user and verify permissions

## 📝 Database Schema Overview

### Tables
- `users` - Admin and User accounts
- `customers` - Customer accounts
- `products` - Product catalog
- `carts` - Customer shopping carts
- `cart_items` - Items in carts
- `user_privileges` - User permission settings

### Key Relationships
- User hasOne UserPrivilege
- Customer hasOne Cart
- Cart hasMany CartItems
- Product hasMany CartItems

## 🐛 Troubleshooting

### Backend Issues
- **Migration errors**: Ensure database exists and credentials are correct
- **Storage link error**: Run `php artisan storage:link` again
- **CORS issues**: Check `config/cors.php` settings

### Frontend Issues
- **API connection failed**: Verify `NEXT_PUBLIC_API_URL` in `.env.local`
- **Build errors**: Delete `node_modules` and `.next`, then reinstall
- **Type errors**: Ensure all TypeScript types are properly defined

### Common Issues
- **Images not displaying**: Check storage symlink exists
- **Unauthorized errors**: Ensure Sanctum is configured correctly
- **Session issues**: Clear browser cookies and restart servers

## 📚 Development Notes

- Laravel runs on port 8000
- Next.js runs on port 3000
- MySQL runs on port 3306
- All API routes are prefixed with `/api`
- Authentication uses Laravel Sanctum
- File uploads limited to 2MB
- Supported image formats: JPG, PNG, JPEG, GIF

## 🤝 Contributing

This is a skill assessment project. For improvements:
1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📄 License

This project is created for educational purposes.

## 👥 Authors

- Your Name - Initial work

## 🙏 Acknowledgments

- Laravel Documentation
- Next.js Documentation
- Tailwind CSS
- shadcn/ui Components

---

**Note**: This is a localhost development project. Do not deploy to production without proper security configurations, environment variable management, and SSL certificates.