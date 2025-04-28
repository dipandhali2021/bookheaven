# BookHeaven

A modern, full-stack online bookstore application with rich features for book lovers. Built with Next.js, React, TypeScript, and PostgreSQL, BookHeaven offers comprehensive book management, personalized bookshelves, secure user authentication, e-commerce capabilities, and media management.

<!--toc:start-->

- [BookHeaven](#bookheaven)
  - [Overview](#overview)
  - [System Architecture](#system-architecture)
  - [Key Features](#key-features)
  - [Tech Stack](#tech-stack)
    - [Frontend](#frontend)
    - [Backend](#backend)
    - [Database](#database)
    - [Authentication & Payments](#authentication--payments)
    - [Media & Monitoring](#media--monitoring)
  - [Data Models](#data-models)
  - [API Endpoints](#api-endpoints)
  - [Workflows](#workflows)
    - [User Authentication Flow](#user-authentication-flow)
    - [Book Purchase Flow](#book-purchase-flow)
    - [Book Review Flow](#book-review-flow)
  - [Development](#development)
    - [Prerequisites](#prerequisites)
    - [Environment Setup](#environment-setup)
    - [Development Workflow](#development-workflow)
  - [Deployment](#deployment)
  - [Contributing](#contributing)
  - [License](#license)

## Overview

BookHeaven is a comprehensive platform for book enthusiasts to discover, review, and purchase books. The application provides a rich user experience with personalized bookshelves, social features, and secure e-commerce capabilities. Built with modern web technologies, BookHeaven offers a responsive, accessible, and fast user interface for readers of all kinds.

## System Architecture

The overall architecture of BookHeaven follows a modern web application structure with clear separation of concerns:

```mermaid
graph TD
    Client[Client Browser] -->|HTTP/HTTPS| NextJS[Next.js App]
    NextJS -->|Server Components| ReactUI[React UI Components]
    NextJS -->|API Routes| ServerLogic[Server-side Logic]
    ServerLogic -->|ORM| DrizzleORM[Drizzle ORM]
    DrizzleORM -->|SQL| PostgreSQL[PostgreSQL Database]
    ServerLogic -->|Authentication| Clerk[Clerk Auth]
    ServerLogic -->|Payment Processing| Stripe[Stripe API]
    ServerLogic -->|File Storage| UploadThing[UploadThing]
    ServerLogic -->|Error Tracking| Sentry[Sentry]
    
    subgraph "Frontend Layer"
        ReactUI
        TailwindCSS[TailwindCSS]
        RadixUI[Radix UI]
        TanstackQuery[Tanstack Query]
    end
    
    subgraph "Backend Layer"
        ServerLogic
        DrizzleORM
    end
    
    subgraph "Data Layer"
        PostgreSQL
    end
    
    subgraph "External Services"
        Clerk
        Stripe
        UploadThing
        Sentry
    end
```

## Key Features

- 📚 **Comprehensive Book Management**

  - Browse and search books by title, author, genre, or ISBN
  - Advanced filtering and sorting capabilities
  - Detailed book information including multiple editions, formats, and availability
  - Book ratings and reviews.
  - Author profiles with bibliography and following capabilities
  - onSale Product Listing

- 📑 **Personalized Bookshelves**

  - Create unlimited custom bookshelves (e.g., "Want to Read", "Currently Reading", "Favorites")
  - Track reading progress and reading history
  - Share bookshelves with other users
  - Organize books by categories, tags, or custom attributes

- 👥 **User System**

  - Secure authentication with Clerk (supporting Google)
  - Comprehensive user profiles management
  - Social features: follow authors
  - Like, share, and comment on books, reviews, or bookshelves
  - Tiered admin dashboard for content management and moderation

- 💳 **E-commerce Capabilities**

  - Secure checkout process using Stripe integration
  - Multiple payment methods support 
  - Shopping cart persistence across sessions
  - Order management and tracking
  - Asynchronous payment processing via webhooks
  - Stock management for book editions
  - Wish list functionality and favourite book
  - Special offers and discounts system
  - light dark mode

- 🖼️ **Media Management**
  - Image uploads for books, authors, and more
  - Responsive image optimization
  - Secure cloud storage with UploadThing
  - Support for various media formats (images, cover art)
  - Content delivery optimization

## Tech Stack

BookHeaven leverages a modern technology stack to provide a robust, scalable, and maintainable application:

```mermaid
mindmap
  root((BookHeaven Tech Stack))
    Frontend
      Next.js 15
        App Router
        Server Components
        Client Components
      React 19
        Hooks
        Context API
      TypeScript
      TailwindCSS 4
      Radix UI
      Tanstack Query
        Data Fetching
        Caching
        Optimistic Updates
      React Hook Form
        Zod Validation
    Backend
      Next.js API Routes
        Serverless Functions
      Drizzle ORM
        Type-safe Queries
        Schema Definitions
      Zod
        Schema Validation
        Type Inference
    Database
      PostgreSQL
        Relational Model
      Drizzle Migrations
        Version Control
        Schema Updates
    Authentication
      Clerk
        Multi-provider Auth
        User Management
        Authorization
    Payments
      Stripe
        Payment Processing
        Checkout Integration
        Webhook Handling
  
```

### Frontend

- **Next.js 15**: React framework with App Router for server-side rendering, static site generation, and API routes
  - Server Components for improved performance and reduced client-side JavaScript
  - Streaming and Suspense for enhanced loading states
  - View Transitions API for smooth page transitions
  
- **React 19**: UI library with the latest features
  - Concurrent Mode for improved responsiveness
  - Hooks for state management and side effects
  - Error boundaries for graceful error handling
  
- **TypeScript**: Strongly-typed JavaScript for enhanced developer experience and code quality
  - Strict type checking
  - Advanced type inference
  - Interface and type definitions
  
- **TailwindCSS 4**: Utility-first CSS framework for rapid UI development
  - Custom theme configuration
  - Responsive design utilities
  - Dark mode support
  
- **Radix UI**: Unstyled, accessible UI components
  - ARIA compliant components
  - Keyboard navigation support
  - Flexible styling options
  
- **Tanstack Query**: Data fetching, caching, and state management
  - Automatic request deduplication
  - Background data refetching
  - Optimistic updates
  - Server state synchronization
  
- **React Hook Form**: Form validation and handling
  - Performance-focused form library
  - Zod schema validation
  - Error handling and field validation

### Backend

- **Next.js API Routes**: Serverless API endpoints
  - Request handling and response formatting
  - Middleware support
  - Route handlers for different HTTP methods
  
- **Drizzle ORM**: Type-safe SQL query builder
  - SQL-like query syntax
  - TypeScript integration
  - Performance optimized queries
  
- **Zod**: Schema validation and type generation
  - Runtime validation
  - TypeScript type inference
  - Custom validators

### Database

- **PostgreSQL**: Powerful, open-source relational database
  - Robust data integrity
  - Advanced indexing
  - Full-text search capabilities
  - JSON support
  
- **Drizzle Migrations**: Database schema management
  - Version-controlled schema changes
  - Type-safe schema definitions
  - Rollback capabilities

### Authentication & Payments

- **Clerk**: User authentication and management
  - Multiple authentication providers
  - User profile management
  - Session handling
  - Role-based access control
  
- **Stripe**: Payment processing
  - Secure checkout experience
  - Multiple payment methods
  - Subscription management
  - Webhook integration for asynchronous events

### Media
  
- **UploadThing**: File uploads and secure storage
  - Secure file uploads
  - Image optimization
  - Content delivery

## Data Models

BookHeaven uses a relational database model to organize and store data effectively:

```mermaid
erDiagram
    BOOK_WORKS ||--o{ BOOK_EDITIONS : "has editions"
    BOOK_WORKS ||--o{ QUOTES : "has quotes"
    BOOK_WORKS }|--|| WORK_TO_AUTHORS : "written by"
    WORK_TO_AUTHORS }|--|| AUTHORS : "is author"
    BOOK_WORKS }o--o{ TAGS : "categorized by"
    BOOK_EDITIONS ||--o{ BOOK_IMAGES : "has images"
    BOOK_EDITIONS ||--o{ REVIEWS : "has reviews"
    BOOK_EDITIONS ||--o{ RATINGS : "has ratings"
    BOOK_EDITIONS ||--o{ BOOK_LIKES : "liked by"
    BOOK_EDITIONS ||--o{ SHELF_ITEMS : "shelved in"
    BOOK_EDITIONS ||--o{ ORDER_ITEMS : "purchased in"
    
    AUTHORS ||--o{ AUTHOR_IMAGES : "has images"
    AUTHORS ||--o{ AUTHOR_FOLLOWERS : "followed by"
    
    USERS ||--o{ REVIEWS : "writes"
    USERS ||--o{ RATINGS : "rates"
    USERS ||--o{ SHELVES : "owns"
    USERS ||--o{ ORDERS : "places"
    USERS ||--o{ BOOK_LIKES : "likes books"
    USERS ||--o{ SHELF_LIKES : "likes shelves"
    USERS ||--o{ REVIEW_LIKES : "likes reviews"
    USERS ||--o{ QUOTE_LIKES : "likes quotes"
    USERS ||--o{ AUTHOR_FOLLOWERS : "follows"
    USERS ||--o{ USER_FOLLOWERS : "follows/followed by"
    
    SHELVES ||--o{ SHELF_ITEMS : "contains"
    SHELVES ||--o{ SHELF_LIKES : "liked by"
    
    ORDERS ||--o{ ORDER_ITEMS : "contains"
    
    QUOTES ||--o{ QUOTE_LIKES : "liked by"
    REVIEWS ||--o{ REVIEW_LIKES : "liked by"
```

## API Endpoints

BookHeaven provides a comprehensive set of API endpoints for different functionalities:

### Books and Authors
- `/api/books` - Book management endpoints
- `/api/authors` - Author management endpoints
- `/api/tags` - Tag management endpoints

### User Features
- `/api/bookshelves` - Bookshelf management
- `/api/reviews` - Review management
- `/api/ratings` - Rating management
- `/api/quotes` - Quote management

### E-commerce
- `/api/orders` - Order management
- `/api/payments` - Payment processing
- `/api/webhook/stripe` - Stripe webhook handler

### User Management
- `/api/users` - User profile management
- `/api/followers` - User and author following

### Media
- `/api/uploadthing` - File upload endpoints

## Workflows

### User Authentication Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as Client Browser
    participant Next as Next.js App
    participant Clerk as Clerk Auth
    
    User->>Client: Initiates login
    Client->>Next: Redirects to login page
    Next->>Clerk: Requests authentication options
    Clerk->>Next: Returns authentication providers
    Next->>Client: Displays login options
    User->>Client: Selects login method
    Client->>Clerk: Submits credentials
    Clerk->>Clerk: Validates credentials
    Clerk->>Next: Returns authentication token
    Next->>Client: Sets auth cookie/token
    Client->>Next: Requests protected resource
    Next->>Clerk: Validates token
    Clerk->>Next: Confirms user identity
    Next->>Client: Returns protected resource
```

### Book Purchase Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as Client Browser
    participant Next as Next.js App
    participant Stripe as Stripe API
    participant DB as Database
    
    User->>Client: Adds book to cart
    Client->>Next: Sends add to cart request
    Next->>DB: Updates shopping cart
    DB->>Next: Confirms update
    Next->>Client: Updates UI
    
    User->>Client: Proceeds to checkout
    Client->>Next: Requests checkout session
    Next->>Stripe: Creates checkout session
    Stripe->>Next: Returns session ID
    Next->>Client: Redirects to Stripe checkout
    
    User->>Stripe: Completes payment
    Stripe->>Next: Sends webhook event
    Next->>DB: Creates order
    Next->>DB: Updates inventory
    DB->>Next: Confirms updates
    Next->>Client: Displays order confirmation
```

### Book Review Flow

```mermaid
sequenceDiagram
    actor User
    participant Client as Client Browser
    participant Next as Next.js App
    participant DB as Database
    
    User->>Client: Writes review
    Client->>Next: Submits review
    Next->>DB: Validates user purchased book
    DB->>Next: Returns purchase status
    
    alt Book purchased
        Next->>DB: Marks as verified purchase
    else Book not purchased
        Next->>DB: Marks as standard review
    end
    
    Next->>DB: Saves review
    DB->>Next: Confirms save
    Next->>Client: Updates UI with new review
    Next->>DB: Updates book rating average
    DB->>Next: Confirms update
    Next->>Client: Updates book rating display
```

## Development

### Prerequisites

- **Node.js 18+** - JavaScript runtime
- **pnpm** - Package manager
- **PostgreSQL** - Database server
- **Accounts for services:**
  - Clerk (authentication)
  - Stripe (payments)
  - UploadThing (file storage)
  - Sentry (optional, for error tracking)

### Environment Setup

1. **Clone the repository:**

```bash
git clone https://github.com/yourusername/bookheaven.git
cd bookheaven
```

2. **Install dependencies:**

```bash
pnpm install
```

3. **Set up the database:**

```bash
# Start the development database (PostgreSQL in Docker)
pnpm just dev-db

# Run migrations to set up schema
pnpm drizzle-kit push:pg

# Seed the database with initial data
pnpm seed
```

4. **Configure environment variables:**

```bash
cp .env.example .env
```

Edit the `.env` file with your service credentials:

```
# Database
DATABASE_URL="postgres://postgres:postgres@localhost:5432/bookheaven"

# Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_clerk_webhook_secret

# Payments
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# File Storage
UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id

# Monitoring
NEXT_PUBLIC_SENTRY_DSN=your_sentry_dsn
SENTRY_AUTH_TOKEN=your_sentry_auth_token
```

5. **Start the development server:**

```bash
pnpm dev
```

The application will be available at [http://localhost:3000](http://localhost:3000)

### Development Workflow

```mermaid
graph TD
    Start([Start Development]) --> InstallDeps[Install Dependencies]
    InstallDeps --> SetupEnv[Set Up Environment]
    SetupEnv --> RunDB[Run Database]
    RunDB --> DevServer[Start Dev Server]
    DevServer --> Code[Write Code]
    Code --> Test[Run Tests]
    Test -->|Tests Pass| Commit[Commit Changes]
    Test -->|Tests Fail| Fix[Fix Issues]
    Fix --> Test
    Commit --> Push[Push to Repository]
    Push --> PR[Create Pull Request]
    PR --> Review[Code Review]
    Review -->|Approved| Merge[Merge to Main]
    Review -->|Changes Requested| Fix
    Merge --> Deploy[Deploy]
```

## Deployment

BookHeaven can be deployed to various platforms:

1. **Vercel (Recommended)**
   - Connect your GitHub repository
   - Vercel will automatically detect Next.js and set up the build
   - Configure environment variables in the Vercel dashboard

2. **Docker Deployment**
   - Build the Docker image: `docker build -t bookheaven .`
   - Run the container: `docker run -p 3000:3000 bookheaven`

3. **Self-hosted**
   - Build the application: `pnpm build`
   - Start the server: `pnpm start`

## Contributing

We welcome contributions to BookHeaven! Please follow these steps:

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add some amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

Please make sure your code follows our coding standards and includes appropriate tests.

## License

BookHeaven is licensed under the BSD 3-Clause License - see the [LICENSE](LICENSE) file for details.
