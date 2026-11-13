# Practo for Animals
> **Premium Animal Healthcare Discovery Platform**  
> Modern, production-quality MERN Stack MVP connecting pet owners with trusted veterinary clinics, animal hospitals, boarding facilities, diagnostic labs, animal ambulances, and animal NGOs across India.

---

## 🐾 Overview

**Practo for Animals** is a discovery platform tailored specifically for pet parents and animal caregivers. Built with a healthcare-inspired visual identity, the platform delivers location-based clinic discovery, faceted category searches, direct contact actions, practice registration, and community-driven data accuracy.

---

## 🚀 Key Features

### 1. Healthcare Discovery Homepage
- **Responsive Sticky Navigation**: Quick links, brand logo with paw motif, and slide-out mobile drawer with Framer Motion.
- **Hero & Targeted Search**: Dual-parameter search interface by location (city, area, PIN code) and service category.
- **Trust Indicators**: Verified Providers, Easy Discovery, Multiple Care Services, and Healthcare Access value propositions.
- **6 Dedicated Service Portals**:
  1. *Veterinary Clinics* — Consultations, checkups, vaccinations.
  2. *Animal Hospitals* — Critical ICU facilities, advanced surgeries, 24/7 emergency.
  3. *Pet Boarding* — Climate-controlled suites, daycare, behavioral supervision.
  4. *Diagnostics* — Digital X-ray, ultrasonography, hematology, and pathology.
  5. *Animal Ambulance* — Emergency rescue transit equipped with oxygen concentrators.
  6. *Animal NGOs* — Non-profit sterilization drives, rescue missions, and adoption.
- **Featured Providers Section**: Real-time top-rated facilities with direct *"Call Now"* and *"View Details"* CTAs.
- **Community Corrections**: In-app feedback system for reporting outdated operating hours, phone numbers, or addresses.
- **Provider Registration CTA**: Dedicated onboarding portal for healthcare practitioners.

### 2. Search & Filter Directory (`/search`)
- **Faceted Filters**:
  - Service Category radio group
  - City / Location text search
  - PIN Code lookup
  - Minimum Rating threshold (4.5+, 4.0+, 3.5+)
  - *"Open Now Only"* real-time operating availability filter
- **Sorting Options**: Highest Rated, Name (A–Z), and Relevance.
- **Dynamic URL Synchronization**: Filter parameters sync bidirectionally to browser query parameters.
- **Responsive Drawer**: Touch-friendly filter drawer for mobile devices.
- **Graceful States**: Animated loading skeletons, empty state illustration, and reset controls.

### 3. Provider Profile Details (`/provider/:slug`)
- Facility banner and cover branding.
- Address with one-click **Get Directions** (Google Maps integration).
- Real-time **Call Now** action.
- Categorized service badges.
- Verified status badge & operating hours schedule.

### 5. Business Listing + Correction Management Workflows
- **Business Submission to Public Directory**:
  - Clinics register via `/list-business` with instant unique submission ID and confirmation screen.
  - Submissions enter MongoDB with `pending` status and remain hidden from public search.
  - Administrators review applications inside the protected Admin Dashboard (`/admin`).
  - Upon approval, a verified `Provider` record is published and immediately discoverable in search, filters, and detail views. Duplicate records are prevented.
- **Community Corrections to Provider Updates**:
  - Users report outdated data or closures via the homepage correction form with unique reference IDs.
  - Admins review reports and apply targeted field updates (`phone`, `address`, `website`, etc.) while strictly preserving existing ratings and review counts.
  - Permanently closed facilities are marked inactive (`isActive: false`) and cleanly removed from public discovery without destroying audit records.
- **Protected Admin Portal (`/admin`)**:
  - Server-side JWT authentication (`/admin/login`).
  - Live statistics: Total Submissions, Pending/Approved/Rejected Businesses, Pending/Resolved Corrections, and Published Providers.
  - Filterable, searchable, and paginated tables with modal detail views and confirmation dialogs.

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM v7, Lucide React, Framer Motion, Axios, React Hook Form, React Hot Toast |
| **Backend** | Node.js, Express.js (v5), Mongoose, MongoDB Atlas / Local MongoDB, Express Validator, Helmet, CORS, Dotenv |
| **Testing** | Node native fetch test suite, build pipeline verification |

---

## 📁 Project Structure

```text
p1Animal/
├── backend/
│   ├── config/
│   │   └── db.js                       # Mongoose MongoDB connection
│   ├── controllers/
│   │   ├── providerController.js       # Search, filter, featured, slug lookup
│   │   ├── businessListingController.js# Registration & admin listing
│   │   └── correctionController.js     # User correction reports
│   ├── middleware/
│   │   ├── asyncHandler.js             # Async error wrapper
│   │   └── errorHandler.js             # Centralized JSON error response
│   ├── models/
│   │   ├── Provider.js                 # Provider schema with slug pre-save hook
│   │   ├── BusinessListing.js          # Partner application schema
│   │   └── Correction.js               # Information update reports schema
│   ├── routes/
│   │   ├── providerRoutes.js           # /api/providers routes
│   │   ├── businessListingRoutes.js    # /api/business-listings routes
│   │   └── correctionRoutes.js         # /api/corrections routes
│   ├── seed.js                         # 10 realistic demo records across all categories
│   ├── server.js                       # Express app bootstrap & security middleware
│   ├── .env.example                    # Backend environment template
│   └── package.json
├── frontend/
│   ├── public/
│   │   ├── favicon.svg
│   │   └── icons.svg
│   ├── src/
│   │   ├── components/
│   │   │   ├── home/                   # HeroSection, TrustIndicators, ServicesSection,
│   │   │   │                           # FeaturedProviders, WhyChooseUs, ListBusinessCTA,
│   │   │   │                           # SubmitCorrection
│   │   │   ├── layout/                 # Navbar, Footer
│   │   │   └── ui/                     # ProviderCard, ServiceCard, LoadingSkeleton, EmptyState
│   │   ├── layouts/
│   │   │   └── MainLayout.jsx          # Shell with Navbar, Footer & Toaster
│   │   ├── pages/
│   │   │   ├── HomePage.jsx            # Full landing page
│   │   │   ├── SearchPage.jsx          # Faceted search & filter directory
│   │   │   ├── ProviderDetailPage.jsx  # Individual provider profile
│   │   │   └── ListBusinessPage.jsx    # Partner registration portal
│   │   ├── services/
│   │   │   └── api.js                  # Axios client with base URL configuration
│   │   ├── App.jsx                     # Route mappings
│   │   ├── main.jsx                    # React entrypoint
│   │   └── index.css                   # Tailwind imports & smooth scrolling
│   ├── vite.config.js                  # Vite with Tailwind & React plugins
│   ├── .env.example                    # Frontend environment template
│   └── package.json
├── .gitignore
├── AGENTS.md                           # Development guidelines & ponytail mode
├── package.json                        # Root workspace scripts
└── README.md
```

---

## ⚡ Quick Start & Installation

### Prerequisites
- **Node.js**: v18+ (tested on Node v24)
- **MongoDB**: Local MongoDB instance (`mongodb://localhost:27017/practo-animals`) or MongoDB Atlas URI.

### 1. Clone & Install Dependencies

```bash
# In the project root:
cd p1Animal

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 2. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/practo-animals
CORS_ORIGIN=http://localhost:5173
```
*(Or use a MongoDB Atlas cluster URI if preferred).*

**Frontend (`frontend/.env`):**
```env
VITE_API_URL=http://localhost:5000/api
```

### 3. Seed Demo Data

Run the database seed script to populate 10 realistic animal care providers across all 6 service categories:

```bash
# From backend directory:
node seed.js

# Or from root directory:
npm run seed
```

### 4. Run Development Servers

**Start Backend (Port 5000):**
```bash
cd backend
npm start
```

**Start Frontend (Port 5173):**
```bash
cd frontend
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 📡 REST API Documentation

### Providers Endpoints

| Method | Endpoint | Description | Query Parameters |
|---|---|---|---|
| `GET` | `/api/providers` | Get paginated providers with filtering & sorting | `page`, `limit`, `category`, `city`, `pincode`, `minRating`, `search`, `sort` |
| `GET` | `/api/providers/featured` | Fetch top 6 highest-rated providers | None |
| `GET` | `/api/providers/search` | Search providers (alias for `/api/providers`) | Same as `/api/providers` |
| `GET` | `/api/providers/:idOrSlug` | Fetch single provider by MongoDB `_id` or unique `slug` | None |

### Business Listings Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/business-listings` | Submit partner clinic registration | `{ businessName, ownerName, email, phone, category, address, city, state, pincode, description, website }` |
| `GET` | `/api/business-listings` | Retrieve submitted business listings (admin) | None |

### Corrections Endpoints

| Method | Endpoint | Description | Request Body |
|---|---|---|---|
| `POST` | `/api/corrections` | Submit community data correction report | `{ providerName, issueType, description, userEmail }` |

### Admin Management Endpoints (Protected by JWT or `x-admin-key`)

| Method | Endpoint | Description | Authorization |
|---|---|---|---|
| `POST` | `/api/admin/login` | Authenticate administrator credentials | Public (`{ email, password }`) |
| `GET` | `/api/admin/stats` | Aggregate dashboard counts & metrics | Bearer Token / `x-admin-key` |
| `GET` | `/api/admin/business-listings` | Filterable, paginated partner submissions | Bearer Token / `x-admin-key` |
| `GET` | `/api/admin/business-listings/:id` | View submission detail record | Bearer Token / `x-admin-key` |
| `PUT` | `/api/admin/business-listings/:id/approve` | Approve business & publish to public directory | Bearer Token / `x-admin-key` |
| `PUT` | `/api/admin/business-listings/:id/reject` | Reject application & hide from public | Bearer Token / `x-admin-key` |
| `GET` | `/api/admin/corrections` | Filterable, paginated correction requests | Bearer Token / `x-admin-key` |
| `GET` | `/api/admin/corrections/:id` | View correction request details | Bearer Token / `x-admin-key` |
| `PUT` | `/api/admin/corrections/:id/approve` | Apply approved updates or mark closed provider inactive | Bearer Token / `x-admin-key` |
| `PUT` | `/api/admin/corrections/:id/reject` | Reject correction without touching provider | Bearer Token / `x-admin-key` |
| `PUT` | `/api/admin/corrections/:id/review` | Mark correction as reviewed | Bearer Token / `x-admin-key` |

> **Default Admin Credentials**:
> - Email: `admin@practoforanimals.com`
> - Password: `Admin@Practo2024!`

---

## 🎨 Visual Identity & Brand Guidelines

- **Primary Teal**: `#087F8C` — Conveys clinical credibility, cleanliness, and trust.
- **Soft Mint**: `#DFF5EF` — Gentle pastel accents for badges and icon backgrounds.
- **Warm Orange**: `#FF9B62` — High-visibility CTA buttons and rating stars.
- **Deep Navy**: `#172B3A` — High-contrast typography for readability.
- **Off White**: `#F8FAFC` — Subtle, calm background minimizing visual fatigue.
- **Typography**: Inter / Plus Jakarta Sans.

---

## 🧪 Testing & Verification

The project includes an end-to-end automated test runner validating database connectivity, model schemas, Express validator rules, and API response structures.

To execute the test suite:
```bash
node -e "
const app = require('./backend/server');
setTimeout(async () => {
  const res = await fetch('http://localhost:5000/api/providers/featured');
  const d = await res.json();
  console.log('API Status:', d.success ? 'Operational' : 'Failed');
  process.exit(0);
}, 2000);"
```

To test frontend production build:
```bash
cd frontend
npm run build
```

---

## ⚖️ License & Attribution

Designed and developed as a production-quality MVP for the **Practo for Animals** product discovery internship assignment. Demo provider records are fictional and clearly labeled as sample data.

