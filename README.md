# Shortly - URL Shortener SaaS

A modern, production-quality URL shortener built with Next.js, Tailwind CSS, Prisma, and PostgreSQL. Features a clean, responsive UI with smooth animations and local storage for URL persistence.

## 🚀 Features

- **URL Shortening**: Create short, memorable links from long URLs
- **User Authentication**: Sign in with Google, GitHub, or email/password
- **User Dashboard**: View and manage your shortened URLs
- **Instant Redirects**: Fast server-side redirects for short URLs
- **Modern UI**: Clean, responsive design with Tailwind CSS
- **Smooth Animations**: Framer Motion for delightful interactions
- **Persistent Storage**: URLs saved to database for authenticated users
- **Copy to Clipboard**: One-click copying with visual feedback
- **Mobile Responsive**: Works perfectly on all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 16 (App Router), TypeScript, Tailwind CSS
- **UI Components**: ShadCN UI, Radix UI primitives
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js with multiple providers
- **Backend**: Next.js API Routes
- **Database**: Prisma ORM with SQLite (local) / PostgreSQL (production)
- **Deployment**: Railway (full-stack hosting)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd url-shorter
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   node scripts/setup-env.js
   ```
   
   The script creates `.env.local` with default configuration. For OAuth providers, update with your credentials:
   ```env
   # OAuth Providers (optional)
   GOOGLE_CLIENT_ID="your-google-client-id"
   GOOGLE_CLIENT_SECRET="your-google-client-secret"
   GITHUB_CLIENT_ID="your-github-client-id"
   GITHUB_CLIENT_SECRET="your-github-client-secret"
   ```

4. **Set up the database**
   ```bash
   npx prisma generate
   npx prisma db push
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🗄️ Database Schema

```prisma
model User {
  id            String    @id @default(cuid())
  name          String?
  email         String    @unique
  emailVerified DateTime?
  image         String?
  accounts      Account[]
  sessions      Session[]
  shortUrls     ShortUrl[]
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
}

model ShortUrl {
  id          String   @id @default(cuid())
  originalUrl String
  shortCode   String   @unique
  createdAt   DateTime @default(now())
  userId      String?
  user        User?    @relation(fields: [userId], references: [id], onDelete: SetNull)
}
```

## 🚀 Deployment

### Railway (Recommended)

1. **Deploy to Railway**
   - Connect your GitHub repository to Railway
   - Railway automatically detects Next.js and sets up the environment
   - Add PostgreSQL database from Railway dashboard

2. **Environment Variables**
   ```env
   DATABASE_URL="postgresql://postgres:[password]@[host]:5432/postgres"
   NEXT_PUBLIC_APP_URL="https://your-app.up.railway.app"
   ```

3. **Database Setup**
   ```bash
   npx prisma db push
   ```

Your app will be available at: `https://your-app.up.railway.app`

## 📁 Project Structure

```
URLShorter/
├── prisma/
│   ├── schema.prisma            # Database schema
│   └── dev.db                   # SQLite database (local)
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── shorten/route.ts  # URL shortening endpoint
│   │   │   └── [slug]/route.ts   # Redirect handler
│   │   ├── [slug]/page.tsx       # Dynamic redirect page
│   │   ├── layout.tsx            # Root layout
│   │   ├── page.tsx              # Homepage
│   │   ├── globals.css           # Global styles
│   │   └── favicon.ico           # App icon
│   ├── components/
│   │   ├── ui/                   # ShadCN UI components
│   │   │   ├── badge.tsx
│   │   │   ├── button.tsx
│   │   │   ├── card.tsx
│   │   │   └── input.tsx
│   │   ├── UrlForm.tsx           # URL input form
│   │   └── UrlList.tsx           # URL list display
│   └── lib/
│       ├── prisma.ts             # Prisma client
│       └── utils.ts              # Utility functions
├── package.json                  # Dependencies
├── tsconfig.json                # TypeScript config
├── next.config.ts              # Next.js config
├── tailwind.config.js           # Tailwind config
└── README.md                    # This file
```

## 🔧 API Endpoints

### POST `/api/shorten`
Creates a new short URL.

**Request:**
```json
{
  "url": "https://example.com/very/long/url"
}
```

**Response:**
```json
{
  "id": "clx123...",
  "originalUrl": "https://example.com/very/long/url",
  "shortCode": "abc123",
  "shortUrl": "https://your-app.com/abc123",
  "createdAt": "2024-01-01T00:00:00.000Z"
}
```

### GET `/[slug]`
Redirects to the original URL.

## 🎨 UI Components

The app uses a custom design system built with:
- **ShadCN UI**: Pre-built, accessible components
- **Tailwind CSS**: Utility-first styling
- **Framer Motion**: Smooth animations
- **Lucide React**: Beautiful icons

## 🔮 Future Enhancements

- [x] User authentication (NextAuth.js)
- [ ] Analytics dashboard (click tracking, geolocation)
- [ ] Custom domains
- [ ] Bulk URL shortening
- [ ] QR code generation
- [ ] API rate limiting
- [ ] Paid plans with Stripe
- [ ] URL expiration dates
- [ ] Password protection for links

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing React framework
- [Tailwind CSS](https://tailwindcss.com/) for the utility-first CSS
- [Prisma](https://prisma.io/) for the database toolkit
- [ShadCN UI](https://ui.shadcn.com/) for the beautiful components
- [Framer Motion](https://www.framer.com/motion/) for the smooth animations

---

Built with ❤️ using Next.js, Tailwind CSS, and Prisma.