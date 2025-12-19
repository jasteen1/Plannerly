# 🚀 Student Planner - Netlify Deployment Guide

## 📋 Prerequisites

Before deploying to Netlify, make sure you have:

1. **Git Repository**: Your project should be in a Git repository
2. **Netlify Account**: Sign up at [netlify.com](https://netlify.com)
3. **Calendarific API Key**: Get your free API key from [calendarific.com](https://calendarific.com)

## 🛠️ Step-by-Step Deployment

### Step 1: Push Your Code to Git

Make sure your code is committed and pushed to a Git repository (GitHub, GitLab, or Bitbucket).

```bash
git add .
git commit -m "Ready for deployment"
git push origin main
```

### Step 2: Deploy to Netlify

#### Option A: Connect Repository (Recommended)

1. **Go to Netlify Dashboard**: [app.netlify.com](https://app.netlify.com)
2. **Click "New site from Git"**
3. **Choose your Git provider** (GitHub/GitLab/Bitbucket)
4. **Select your repository**: `student-planner`
5. **Configure build settings**:
   - **Branch to deploy**: `main` (or your default branch)
   - **Build command**: `npm run build`
   - **Publish directory**: `.next` (leave as auto-detected)

#### Option B: Drag & Drop (Quick Test)

1. **Build locally**: `npm run build`
2. **Go to Netlify Dashboard**
3. **Drag the `.next` folder** into the deploy area

### Step 3: Configure Environment Variables

**Important**: Set your Calendarific API key in Netlify:

1. **Go to Site Settings** → **Environment variables**
2. **Add variable**:
   - **Key**: `CALENDARIFIC_API_KEY`
   - **Value**: Your Calendarific API key (starts with `OwT8KoLRLnw5mhmiN2sVawoyhDSLAyQf`)
   - **Scopes**: ✅ Build time ✅ Functions ✅ Post-processing

### Step 4: Deploy

1. **Click "Deploy site"**
2. **Wait for build** (usually 2-3 minutes)
3. **Your site will be live** at `https://your-site-name.netlify.app`

## ⚙️ Configuration Details

### netlify.toml
The project includes a `netlify.toml` file that configures:

- **Build settings**: Next.js build command and output directory
- **API routes**: Proper routing for `/api/*` endpoints
- **Security headers**: XSS protection, content type options, etc.
- **CORS settings**: For API access

### Environment Variables
```
CALENDARIFIC_API_KEY=your-calendarific-api-key-here
```

## 🔧 Troubleshooting

### Build Fails
**Common issues:**
- Missing `CALENDARIFIC_API_KEY` environment variable
- Node version mismatch (project uses Node 18)

**Solutions:**
- Add environment variable in Netlify dashboard
- Check build logs for specific errors

### API Not Working
**Symptoms:** Holiday data not loading

**Solutions:**
1. Check API key is set correctly
2. Verify key has correct permissions
3. Check Netlify function logs

### Functions Not Deploying
**Issue:** `/api/holidays` returns 404

**Solutions:**
1. Make sure `netlify.toml` is in your repository
2. Check function directory path in netlify.toml
3. Verify Next.js API routes are in correct location

## 🌐 Custom Domain (Optional)

To use a custom domain:

1. **Go to Site Settings** → **Domain management**
2. **Add custom domain** or **set primary domain**
3. **Configure DNS** if using custom domain

## 📊 Monitoring & Analytics

### Enable Analytics
1. **Go to Site Settings** → **Site monitoring**
2. **Enable Netlify Analytics**

### View Logs
- **Function logs**: Site Settings → Functions → View logs
- **Build logs**: Deploys → Click on latest deploy → View build log

## 🔄 Updates & Redeployment

When you make changes:

1. **Commit and push** to your repository
2. **Netlify auto-deploys** (if enabled)
3. **Or manually trigger** deploy from dashboard

## ✅ Post-Deployment Checklist

- [ ] Site loads without errors
- [ ] Holiday data loads (check dashboard)
- [ ] All pages work (dashboard, planner, tasks, holidays, about)
- [ ] Forms work (add tasks, add holidays)
- [ ] Social media links work
- [ ] Email copy-to-clipboard works
- [ ] Mobile responsive design works

## 🎉 Your Student Planner is Live!

Once deployed, your Student Planner will be available at:
`https://your-site-name.netlify.app`

Share the link with friends and enjoy your fully functional student planning application! 📚✨

## 📞 Support

If you encounter issues:
- Check Netlify build logs
- Verify environment variables
- Test API endpoints locally first
- Check Netlify status page for outages

**Happy planning! 🎓📅**
