# Deployment Guide 🚀

This guide will help you deploy the Student Productivity Platform to various hosting services.

## Prerequisites

Before deploying, make sure you have:
- Node.js (version 16+) installed
- npm or yarn package manager
- Git (for version control)

## Local Development Setup

1. **Install Node.js**: Download from [nodejs.org](https://nodejs.org/)
2. **Clone and setup the project**:
   ```bash
   cd student-productivity-platform
   npm install
   npm run dev
   ```
3. **Build for production**:
   ```bash
   npm run build
   ```

## Deployment Options

### Option 1: Vercel (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Deploy**:
   ```bash
   vercel --prod
   ```

3. **Or connect GitHub repository**:
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Vercel will automatically detect it's a Vite project

### Option 2: Netlify

1. **Build the project**:
   ```bash
   npm run build
   ```

2. **Deploy via drag & drop**:
   - Go to [netlify.com](https://netlify.com)
   - Drag the `dist` folder to the deploy area

3. **Or connect GitHub**:
   - Connect your repository
   - Set build command: `npm run build`
   - Set publish directory: `dist`

### Option 3: GitHub Pages

1. **Install gh-pages**:
   ```bash
   npm install --save-dev gh-pages
   ```

2. **Add to package.json scripts**:
   ```json
   {
     "scripts": {
       "deploy": "gh-pages -d dist"
     }
   }
   ```

3. **Deploy**:
   ```bash
   npm run build
   npm run deploy
   ```

### Option 4: Firebase Hosting

1. **Install Firebase CLI**:
   ```bash
   npm install -g firebase-tools
   ```

2. **Initialize Firebase**:
   ```bash
   firebase init hosting
   ```

3. **Deploy**:
   ```bash
   npm run build
   firebase deploy
   ```

## Environment Configuration

The app uses localStorage for data persistence, so no environment variables are needed for basic functionality.

## Performance Optimization

The build is already optimized with:
- Code splitting
- Tree shaking
- Asset optimization
- Gzip compression ready

## Custom Domain

After deployment, you can configure a custom domain through your hosting provider's dashboard.

## SSL Certificate

All recommended hosting services provide free SSL certificates automatically.

## Monitoring

Consider adding analytics and error monitoring:
- Google Analytics
- Sentry for error tracking
- Vercel Analytics (if using Vercel)

## Troubleshooting

### Build Issues
- Ensure Node.js version is 16+
- Clear node_modules and reinstall: `rm -rf node_modules package-lock.json && npm install`
- Check for TypeScript errors: `npm run build`

### Runtime Issues
- Check browser console for errors
- Verify localStorage is enabled
- Test in incognito mode to rule out extension conflicts

## Support

If you encounter deployment issues:
1. Check the hosting service's documentation
2. Verify all dependencies are installed
3. Test the build locally first
4. Check for any TypeScript or linting errors

---

Happy deploying! 🎉
