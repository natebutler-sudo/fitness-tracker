# Contributing to Fitness Tracker

Thank you for your interest in contributing to Fitness Tracker! We welcome contributions from the community. This document provides guidelines and instructions for contributing.

## Getting Started

1. **Fork the repository** on GitHub
2. **Clone your fork** locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/fitness-tracker.git
   cd fitness-tracker
   ```
3. **Create a feature branch** from `development`:
   ```bash
   git checkout -b feature/your-feature-name
   ```
4. **Set up your environment** (see [README.md](README.md#getting-started))

## Development Workflow

### Branch Naming Convention

- **Feature branches**: `feature/short-description` (e.g., `feature/add-progress-charts`)
- **Bug fixes**: `bugfix/short-description` (e.g., `bugfix/fix-firebase-auth`)
- **Documentation**: `docs/short-description` (e.g., `docs/update-setup-guide`)

### Making Changes

1. **Keep commits small and focused** — one logical change per commit
2. **Write clear commit messages**:
   ```
   feat: Add workout randomizer UI

   - Implement weekly randomization logic
   - Add calendar view component
   - Add tests for randomizer function
   ```
3. **Code style**: Follow the existing code style in the project
   - Use functional components with React hooks
   - Use meaningful variable names
   - Add comments for complex logic

### Testing

Before submitting a PR:

```bash
# Install dependencies
npm install

# Run tests
npm test

# Build the project
npm run build

# Run linter (if configured)
npm run lint
```

Ensure all tests pass and the build completes successfully.

## Submitting a Pull Request

1. **Push to your fork**:
   ```bash
   git push origin feature/your-feature-name
   ```

2. **Create a Pull Request** on GitHub:
   - Use the PR template (it will auto-populate)
   - Link any related issues
   - Provide a clear description of changes
   - Add screenshots if UI changes are involved

3. **PR Requirements**:
   - ✅ All tests pass
   - ✅ Build succeeds
   - ✅ Code follows project conventions
   - ✅ PR targets `master` branch (will be merged via development)
   - ✅ No direct pushes to `master` — always use PRs

4. **Review Process**:
   - At least one maintainer review required
   - Address feedback promptly
   - Request re-review after making changes

## Reporting Issues

### Bug Reports

Use the bug report template when creating an issue. Include:
- Clear, descriptive title
- Steps to reproduce
- Expected vs. actual behavior
- Screenshots/logs if applicable
- Environment (browser, Node version, etc.)

### Feature Requests

Use the feature request template. Include:
- Clear description of the requested feature
- Use cases and motivation
- Proposed implementation (optional)

## Code Review Guidelines

When reviewing code, consider:
- Does it solve the stated problem?
- Is it maintainable and well-documented?
- Does it follow project conventions?
- Are there any security concerns?
- Could it impact performance?

## Branching Strategy

```
master (production)
  ↑
  └─ development (staging)
       ↑
       └─ feature/* (development branches)
```

- **Feature branches** are created from `development`
- **PRs** target `master` and will auto-deploy on merge
- **Direct pushes to master are blocked** by GitHub Actions

## Environment Variables

For local development, create a `.env.local` file:

```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
REACT_APP_FIREBASE_MEASUREMENT_ID=your_measurement_id
REACT_APP_GEMINI_API_KEY=your_gemini_api_key
```

See [GitHub Secrets Setup Guide](docs/github-branch-protection.md) for CI/CD secrets configuration.

## Questions?

- Check existing [GitHub Issues](https://github.com/YOUR_USERNAME/fitness-tracker/issues)
- Review [README.md](README.md) for setup help
- Open a discussion for questions

## License

By contributing, you agree that your contributions will be licensed under the MIT License.

Thank you for contributing! 🙏
