# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Trainer chat UI with timestamps
- Copy button for trainer messages
- GitHub branch protection setup guide
- Guardrails quick reference guide

### Changed
- Updated package dependencies to match package.json
- Improved package-lock.json management

### Fixed

### Deprecated

### Removed

### Security

## [0.1.0] - 2026-04-04

### Added
- Initial project setup
- React + Firebase foundation
- Workout library and tracking features
- Weekly randomizer for workout schedules
- Progress tracking with charts
- User authentication via Firebase
- Firestore database structure
- Firebase Hosting deployment
- GitHub Actions CI/CD workflow
- Branch protection enforcement
- ESLint configuration

### Features
- **Workout Library** — Based on trainer workouts (upper body, lower body, cardio)
- **Weekly Randomizer** — New randomized workout schedule each week (Mon-Fri)
- **Progress Tracker** — Log reps, weights, dates
- **Visual History** — Charts showing progress over time
- **Bodyweight & Dumbbell Friendly** — No gym equipment required

---

## Release Process

### Version Numbering

- **MAJOR** — Breaking changes
- **MINOR** — New features (backwards compatible)
- **PATCH** — Bug fixes

### Creating a Release

1. Update `CHANGELOG.md` with changes
2. Update version in `package.json`
3. Commit changes: `chore: Bump version to X.Y.Z`
4. Create git tag: `git tag vX.Y.Z`
5. Push tag: `git push origin vX.Y.Z`
6. GitHub Actions will auto-deploy to production

### Commit Message Convention

```
<type>: <subject>

<body>

<footer>
```

**Types**: `feat`, `fix`, `docs`, `style`, `refactor`, `perf`, `test`, `chore`

**Example**:
```
feat: Add progress export to CSV

- Users can now export their workout history
- Includes date, exercise, reps, and weight
- Fixes #123

Closes #123
```

## Notes

- Patch releases may be released more frequently
- Major releases will be announced in advance
- All releases are deployed to https://fitness-tracker573.web.app
