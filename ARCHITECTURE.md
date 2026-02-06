# Health Guardian - System Architecture

## 🏗️ Architecture Overview

Health Guardian is built on a modern, scalable architecture that leverages cutting-edge technologies to deliver a seamless healthcare experience.

## System Components

### Frontend Architecture

```
┌─────────────────────────────────────────────────────────┐
│                      React Application                   │
│  ┌─────────────┐  ┌──────────────┐  ┌──────────────┐  │
│  │   Pages     │  │  Components  │  │    Hooks     │  │
│  │ - Dashboard │  │ - AI Hub     │  │ - useAuth    │  │
│  │ - AI Hub    │  │ - Chatbot    │  │ - useHealth  │  │
│  │ - Profile   │  │ - Simulation │  │ - useCredits │  │
│  └─────────────┘  └──────────────┘  └──────────────┘  │
│                                                          │
│  ┌───────────────────────────────────────────────────┐ │
│  │          State Management (React Query)            │ │
│  └───────────────────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────┘
                            ⬇️
┌─────────────────────────────────────────────────────────┐
│                    Backend Services                      │
│  ┌────────────────┐  ┌────────────────┐  ┌───────────┐ │
│  │  Supabase DB   │  │  Edge Functions│  │   Auth    │ │
│  │  - PostgreSQL  │  │  - Health Chat │  │  - JWT    │ │
│  │  - RLS         │  │  - Disease API │  │  - OAuth  │ │
│  │  - Real-time   │  │  - Hospital    │  │           │ │
│  └────────────────┘  └────────────────┘  └───────────┘ │
└─────────────────────────────────────────────────────────┘
```

### Frontend Layer

**Framework:** React 18 with TypeScript
**Build Tool:** Vite (Fast HMR and optimized builds)
**UI Framework:** 
- Shadcn/ui components built on Radix UI primitives
- Tailwind CSS for styling
- Framer Motion for animations

**State Management:**
- TanStack Query (React Query) for server state
- React Context for auth and global state
- Custom hooks for business logic

**Routing:** React Router v6 with nested routes

### Backend Layer

**Database:** Supabase (PostgreSQL)
- Row Level Security (RLS) for data protection
- Real-time subscriptions for live updates
- Automatic API generation

**Serverless Functions:** Supabase Edge Functions (Deno)
- `health-chat`: AI-powered health consultations
- `search-disease`: Disease information retrieval
- `find-hospitals`: Geolocation-based hospital finder
- `claim-daily-credits`: Credit system management

**Authentication:**
- Supabase Auth with JWT tokens
- Email/password authentication
- Session management
- Protected routes

### Database Schema

```sql
-- Users Table (Managed by Supabase Auth)
auth.users
  ├── id (uuid, primary key)
  ├── email
  └── created_at

-- User Credits
public.user_credits
  ├── user_id (uuid, foreign key -> auth.users)
  ├── daily_credits (integer)
  ├── bonus_credits (integer)
  ├── last_daily_claim (timestamp)
  └── updated_at

-- Health Entries
public.health_entries
  ├── id (uuid, primary key)
  ├── user_id (uuid, foreign key)
  ├── entry_type (text)
  ├── value (numeric)
  ├── notes (text)
  ├── created_at
  └── metadata (jsonb)

-- Subscriptions
public.subscriptions
  ├── user_id (uuid, foreign key)
  ├── plan (text)
  ├── status (text)
  ├── started_at
  └── expires_at

-- Reviews
public.reviews
  ├── id (uuid, primary key)
  ├── user_id (uuid, foreign key)
  ├── rating (integer)
  ├── comment (text)
  └── created_at
```

## Security Architecture

### 1. Environment Variables
All sensitive data (API keys, database URLs) stored in `.env` file
- Excluded from version control via `.gitignore`
- Server-side only access for critical secrets

### 2. Row Level Security (RLS)
Every database table has RLS policies:
```sql
-- Users can only read/write their own data
CREATE POLICY "Users can view own data" ON health_entries
  FOR SELECT USING (auth.uid() = user_id);
```

### 3. Authentication Flow
```
User → Login Request → Supabase Auth → JWT Token
  ↓
Frontend stores token → All API calls include JWT
  ↓
Backend validates JWT → RLS enforces data access
```

### 4. API Security
- Rate limiting on edge functions
- CORS configuration
- Input validation and sanitization
- SQL injection prevention via parameterized queries

## Data Flow

### Health Data Entry Flow
```
1. User fills form (HealthInput component)
2. Data validated client-side (Zod schemas)
3. POST to Supabase with auth token
4. RLS verifies user ownership
5. Data inserted into health_entries
6. Real-time subscription updates UI
7. React Query cache invalidated
8. Dashboard refreshes with new data
```

### AI Chat Flow
```
1. User sends message (Chatbot component)
2. Check user credits
3. Call health-chat edge function
4. Edge function queries AI service
5. Response streamed back to client
6. Credits deducted
7. Message stored in history
```

## Performance Optimizations

### Frontend
- **Code Splitting:** Lazy loading for routes
- **Image Optimization:** WebP format, lazy loading
- **Bundle Optimization:** Tree shaking, minification
- **Caching:** React Query cache with stale-while-revalidate
- **Virtualization:** For large lists (health entries)

### Backend
- **Database Indexing:** On frequently queried columns
- **Connection Pooling:** Managed by Supabase
- **Edge Functions:** Deployed close to users globally
- **CDN:** Static assets served via CDN

## Scalability

### Horizontal Scalability
- **Frontend:** Static site, infinitely scalable via CDN
- **Backend:** Supabase automatically scales
- **Edge Functions:** Auto-scaling serverless functions

### Database Scalability
- **Read Replicas:** Supabase supports read replicas
- **Partitioning:** Tables can be partitioned by user_id
- **Caching:** Redis layer can be added if needed

## Deployment Architecture

```
┌──────────────────────────────────────────────────────┐
│                   Vercel/Netlify                      │
│            (Frontend Static Hosting)                  │
│  - CDN distribution                                   │
│  - Automatic HTTPS                                    │
│  - CI/CD from Git                                     │
└──────────────────────────────────────────────────────┘
                        ⬇️
┌──────────────────────────────────────────────────────┐
│               Supabase Cloud Platform                 │
│  ┌─────────────┐  ┌─────────────┐  ┌──────────────┐ │
│  │ PostgreSQL  │  │ Edge Funcs  │  │    Auth      │ │
│  │  Database   │  │   (Deno)    │  │   Service    │ │
│  └─────────────┘  └─────────────┘  └──────────────┘ │
│                                                       │
│  Global Edge Network (Low Latency)                   │
└──────────────────────────────────────────────────────┘
```

## Monitoring and Logging

### Frontend Monitoring
- Error boundaries for graceful error handling
- Console logging in development
- User action tracking (optional analytics)

### Backend Monitoring
- Supabase Dashboard for real-time metrics
- Edge function logs via Deno Deploy
- Database query performance monitoring

## Development Workflow

```
Developer → Git Commit → GitHub
              ↓
         CI/CD Pipeline
              ↓
    ┌─────────────────┐
    │   Build & Test  │
    └─────────────────┘
              ↓
    ┌─────────────────┐
    │  Deploy Staging │
    └─────────────────┘
              ↓
         QA Testing
              ↓
    ┌─────────────────┐
    │Deploy Production│
    └─────────────────┘
```

## Technology Decisions

### Why React + TypeScript?
- Type safety reduces bugs
- Large ecosystem and community
- Excellent developer experience
- Industry standard

### Why Supabase?
- Postgres: Reliable, ACID compliant
- Built-in auth and storage
- Real-time capabilities
- Edge functions for serverless compute
- Great developer experience
- Free tier for development

### Why Vite?
- Extremely fast HMR
- Optimized production builds
- Native ESM support
- Modern tooling

### Why Tailwind CSS?
- Utility-first approach
- Consistent design system
- Smaller CSS bundle
- Fast development

## Future Architecture Enhancements

### Planned Improvements
1. **Redis Caching:** For frequently accessed data
2. **GraphQL API:** More efficient data fetching
3. **WebSockets:** Real-time AI chat responses
4. **Service Workers:** Offline capabilities
5. **Microservices:** Separate services for AI, analytics
6. **Message Queue:** For async processing (email, notifications)

### AI Integration Architecture
```
User Request → Edge Function → AI Service API
                                   ↓
                            Vector Database
                                   ↓
                        Context + User Data
                                   ↓
                          LLM Processing
                                   ↓
                         Response + Metadata
```

## Conclusion

Health Guardian's architecture is designed for:
- **Performance:** Fast load times, optimized queries
- **Security:** RLS, JWT, environment variables
- **Scalability:** Serverless, CDN, auto-scaling
- **Maintainability:** TypeScript, component-based, modular
- **Developer Experience:** Fast HMR, type safety, modern tooling

This architecture ensures the application can handle growth while maintaining security, performance, and code quality.
