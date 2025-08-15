# 🏪 Restaurant Management System

A modern, full-featured restaurant management system built with Next.js 15, TypeScript, and Tailwind CSS. This application provides comprehensive tools for managing restaurant operations, including point-of-sale, inventory management, user management, and reporting.

## ✨ Features

### 🛍️ Point of Sale (POS)
- **Cashier Interface**: Modern, responsive POS system
- **Shopping Cart**: Real-time cart management
- **Payment Processing**: Multiple payment methods
- **Product Management**: Add, edit, and manage products
- **Category Management**: Organize products by categories

### 🏢 Business Management
- **Location Management**: Multi-location restaurant support
- **User Management**: Role-based access control
- **Company Management**: Multi-company support
- **Role Management**: Granular permissions system

### 📊 Analytics & Reporting
- **Transaction History**: Complete sales history
- **Sales Reports**: Comprehensive reporting tools
- **User Activity**: Track user actions and performance

### 🔐 Authentication & Security
- **Google OAuth**: Secure authentication
- **Role-Based Access**: Granular permissions
- **Protected Routes**: Client and server-side protection
- **JWT Tokens**: Secure token management

## 🛠️ Tech Stack

- **Framework**: Next.js 15.2.4 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **UI Components**: Radix UI + Custom components
- **State Management**: Zustand + React Query
- **Testing**: Jest + React Testing Library
- **E2E Testing**: Playwright
- **Build Tool**: Webpack (Next.js default)

## 📁 Project Structure

```
mobile-sidebar/
├── app/                    # Next.js App Router pages
│   ├── (dashboard)/       # Protected dashboard routes
│   ├── api/              # API routes
│   └── layout.tsx        # Root layout
├── components/           # Reusable UI components
│   ├── ui/              # Base UI components (Radix)
│   └── *.tsx           # Feature components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and API functions
├── pages/               # Legacy pages (mixed routing)
├── __tests__/          # Test files
└── e2e/                # End-to-end tests
```

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ 
- npm or pnpm
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-sidebar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Configure the following variables:
   ```env
   NEXT_PUBLIC_API_URL=https://dev-api.posport.io/api/v1
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Run Tests
```bash
# Run all tests
npm test

# Run tests with coverage
npm test -- --coverage

# Run tests in watch mode
npm test -- --watch
```

### Test Coverage
- **Current Coverage**: 3.73%
- **Target Coverage**: 70%
- **Test Types**: Unit tests, Component tests, Integration tests

## 🏗️ Build & Deployment

### Development Build
```bash
npm run build
npm start
```

### Production Deployment
The application is optimized for production deployment with:
- **Static Export**: Supported
- **Server-Side Rendering**: Enabled
- **API Routes**: Functional
- **Image Optimization**: Enabled
- **Bundle Compression**: Active

## 👥 User Roles

### POSPORT_ADMIN
- Full system access
- Company management
- User management
- System configuration

### COMPANY_OWNER
- Company-specific access
- Location management
- User management within company
- Financial reports

### LOCATION_MANAGER
- Location-specific access
- Staff management
- Inventory management
- Sales reports

### Cashier
- POS operations only
- Transaction processing
- Basic product management

## 🔧 Configuration

### Next.js Configuration
The application uses a custom Next.js configuration (`next.config.mjs`) with:
- Image optimization
- Package import optimization
- Compression enabled
- TypeScript build optimization

### Environment Variables
```env
# API Configuration
NEXT_PUBLIC_API_URL=https://dev-api.posport.io/api/v1

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret

# Database (if applicable)
DATABASE_URL=your_database_url

# JWT Secret
JWT_SECRET=your_jwt_secret
```

## 📚 API Documentation

### Authentication Endpoints
- `POST /api/auth/google/token` - Google OAuth token exchange
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout

### User Management
- `GET /api/users` - Get all users
- `POST /api/users` - Create user
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

### Location Management
- `GET /api/locations` - Get all locations
- `POST /api/locations` - Create location
- `PUT /api/locations/:id` - Update location
- `DELETE /api/locations/:id` - Delete location

### Product Management
- `GET /api/products` - Get all products
- `POST /api/products` - Create product
- `PUT /api/products/:id` - Update product
- `DELETE /api/products/:id` - Delete product

## 🐛 Troubleshooting

### Common Issues

1. **Build Errors**
   ```bash
   # Clear Next.js cache
   rm -rf .next
   npm run build
   ```

2. **TypeScript Errors**
   ```bash
   # Check TypeScript errors
   npx tsc --noEmit
   ```

3. **Test Failures**
   ```bash
   # Clear Jest cache
   npm test -- --clearCache
   ```

### Performance Issues
- Check bundle size with `npm run build`
- Monitor network requests in browser dev tools
- Verify image optimization is working

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines
- Follow TypeScript best practices
- Write tests for new features
- Use conventional commit messages
- Ensure code passes linting

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 📈 Performance Metrics

- **Build Time**: ~30 seconds
- **Bundle Size**: ~102-225 KB per route
- **First Load JS**: ~102 KB shared
- **Lighthouse Score**: 90+ (Performance, Accessibility, Best Practices, SEO)

## 🔄 Version History

### v1.0.0 (Current)
- Initial release
- Complete restaurant management system
- Multi-location support
- Role-based access control
- Modern UI/UX

---

**Built with ❤️ using Next.js, TypeScript, and Tailwind CSS**
