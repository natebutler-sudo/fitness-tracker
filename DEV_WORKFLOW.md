# Development & Production Workflow

This guide explains how to manage development and production environments for the Fitness Tracker.

## Branch Structure

- **`master`** — Production branch (stable, deployed to https://fitness-tracker573.web.app)
- **`development`** — Development branch (for testing new features before production)
- **Feature branches** — Create from `development` for specific features

## Environment Setup

### Production Environment
- Firebase Project: `fitness-tracker573`
- Config: `.env.production`
- URL: https://fitness-tracker573.web.app
- Database: Firestore in fitness-tracker573 project

### Development Environment
- Firebase Project: Currently same as production (can be separated)
- Config: `.env.development`
- URL: Local development (localhost:3000) or separate Firebase Hosting project
- Database: Same Firestore (consider creating separate collections for dev data)

## Working on Features

### 1. Create Feature Branch
```bash
git checkout development
git pull origin development
git checkout -b feature/your-feature-name
```

### 2. Make Changes
Edit code, test locally, commit changes:
```bash
npm start  # Run locally on localhost:3000
```

### 3. Test in Development
```bash
npm run build
# Test the build locally
npm install -g serve
serve -s build
```

### 4. Commit & Push
```bash
git add .
git commit -m "Add your feature"
git push origin feature/your-feature-name
```

### 5. Create Pull Request
- Open PR from `feature/your-feature-name` → `development`
- Review changes
- Test in dev environment
- Merge to development

### 6. Deploy Development
When ready to test on Firebase Hosting for dev:
```bash
git checkout development
npm run build
firebase deploy --only hosting  # This will deploy to the configured project
```

## Promoting to Production

When development is stable and ready for production:

### 1. Create Production PR
```bash
git checkout master
git pull origin master
git merge development
# Or create a Pull Request on GitHub: development → master
```

### 2. Build & Test Production
```bash
git checkout master
npm run build
# Verify build succeeded
```

### 3. Deploy to Production
```bash
# Make sure you're on master branch
git checkout master
npm run build
firebase deploy --only hosting
```

## Managing Firebase Projects (Optional)

To completely isolate dev from production:

### Create Development Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Create new project: `fitness-tracker-dev`
3. Set up Firestore, Authentication, Hosting
4. Copy project credentials
5. Update `.env.development` with new project IDs

### Configure firebase.json for Multiple Projects
You can use multiple Firebase projects by switching `.firebaserc`:

```bash
# Switch to dev project
firebase use fitness-tracker-dev

# Switch back to production
firebase use fitness-tracker573
```

Or manually edit `.firebaserc`:
```json
{
  "projects": {
    "default": "fitness-tracker573",
    "development": "fitness-tracker-dev"
  }
}
```

Then deploy to specific project:
```bash
firebase deploy --project=fitness-tracker-dev --only hosting
```

## Deployment Checklist

### Before Deploying Development
- [ ] All tests pass
- [ ] No console errors
- [ ] Features work locally
- [ ] Code review complete
- [ ] No secrets in code

### Before Deploying Production
- [ ] Tested in development environment
- [ ] All features working
- [ ] Analytics/dashboards load
- [ ] Authentication works (email + Google)
- [ ] Firestore security rules are correct
- [ ] No critical console errors

## Reverting Changes

### Revert Last Production Deployment
```bash
git checkout master
git log --oneline  # Find previous commit
git checkout <previous-commit-hash>
npm run build
firebase deploy --only hosting
```

### Revert Specific File
```bash
git checkout master~1 -- path/to/file.js
git commit -m "Revert file to previous version"
npm run build
firebase deploy --only hosting
```

## Monitoring

### View Deployment Logs
```bash
firebase deploy --debug
```

### Check Firebase Console
- Go to [Firebase Console](https://console.firebase.google.com/)
- Check Hosting, Firestore, Authentication status

### Monitor App Performance
- Check browser console for errors: `F12` → Console
- Check Firebase Console → Firestore → Data
- View Hosting deployment history in Console

## Environment Variables Reference

### Production (.env.production)
```
REACT_APP_ENVIRONMENT=production
REACT_APP_FIREBASE_*=production-credentials
```

### Development (.env.development)
```
REACT_APP_ENVIRONMENT=development
REACT_APP_FIREBASE_*=dev-credentials (or same as prod for now)
```

### Local (.env.local)
```
REACT_APP_ENVIRONMENT=development
REACT_APP_FIREBASE_*=local-credentials (gitignored)
```

## Tips

- Always test locally before pushing
- Use descriptive branch names: `feature/`, `bugfix/`, `hotfix/`
- Keep development branch up to date with master
- Review changes before merging to master
- Use meaningful commit messages
- Tag releases: `git tag v1.0.0`

---

For questions or issues, check Firebase console or contact the team.
