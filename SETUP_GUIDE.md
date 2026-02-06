# Health Guardian - Complete Setup & Installation Guide

## 🚀 Quick Start

Get Health Guardian running locally in less than 10 minutes!

---

## 📋 Prerequisites

### Required Software

1. **Node.js** (v18 or higher)
   - Download: https://nodejs.org/
   - Check version: `node --version`

2. **Package Manager** (choose one)
   - **npm** (comes with Node.js)
   - **Bun** (recommended for faster installs)
     - Install: `npm install -g bun`
     - Website: https://bun.sh/

3. **Git**
   - Download: https://git-scm.com/
   - Check version: `git --version`

4. **Code Editor** (recommended)
   - Visual Studio Code: https://code.visualstudio.com/
   - WebStorm: https://www.jetbrains.com/webstorm/

### Optional but Recommended

- **Supabase CLI** (for local development)
  - Install: `npm install -g supabase`
  - Docs: https://supabase.com/docs/guides/cli

---

## 📦 Installation Steps

### Step 1: Clone the Repository

```bash
# Using HTTPS
git clone https://github.com/yourusername/health-guardian.git

# Or using SSH
git clone git@github.com:yourusername/health-guardian.git

# Navigate to project directory
cd health-guardian
```

### Step 2: Install Dependencies

**Using Bun (Recommended - Faster):**
```bash
bun install
```

**Using npm:**
```bash
npm install
```

**Using yarn:**
```bash
yarn install
```

**Install time:** ~2-3 minutes depending on internet speed

### Step 3: Environment Configuration

1. **Create `.env` file:**
   ```bash
   # Copy the example environment file
   cp .env.example .env
   ```

2. **Add Supabase Configuration:**

   Open `.env` and add:
   ```env
   # Supabase Configuration
   VITE_SUPABASE_URL=your_supabase_project_url
   VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
   
   # Optional: AI Service API Keys (if using external AI)
   VITE_OPENAI_API_KEY=your_openai_key  # Optional
   VITE_GROQ_API_KEY=your_groq_key      # Optional
   ```

3. **Get Supabase Credentials:**
   - Go to: https://supabase.com/dashboard
   - Create new project or select existing
   - Go to Settings → API
   - Copy `URL` and `anon/public` key

### Step 4: Database Setup

**Option A: Use Hosted Supabase (Recommended for Quick Start)**

1. Database is already configured if using Supabase Cloud
2. Run migrations:
   ```bash
   # Using Supabase CLI
   supabase db push
   
   # Or manually run migrations in Supabase Dashboard
   # SQL Editor → Copy migration files → Execute
   ```

**Option B: Local Supabase (Advanced)**

```bash
# Start local Supabase
supabase start

# Apply migrations
supabase db reset
```

**Required Tables:** (automatically created by migrations)
- `profiles`
- `health_entries`
- `user_credits`
- `subscriptions`
- `reviews`

### Step 5: Start Development Server

**Using Bun:**
```bash
bun run dev
```

**Using npm:**
```bash
npm run dev
```

**Using yarn:**
```bash
yarn dev
```

**Output:**
```
VITE v5.0.0  ready in 500 ms

➜  Local:   http://localhost:5173/
➜  Network: http://192.168.1.100:5173/
```

### Step 6: Open in Browser

Navigate to: `http://localhost:5173`

You should see the Health Guardian landing page! 🎉

---

## 🔐 Account Setup

### Create Your First Account

1. Click **"Get Started"** or **"Sign Up"**
2. Enter email and password
3. Check email for verification (if enabled)
4. Login with credentials
5. Complete profile setup

### Test Credentials (For Development)

For demo/jury purposes:
- **Email:** aakashmohanraj333@gmail.com
- **Password:** AKASH333

---

## 🗄️ Database Migrations

### Apply All Migrations

```bash
# Navigate to project root
cd health-guardian

# Run migrations (if using Supabase CLI)
supabase db push

# Or use the included script
node apply-migration.js
```

### Migration Files

Located in `supabase/migrations/`:
1. `20251230025247_*.sql` - Initial schema
2. `20251230090253_*.sql` - Health entries
3. `20260104092017_*.sql` - User profiles
4. `20260106160000_*.sql` - Remove constraints
5. `20260106170000_*.sql` - Credits system
6. `20260106180000_*.sql` - RLS policies
7. `20260106190000_*.sql` - Data migration
8. `20260107150000_*.sql` - Reviews table

### Manual Migration (via Supabase Dashboard)

1. Login to Supabase Dashboard
2. Select your project
3. Go to SQL Editor
4. Open each migration file
5. Copy SQL content
6. Paste and execute in SQL Editor
7. Verify table creation

---

## 🧪 Running Edge Functions Locally

### Setup Edge Functions

```bash
# Navigate to functions directory
cd supabase/functions

# Serve all functions locally
supabase functions serve

# Or serve specific function
supabase functions serve health-chat
```

### Test Edge Functions

```bash
# Test health-chat function
curl -i --location --request POST 'http://localhost:54321/functions/v1/health-chat' \
  --header 'Authorization: Bearer YOUR_ANON_KEY' \
  --header 'Content-Type: application/json' \
  --data '{"message": "Hello, I have a headache"}'
```

### Deploy Edge Functions (Production)

```bash
# Deploy all functions
supabase functions deploy

# Or deploy specific function
supabase functions deploy health-chat
```

---

## 🏗️ Build for Production

### Create Production Build

```bash
# Using Bun
bun run build

# Using npm
npm run build

# Using yarn
yarn build
```

**Output:** Optimized files in `dist/` directory

### Preview Production Build

```bash
# Using Bun
bun run preview

# Using npm
npm run preview
```

Navigate to: `http://localhost:4173`

---

## 🚀 Deployment Options

### Option 1: Vercel (Recommended)

```bash
# Install Vercel CLI
npm i -g vercel

# Login
vercel login

# Deploy
vercel
```

**Or use Vercel Dashboard:**
1. Import Git repository
2. Select framework preset: Vite
3. Add environment variables
4. Deploy

### Option 2: Netlify

```bash
# Install Netlify CLI
npm install -g netlify-cli

# Login
netlify login

# Deploy
netlify deploy --prod
```

**Or use Netlify Dashboard:**
1. Connect Git repository
2. Build command: `bun run build` or `npm run build`
3. Publish directory: `dist`
4. Add environment variables
5. Deploy

### Option 3: Cloudflare Pages

1. Login to Cloudflare Dashboard
2. Pages → Create a project
3. Connect Git repository
4. Build settings:
   - Build command: `bun run build`
   - Build output: `dist`
5. Add environment variables
6. Deploy

### Option 4: Static Hosting (Any Provider)

```bash
# Build the project
bun run build

# Upload contents of `dist/` folder to:
# - AWS S3 + CloudFront
# - Google Cloud Storage
# - Azure Static Web Apps
# - GitHub Pages
# - Any static hosting service
```

---

## 🔧 Configuration Options

### Vite Configuration

Edit `vite.config.ts`:

```typescript
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,        // Development port
    host: true,        // Expose to network
    open: true,        // Auto-open browser
  },
  build: {
    outDir: 'dist',    // Output directory
    sourcemap: false,  // Enable for debugging
    minify: 'terser',  // Minification
  },
});
```

### TypeScript Configuration

Edit `tsconfig.json` for type checking preferences.

### Tailwind Configuration

Edit `tailwind.config.ts` for custom themes, colors, spacing.

### ESLint Configuration

Edit `eslint.config.js` for code quality rules.

---

## 🧪 Testing

### Run Linter

```bash
# Using Bun
bun run lint

# Using npm
npm run lint
```

### Type Checking

```bash
# Check TypeScript types
tsc --noEmit
```

### Manual Testing Checklist

- [ ] Landing page loads
- [ ] Sign up / Login works
- [ ] Dashboard displays
- [ ] Health data input saves
- [ ] AI features accessible
- [ ] Chatbot responds
- [ ] Hospital finder works
- [ ] Reports generate
- [ ] Profile updates save
- [ ] Logout works

---

## 📱 Mobile Development (Future)

### Prerequisites for Mobile

```bash
# Install Expo CLI (React Native)
npm install -g expo-cli

# Or use Capacitor for web-to-native
npm install @capacitor/core @capacitor/cli
```

### Currently
The app is fully responsive and works on mobile browsers.
Native apps planned for Q3 2026.

---

## 🐛 Troubleshooting

### Common Issues

#### Issue: "Command not found: bun"
**Solution:**
```bash
# Install Bun
npm install -g bun

# Or use npm instead
npm install
npm run dev
```

#### Issue: "Cannot connect to Supabase"
**Solution:**
1. Check `.env` file has correct `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`
2. Verify Supabase project is active
3. Check network connection
4. Try regenerating Supabase keys

#### Issue: "Module not found" errors
**Solution:**
```bash
# Clear node_modules and reinstall
rm -rf node_modules
rm bun.lockb  # or package-lock.json
bun install   # or npm install
```

#### Issue: "Database table does not exist"
**Solution:**
```bash
# Run migrations
supabase db push

# Or manually create tables in Supabase Dashboard
```

#### Issue: "Port 5173 already in use"  
**Solution:**
```bash
# Kill process on port 5173
# On Mac/Linux:
lsof -ti:5173 | xargs kill -9

# On Windows:
netstat -ano | findstr :5173
taskkill /PID <PID> /F

# Or change port in vite.config.ts
```

#### Issue: Build fails
**Solution:**
```bash
# Clear cache
rm -rf dist
rm -rf .vite

# Rebuild
bun run build
```

### Debug Mode

Enable verbose logging:

```bash
# Add to .env
VITE_DEBUG=true

# Restart dev server
bun run dev
```

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] `.env` file in `.gitignore`
- [ ] No API keys in code
- [ ] Enable RLS on all Supabase tables
- [ ] Use environment variables for secrets
- [ ] Enable CORS properly
- [ ] Setup rate limiting
- [ ] Enable HTTPS
- [ ] Setup authentication properly
- [ ] Validate all user inputs
- [ ] Setup error logging (Sentry, LogRocket)

---

## 📊 Performance Optimization

### Recommended Optimizations

1. **Enable Caching:**
   ```bash
   # Add to vite.config.ts
   build: {
     rollupOptions: {
       output: {
         manualChunks: {
           vendor: ['react', 'react-dom'],
           ui: ['@radix-ui/react-*'],
         },
       },
     },
   }
   ```

2. **Image Optimization:**
   - Use WebP format
   - Lazy load images
   - Use CDN for static assets

3. **Code Splitting:**
   - Already implemented via React.lazy()
   - Lazy load routes

4. **Bundle Analysis:**
   ```bash
   # Install analyzer
   npm install -D rollup-plugin-visualizer
   
   # Add to vite.config.ts
   import { visualizer } from 'rollup-plugin-visualizer';
   
   plugins: [
     react(),
     visualizer(),
   ]
   
   # Build and check stats.html
   bun run build
   ```

---

## 🤝 Development Workflow

### Recommended Git Workflow

```bash
# Create feature branch
git checkout -b feature/new-ai-feature

# Make changes
# ... code ...

# Commit with meaningful messages
git add .
git commit -m "feat: add new AI symptom analyzer"

# Push to remote
git push origin feature/new-ai-feature

# Create Pull Request on GitHub
```

### Commit Message Convention

```
feat: New feature
fix: Bug fix
docs: Documentation changes
style: Code style changes (formatting)
refactor: Code refactoring
test: Adding tests
chore: Build process or auxiliary tool changes
```

---

## 📚 Additional Resources

### Documentation
- React: https://react.dev/
- Vite: https://vitejs.dev/
- Supabase: https://supabase.com/docs
- Tailwind CSS: https://tailwindcss.com/docs
- Shadcn/ui: https://ui.shadcn.com/
- Radix UI: https://www.radix-ui.com/

### Learning Resources
- TypeScript Handbook: https://www.typescriptlang.org/docs/
- React Query: https://tanstack.com/query/latest
- Framer Motion: https://www.framer.com/motion/

### Community
- GitHub Issues: Report bugs
- Discussions: Ask questions
- Discord: Community chat (Coming soon)

---

## 🎓 Next Steps

After setup, explore:

1. **Create health data entries** - Test dashboard
2. **Try AI features** - Explore 20+ AI tools
3. **Chat with AKASHII** - Test chatbot
4. **Generate reports** - Create health reports
5. **Customize profile** - Add personal info
6. **Try premium features** - Explore pro tools

---

## 💬 Support

### Need Help?

- **Email:** support@healthguardian.com
- **GitHub Issues:** https://github.com/yourusername/health-guardian/issues
- **Documentation:** Check README.md and this guide

### Contributing

Want to contribute? Check `CONTRIBUTING.md` (coming soon)

---

## 📦 Complete Command Reference

```bash
# Install dependencies
bun install         # or npm install

# Development
bun run dev         # Start dev server
bun run build       # Production build
bun run preview     # Preview production
bun run lint        # Run linter

# Supabase
supabase init       # Initialize Supabase
supabase start      # Start local Supabase
supabase db push    # Apply migrations
supabase functions serve    # Serve functions locally
supabase functions deploy   # Deploy functions

# Git
git clone <url>     # Clone repository
git checkout -b <branch>    # Create branch
git add .          # Stage changes
git commit -m "<message>"   # Commit
git push           # Push to remote

# Deployment
vercel             # Deploy to Vercel
netlify deploy --prod      # Deploy to Netlify
```

---

## ✅ Setup Complete!

You're all set! Health Guardian should now be running locally.

**Access your app at:** `http://localhost:5173`

**Next:** Start exploring the 20+ AI health features! 🚀

---

## 🎉 Congratulations!

You've successfully set up Health Guardian. If you encountered any issues, please check the Troubleshooting section or reach out for support.

**Happy health tracking! 💪🏥🤖**
