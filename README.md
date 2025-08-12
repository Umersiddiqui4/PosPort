# PosPort - Point of Sale System

A modern, feature-rich Point of Sale (POS) system built with Next.js, TypeScript, and React. Designed for businesses to manage sales, inventory, and customer relationships efficiently.

## 🚀 Features

- **Modern Tech Stack**: Next.js 15, React 19, TypeScript, Tailwind CSS
- **Authentication**: JWT-based authentication with Google OAuth support
- **Role-Based Access Control**: Multi-level user permissions
- **Real-time Updates**: Live data synchronization
- **Responsive Design**: Mobile-first approach with desktop optimization
- **Error Handling**: Comprehensive error boundaries and logging
- **Type Safety**: Full TypeScript coverage with Zod validation
- **Testing**: Jest, React Testing Library, and Playwright for E2E testing

## 📋 Prerequisites

- Node.js 18+ 
- npm, yarn, or pnpm
- Git

## 🛠️ Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd mobile-sidebar
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```
   
   Fill in the required environment variables:
   ```env
   # API Configuration
   NEXT_PUBLIC_API_BASE_URL=https://dev-api.posport.io/api/v1
   
   # Google OAuth (optional)
   GOOGLE_CLIENT_ID=your_google_client_id
   GOOGLE_CLIENT_SECRET=your_google_client_secret
   
   # App Configuration
   NEXT_PUBLIC_APP_VERSION=1.0.0
   ```

4. **Run the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🧪 Testing

### Unit and Integration Tests
```bash
# Run all tests
npm test

# Run tests in watch mode
npm run test:watch

# Run tests with coverage
npm run test:coverage

# Type checking
npm run test:type-check
```

### End-to-End Tests
```bash
# Run E2E tests
npm run test:e2e

# Run E2E tests with UI
npm run test:e2e:ui
```

## 🏗️ Project Structure

```
├── app/                    # Next.js App Router
│   ├── (dashboard)/        # Dashboard routes
│   ├── api/               # API routes
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # Reusable components
│   ├── ui/               # Base UI components
│   └── ...               # Feature components
├── hooks/                # Custom React hooks
├── lib/                  # Utilities and configurations
│   ├── Api/              # API functions
│   ├── slices/           # Redux slices
│   ├── store.ts          # Zustand store
│   ├── validations.ts    # Zod schemas
│   └── error-handling.ts # Error handling
├── types/                # TypeScript type definitions
├── utils/                # Utility functions
├── __tests__/            # Test files
└── public/               # Static assets
```

## 🔧 Development

### Code Quality

```bash
# Lint code
npm run lint

# Fix linting issues
npm run lint:fix

# Format code
npm run format

# Check formatting
npm run format:check
```

### Git Hooks

The project uses Husky for pre-commit hooks that automatically:
- Run ESLint
- Format code with Prettier
- Run type checking

### Available Scripts

| Script | Description |
|--------|-------------|
| `dev` | Start development server |
| `build` | Build for production |
| `start` | Start production server |
| `test` | Run tests |
| `test:watch` | Run tests in watch mode |
| `test:coverage` | Run tests with coverage |
| `test:e2e` | Run E2E tests |
| `lint` | Run ESLint |
| `lint:fix` | Fix ESLint issues |
| `format` | Format code with Prettier |
| `format:check` | Check code formatting |

## 🏛️ Architecture

### State Management
- **Zustand**: Global application state
- **React Query**: Server state management
- **React Hook Form**: Form state management

### Data Flow
1. **API Layer**: Axios with interceptors for authentication and error handling
2. **Validation**: Zod schemas for request/response validation
3. **State**: Zustand for client state, React Query for server state
4. **UI**: React components with TypeScript and Tailwind CSS

### Error Handling
- **Error Boundaries**: React error boundaries for component errors
- **Centralized Logging**: Error handling system with different loggers for dev/prod
- **User Feedback**: Toast notifications and error messages

## 🔐 Security

- **Authentication**: JWT tokens with refresh mechanism
- **Authorization**: Role-based access control
- **Input Validation**: Zod schemas for all inputs
- **CSRF Protection**: CSRF tokens in requests
- **Secure Headers**: Security headers in Next.js config

## 📱 Responsive Design

The application is built with a mobile-first approach:
- **Mobile**: Optimized for touch interactions
- **Tablet**: Adaptive layouts for medium screens
- **Desktop**: Full-featured desktop experience

## 🎨 Styling

- **Tailwind CSS**: Utility-first CSS framework
- **Dark Mode**: System preference detection
- **Custom Components**: Reusable UI components
- **Responsive**: Mobile-first responsive design

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Other Platforms
```bash
# Build the application
npm run build

# Start production server
npm start
```

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
- Ensure code passes linting and formatting
- Update documentation as needed

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔧 Troubleshooting

### CORS Errors
If you encounter CORS errors like:
```
Access to XMLHttpRequest has been blocked by CORS policy: 
Request header field x-request-id is not allowed by Access-Control-Allow-Headers
```

**Solution**: The application has been configured to avoid CORS issues by:
- Removing custom headers that aren't supported by the API server
- Disabling `withCredentials` to prevent cookie-related CORS issues
- Only including essential headers: `Authorization`, `Content-Type`, and `X-CSRF-Token` (if available)

### API Connection Issues
- Ensure your `NEXT_PUBLIC_API_BASE_URL` environment variable is correctly set
- Check that the API server is running and accessible
- Verify your authentication tokens are valid

### Build Errors
- Clear your `.next` folder: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`
- Check TypeScript errors: `npm run test:type-check`

## 🔄 Changelog

### Version 1.0.0
- Initial release
- Core POS functionality
- User authentication
- Role-based access control
- Product management
- Sales tracking

---

**Built with ❤️ by the PosPort Team**
