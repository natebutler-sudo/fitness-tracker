# Fitness Tracker - Workflow Guardrails & Enforcement

This document outlines all guardrails that prevent improper commits/deploys and enforce the development → testing → production workflow.

---

## Workflow Overview

```
┌─────────────────────────────────────────────────────────────┐
│ 1. Work on feature branch (locally on development)          │
│    git checkout -b feature/your-feature                     │
│    Use .env.development for local testing                   │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 2. Push to origin/development                               │
│    git push origin feature/your-feature                     │
│    (.husky/pre-push hook prevents pushes to master)         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 3. Create PR: feature/your-feature → master                 │
│    (.github/workflows/workflow-enforcement.yml runs tests)  │
│    Requires 1 approval before merge                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 4. Merge PR to master via GitHub                            │
│    (Cannot do this locally - GitHub only)                   │
│    (.husky/pre-push hook blocks local master pushes)        │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│ 5. Auto-deploy to production                                │
│    (GitHub Actions auto-deploys on master push)             │
│    https://fitness-tracker573.web.app                       │
└─────────────────────────────────────────────────────────────┘
```

---

## Guardrail Locations & What They Enforce

### A. LOCAL GIT HOOKS - `.husky/pre-commit`

**Location:** `.husky/pre-commit`

**What it does:**
- ❌ Prevents commits directly to `master`, `production`, or `main` branches
- ⚠️  Warns if `.env.development` is missing when working on development

**Error Example:**
```
❌ ERROR: Direct commits to 'master' are not allowed.

✅ Proper workflow:
  1. Switch to development branch:
     git checkout development
  2. Create a feature branch:
     git checkout -b feature/your-feature
  ...
```

**Where logic runs:** Every time you run `git commit`

**To bypass (NOT RECOMMENDED):** `git commit --no-verify` (but don't do this!)

---

### B. LOCAL GIT HOOKS - `.husky/pre-push`

**Location:** `.husky/pre-push`

**What it does:**
- ❌ Prevents pushing directly to `master`, `production`, or `main` branches
- ✅ Allows pushing to `development` or feature branches (`feature/*`, `bugfix/*`, `hotfix/*`)
- ⚠️  Warns if you're on an unusual branch name

**Error Example:**
```
❌ ERROR: Cannot push directly to 'master' branch
All changes must come through development branch via PR

✅ Proper workflow:
  1. Push your feature branch instead:
     git push origin feature-name
  2. Create a PR on GitHub: development → master
  ...
```

**Where logic runs:** Every time you run `git push`

**To bypass (NOT RECOMMENDED):** `git push --no-verify` (but don't do this!)

---

### C. GITHUB ACTIONS - `.github/workflows/workflow-enforcement.yml`

**Location:** `.github/workflows/workflow-enforcement.yml`

**What it does:**

#### 1. Validate Branch Protection (on every push)
- ❌ Blocks direct pushes to master
- Only runs when you push to a branch (not PRs)

#### 2. Run Tests (on PR and development pushes)
```
✅ Checks:
  - npm install (dependency install)
  - npm run build (verify build works)
  - ESLint (if configured)
  - Verify build/output directory created
```

**Runs on:**
- Every push to `development`
- Every PR to `master`

**Required status checks:** Build must succeed before PR can merge

#### 3. Auto-Deploy to Production (master pushes only)
```
✅ Auto-triggers on:
  - Merge to master (via GitHub PR)
  - Does NOT trigger on manual master pushes (blocked by pre-push hook)

Deploys to:
  https://fitness-tracker573.web.app/

Also runs:
  - npm install
  - npm run build
  - Firebase Hosting deployment
```

#### 4. Validate PR Source Branch
```
✅ Checks:
  - PR source is NOT master (prevents accidental master→master PRs)
  - PR target IS master (ensures release flow)
```

**Where logic runs:** GitHub servers (cloud, not local)

---

## Environment Files - What Gets Used Where

| Location | Environment | Purpose |
|----------|-------------|---------|
| `.env.development` | Local machine (`npm start`) | Development with local Firebase config |
| `.env.production` | GitHub Actions (CI/CD) | Production secrets from GitHub Secrets |
| GitHub Secrets | GitHub Actions only | Sensitive keys (API keys, Firebase creds) |

**Key files in `.env.development`:**
```
REACT_APP_FIREBASE_API_KEY=...
REACT_APP_FIREBASE_PROJECT_ID=...
REACT_APP_GEMINI_API_KEY=...
```

**Key secrets in GitHub Secrets:**
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_GEMINI_API_KEY
FIREBASE_SERVICE_ACCOUNT_KEY
```

---

## How to Work Properly - Step-by-Step Examples

### ✅ Correct Workflow: Adding a New Feature

```bash
# 1. Make sure you're up to date
git checkout development
git pull origin development

# 2. Create feature branch
git checkout -b feature/add-workout-logging

# 3. Make changes (this is where you write code)
# ... edit files ...

# 4. Test locally with .env.development
npm start
# Visit localhost:3000 and test your feature

# 5. Commit changes
git add src/components/LogWorkout.js
git commit -m "feat: add workout logging modal"
# ✅ .husky/pre-commit hook validates this is safe

# 6. Push to origin
git push origin feature/add-workout-logging
# ✅ .husky/pre-push hook validates you're not pushing to master

# 7. Create PR on GitHub
# Go to https://github.com/YOUR_USERNAME/fitness-tracker
# Click "New Pull Request"
# From: feature/add-workout-logging
# To: master
# ℹ️ GitHub Actions automatically runs tests

# 8. Once tests pass & PR approved, merge via GitHub UI
# Do NOT merge locally - merge on GitHub

# 9. GitHub Actions auto-deploys to production
# Check https://fitness-tracker573.web.app in 2-3 minutes
```

### ❌ BLOCKED Workflow: Direct Master Commit

```bash
git checkout master
git commit -m "quick fix"
# ❌ .husky/pre-commit ERROR:
# "ERROR: Direct commits to 'master' are not allowed."
# Workflow blocked! Must use feature branch.
```

### ❌ BLOCKED Workflow: Direct Master Push

```bash
git checkout development
git commit -m "feat: something"
git push origin master
# ❌ .husky/pre-push ERROR:
# "ERROR: Cannot push directly to 'master' branch"
# Workflow blocked! Must create PR instead.
```

### ❌ BLOCKED Workflow: No Tests on Master Merge

```
You try to merge PR to master in GitHub UI
↓
GitHub Actions runs tests automatically
↓
Build fails (npm run build error)
↓
Cannot merge - status checks failed
↓
Fix the error, push to feature branch
↓
Tests re-run automatically
↓
Once passing, you can merge
```

---

## Troubleshooting Guardrails

### Problem: "pre-commit: Permission denied"
```bash
# Fix: Make hooks executable
chmod +x .husky/pre-commit .husky/pre-push

# Or reinstall husky
npm install husky
npx husky install
```

### Problem: "Direct commits to 'master' are not allowed"
```bash
# You're on master trying to commit
# Solution:
git checkout development
git checkout -b feature/your-feature
# Now make your commit
```

### Problem: "Cannot push directly to 'master' branch"
```bash
# You're trying to git push origin master
# Solution: Don't push to master locally!
# Use GitHub UI to merge PR instead

# If you accidentally committed to master:
git reset HEAD~1              # Undo last commit
git checkout development       # Switch to development
git checkout -b feature/name   # Create feature branch
git commit -m "feat: fix"      # Now commit is on feature branch
git push origin feature/name   # Push feature branch
```

### Problem: Build fails on GitHub Actions
```
GitHub Actions log shows build error
↓
Check the error message
↓
Fix the issue locally
↓
git push to your feature branch
↓
GitHub Actions automatically re-runs tests
```

---

## Bypassing Guardrails (Only in Emergency)

**If you absolutely must bypass (not recommended):**

```bash
# Bypass pre-commit hook:
git commit --no-verify

# Bypass pre-push hook:
git push --no-verify

# But you CANNOT bypass GitHub Actions
# (those run on GitHub servers, not your machine)
```

**⚠️ WARNING:** Bypassing these should be EXTREMELY rare. If you need to bypass, it means the workflow needs discussion. Contact Nate first.

---

## Summary - What Blocks What

| Action | Blocked By | How to Fix |
|--------|-----------|-----------|
| `git commit` on master | `.husky/pre-commit` | Switch to feature branch first |
| `git push origin master` | `.husky/pre-push` | Use GitHub PR UI instead |
| Merge PR without tests passing | GitHub Actions | Fix build errors, re-push |
| Direct push to master from local | `.husky/pre-push` | Merge via GitHub UI instead |
| Deploy without master merge | GitHub Actions | Only deploys on master→production |

---

## Testing the Guardrails

To verify guardrails are working:

```bash
# Test 1: Try to commit on master
git checkout master
git touch test.txt
git add test.txt
git commit -m "test"
# Expected: ❌ Error - prevented

# Test 2: Try to push to master
git checkout development
git touch test.txt
git add test.txt
git commit -m "test"
git push origin master
# Expected: ❌ Error - prevented

# Test 3: Feature branch works
git checkout development
git checkout -b feature/test
git touch test.txt
git add test.txt
git commit -m "test"
git push origin feature/test
# Expected: ✅ Works!
```

---

## Questions?

When guardrails block you, it's intentional. The workflow exists to ensure:
- ✅ All code is tested before production
- ✅ No accidental master pushes
- ✅ Production is always deployable
- ✅ Clear history of what changed when

Follow the proper workflow and you'll never hit these blocks.
