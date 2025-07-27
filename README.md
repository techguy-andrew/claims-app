# Claims App - Digital Inspection Management System

A comprehensive digital claim and inspection management system built with Next.js 15, designed for service businesses working with insurance companies and corporate clients.

## 🎯 Project Overview

Professional-grade SaaS application featuring:
- **Responsive Navigation System** - Mobile-first design with hamburger menu animations
- **Claims Management** - Complete workflow for insurance claim processing
- **Digital Inspections** - Photo documentation and inspection reports
- **Modern UI/UX** - Clean, accessible interface matching industry standards

## 🚀 Current Status: Navigation System Complete

✅ **Latest Milestone (2025-07-27)**: Complete navigation overhaul with responsive design  
✅ **Mobile-first hamburger menu** with smooth animations  
✅ **Professional sidebar** with user profiles and navigation  
✅ **State management** with React Context + useReducer  
✅ **CSS Modules** styling architecture  
✅ **TypeScript** full type safety  

## 🛠 Tech Stack

- **Framework**: Next.js 15.4.3 (App Router)
- **Language**: TypeScript
- **Styling**: CSS Modules + Tailwind CSS
- **Database**: Prisma ORM
- **Icons**: Lucide React
- **State Management**: React Context + useReducer
- **Image Processing**: Cloudinary

## 📱 Navigation Features

### Mobile Experience
- Fixed hamburger menu trigger when sidebar closed
- Smooth hamburger ↔ X animation transitions  
- Overlay sidebar that slides in from left
- Touch-friendly interaction targets
- Auto-close on navigation item selection

### Desktop Experience
- Static sidebar layout with full branding
- Collapsible sidebar functionality
- Keyboard shortcuts (Cmd/Ctrl+B)
- User profile dropdown with settings

### Technical Implementation
- **NavigationProvider**: Centralized state management
- **Responsive Design**: Mobile-first with breakpoint utilities
- **Accessibility**: ARIA labels, keyboard navigation
- **Performance**: CSS Modules, efficient re-renders
- **Persistence**: LocalStorage for user preferences

## 🏗 Project Structure

```
src/
├── app/
│   ├── layout.tsx              # Root layout
│   ├── client-layout.tsx       # Client-side navigation wrapper
│   ├── page.tsx               # Dashboard page
│   └── navigation-demo/       # Navigation demonstration
├── components/
│   ├── navigation/            # Complete navigation system
│   │   ├── navigation-provider.tsx
│   │   ├── sidebar.tsx
│   │   ├── navbar.tsx
│   │   └── navigation.module.css
│   └── ui/                    # Reusable UI components
└── lib/                       # Utilities and configurations
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ (LTS recommended)
- npm or yarn package manager

### Installation
```bash
# Clone the repository
git clone <repository-url>
cd claims-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your configuration

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Available Scripts
```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
npm run db:push  # Push database schema changes
```

## 📖 Documentation

- **[Navigation System](./NAVIGATION.md)** - Comprehensive navigation documentation
- **[Development Log](./DEVELOPMENT-LOG.md)** - Detailed development history
- **[API Documentation](./docs/api.md)** - API endpoints and usage

## 🎨 Design System

### Navigation Components
- **Sidebar**: Main navigation with responsive layouts
- **Navbar**: Top navigation bar for desktop
- **TopBar**: Page-level navigation component
- **Responsive**: Mobile-first with smooth transitions

### Styling Architecture
- **CSS Modules**: Component-scoped styling
- **Responsive Design**: Mobile-first breakpoints
- **Animations**: Smooth transitions and hover states
- **Theme Support**: Light/dark mode ready

## 🔧 Development

### Code Standards
- TypeScript for all new code
- CSS Modules for component styling  
- React Context for state management
- Comprehensive error handling
- Accessibility-first development

### Git Workflow
- Feature branches for major changes
- Descriptive commit messages with conventional format
- Regular development checkpoints
- Documentation updates with each milestone

## 🎯 Next Development Phase

### Immediate Priorities
- [ ] User authentication system
- [ ] Claims workflow implementation  
- [ ] Inspection form components
- [ ] Photo upload integration
- [ ] Database relationships

### Future Enhancements
- [ ] Advanced reporting dashboard
- [ ] Mobile app companion
- [ ] API integrations
- [ ] Multi-tenant support
- [ ] Advanced analytics

## 📋 Current Features

✅ **Responsive Navigation** - Professional sidebar with mobile hamburger menu  
✅ **Modern UI Components** - Clean, accessible interface components  
✅ **TypeScript Integration** - Full type safety throughout application  
✅ **Database Schema** - Prisma ORM with comprehensive data models  
✅ **Image Upload** - Cloudinary integration for photo processing  

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

---

*Built with ❤️ using Next.js 15 and modern React patterns*