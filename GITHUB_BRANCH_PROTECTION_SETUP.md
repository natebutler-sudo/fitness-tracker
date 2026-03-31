# GitHub Branch Protection Rules - Exact Setup Steps

## How to Configure Branch Protection on GitHub

### Step 1: Go to Repository Settings

1. Go to your repo: https://github.com/natebutler-sudo/fitness-tracker
2. Click **Settings** (top navigation)
3. Click **Branches** (left sidebar)

---

### Step 2: Add Branch Protection Rule for `master`

Click **"Add rule"** button

---

### Step 3: Configure Protection Settings

Enter the following settings exactly:

#### **Branch name pattern**
```
master
```

---

#### **Protect matching branches** (Check these boxes)

☑️ **Require a pull request before merging**
   - Dismiss stale pull request approvals when new commits are pushed: ☑️
   - Require code review from code owners: ☐ (optional, only if you have CODEOWNERS file)

☑️ **Require status checks to pass before merging**
   - Require branches to be up to date before merging: ☑️
   - Status checks that must pass:
     - `build / test`
     - `build / validate-branch-protection`
     - `build / validate-pr-source`

☑️ **Require conversation resolution before merging**: ☐ (optional)

☐ **Require deployments to succeed before merging**: Leave unchecked

☑️ **Restrict who can push to matching branches**: ☐ (optional - only if you want to limit pushers)

☐ **Require signed commits**: Leave unchecked

---

### Step 4: Review Summary

Your configuration should look like:

```
Branch name pattern: master

☑ Require a pull request before merging
  ☑ Dismiss stale pull request approvals when new commits are pushed
  ☐ Require code review from code owners

☑ Require status checks to pass before merging
  ☑ Require branches to be up to date before merging
  - Status checks:
    ☑ build / test
    ☑ build / validate-branch-protection
    ☑ build / validate-pr-source

☐ Require conversation resolution before merging
☐ Require deployments to succeed before merging
☐ Restrict who can push to matching branches
☐ Require signed commits
```

---

### Step 5: Save

Click **"Create"** button (or **"Save changes"** if editing existing rule)

---

## What This Accomplishes

After setup, these rules FORCE the workflow:

### ✅ Cannot merge PR without:
1. At least 1 approval from another person
2. All GitHub Actions checks passing:
   - Build succeeds (`build / test`)
   - Branch validation passes (`build / validate-branch-protection`)
   - PR source validation passes (`build / validate-pr-source`)
3. Branch is up to date with master

### ✅ If tests fail:
- Red ❌ on PR merge button
- Cannot click "Squash and merge" or "Merge pull request"
- Must fix errors and push new commits
- Tests re-run automatically

### ✅ If new commits are pushed while PR is approved:
- Approval is dismissed
- Reviewer must approve again
- Prevents merging outdated code

---

## Verification - Test the Protection

Once configured, test it:

```bash
# 1. Create a test PR with a failing build
git checkout development
git checkout -b test/verify-protection
echo "broken code" > src/App.js
git add src/App.js
git commit -m "test: break build"
git push origin test/verify-protection
```

2. Go to GitHub and create PR: `test/verify-protection` → `master`

3. You should see:
   - ❌ Status checks failing (build error)
   - 🔴 Red X on merge button
   - Message: "All status checks have failed"
   - **Cannot merge** until tests pass

4. Clean up test:
   ```bash
   git checkout development
   git branch -D test/verify-protection
   git push origin --delete test/verify-protection
   ```

---

## Complete Protection Chain

Your workflow is now protected at THREE levels:

```
Level 1: Local Machine
  ├─ .husky/pre-commit → Blocks commits to master
  └─ .husky/pre-push → Blocks pushes to master

Level 2: GitHub Actions (Cloud)
  ├─ validate-branch-protection → Blocks direct master pushes
  ├─ test → Blocks merge if build fails
  ├─ validate-pr-source → Blocks improper PRs
  └─ deploy-production → Auto-deploys master

Level 3: GitHub Settings (Repository)
  ├─ Require PR before merge
  ├─ Require status checks pass
  ├─ Require branch up to date
  └─ Dismiss stale approvals
```

---

## If You Need to Modify Later

To edit the rule:
1. Go to Settings → Branches
2. Find the rule for `master`
3. Click the pencil icon (Edit)
4. Make changes
5. Click "Save changes"

To delete the rule:
1. Go to Settings → Branches
2. Find the rule for `master`
3. Click the trash icon (Delete)
4. Confirm

---

## Troubleshooting

### "Status checks not appearing"
- GitHub Actions may need to run once first
- Create a dummy PR to trigger workflow
- Then configure branch protection
- The checks will appear in the dropdown

### "Cannot find status checks to select"
- Wait 5-10 minutes for workflow to run
- The checks appear after first workflow execution
- Manual refresh (F5) may help

### "Merge button still shows as available"
- GitHub caches settings
- Refresh the page (F5)
- Create a new test PR
- Rules should apply

---

## Summary

Once complete, your workflow is fully enforced:

1. ✅ Work on development/feature branches locally
2. ✅ Tests run automatically on every push
3. ✅ Cannot merge without approval + passing tests
4. ✅ Stale approvals are dismissed when new commits come in
5. ✅ Master is always production-ready
6. ✅ Production deployment is automatic when merged

**Now all 6 points are guaranteed to happen every time.**
