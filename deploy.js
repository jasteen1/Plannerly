#!/usr/bin/env node

/**
 * Student Planner - Quick Netlify Deployment Script
 *
 * This script helps you prepare your Student Planner for Netlify deployment.
 *
 * Usage:
 * 1. Make sure you have your Calendarific API key
 * 2. Run: node deploy.js
 * 3. Follow the instructions
 */

const fs = require('fs');
const path = require('path');

console.log('🚀 Student Planner - Netlify Deployment Helper\n');

// Check if .env.local exists
const envPath = path.join(__dirname, '.env.local');
const hasEnvFile = fs.existsSync(envPath);

if (hasEnvFile) {
  console.log('✅ Environment file found (.env.local)');
  const envContent = fs.readFileSync(envPath, 'utf8');
  const hasApiKey = envContent.includes('CALENDARIFIC_API_KEY=') &&
                   !envContent.includes('your-api-key-here');

  if (hasApiKey) {
    console.log('✅ Calendarific API key is configured');
  } else {
    console.log('⚠️  Calendarific API key not found or using placeholder');
    console.log('   Make sure to set CALENDARIFIC_API_KEY in Netlify environment variables');
  }
} else {
  console.log('⚠️  No .env.local file found');
  console.log('   Make sure to set CALENDARIFIC_API_KEY in Netlify environment variables');
}

// Check if netlify.toml exists
const netlifyConfigPath = path.join(__dirname, 'netlify.toml');
const hasNetlifyConfig = fs.existsSync(netlifyConfigPath);

if (hasNetlifyConfig) {
  console.log('✅ Netlify configuration found (netlify.toml)');
} else {
  console.log('❌ Netlify configuration missing');
}

// Check package.json
const packagePath = path.join(__dirname, 'package.json');
const hasPackageJson = fs.existsSync(packagePath);

if (hasPackageJson) {
  const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
  console.log(`✅ Package.json found (version: ${packageJson.version})`);
}

// Instructions
console.log('\n📋 Deployment Instructions:');
console.log('1. Push your code to a Git repository (GitHub/GitLab/Bitbucket)');
console.log('2. Go to https://app.netlify.com');
console.log('3. Click "New site from Git"');
console.log('4. Connect your repository');
console.log('5. Set build settings:');
console.log('   - Build command: npm run build');
console.log('   - Publish directory: .next (auto-detected)');
console.log('6. Add environment variable:');
console.log('   - Key: CALENDARIFIC_API_KEY');
console.log('   - Value: Your Calendarific API key');
console.log('7. Click "Deploy site"');

console.log('\n🔗 Important Links:');
console.log('- Netlify: https://app.netlify.com');
console.log('- Calendarific API: https://calendarific.com');
console.log('- Full Guide: Check DEPLOYMENT_GUIDE.md');

console.log('\n🎉 Ready for deployment!');
console.log('Your Student Planner will be live in a few minutes! 🚀');
