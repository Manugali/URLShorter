const fs = require('fs');
const path = require('path');

const envContent = `# Database (PostgreSQL)
# For local development, you can use a local PostgreSQL instance or Railway's free tier
# DATABASE_URL="postgresql://username:password@localhost:5432/shortly"
# For production, use Railway PostgreSQL:
# DATABASE_URL="postgresql://postgres:password@host:port/railway"

# NextAuth.js
NEXTAUTH_URL="http://localhost:3000"
NEXTAUTH_SECRET="your-secret-key-here-change-in-production-${Math.random().toString(36).substring(2, 15)}"

# OAuth Providers (optional - add your own keys)
# GOOGLE_CLIENT_ID=""
# GOOGLE_CLIENT_SECRET=""
# GITHUB_CLIENT_ID=""
# GITHUB_CLIENT_SECRET=""
`;

const envPath = path.join(process.cwd(), '.env.local');

if (!fs.existsSync(envPath)) {
  fs.writeFileSync(envPath, envContent);
  console.log('✅ Created .env.local file with default configuration');
  console.log('📝 Please update the OAuth provider credentials if you want to use them');
} else {
  console.log('⚠️  .env.local already exists, skipping creation');
}
