# 🚀 Deploy to Vercel with Custom Domain

## Prerequisites
- Vercel account (free)
- Custom domain (optional, for shorter URLs)

## Step 1: Deploy to Vercel

1. **Connect to Vercel:**
   ```bash
   npm install -g vercel
   vercel login
   ```

2. **Deploy your project:**
   ```bash
   vercel
   ```

3. **Set environment variables in Vercel dashboard:**
   - `DATABASE_URL`: Your PostgreSQL connection string
   - `NEXT_PUBLIC_APP_URL`: Your Vercel domain (e.g., `https://your-app.vercel.app`)

## Step 2: Add Custom Domain (Optional)

1. **Go to Vercel Dashboard** → Your Project → Settings → Domains
2. **Add your custom domain** (e.g., `short.ly`, `tiny.link`)
3. **Update DNS records** as instructed by Vercel
4. **Update environment variable:**
   - `NEXT_PUBLIC_APP_URL`: `https://your-custom-domain.com`

## Step 3: Database Setup

### Option A: Vercel Postgres (Recommended)
1. **Go to Vercel Dashboard** → Storage → Create Database
2. **Choose PostgreSQL**
3. **Copy the connection string** to `DATABASE_URL`

### Option B: External Database
- Use Railway Postgres (free tier)
- Use Supabase (free tier)
- Use Neon (free tier)

## Step 4: Run Database Migration

```bash
# Connect to your project
vercel link

# Run database migration
vercel env pull .env.local
npx prisma db push
```

## Benefits of Vercel:
- ✅ **Free hosting** with generous limits
- ✅ **Custom domains** (free)
- ✅ **Automatic deployments** from GitHub
- ✅ **Global CDN** for fast loading
- ✅ **Built-in analytics**
- ✅ **Easy environment management**

## Custom Domain Examples:
- `short.ly` → `https://short.ly/Ab3k`
- `tiny.link` → `https://tiny.link/Ab3k`
- `s.ly` → `https://s.ly/Ab3k`
