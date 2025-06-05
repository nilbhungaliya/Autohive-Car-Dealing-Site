# 🚗 AutoHive - Premium Car Dealership Platform

AutoHive is a modern, AI-powered car dealership platform built with Next.js 15, featuring a sophisticated inventory management system, customer relationship management, and an elegant user interface with dark mode support.

## ✨ Features

### 🎯 Core Features
- **AI-Powered Search**: Intelligent car search and recommendations
- **Premium Car Inventory**: Comprehensive vehicle management system
- **Customer Management**: Advanced CRM with lifecycle tracking
- **Real-time Analytics**: Dashboard with sales metrics and KPIs
- **Multi-step Booking**: Streamlined car reservation process
- **Favorites System**: Save and manage preferred vehicles
- **Advanced Filtering**: Filter by make, model, price, year, and more

### 🎨 UI/UX Features
- **Modern Design**: Clean, responsive interface with Tailwind CSS
- **Dark Mode Support**: System-aware theme switching
- **Smooth Animations**: Framer Motion powered transitions
- **Interactive Components**: Shadcn/ui component library
- **Mobile Responsive**: Optimized for all device sizes
- **Loading States**: Skeleton loaders and smooth transitions

### 🔧 Technical Features
- **Type Safety**: Full TypeScript implementation
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js with 2FA support
- **File Upload**: AWS S3 integration with multipart uploads
- **Image Optimization**: Imgix integration for responsive images
- **Email System**: Resend integration for notifications
- **Rate Limiting**: Redis-based request throttling
- **SEO Optimized**: Meta tags and structured data

## 🛠️ Tech Stack

### Frontend
- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Components**: Shadcn/ui + Radix UI
- **Animations**: Framer Motion
- **State Management**: React Hook Form + Zod validation
- **Icons**: Lucide React

### Backend
- **Runtime**: Node.js
- **Database**: PostgreSQL
- **ORM**: Prisma
- **Authentication**: NextAuth.js
- **File Storage**: AWS S3
- **Email**: Resend
- **Cache**: Redis (Upstash)
- **AI**: OpenAI + Google Gemini

### Development Tools
- **Package Manager**: npm
- **Linting**: ESLint + Prettier
- **Type Checking**: TypeScript
- **Database Migrations**: Prisma
- **Environment**: T3 Env

## 📁 Project Structure

```
autohive/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (presentation)/     # Public pages
│   │   ├── admin/             # Admin dashboard
│   │   ├── api/               # API routes
│   │   ├── _actions/          # Server actions
│   │   └── schemas/           # Zod validation schemas
│   ├── components/            # React components
│   │   ├── admin/             # Admin-specific components
│   │   ├── auth/              # Authentication components
│   │   ├── classified/        # Vehicle listing components
│   │   ├── homePage/          # Homepage components
│   │   ├── inventory/         # Inventory management
│   │   ├── layouts/           # Layout components
│   │   ├── shared/            # Reusable components
│   │   └── ui/                # UI primitives
│   ├── config/                # Configuration files
│   ├── lib/                   # Utility functions
│   └── styles/                # Global styles
├── prisma/                    # Database schema & migrations
├── public/                    # Static assets
└── emails/                    # Email templates
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ 
- PostgreSQL database
- Redis instance
- AWS S3 bucket
- Required API keys (OpenAI, Gemini, Resend, etc.)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd autohive
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment Setup**
   Create a `.env.local` file with the following variables:
   ```env
   # Database
   DATABASE_URL="postgresql://username:password@localhost:5432/autohive"
   
   # Redis
   UPSTASH_REDIS_REST_URL="your-redis-url"
   UPSTASH_REDIS_REST_TOKEN="your-redis-token"
   
   # Authentication
   NEXTAUTH_SECRET="your-nextauth-secret"
   
   # AWS S3
   S3_BUCKET_ACCESS_KEY="your-s3-access-key"
   S3_BUCKET_SECRET_KEY="your-s3-secret-key"
   NEXT_PUBLIC_S3_BUCKET_REGION="your-s3-region"
   NEXT_PUBLIC_S3_BUCKET_NAME="your-s3-bucket"
   NEXT_PUBLIC_S3_URL="your-s3-url"
   
   # Image Processing
   NEXT_PUBLIC_IMGIX_URL="your-imgix-url"
   
   # Email
   RESEND_API_KEY="your-resend-api-key"
   FROM_EMAIL_ADDRESS="noreply@yourdomain.com"
   
   # AI Services
   OPENAI_API_KEY="your-openai-api-key"
   GEMINI_API_KEY="your-gemini-api-key"
   
   # App Configuration
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   NEXT_PUBLIC_TINYMCE_API_KEY="your-tinymce-api-key"
   
   # Security
   X_AUTH_TOKEN="your-auth-token"
   ```

4. **Database Setup**
   ```bash
   # Generate Prisma client
   npx prisma generate
   
   # Run migrations
   npx prisma migrate deploy
   
   # Seed the database
   npm run db:seed
   ```

5. **Start Development Server**
   ```bash
   npm run dev
   ```

   Visit [http://localhost:3000](http://localhost:3000) to see the application.

## 📊 Database Schema

### Core Models
- **Classified**: Vehicle listings with comprehensive details
- **Make/Model/ModelVariant**: Vehicle taxonomy
- **Customer**: Customer information and lifecycle tracking
- **Image**: Vehicle images with optimization metadata
- **User/Session**: Authentication and session management
- **PageView**: Analytics tracking

### Key Relationships
- Classifieds belong to Make and Model
- Customers can be associated with Classifieds
- Images are linked to Classifieds
- Customer lifecycle tracks status changes

## 🎨 UI Components

### Design System
- **Colors**: Consistent color palette with dark mode variants
- **Typography**: Poppins (headings) + Inter (body)
- **Spacing**: Tailwind's spacing scale
- **Shadows**: Layered shadow system
- **Animations**: Smooth transitions and micro-interactions

### Component Library
- **Forms**: React Hook Form with Zod validation
- **Tables**: Sortable, filterable data tables
- **Modals**: Accessible dialog components
- **Cards**: Flexible card layouts
- **Buttons**: Multiple variants and states
- **Inputs**: Form controls with validation states

## 🔐 Authentication & Security

### Authentication Flow
1. Email-based sign-in
2. OTP verification via email
3. Session management with NextAuth.js
4. Optional 2FA for admin accounts

### Security Features
- Rate limiting on API endpoints
- CSRF protection
- Input validation with Zod schemas
- Secure session handling
- Environment variable validation

## 📱 API Endpoints

### Public APIs
- `GET /api/taxonomy` - Vehicle makes and models
- `POST /api/favourites` - Manage user favorites

### Admin APIs
- Vehicle management (CRUD operations)
- Customer management
- Image upload and processing
- Analytics data

### Authentication APIs
- NextAuth.js endpoints for authentication flow

## 🎯 Key Features Deep Dive

### AI-Powered Search
- Integration with OpenAI and Google Gemini
- Intelligent vehicle recommendations
- Natural language search capabilities

### Image Management
- AWS S3 multipart uploads
- Imgix integration for responsive images
- Drag-and-drop image reordering
- Automatic image optimization

### Customer Journey
1. **Browse**: Explore vehicle inventory
2. **Filter**: Use advanced search filters
3. **Favorite**: Save preferred vehicles
4. **Reserve**: Multi-step booking process
5. **Contact**: Direct communication with dealers

### Admin Dashboard
- Real-time analytics and KPIs
- Vehicle inventory management
- Customer relationship tracking
- Sales performance metrics

## 🚀 Deployment

### Build Process
```bash
# Production build
npm run build

# Start production server
npm start
```

### Environment Considerations
- Ensure all environment variables are set
- Database migrations are applied
- S3 bucket permissions are configured
- Redis instance is accessible

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

### Development Guidelines
- Follow TypeScript best practices
- Use Prettier for code formatting
- Write meaningful commit messages
- Ensure all tests pass
- Update documentation as needed

## 📄 License

This project is proprietary software. All rights reserved.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Contact the development team
- Check the documentation

## 🔄 Version History

- **v0.1.0** - Initial release with core functionality
- Modern UI with dark mode support
- AI-powered search integration
- Comprehensive admin dashboard

---

**AutoHive** - Revolutionizing the car buying experience with modern technology and elegant design.