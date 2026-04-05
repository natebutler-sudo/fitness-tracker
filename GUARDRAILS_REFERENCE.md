# Guardrails Reference - Where the Logic Is

## Quick Lookup: Where Each Guardrail Lives

```
fitness-tracker/
├── .husky/                          ← LOCAL MACHINE GUARDRAILS
│   ├── pre-commit                   ← Prevents commits to master
│   └── pre-push                     ← Prevents pushes to master
│
├── .github/workflows/
│   └── workflow-enforcement.yml     ← GITHUB ACTIONS GUARDRAILS (Cloud)
│       ├── validate-branch-protection
│       ├── test (build, lint, verify)
│       ├── deploy-production (auto-deploys master)
│       └── validate-pr-source (ensures PR flow)
│
└── WORKFLOW_GUARDRAILS.md           ← DOCUMENTATION
```

---

## 1️⃣ LOCAL GIT HOOKS (Run on YOUR computer)

### File: `.husky/pre-commit`
**When it runs:** Every time you run `git commit`
**What it prevents:**
- ❌ Commits directly to `master` branch
- ❌ Commits directly to `production` or `main` branches
- ⚠️ Warns if `.env.development` missing

**Key logic:**
```bash
BRANCH=$(git rev-parse --abbrev-ref HEAD)

if [ "$BRANCH" = "master" ] || [ "$BRANCH" = "production" ]; then
  echo "❌ ERROR: Direct commits to '$BRANCH' are not allowed."
  exit 1
fi
```

**Test it:**
```bash
git checkout master
touch test.txt && git add test.txt
git commit -m "test"
# → ❌ BLOCKED with error message
```

---

### File: `.husky/pre-push`
**When it runs:** Every time you run `git push`
**What it prevents:**
- ❌ Pushes directly to `master`, `production`, or `main`
- ✅ Allows pushes to `development` or feature branches
- ⚠️ Warns if unusual branch name

**Key logic:**
```bash
protected_branches='^(master|production|main)$'
current_branch=$(git symbolic-ref --short HEAD)

if echo "$current_branch" | grep -qE "$protected_branches"; then
  echo "❌ ERROR: Cannot push directly to '$current_branch' branch"
  exit 1
fi
```

**Test it:**
```bash
git checkout feature/test
git push origin master
# → ❌ BLOCKED with error message
# Instead, create PR on GitHub
```

---

## 2️⃣ GITHUB ACTIONS WORKFLOWS (Run on GitHub servers)

### File: `.github/workflows/workflow-enforcement.yml`

This runs FOUR separate jobs automatically:

#### Job 1: `validate-branch-protection`
**Trigger:** Any push to any branch
**What it does:**
- ❌ Blocks any direct push to `master`
- Shows error if detected
- Validates push is to correct branch

**Key logic:**
```yaml
if: github.event_name == 'push'
    if [ "${{ github.ref }}" = "refs/heads/master" ]; then
      echo "❌ ERROR: Direct push to master detected!"
      exit 1
    fi
```

**Can't bypass:** Even if you somehow bypass local hooks, GitHub will reject it

---

#### Job 2: `test`
**Trigger:**
- Every push to `development`
- Every PR to `master`

**What it tests:**
```
✅ npm install       (Install dependencies)
✅ npm run build     (Verify app builds)
✅ npm run lint      (Check code style, if configured)
✅ Verify build/ dir exists
```

**Fails if:**
- npm install fails
- Build has errors
- Lint errors (if configured)

**Key logic:**
```yaml
- name: Build application
  run: npm run build
  env:
    REACT_APP_FIREBASE_API_KEY: ${{ secrets.REACT_APP_FIREBASE_API_KEY }}
    REACT_APP_GEMINI_API_KEY: ${{ secrets.REACT_APP_GEMINI_API_KEY }}
```

**Example failure flow:**
```
1. You push to feature branch
2. GitHub Actions runs tests
3. Build fails (e.g., missing import)
4. Status check shows ❌ FAILED
5. You can't merge PR until fixed
6. Fix the error locally
7. Push to same feature branch
8. Tests re-run automatically
9. Once passing, you can merge
```

---

#### Job 3: `deploy-production`
**Trigger:** Push to `master` branch ONLY

**What it does:**
```
✅ Checkout code
✅ npm install
✅ npm run build (for production)
✅ Deploy to Firebase Hosting
✅ Post success notification
```

**Deploys to:** `https://fitness-tracker573.web.app`

**Key logic:**
```yaml
if: github.ref == 'refs/heads/master' && github.event_name == 'push'

- name: Deploy to Firebase Hosting
  uses: FirebaseExtended/action-hosting-deploy@v0
  with:
    firebaseServiceAccount: ${{ secrets.FIREBASE_SERVICE_ACCOUNT_KEY }}
    projectId: fitness-tracker573
```

**Important:** This ONLY runs when master is updated via PR merge, not direct pushes (which are blocked by pre-push hook)

---

#### Job 4: `validate-pr-source`
**Trigger:** Every pull request

**What it validates:**
- ❌ PR source is NOT `master`
- ✅ PR target IS `master` (enforces release flow)

**Key logic:**
```yaml
- name: Check PR source branch
  if [ "${{ github.head_ref }}" = "master" ]; then
    echo "❌ ERROR: PR source branch is master"
    exit 1
  fi
```

**Prevents:** Accidental `master → master` PRs

---

## 3️⃣ ENVIRONMENT VARIABLES & SECRETS

### `.env.development` (Local - for local testing)
```
REACT_APP_FIREBASE_API_KEY=your_key_here
REACT_APP_FIREBASE_AUTH_DOMAIN=your_domain_here
REACT_APP_FIREBASE_PROJECT_ID=fitness-tracker573
REACT_APP_GEMINI_API_KEY=your_gemini_key_here
```

**Used by:** `npm start` on your local machine
**Safeguard:** Listed in `.gitignore` - never committed to git

### GitHub Secrets (Cloud - for GitHub Actions)
```
REACT_APP_FIREBASE_API_KEY
REACT_APP_FIREBASE_AUTH_DOMAIN
REACT_APP_FIREBASE_PROJECT_ID
REACT_APP_FIREBASE_STORAGE_BUCKET
REACT_APP_FIREBASE_MESSAGING_SENDER_ID
REACT_APP_FIREBASE_APP_ID
REACT_APP_FIREBASE_MEASUREMENT_ID
REACT_APP_GEMINI_API_KEY
FIREBASE_SERVICE_ACCOUNT_KEY
```

**Used by:** GitHub Actions workflow
**Safeguard:** Stored in GitHub - never exposed in logs
**How to set:**
1. Go to GitHub repo → Settings → Secrets
2. Click "New repository secret"
3. Add each key-value pair

**Access in workflow:**
```yaml
env:
  REACT_APP_GEMINI_API_KEY: ${{ secrets.REACT_APP_GEMINI_API_KEY }}
```

---

## 4️⃣ BRANCH PROTECTION RULES (GitHub Settings)

### Recommended GitHub Settings
Go to: GitHub repo → Settings → Branches → Add rule for `master`

```
✅ Require pull request reviews before merging
   - Number of approvals required: 1

✅ Dismiss stale pull request approvals when new commits are pushed
   (Ensures reviewer re-approves after changes)

✅ Require status checks to pass before merging
   - Require branches to be up to date
   - Status checks:
     - build / test
     - build / deploy-production
```

**Effect:** You CANNOT merge on GitHub UI unless:
1. At least 1 person approved
2. All status checks passed (tests, build)
3. Branch is up to date

---

## Guardrails Flow Diagram

```
┌─────────────────────────────────────┐
│ You try to: git commit              │
└──────────┬──────────────────────────┘
           │
           ├─→ On master? ❌
           │   (.husky/pre-commit)
           │   BLOCKED!
           │
           ├─→ On feature/x? ✅
           │   (.husky/pre-commit)
           │   Commit proceeds
           │
           └─→ COMMIT SAVED

┌─────────────────────────────────────┐
│ You try to: git push origin X       │
└──────────┬──────────────────────────┘
           │
           ├─→ Pushing to master? ❌
           │   (.husky/pre-push)
           │   BLOCKED!
           │
           ├─→ Pushing to feature/x? ✅
           │   (.husky/pre-push)
           │   Push proceeds
           │
           └─→ PUSH TO GITHUB

┌─────────────────────────────────────┐
│ GitHub Actions receives push        │
└──────────┬──────────────────────────┘
           │
           ├─→ Is this master?
           │   YES:
           │   ├─ validate-branch-protection ✅
           │   ├─ test (build + lint)
           │   │  ├─ Fail? ❌ No deploy
           │   │  └─ Pass? ✅ Continue
           │   └─ deploy-production (auto-deploy!)
           │
           └─→ Is this PR to master?
               ├─ validate-pr-source ✅
               ├─ test (build + lint)
               │  ├─ Fail? ❌ Can't merge
               │  └─ Pass? ✅ Can merge
               └─ wait for approval
```

---

## Testing Guardrails

To verify all guardrails are working:

```bash
# Test 1: Pre-commit hook
git checkout master
touch .test
git add .test
git commit -m "test"
# Expected: ❌ ERROR - Direct commits not allowed

# Test 2: Pre-push hook
git checkout development
git checkout -b feature/test
touch .test
git add .test
git commit -m "test"
git push origin master
# Expected: ❌ ERROR - Cannot push to master

# Test 3: Feature branch works
# (from same branch as Test 2)
git push origin feature/test
# Expected: ✅ Pushes successfully

# Test 4: GitHub Actions (via PR)
# Create PR from feature/test → master on GitHub
# Expected: Automatic test run, shows status

# Clean up test
git branch -D feature/test
git push origin --delete feature/test
```

---

## Maintenance Checklist

- [ ] `.husky/pre-commit` is executable: `ls -la .husky/pre-commit` shows `x`
- [ ] `.husky/pre-push` is executable: `ls -la .husky/pre-push` shows `x`
- [ ] `.github/workflows/workflow-enforcement.yml` exists
- [ ] GitHub Secrets are set (Settings → Secrets)
- [ ] Branch protection rule on `master` is configured
- [ ] Team knows about `WORKFLOW_GUARDRAILS.md`

---

## Where to Go For Help

| Question | Answer |
|----------|--------|
| "How do I work properly?" | Read `WORKFLOW_GUARDRAILS.md` |
| "Why is X blocked?" | Check this file's relevant section |
| "Is this hook working?" | Run the test commands above |
| "How do I set GitHub Secrets?" | See "Branch Protection Rules" section |
| "Can I bypass guardrails?" | Only with `--no-verify` (discouraged) |

---

## Summary: One-Liner for Each Guardrail

| Guardrail | Location | Purpose |
|-----------|----------|---------|
| Pre-commit hook | `.husky/pre-commit` | Prevents `git commit` on master |
| Pre-push hook | `.husky/pre-push` | Prevents `git push origin master` |
| Branch validation | `.github/workflows/workflow-enforcement.yml` | Blocks direct pushes to master on GitHub |
| Test suite | `.github/workflows/workflow-enforcement.yml` | Fails PR if build/tests fail |
| Auto-deploy | `.github/workflows/workflow-enforcement.yml` | Auto-deploys master to production |
| PR validation | `.github/workflows/workflow-enforcement.yml` | Ensures PR comes from feature branch |
| Branch protection | GitHub Settings → Branches | Requires approval + passing checks |

All guardrails work together to ensure: **development → feature branch → PR → tests → master → auto-deploy to production**
