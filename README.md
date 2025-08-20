# Rent My Place

A mobile-first web application for property rental management built with React, Firebase, and Tailwind CSS. This project was completed as part of the Ardexa.ai 3-Day Frontend Challenge.

## 🚀 Quick Start

### Prerequisites
- Node.js 20.16+ 
- npm 10.8+
- Firebase account with a project configured

### Installation

1. **Clone the repository**
```bash
git clone <repo-url>
cd rent-my-place
```

2. **Install dependencies**
```bash
npm install
```

3. **Configure Firebase**
```bash
cp .env.example .env
```

Edit `.env` with your Firebase configuration:
```env
VITE_FIREBASE_API_KEY=your_actual_api_key
VITE_FIREBASE_AUTH_DOMAIN=your-project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your-project-id
VITE_FIREBASE_STORAGE_BUCKET=your-project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=123456789
VITE_FIREBASE_APP_ID=1:123456789:web:abcdef
```

4. **Set up Firebase services**
   - Enable Email/Password authentication in Firebase Console
   - Create Firestore database in test mode
   - Create composite index for `applications` collection (userId + createdAt)

5. **Run development server**
```bash
npm run dev
```

6. **Build for production**
```bash
npm run build
npm run preview  # Test production build locally
```

## 🌟 Features

### Public Features
- **Property Search**: Browse available properties with real-time search
- **Advanced Filters**: Filter by city (dropdown), price range, minimum beds
- **Property Status**: Visual indicators for rented/available properties
- **Responsive Design**: Mobile-first with breakpoints for tablet/desktop
- **Image Handling**: Lazy loading with fallback images for broken links

### User Features
- **Authentication**: Email/password signup and login with validation
- **Application Form**: 
  - Smart validation (income 3x rent, future move-in dates)
  - International phone support (7-15 digits)
  - Pre-filled user email for convenience
- **Application Tracking**: View all submitted applications with status updates
- **Real-time Updates**: See approval/rejection status immediately

### Admin Features
- **Dashboard Access**: Admin-only route with role-based protection
- **Application Management**: Accept/reject applications with one click
- **Analytics**:
  - KPI cards (today/7d/30d applications)
  - Applications trend chart (14 days)
  - Average rent by city chart
  - Searchable applications table
- **Property Status**: Approved applications mark properties as rented

### UX & Animations
- **Micro-interactions**: 
  - Card hover effects with elevation
  - Button ripple effects
  - Show/hide password toggles
  - Mobile menu animations
- **Loading States**: Skeleton loaders for images
- **Empty States**: Animated placeholders
- **Page Transitions**: Smooth enter/exit animations with Framer Motion

## 🛠 Tech Stack & Implementation Choices

### Core Technologies
- **Framework**: React 18 with Vite (for fast HMR and builds)
- **Styling**: Tailwind CSS v3 + shadcn/ui components
- **State**: React Context API (simple, sufficient for app size)
- **Routing**: React Router v6
- **Animations**: Framer Motion

### Backend Services (Firebase - Chosen Option)
- **Authentication**: Firebase Auth (email/password)
- **Database**: Firestore
- **Why Firebase over Airtable**:
  - Real-time updates without polling
  - Built-in authentication
  - Better scalability
  - Offline support
  - More flexible querying

### Data Source
- **Option Chosen**: Seed JSON (Option A)
- **Location**: `/src/data/properties.json`
- **Extended**: Added 8 properties across 4 Florida cities

## 🔄 Application Flow

1. **User Journey**:
   - Browse properties → Filter/Search → Click "Apply Now"
   - Sign up/Login → Fill application form → Submit
   - View "My Applications" → See status updates

2. **Admin Journey**:
   - Login with admin email → Access Dashboard
   - View all applications → Accept/Reject
   - Monitor analytics and trends

3. **Status Flow**:
   - Application submitted (pending) → Admin reviews → Approved/Rejected
   - Approved → Property marked as "RENTED" → Disabled for new applications

## ⚖️ Tradeoffs

### Architecture Decisions

1. **Client-side Firebase calls**
   - ✅ Pro: Faster development, real-time updates, simpler deployment
   - ❌ Con: API keys exposed (mitigated by security rules)
   - Alternative: Server with API endpoints

2. **Local data sorting**
   - ✅ Pro: Works without Firestore indexes initially
   - ❌ Con: Less efficient for large datasets
   - Solution: Added indexes after initial development

3. **CSS-in-JS vs Utility Classes**
   - ✅ Pro: Tailwind provides consistent spacing, responsive utilities
   - ❌ Con: Larger HTML, less semantic
   - Mitigation: Component abstraction for reusability

4. **Admin role hardcoded**
   - ✅ Pro: Simple implementation, quick to develop
   - ❌ Con: Not scalable for multiple admins
   - Future: Custom claims or admin collection

## ⏱ Time Allocation

### Day 1 (8 hours)
- Project setup with Vite, Tailwind, shadcn/ui
- Firebase configuration and authentication
- Basic routing and navigation
- Landing page with property grid

### Day 2 (9 hours)
- Application form with validation
- Firestore integration
- Protected routes implementation
- My Applications page
- Admin dashboard with charts

### Day 3 (7 hours)
- Accept/reject functionality
- Property status indicators
- Animations and micro-interactions
- Mobile responsiveness
- Bug fixes and polish

**Total: ~24 hours**

## 🚀 What I'd Add With 1 More Day

1. **Enhanced Features**:
   - Email notifications on status change (Firebase Functions)
   - Multiple property images with gallery view
   - Favorite properties functionality
   - Application notes from admin to user

2. **Technical Improvements**:
   - Unit tests with Vitest and React Testing Library
   - E2E tests with Playwright
   - Code splitting for better performance
   - PWA capabilities (offline support, installable)
   - Proper error boundaries

3. **UX Enhancements**:
   - Voice search for properties (Web Speech API)
   - Advanced filters (amenities, pet-friendly, parking)
   - Map view with property locations
   - Virtual tour links
   - Application document uploads

4. **Admin Features**:
   - Bulk actions (approve/reject multiple)
   - Export applications to CSV
   - Property management (add/edit/delete)
   - Email templates for notifications
   - Audit logs

## 🔒 Security Considerations

### Current Implementation
- Firebase security rules (currently in test mode)
- Client-side validation (needs server validation)
- Environment variables for sensitive config
- Protected routes with role checking

### Production Requirements
```javascript
// Firestore Rules Example
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /applications/{document} {
      allow read: if request.auth != null && 
        (request.auth.uid == resource.data.userId || 
         request.auth.token.admin == true);
      allow create: if request.auth != null;
      allow update: if request.auth != null && 
        request.auth.token.admin == true;
    }
  }
}
```

## 📱 Responsive Breakpoints

- Mobile: < 768px (default)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## 🎯 Performance Optimizations

- Lazy loading images with native `loading="lazy"`
- Skeleton loaders prevent layout shift
- Local state management reduces re-renders
- Debounced search inputs
- Optimized bundle with Vite

## 🐛 Known Issues

1. Firebase indexes need manual creation on first run
2. Image fallbacks use Unsplash (may be slow)
3. No pagination for large application lists
4. Admin emails are hardcoded

## 📄 License

MIT