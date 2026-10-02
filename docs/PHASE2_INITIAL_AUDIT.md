# Phase 2: Initial Audit Report
## Rejoice Cakes & Sweets Backend Integration

**Date:** September 23, 2026  
**Status:** Audit Complete - Ready for Implementation Planning  
**Scope:** Frontend-only application → Full-stack with Node.js + Express + MongoDB backend

---

## 1. WHAT ACTUALLY EXISTS

### Frontend Application (Phase 1 - COMPLETE)
- ✅ **12 customer pages** fully built and functional
- ✅ **50+ React components** with Tailwind CSS styling
- ✅ **React Router v6** for client-side routing
- ✅ **TypeScript** with strict type safety
- ✅ **Context API** for state management (AuthContext, CartContext)
- ✅ **Mock data** with products, orders, reviews, gallery images
- ✅ **Responsive design** tested at mobile, tablet, desktop breakpoints
- ✅ **All pages working with UI/UX complete**

### Project Structure
```
src/
├── components/           # 50+ reusable components
├── contexts/            # AuthContext, CartContext (demo)
├── data/                # mockData.ts (NO backend)
├── layouts/             # CustomerLayout wrapper
├── pages/               # 12 customer pages (NO admin)
├── types/               # Complete TypeScript interfaces
├── App.tsx              # Routing setup
└── main.tsx             # React entry point
```

### Technology Stack (Frontend Only)
- React 18.2
- TypeScript 6.0
- Vite (build tool)
- Tailwind CSS 4.3
- React Router v6
- NO backend framework
- NO database
- NO authentication service
- NO API client setup

---

## 2. WHAT IS CURRENTLY MOCK FUNCTIONALITY

### Authentication (COMPLETELY MOCK)
**File:** `src/contexts/AuthContext.tsx`

**Current Implementation:**
```typescript
// CRITICAL SECURITY ISSUES:
const login = async (email: string, password: string) => {
  // Accepts ANY email/password combination
  const mockUser = {
    id: 'user-' + Math.random().toString(36).substr(2, 9),
    email,
    firstName: email.split('@')[0],
    // ...
  };
  setUser(mockUser);
  localStorage.setItem('user', JSON.stringify(mockUser));  // ❌ Client-side only
};
```

**Problems:**
1. ❌ No actual authentication validation
2. ❌ Random UUID generation (not secure)
3. ❌ User data stored in plain localStorage (visible to anyone)
4. ❌ No password hashing (password parameter ignored)
5. ❌ No secure HttpOnly cookies
6. ❌ No server-side session validation
7. ❌ No logout/session expiration
8. ❌ No role separation (all created as 'customer')
9. ❌ Can create/modify user claims on client side
10. ❌ No protection against CSRF

**Status:** MUST BE REPLACED with secure backend authentication

---

### Shopping Cart (LOCAL STORAGE ONLY)
**File:** `src/contexts/CartContext.tsx`

**Current Implementation:**
```typescript
// Load cart from localStorage
const cartKey = `cart_${user?.id || 'guest'}`;
const storedCart = localStorage.getItem(cartKey);
setItems(JSON.parse(storedCart));

// Calculate total client-side
const calculateTotal = (): number => {
  return items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);
};
```

**Problems:**
1. ❌ Cart persisted in browser localStorage (vulnerable to tampering)
2. ❌ Cart prices stored client-side (can be modified with DevTools)
3. ❌ No server validation of cart contents
4. ❌ No verification that products still exist
5. ❌ No verification that prices haven't changed
6. ❌ Total calculated on client (can be manipulated)
7. ❌ No cart synchronization if user logs out/in
8. ❌ No protection against cross-user cart access
9. ❌ Cart key based on client-provided userId (forgeable)

**Status:** MUST BE MOVED to secure backend with server-side validation

---

### Product Data (STATIC MOCK ONLY)
**File:** `src/data/mockData.ts`

**Current Implementation:**
- 10 hardcoded products in JSON
- No database
- Prices defined in mock data
- All products always "available"
- No inventory management
- No product images (using emoji placeholders)
- No dynamic pricing or seasonal adjustments

**Status:** MUST BE REPLACED with MongoDB collection + API endpoints

---

### Orders (COMPLETELY MOCK)
**File:** `src/pages/customer/OrderRequestPage.tsx`

**Current Implementation:**
```typescript
const handleSubmitOrder = async (e: React.FormEvent) => {
  // Simulates API call with 1000ms timeout
  await new Promise((resolve) => setTimeout(resolve, 1000));
  
  // Clears cart and navigates to success
  clearCart();
  navigate('/order-request/success');
};
```

**Problems:**
1. ❌ No actual order creation
2. ❌ No backend database storage
3. ❌ No order ID returned
4. ❌ No order status tracking
5. ❌ No confirmation to customer
6. ❌ No notification to baker
7. ❌ No order history
8. ❌ No order verification
9. ❌ No duplicate submission prevention
10. ❌ Cart cleared regardless of success/failure

**Status:** MUST IMPLEMENT full order request workflow with backend persistence

---

### My Orders Page (DISPLAYS MOCK DATA ONLY)
**File:** `src/pages/customer/MyOrdersPage.tsx`

**Current Implementation:**
- Displays 3 hardcoded sample orders from mockData
- No connection to actual user orders
- No real-time status updates
- No filtering by current user
- No security boundary

**Status:** MUST BE CONNECTED to backend API with user isolation

---

### Reviews System (READ-ONLY MOCK)
**File:** `src/pages/customer/ReviewsPage.tsx`

**Current Implementation:**
- 6 hardcoded reviews from mockData
- Write review form UI present but non-functional
- No backend submission
- No star rating submission
- No validation

**Status:** Review reading can stay; writing must connect to backend API

---

### Gallery (STATIC MOCK)
**File:** `src/pages/customer/GalleryPage.tsx`

**Current Implementation:**
- 7 hardcoded gallery items from mockData
- No database
- No image uploads
- Using emoji placeholders instead of real images

**Status:** Can use static mockData initially; needs Cloudinary integration later

---

### Admin Functionality (NOT IMPLEMENTED)
- ❌ NO admin dashboard
- ❌ NO admin routes
- ❌ NO admin pages
- ❌ NO order management for baker
- ❌ NO product management
- ❌ NO review moderation
- ❌ NO analytics

**Status:** MUST BE BUILT in Phase 2

---

## 3. WHAT IS INCOMPLETE OR MISSING

### Backend Layer
- ❌ **NO Express.js server**
- ❌ **NO MongoDB database**
- ❌ **NO Mongoose models**
- ❌ **NO API endpoints**
- ❌ **NO authentication service**
- ❌ **NO authorization middleware**
- ❌ **NO order management service**
- ❌ **NO image storage (Cloudinary)**
- ❌ **NO environment configuration**
- ❌ **NO deployment configuration (Render)**

### Security Infrastructure
- ❌ Password hashing (bcrypt)
- ❌ JWT token generation
- ❌ HttpOnly secure cookies
- ❌ CSRF protection
- ❌ Rate limiting
- ❌ CORS configuration
- ❌ Request validation (Zod)
- ❌ Security headers
- ❌ Input sanitization
- ❌ XSS protection (backend)
- ❌ IDOR/BOLA protection
- ❌ Dependency scanning

### Admin Functionality
- ❌ Admin authentication/role separation
- ❌ Admin dashboard
- ❌ Order review & confirmation interface
- ❌ Product management (CRUD)
- ❌ Gallery management
- ❌ Review moderation
- ❌ Customer management
- ❌ Analytics/reporting

### API Endpoints
- ❌ `/api/auth/register` - User registration
- ❌ `/api/auth/login` - User login
- ❌ `/api/auth/logout` - User logout
- ❌ `/api/products` - Product listing
- ❌ `/api/products/:id` - Single product
- ❌ `/api/cart` - Cart operations
- ❌ `/api/orders` - Order submission
- ❌ `/api/orders/:id` - Order detail
- ❌ `/api/orders/user/me` - My orders
- ❌ `/api/reviews` - Review operations
- ❌ `/api/admin/orders` - Order management
- ❌ `/api/admin/products` - Product management
- ❌ And many more...

### Frontend Integration
- ❌ API client setup
- ❌ Real authentication flow
- ❌ Token management
- ❌ Session handling
- ❌ Real cart persistence
- ❌ Real order submission
- ❌ Real product loading
- ❌ Error states
- ❌ Loading states
- ❌ Session expiration handling

---

## 4. WHAT MUST CHANGE

### Critical Security Changes

#### Authentication Flow
**Current (BROKEN):**
```
Client: generate random userId → store in localStorage → claim authority
```

**Required:**
```
Client: POST /api/auth/register or /api/auth/login
Server: validate credentials, hash password, generate session
Server: return HttpOnly cookie + JWT token
Client: automatically store token in memory, use in all requests
Server: verify token on every request, extract userId from validated token
Client: NEVER trust userId from anything but authenticated session
```

#### Cart Management
**Current (BROKEN):**
```
Client: calculate total → send to server (trusting client number)
```

**Required:**
```
Client: request server to add item to cart
Server: verify product exists, verify price, create cart entry
Server: calculate total server-side
Server: prevent tampering by validating on every operation
Server: return verified total to client for display
Client: never use cart total for actual order (request fresh from server)
```

#### Order Submission
**Current (BROKEN):**
```
Client: collect order details
Client: submit with client-side calculated total
Server: (doesn't exist)
```

**Required:**
```
Client: collect order details
Client: submit to POST /api/orders with items list
Server: authenticate user
Server: verify items exist and match current prices
Server: recalculate total server-side
Server: validate address and delivery options
Server: create Order document in MongoDB
Server: return order ID and status
Server: send notification to admin/baker
Client: display order confirmation with real order ID
```

#### Admin/Baker Access
**Current (NONEXISTENT):**
```
No admin functionality at all
```

**Required:**
```
Role-based access control:
- User role: 'customer'
  - Access: /customer/* routes, own orders only
  - Permissions: view products, add to cart, submit orders
  
- User role: 'admin'
  - Access: /admin/* routes, all orders
  - Permissions: view all orders, confirm orders, update status
  - Cannot access customer pages beyond viewing products
```

#### User Isolation
**Current (VULNERABLE):**
```
// Customer could modify userId in localStorage and see another user's cart
const cartKey = `cart_${user?.id || 'guest'}`;  // ❌ Trusts client-provided ID
```

**Required:**
```
Server:
- Extract userId from authenticated session/JWT token
- Fetch ONLY that user's cart from database
- Verify user can access requested resource before returning

Frontend:
- NEVER use userId from localStorage
- ONLY use user data from authenticated session
- Pass user data verification to server on every request
```

### Product Security Changes

**Current (BROKEN):**
```typescript
// Prices stored in mockData, client-side available
const product = PRODUCTS.find(p => p.id === productId);
const price = product.basePrice;  // ❌ Can be modified in DevTools
```

**Required:**
```
Server:
- Store all products in MongoDB
- Server-side endpoint to get product details including verified price
- Price is source of truth, never computed on client
- Verify price hasn't changed since cart item was added

Client:
- Display price from server response
- NEVER use cached price for calculation
- NEVER submit client-provided price to server
```

### Inventory & Availability

**Current:**
```
All products always available, unlimited quantity
```

**Required:**
```
MongoDB Product model:
- available: boolean
- limitedQuantity?: number
- preparationDays: number (affects delivery date calculation)

Validation:
- Reject order if product marked unavailable
- Reject order if quantity exceeds limit
- Reject delivery date if before minimum prep days
```

### Password Security

**Current (BROKEN):**
```
const login = async (email: string, password: string) => {
  // Password is never hashed, validated, or securely stored
  // Any email/password combo accepted
};
```

**Required:**
```
Backend:
- On registration: Hash password with bcrypt (salt rounds: 12)
- On login: Compare submitted password with hashed password using bcrypt
- Never store or log plain passwords
- Use constant-time comparison to prevent timing attacks

Frontend:
- Accept password input
- Send over HTTPS only
- Never log password
- Never store password
```

---

## 5. SECURITY VULNERABILITIES / WEAKNESSES

### CRITICAL (Must fix before production)

| Vulnerability | Impact | Current State | Required Fix |
|---|---|---|---|
| No authentication | Anyone can be anyone | BROKEN | Implement secure auth with hashing & tokens |
| Client-side price storage | Price manipulation attacks | BROKEN | Move all prices to server |
| Client-side total calculation | Order total manipulation | BROKEN | Server-side total calculation only |
| No password hashing | Credential compromise | BROKEN | Implement bcrypt hashing |
| No CSRF protection | Forged requests | MISSING | Implement CSRF tokens or SameSite cookies |
| No rate limiting | Brute force attacks | MISSING | Implement rate limiting middleware |
| No input validation | Injection attacks | WEAK | Implement Zod validation on all inputs |
| No XSS protection | Data exfiltration | MISSING | Implement content security headers |
| Credentials in localStorage | Credential theft | BROKEN | Use HttpOnly cookies instead |
| No CORS restrictions | Cross-origin attacks | MISSING | Implement proper CORS config |
| No IDOR protection | Access other users' data | CRITICAL | Verify user owns resource before returning |
| No session management | Session hijacking | MISSING | Implement secure session handling |
| Client-side user ID trust | Privilege escalation | BROKEN | Always extract userId from server session |

### HIGH (Must address)

| Issue | Impact | Status |
|---|---|---|
| No order deduplication | Duplicate orders possible | Missing server-side implementation |
| No inventory tracking | Overselling possible | Missing database layer |
| No delivery validation | Invalid delivery options accepted | Missing backend validation |
| No baker notification | Baker doesn't know about orders | Missing notification system |
| No admin interface | Baker can't manage orders | Not implemented |
| No image validation | Malicious files possible | Missing file validation |
| No request size limits | DoS via huge payloads | Missing middleware |
| No dependency scanning | Vulnerable packages | Missing security scanning |
| No error sanitization | Secrets leaked in errors | Needs careful error handling |
| No security headers | Various attacks possible | Missing Express middleware |

### MEDIUM (Address in Phase 2)

- No logging/audit trail
- No backup strategy
- No monitoring/alerting
- No API documentation
- No test coverage
- No database backup automation
- No rate limit persistence (Redis needed)

---

## 6. BACKEND ARCHITECTURE REQUIRED

### Layered Architecture

```
┌─────────────────────────────────┐
│      Express.js Server          │
│  (Routes, Middleware, Handlers) │
├─────────────────────────────────┤
│     Service Layer               │
│  (Business Logic, Auth, Order)  │
├─────────────────────────────────┤
│     Data Access Layer           │
│   (Mongoose Models)             │
├─────────────────────────────────┤
│      MongoDB Atlas              │
│   (Data Persistence)            │
└─────────────────────────────────┘
```

### Server Structure

```
backend/
├── src/
│   ├── config/              # Configuration & environment
│   │   ├── database.ts      # MongoDB connection
│   │   ├── env.ts           # Environment validation (Zod)
│   │   └── cors.ts          # CORS configuration
│   │
│   ├── middleware/          # Express middleware
│   │   ├── auth.ts          # JWT/session verification
│   │   ├── errorHandler.ts  # Global error handling
│   │   ├── validation.ts    # Zod validation middleware
│   │   ├── rateLimiter.ts   # Rate limiting
│   │   ├── security.ts      # Security headers
│   │   └── logging.ts       # Request/error logging
│   │
│   ├── models/              # Mongoose schemas
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   ├── Order.ts
│   │   ├── Review.ts
│   │   ├── GalleryImage.ts
│   │   └── OrderTimeline.ts
│   │
│   ├── services/            # Business logic
│   │   ├── auth.ts          # User auth service
│   │   ├── product.ts       # Product operations
│   │   ├── cart.ts          # Cart management
│   │   ├── order.ts         # Order processing
│   │   ├── review.ts        # Review operations
│   │   └── notification.ts  # Email/notifications
│   │
│   ├── controllers/         # Route handlers
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── reviews.ts
│   │   └── admin.ts
│   │
│   ├── routes/              # Route definitions
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   ├── orders.ts
│   │   ├── reviews.ts
│   │   └── admin.ts
│   │
│   ├── types/               # TypeScript types
│   │   └── index.ts
│   │
│   ├── utils/               # Utility functions
│   │   ├── validation.ts    # Zod schemas
│   │   ├── crypto.ts        # Password hashing, tokens
│   │   ├── email.ts         # Email formatting
│   │   └── errors.ts        # Custom error classes
│   │
│   ├── app.ts               # Express app setup
│   └── server.ts            # Entry point
│
├── tests/
│   ├── auth.test.ts
│   ├── products.test.ts
│   ├── cart.test.ts
│   ├── orders.test.ts
│   └── security.test.ts
│
├── .env.example             # Environment template
├── .env.local               # Local development (git-ignored)
├── package.json
├── tsconfig.json
└── jest.config.js
```

### Key Design Decisions

1. **Authentication:** JWT tokens in HttpOnly cookies
2. **Authorization:** Role-based access control (customer vs admin)
3. **Validation:** Zod for runtime schema validation
4. **Error Handling:** Typed error classes with safe error responses
5. **Logging:** Structured logging without exposing secrets
6. **Security:** Defense in depth (multiple layers)
7. **Testing:** Jest with comprehensive security tests

---

## 7. DATABASE MODELS REQUIRED

### User Model
```typescript
interface User {
  _id: ObjectId;
  email: string (unique, indexed);
  passwordHash: string (bcrypt);
  firstName: string;
  lastName: string;
  phone: string;
  address: string;
  city: string;
  postalCode: string;
  role: 'customer' | 'admin'; (indexed)
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  lastLogin?: Date;
}
```

### Product Model
```typescript
interface Product {
  _id: ObjectId;
  name: string;
  description: string;
  category: 'cakes' | 'biscuits' | 'sweets' | 'special';
  basePrice: number; (validated, >= 0)
  tags: string[];
  image?: string; (Cloudinary URL)
  imageGallery?: string[];
  preparationDays: number;
  available: boolean; (indexed)
  limitedQuantity?: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Cart Model
```typescript
interface Cart {
  _id: ObjectId;
  userId: ObjectId; (indexed, unique)
  items: [{
    productId: ObjectId;
    quantity: number;
    priceAtAddTime: number;
  }];
  createdAt: Date;
  updatedAt: Date;
}
```

### Order Model
```typescript
interface Order {
  _id: ObjectId;
  userId: ObjectId; (indexed)
  items: [{
    productId: ObjectId;
    productName: string;
    quantity: number;
    unitPriceAtOrder: number;
    specialRequests?: string;
  }];
  totalAmount: number; (verified by server)
  status: 'Requested' | 'Baker Reviewing' | 'Confirmed' | 'Preparing' | 'Ready' | 'Out for Delivery' | 'Completed';
  currentStep: number; (1-7)
  deliveryDate: Date;
  deliveryMode: 'delivery' | 'pickup';
  deliveryAddress?: string;
  deliveryFee: number; (0 or calculated)
  specialNotes?: string;
  bakerNotes?: string;
  bakerConfirmedAt?: Date;
  confirmedBy?: ObjectId; (admin user)
  idempotencyKey: string (unique per order); (prevents duplicates)
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
}
```

### Review Model
```typescript
interface Review {
  _id: ObjectId;
  orderId: ObjectId; (indexed)
  userId: ObjectId; (indexed)
  productId?: ObjectId;
  rating: number; (1-5, validated)
  title: string;
  content: string;
  bakerReply?: string;
  replyAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}
```

### GalleryImage Model
```typescript
interface GalleryImage {
  _id: ObjectId;
  url: string; (Cloudinary)
  title: string;
  category: 'cakes' | 'biscuits' | 'sweets' | 'special';
  tags: string[];
  uploadedBy: ObjectId; (admin)
  createdAt: Date;
}
```

### OrderTimeline Model (For tracking)
```typescript
interface OrderTimeline {
  _id: ObjectId;
  orderId: ObjectId; (indexed)
  step: number; (1-7)
  status: string;
  timestamp: Date;
  changedBy?: ObjectId;
  notes?: string;
}
```

---

## 8. API ENDPOINTS REQUIRED

### Authentication Endpoints
```
POST   /api/auth/register         Register new user
POST   /api/auth/login            Login user
POST   /api/auth/logout           Logout user
POST   /api/auth/refresh          Refresh JWT token
GET    /api/auth/me               Get current user info
```

### Product Endpoints
```
GET    /api/products              List all products (with filtering)
GET    /api/products/:id          Get single product
(Admin only):
POST   /api/admin/products        Create product
PATCH  /api/admin/products/:id    Update product
DELETE /api/admin/products/:id    Delete product
```

### Cart Endpoints
```
GET    /api/cart                  Get user's cart
POST   /api/cart/items            Add item to cart
PATCH  /api/cart/items/:productId Update item quantity
DELETE /api/cart/items/:productId Remove item from cart
DELETE /api/cart                  Clear entire cart
```

### Order Endpoints
```
POST   /api/orders                Submit order request
GET    /api/orders                Get user's orders
GET    /api/orders/:id            Get order details
(Admin only):
GET    /api/admin/orders          List all orders
PATCH  /api/admin/orders/:id      Update order status
GET    /api/admin/orders/:id      Get order details with timestamps
```

### Review Endpoints
```
GET    /api/reviews               List reviews (with filtering)
GET    /api/reviews/stats         Get rating statistics
POST   /api/reviews               Create review
(Admin only):
PATCH  /api/reviews/:id           Add baker reply
DELETE /api/reviews/:id           Delete review
```

### Admin Endpoints
```
GET    /api/admin/dashboard       Dashboard statistics
GET    /api/admin/customers       List customers
GET    /api/admin/analytics       Analytics/reports
```

---

## 9. CREDENTIALS & CONFIGURATION REQUIRED

### Environment Variables Needed

#### Database
- `MONGODB_URI` - MongoDB Atlas connection string
  - **Why:** Connect to MongoDB for data persistence
  - **Frontend-safe:** NO (contains credentials)
  - **Backend-only:** YES
  - **Obtain:** Create MongoDB Atlas cluster, copy connection string
  - **Format:** `mongodb+srv://username:password@cluster.mongodb.net/rejoice?retryWrites=true&w=majority`

#### Authentication
- `JWT_SECRET` - Secret key for signing JWT tokens
  - **Why:** Sign and verify JWT tokens for secure sessions
  - **Frontend-safe:** NO (must be secret)
  - **Backend-only:** YES
  - **Generate:** `openssl rand -base64 32` or use random string generator
  - **Length:** At least 32 characters

- `JWT_EXPIRE` - Token expiration time
  - **Why:** Limit session duration for security
  - **Frontend-safe:** YES (expiration time only, no secret)
  - **Example:** `7d` (7 days)

#### Image Storage
- `CLOUDINARY_CLOUD_NAME` - Cloudinary account cloud name
  - **Why:** Store product images, gallery images, receipts
  - **Frontend-safe:** YES (public identifier only)
  - **Obtain:** Create Cloudinary free account

- `CLOUDINARY_API_KEY` - Cloudinary API key
  - **Why:** Upload images to Cloudinary
  - **Frontend-safe:** NO
  - **Backend-only:** YES
  - **Obtain:** From Cloudinary dashboard

- `CLOUDINARY_API_SECRET` - Cloudinary API secret
  - **Why:** Sign upload requests
  - **Frontend-safe:** NO (must be secret)
  - **Backend-only:** YES
  - **Obtain:** From Cloudinary dashboard

#### Application
- `NODE_ENV` - Environment type
  - **Value:** `development` | `production` | `test`
  - **Frontend-safe:** YES

- `PORT` - Server port
  - **Value:** `3000` (development), `process.env.PORT` (production)
  - **Frontend-safe:** YES

- `FRONTEND_URL` - Frontend application URL
  - **Why:** CORS configuration, email links
  - **Frontend-safe:** YES
  - **Development:** `http://localhost:5173`
  - **Production:** `https://rejoice-cakes.vercel.app`

- `BACKEND_URL` - Backend API URL
  - **Why:** Frontend knows where to call API
  - **Frontend-safe:** YES
  - **Development:** `http://localhost:3000`
  - **Production:** `https://rejoice-cakes-backend.render.com`

#### Email (Optional but recommended)
- `SENDGRID_API_KEY` - SendGrid email service
  - **Why:** Send order confirmations, reset passwords, notifications
  - **Frontend-safe:** NO
  - **Backend-only:** YES
  - **Obtain:** SendGrid free tier account

- `EMAIL_FROM` - Sender email address
  - **Frontend-safe:** YES
  - **Value:** `orders@rejoice-cakes.com`

#### Security
- `BCRYPT_ROUNDS` - Password hashing rounds
  - **Frontend-safe:** YES
  - **Value:** `12` (security vs performance tradeoff)

- `RATE_LIMIT_WINDOW_MS` - Rate limiting window
  - **Frontend-safe:** YES
  - **Value:** `900000` (15 minutes)

- `RATE_LIMIT_MAX_REQUESTS` - Max requests per window
  - **Frontend-safe:** YES
  - **Value:** `100` (requests per IP per window)

### Configuration Files

#### Local Development (.env.local)
```
MONGODB_URI=mongodb+srv://user:password@cluster.mongodb.net/rejoice-dev
JWT_SECRET=<random-32-character-string>
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<your-cloud-name>
CLOUDINARY_API_KEY=<your-api-key>
CLOUDINARY_API_SECRET=<your-api-secret>
NODE_ENV=development
PORT=3000
FRONTEND_URL=http://localhost:5173
BACKEND_URL=http://localhost:3000
SENDGRID_API_KEY=<your-sendgrid-key>
EMAIL_FROM=noreply@rejoice-cakes-dev.local
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Production (Render Environment Variables)
Set in Render dashboard:
```
MONGODB_URI=<production-mongodb-atlas-uri>
JWT_SECRET=<different-secure-secret>
JWT_EXPIRE=7d
CLOUDINARY_CLOUD_NAME=<cloud-name>
CLOUDINARY_API_KEY=<api-key>
CLOUDINARY_API_SECRET=<api-secret>
NODE_ENV=production
FRONTEND_URL=https://rejoice-cakes.vercel.app
BACKEND_URL=https://rejoice-cakes-backend.render.com
SENDGRID_API_KEY=<sendgrid-key>
EMAIL_FROM=orders@rejoice-cakes.com
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

#### Frontend Environment (Vite)
**File:** `frontend/.env.local`
```
VITE_API_URL=http://localhost:3000
```

**File:** `frontend/.env.production`
```
VITE_API_URL=https://rejoice-cakes-backend.render.com
```

---

## 10. DECISIONS REQUIRED

### Decision 1: Image Storage
**Question:** Use Cloudinary for image storage?

**Options:**
1. **Cloudinary** (Recommended)
   - Free tier: 25 GB storage, unlimited uploads
   - Easy integration
   - Automatic image optimization
   - CDN delivery
   - Requires: API key + secret

2. **AWS S3**
   - More scalable
   - Pay-per-use
   - More complex setup

3. **Local file storage**
   - ❌ Not recommended for production
   - Difficult to scale
   - Backup challenges

**Recommendation:** Use Cloudinary (free tier sufficient for MVP)

---

### Decision 2: Email Service
**Question:** Implement email notifications?

**Options:**
1. **SendGrid** (Recommended for Phase 2)
   - Free tier: 100 emails/day
   - Easy API
   - Reliable delivery

2. **Mailgun**
   - Similar features
   - Similar pricing

3. **No email (Phase 3 later)**
   - Skip for now
   - Add later if needed

**Recommendation:** Use SendGrid; can be added incrementally

---

### Decision 3: Database Connection
**Question:** Use MongoDB Atlas or self-hosted?

**Options:**
1. **MongoDB Atlas** (Recommended)
   - Free tier: 512 MB storage
   - Managed by MongoDB
   - Automatic backups
   - Easy scaling

2. **Self-hosted MongoDB**
   - ❌ Not recommended
   - Backup responsibility yours
   - Harder to scale

**Recommendation:** MongoDB Atlas free tier for Phase 2

---

### Decision 4: Password Reset Flow
**Question:** Implement password reset?

**Options:**
1. **Yes** - Send reset link via email
   - Better security
   - Adds complexity
   - Requires email service

2. **No** - Admin resets manually
   - Simpler
   - Worse user experience
   - Less secure

**Recommendation:** Phase 2 includes password reset flow

---

### Decision 5: Admin Interface Technology
**Question:** Build admin UI in React or separate?

**Options:**
1. **React (same codebase)** (Recommended)
   - Add `/admin/*` routes
   - Reuse components
   - Simpler deployment
   - Role-based route protection

2. **Separate Vue/Angular app**
   - More separation
   - More work

**Recommendation:** Use React with admin routes in same codebase

---

### Decision 6: Testing Strategy
**Question:** How extensively test backend?

**Options:**
1. **Comprehensive** (Recommended)
   - Unit tests for services
   - Integration tests for API
   - Security tests (IDOR, auth, etc.)
   - ~70-80% code coverage

2. **Basic**
   - Happy-path tests only
   - Skip security tests

**Recommendation:** Comprehensive testing given security criticality

---

## SUMMARY

| Category | Status | Action |
|---|---|---|
| Frontend Phase 1 | ✅ COMPLETE | Keep; enhance with backend integration |
| Authentication | ❌ BROKEN | Implement JWT + HttpOnly cookies + bcrypt |
| Cart | ❌ INSECURE | Move to backend with server-side validation |
| Orders | ❌ MOCK | Implement full MongoDB persistence + API |
| Products | ❌ STATIC | Move to MongoDB collection + API |
| Admin | ❌ MISSING | Build admin routes + dashboard |
| Security | ❌ CRITICAL | Add rate limiting, CSRF, validation, etc. |
| Testing | ❌ MISSING | Add comprehensive test suite |
| Deployment | ⚠️ PARTIAL | Frontend ready; backend needs Render setup |

---

## NEXT STEPS

1. **Decisions:** You must make decisions 1-6 above
2. **Credentials:** Prepare MongoDB Atlas URI, JWT secret, Cloudinary keys
3. **Stage 2:** I will implement backend layer starting with:
   - Express server setup
   - MongoDB connection
   - User authentication with bcrypt + JWT
   - Zod validation
   - Security middleware

4. **Then:** API endpoints, services, tests in subsequent stages

---

**Audit Complete. Awaiting decisions and credentials.**
