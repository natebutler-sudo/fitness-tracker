# Security Policy

## Reporting Security Vulnerabilities

**Do not** open public GitHub issues for security vulnerabilities. This could allow attackers to exploit the vulnerability before a fix is available.

### Reporting Process

1. **Email the maintainers** with details of the vulnerability
2. **Include**:
   - Description of the vulnerability
   - Steps to reproduce
   - Potential impact
   - Suggested fix (if available)
3. **Do not** disclose the vulnerability publicly until a patch is available

### Response Timeline

- **24 hours**: Initial acknowledgment
- **7 days**: Assessment and patch plan
- **30 days**: Fix release target (varies by severity)

## Security Best Practices

### For Users

- Keep Node.js and npm updated
- Use `.env` files for secrets (never commit them)
- Enable Firebase authentication appropriately
- Review Firebase security rules regularly

### For Developers

- Do not commit API keys or credentials
- Use GitHub Secrets for CI/CD sensitive data
- Validate and sanitize user input
- Keep dependencies updated
- Review security advisories: `npm audit`

## Supported Versions

| Version | Supported |
|---------|-----------|
| 0.1.x   | ✅ Yes    |
| < 0.1   | ❌ No     |

## Dependencies Security

This project uses:
- **React** — Web framework
- **Firebase** — Backend & authentication
- **Google Generative AI** — AI features

We monitor security advisories and update dependencies regularly. Run `npm audit` to check for vulnerabilities:

```bash
npm audit
npm audit fix  # Auto-fix if possible
```

## Contact

For security concerns, contact the maintainers through private channels. Do not open public issues for security-sensitive topics.

## Acknowledgments

We appreciate responsible disclosure. Contributors who report vulnerabilities will be acknowledged in our release notes (unless you prefer anonymity).
