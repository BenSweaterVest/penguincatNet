# Contributing to Restaurant Picker

Thank you for your interest in contributing to Restaurant Picker! This document provides guidelines and instructions for contributing to the project.

## Table of Contents

- [Code of Conduct](#code-of-conduct)
- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Coding Standards](#coding-standards)
- [Testing](#testing)
- [Pull Request Process](#pull-request-process)
- [API Development](#api-development)
- [UI Development](#ui-development)

## Code of Conduct

This project follows a standard code of conduct. Please be respectful and constructive in all interactions.

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Git
- Cloudflare account (for deployment testing)
- GitHub account

### Setup Development Environment

1. **Fork and clone the repository**

   ```bash
   git fork https://github.com/BenSweaterVest/penguincatNet.git
   cd penguincatNet
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables**
   Create `.dev.vars` file:

   ```bash
   ADMIN_PASSWORD=your_dev_password
   GITHUB_TOKEN=your_github_token
   GITHUB_REPO=username/repository
   GITHUB_BRANCH=main
   ```

4. **Start local development server**
   ```bash
   npm run dev
   ```
   Access at `http://localhost:8788`

## Development Workflow

### Branch Naming Convention

- `feature/` - New features (e.g., `feature/add-ratings`)
- `bugfix/` - Bug fixes (e.g., `bugfix/fix-wheel-spin`)
- `docs/` - Documentation updates (e.g., `docs/update-readme`)
- `refactor/` - Code refactoring (e.g., `refactor/clean-api-handlers`)
- `test/` - Test additions/updates (e.g., `test/add-profile-tests`)

### Commit Message Format

Follow conventional commits specification:

```
type(scope): subject

body (optional)

footer (optional)
```

**Types:**

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, missing semi-colons, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

**Examples:**

```bash
feat(api): add restaurant rating support
fix(wheel): correct spin animation timing
docs(readme): update deployment instructions
test(api): add validation tests for profiles
```

## Coding Standards

### JavaScript Style Guide

We use ESLint and Prettier for code formatting. Configuration files:

- `.eslintrc.json` - Linting rules
- `.prettierrc.json` - Formatting rules

**Run linting:**

```bash
npm run lint        # Check for issues
npm run lint:fix    # Auto-fix issues
npm run format      # Format code with Prettier
```

### Key Conventions

1. **Use ES6+ features**
   - Arrow functions
   - Destructuring
   - Template literals
   - Async/await

2. **Error handling**
   - Always use try-catch for async operations
   - Return appropriate HTTP status codes
   - Provide descriptive error messages

3. **Code organization**
   - Keep functions small and focused
   - Use descriptive variable and function names
   - Add JSDoc comments for functions
   - Organize imports at the top

4. **Security practices**
   - Sanitize all user input
   - Validate data on both client and server
   - Use environment variables for secrets
   - Never commit sensitive data

### Example Function Documentation

```javascript
/**
 * Validate restaurant data before saving
 *
 * @param {Object} restaurant - Restaurant object to validate
 * @returns {Object} - { valid: boolean, errors: Array<string> }
 *
 * @example
 * const validation = validateRestaurantData(newRestaurant);
 * if (!validation.valid) {
 *   console.error(validation.errors);
 * }
 */
function validateRestaurantData(restaurant) {
  // Implementation
}
```

## Testing

### Running Tests

```bash
npm run test              # Run all tests
npm run test:ui           # Run tests with UI
npm run test:coverage     # Generate coverage report
```

### Writing Tests

Tests are located in `tests/` directory and use Vitest.

**Test file naming:** `[module-name].test.js`

**Example test structure:**

```javascript
import { describe, it, expect, beforeEach } from 'vitest';

describe('Module Name', () => {
  beforeEach(() => {
    // Setup
  });

  it('should do something specific', () => {
    // Arrange
    const input = 'test';

    // Act
    const result = someFunction(input);

    // Assert
    expect(result).toBe('expected');
  });
});
```

### Test Coverage Requirements

- Maintain minimum 80% code coverage
- All new features must include tests
- Bug fixes should include regression tests

## Pull Request Process

### Before Submitting

1. **Update from main branch**

   ```bash
   git fetch origin
   git rebase origin/main
   ```

2. **Run quality checks**

   ```bash
   npm run lint
   npm run test
   ```

3. **Update documentation**
   - Update README.md if adding features
   - Add/update JSDoc comments
   - Update CHANGELOG.md

### PR Checklist

- [ ] Code follows style guidelines
- [ ] All tests pass
- [ ] New tests added for new features
- [ ] Documentation updated
- [ ] No console.log statements (use console.warn or console.error)
- [ ] Environment variables documented
- [ ] CHANGELOG.md updated

### PR Template

When creating a PR, include:

```markdown
## Description

Brief description of changes

## Type of Change

- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing

How was this tested?

## Screenshots (if applicable)

Add screenshots for UI changes

## Checklist

- [ ] Code follows style guidelines
- [ ] Tests added/updated
- [ ] Documentation updated
```

## API Development

### Adding New Endpoints

1. **Create endpoint file** in `functions/api/`

2. **Use shared utilities** from `functions/api/_shared.js`

3. **Implement handlers**

   ```javascript
   import { verifyAuth, errorResponse, successResponse } from './_shared.js';

   export async function onRequestGet(context) {
     // Implementation
   }

   export async function onRequestPost(context) {
     if (!verifyAuth(context.request, context.env)) {
       return errorResponse('Unauthorized', 401, context.env);
     }
     // Implementation
   }
   ```

4. **Add tests** in `tests/api/[endpoint].test.js`

5. **Update OpenAPI spec** in `openapi.yaml`

### API Response Format

**Success:**

```json
{
  "success": true,
  "data": { ... }
}
```

**Error:**

```json
{
  "error": "Error message",
  "details": "Additional context"
}
```

## UI Development

### Adding Features to index.html

1. **CSS Section** - Add styles for new components
2. **HTML Section** - Add markup for new UI elements
3. **JavaScript Section** - Add functionality
4. **Test manually** in both light and dark modes
5. **Test responsiveness** on mobile and desktop

### State Management

- Use global variables sparingly
- Leverage localStorage for persistent data
- Update UI immediately after state changes
- Handle loading states for async operations

### Accessibility

- Use semantic HTML elements
- Include ARIA labels where appropriate
- Ensure keyboard navigation works
- Test with screen readers
- Maintain sufficient color contrast

## Questions or Issues?

- **Bug reports:** Create an issue with "bug" label
- **Feature requests:** Create an issue with "enhancement" label
- **Questions:** Create an issue with "question" label

Thank you for contributing to Restaurant Picker! 🍕🎡
