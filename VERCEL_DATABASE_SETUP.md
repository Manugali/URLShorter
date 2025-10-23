# 🗄️ Vercel Postgres Database Setup

## Step 1: Create Vercel Postgres Database

1. **Go to** [vercel.com/dashboard](https://vercel.com/dashboard)
2. **Click "Storage"** in the left sidebar
3. **Click "Create Database"**
4. **Choose "Postgres"**
5. **Name it:** `urlshorter-db`
6. **Select region:** Choose closest to your users
7. **Click "Create"**

## Step 2: Get Connection String

1. **Click on your database** in the Storage section
2. **Go to "Settings" tab**
3. **Copy the "Connection String"** (starts with `postgres://`)

## Step 3: Add Environment Variables

### In Vercel Dashboard:
1. **Go to your project** → Settings → Environment Variables
2. **Add these variables:**

```
DATABASE_URL = postgres://username:password@host:port/database
NEXT_PUBLIC_APP_URL = https://your-app.vercel.app
```

### Or via CLI:
```bash
vercel env add DATABASE_URL
# Paste your connection string when prompted

vercel env add NEXT_PUBLIC_APP_URL
# Enter: https://your-app.vercel.app
```

## Step 4: Run Database Migration

```bash
# Connect to your Vercel project
vercel link

# Pull environment variables
vercel env pull .env.local

# Run database migration
npx prisma db push
```

## Step 5: Deploy

```bash
vercel --prod
```

## Benefits of Vercel Postgres:
- ✅ **Integrated** with Vercel hosting
- ✅ **Free tier** with generous limits
- ✅ **Automatic backups**
- ✅ **Global edge locations**
- ✅ **Easy scaling**
- ✅ **No separate billing**

## Database Limits (Free Tier):
- **Storage:** 1 GB
- **Connections:** 100 concurrent
- **Bandwidth:** 1 GB/month
- **Perfect for** URL shortener MVP!

## Migration from Railway:
Your existing data will be preserved when you switch databases, but you'll need to:
1. **Export data** from Railway (if needed)
2. **Import to Vercel** (if needed)
3. **Update connection string**
