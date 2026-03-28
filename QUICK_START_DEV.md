# Quick Start: Development Environment

You now have a complete dev/prod setup! Here's how to use it:

## 📁 Branches

| Branch | Environment | Purpose | URL |
|--------|-------------|---------|-----|
| `master` | Production | Stable, live app | https://fitness-tracker573.web.app |
| `development` | Development | Test new features | localhost:3000 / separate Firebase |

## 🚀 Quick Workflow

### 1. Work on Development Locally

```bash
# Switch to development branch
git checkout development
git pull origin development

# Start local dev server
npm start

# Opens http://localhost:3000
# Make changes and test
```

### 2. Create Feature Branch

```bash
# Create feature branch from development
git checkout -b feature/my-awesome-feature

# Make changes
# Commit and push
git add .
git commit -m "Add awesome feature"
git push origin feature/my-awesome-feature
```

### 3. Test Before Promoting

```bash
# Build and test locally
npm run build
npm install -g serve  # if needed
serve -s build

# Visit http://localhost:3000 and test
```

### 4. Merge to Development

Create Pull Request on GitHub:
- From: `feature/my-awesome-feature`
- To: `development`
- Test in development environment

### 5. Promote to Production (When Ready)

```bash
# Switch to master (production)
git checkout master
git pull origin master

# Merge development into master
git merge development

# Build and deploy
npm run build
firebase deploy --only hosting
```

## 🔄 Environment Variables

### Production (`master` branch)
- Uses `.env.production`
- Firebase: `fitness-tracker573` (live)
- Deployed to: https://fitness-tracker573.web.app

### Development (`development` branch)
- Uses `.env.development`
- Firebase: `fitness-tracker573` (same project for now)
- Can be tested locally or deployed to separate Firebase project

### Local Testing (`.env.local`)
- Copy from `.env.local.example`
- Won't be committed (in .gitignore)
- Use for personal testing

```bash
# Setup local environment
cp .env.local.example .env.local

# Edit .env.local with any credentials you want to test with
# Then run:
npm start
```

## 📊 Example: Adding a Feature

```bash
# 1. Start from development
git checkout development

# 2. Create feature branch
git checkout -b feature/add-meal-tracking

# 3. Add feature
# (Edit files, test locally with npm start)

# 4. Commit
git add .
git commit -m "Add meal tracking feature"
git push origin feature/add-meal-tracking

# 5. Create PR on GitHub (development ← feature/add-meal-tracking)
# 6. Review and test in development
# 7. Merge to development
# 8. Later, merge development to master for production

# 9. Deploy production
git checkout master
git pull origin master
git merge development
npm run build
firebase deploy --only hosting
```

## 🛡️ Keeping Production Stable

- **NEVER commit directly to `master`** — Always use development first
- **NEVER deploy without testing** — Test on `development` branch first
- **Use feature branches** — Keeps development clean
- **Review before merging** — Catch bugs before production

## 🔗 Related Files

- `DEV_WORKFLOW.md` — Full development workflow guide
- `.env.production` — Production Firebase credentials
- `.env.development` — Development Firebase credentials
- `.env.local.example` — Template for local environment

## 📞 Quick Commands Reference

```bash
# View all branches
git branch -a

# Switch to development
git checkout development

# Update from remote
git pull origin development

# Create feature branch
git checkout -b feature/name

# Push to remote
git push origin feature/name

# Build for testing
npm run build

# Deploy production
firebase deploy --only hosting

# Check deployment status
firebase deploy --debug
```

---

**You're all set!** Use `development` for testing, `master` for production. 🎉
