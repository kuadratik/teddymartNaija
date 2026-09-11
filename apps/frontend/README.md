# TeddyMart Frontend

[![Next.js](https://img.shields.io/badge/Next.js-15.2.4-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5-blue)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4.4-38B2AC)](https://tailwindcss.com/)
[![Ant Design](https://img.shields.io/badge/Ant_Design-5.18.3-1890FF)](https://ant.design/)

A modern e-commerce marketplace frontend built with Next.js, featuring vendor stores, customer shopping, messaging, and advertisement management.

## 🚀 Features

- **Vendor Management**: Create and manage online stores with product listings
- **Customer Shopping**: Browse products, categories, and make purchases
- **Real-time Messaging**: Integrated chat system for vendor-customer communication
- **Advertisement Gallery**: Promote products and stores with banner ads
- **Responsive Design**: Mobile-first approach with Tailwind CSS
- **Authentication**: Secure login/signup with Google OAuth integration
- **Payment Integration**: Currency handling and transaction management
- **SEO Optimized**: Server-side rendering and sitemap generation
- **PWA Ready**: Progressive Web App capabilities

## 🛠️ Tech Stack

### Frontend Framework

- **Next.js 15** - React framework with SSR/SSG
- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript

### UI & Styling

- **Tailwind CSS** - Utility-first CSS framework
- **Ant Design** - Component library
- **Framer Motion** - Animation library
- **Swiper** - Carousel/slider components

### State Management

- **Redux Toolkit** - State management
- **React Redux** - Redux bindings for React

### Forms & Validation

- **Formik** - Form handling
- **Yup** - Schema validation

### Real-time Features

- **Pusher.js** - Real-time messaging
- **Laravel Echo** - WebSocket integration

### Utilities

- **Axios** - HTTP client
- **JWT Decode** - Token handling
- **React Toastify** - Notifications
- **React Share** - Social sharing
- **React to Print** - Document printing
- **HTML2Canvas & jsPDF** - PDF generation

## 📋 Prerequisites

Before running this project, make sure you have the following installed:

- **Node.js** (version 18 or higher)
- **npm**, **yarn**, or **pnpm**
- **Git**

## 🚀 Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/kuadratik/teddymart-frontend.git
   cd teddymart-frontend
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

   Configure the following variables in `.env.local`:

   - API endpoints
   - Authentication keys
   - Pusher credentials
   - Google OAuth settings

4. **Run the development server**

   ```bash
   npm run dev
   # or
   yarn dev
   # or
   pnpm dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3030](http://localhost:3030) to see the application.

## 📜 Available Scripts

- `npm run dev` - Start the development server on port 3030
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality checks
- `npm run postbuild` - Generate sitemap after build (via next-sitemap)

## 🏗️ Project Structure

```
teddymart-frontend/
├── components/          # Reusable UI components
│   ├── Auth/           # Authentication components
│   ├── Business/       # Business/vendor components
│   ├── Customer/       # Customer-facing components
│   ├── Layout/         # Layout components
│   ├── Messages/       # Chat/messaging components
│   ├── Store/          # Store management components
│   └── ...
├── pages/              # Next.js pages (App Router)
│   ├── api/            # API routes
│   ├── auth/           # Authentication pages
│   ├── store/          # Store pages
│   ├── messages/       # Messaging pages
│   └── ...
├── public/             # Static assets
│   ├── assets/         # Images, icons, banners
│   └── ...
├── redux/              # Redux store configuration
├── services/           # API services and utilities
├── styles/             # Global styles and Tailwind config
├── types/              # TypeScript type definitions
├── utils/              # Utility functions
└── hooks/              # Custom React hooks
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Development Guidelines

- Follow the existing code style and conventions
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed
- Ensure all linting checks pass

## 📄 License

This project is private and proprietary. All rights reserved.

## 📞 Support

For support or questions, please contact the development team or create an issue in the repository.

## 🔗 Links

- [Live Demo](https://myeki.market/)
- [API Documentation](https://staging-api.myeki.market/docs)
- [Design System](https://figma.com)

---

Built with ❤️ using Next.js and modern web technologies.
