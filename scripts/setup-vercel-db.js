#!/usr/bin/env node

/**
 * Vercel Database Setup Script
 * This script helps set up the database for Vercel deployment
 */

const { execSync } = require('child_process');

console.log('🚀 Setting up Vercel Database...\n');

try {
  // Check if Vercel CLI is installed
  console.log('📦 Checking Vercel CLI...');
  execSync('vercel --version', { stdio: 'pipe' });
  console.log('✅ Vercel CLI is installed\n');

  // Check if project is linked
  console.log('🔗 Checking project link...');
  try {
    execSync('vercel ls', { stdio: 'pipe' });
    console.log('✅ Project is linked to Vercel\n');
  } catch (error) {
    console.log('❌ Project not linked. Run: vercel link\n');
  }

  console.log('📋 Next steps:');
  console.log('1. Create Vercel Postgres database in Vercel dashboard');
  console.log('2. Copy the connection string');
  console.log('3. Run: vercel env add DATABASE_URL');
  console.log('4. Run: vercel env add NEXT_PUBLIC_APP_URL');
  console.log('5. Run: npx prisma db push');
  console.log('6. Run: vercel --prod');
  
  console.log('\n🎉 Your URL shortener will be live on Vercel!');

} catch (error) {
  console.error('❌ Error:', error.message);
  console.log('\n💡 Make sure Vercel CLI is installed: npm install -g vercel');
}
