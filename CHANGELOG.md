# Changelog

All notable changes to Restaurant Picker will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Shared API utilities module (`functions/api/_shared.js`) to eliminate code duplication
- Restaurant edit functionality (PUT endpoint at `/api/restaurants`)
- Profile edit functionality (PUT endpoint at `/api/profiles`)
- UUID-based ID generation for restaurants (replacing sequential integers)
- Enhanced URL validation with reachability check option
- Service worker for offline PWA support (`sw.js`)
- Automated testing infrastructure with Vitest
- ESLint and Prettier for code quality
- CI/CD pipeline with GitHub Actions
- OpenAPI/Swagger API documentation (`openapi.yaml`)
- `CONTRIBUTING.md` with development guidelines
- `CHANGELOG.md` for tracking changes
- JWT token expiration (1-hour sessions)
- Comprehensive input validation for all API endpoints

### Changed

- Authentication tokens now include timestamp for expiration tracking
- API responses now use standardized format from shared utilities
- Restaurant IDs now support both UUID and integer formats
- CORS headers now configurable via environment variables
- Improved error messages across all API endpoints

### Fixed

- Token validation now properly checks expiration time
- Restaurant deletion now handles both UUID and integer IDs

### Security

- Added token expiration (1-hour limit)
- Enhanced input validation and sanitization
- Improved URL validation

## [1.0.0] - 2024-12-07

### Added

- Sound Effects with toggleable controls
- Custom wheel colors with color picker
- PWA manifest for installable web app
- Bulk edit functionality for restaurants
- Export/Import data management
- Restaurant duplication feature
- Confetti celebration animation
- Full dark mode support
- Batch save system for GitHub commits
- Unsaved changes tracking UI
- Service type mini-wheel for random selection
- At-home cooking option for recipes
- Profile autocomplete with search
- Dining profiles for custom restaurant subsets
- Service type filtering (takeout, delivery, dine-in, at-home)
- Food type checkbox filters
- GitHub-based data persistence
- Token-based authentication
- Cloudflare Functions backend
- Canvas-based spinning wheel interface
- Responsive design for mobile and desktop

### Initial Features

- Basic restaurant management (add, delete)
- Profile management (add, delete)
- Wheel spinning with animation
- Filter by profile and service type
- Admin panel with authentication
- CRUD operations via REST API
- GitHub integration for data storage
- Comprehensive README documentation

## [0.1.0] - Initial Development

### Added

- Project scaffolding
- Basic HTML structure
- Initial CSS styling
- Core JavaScript functionality
- GitHub repository setup

---

## Version History

- **2.0.0** (Unreleased) - Major refactoring, testing, and CI/CD infrastructure
- **1.0.0** (2024-12-07) - Production release with full feature set
- **0.1.0** - Initial development

---

## Upgrade Guide

### From 1.x to 2.x

**Breaking Changes:**

- Restaurant IDs may now be UUIDs instead of integers
- Authentication tokens now expire after 1 hour
- API responses format has changed (now includes `success` boolean)

**Migration Steps:**

1. **Update API client code** to handle new response format:

   ```javascript
   // Old format
   const data = await response.json();

   // New format
   const { success, data, error } = await response.json();
   if (!success) {
     console.error(error);
   }
   ```

2. **Re-authenticate** if using old tokens (they will be expired)

3. **Update restaurant IDs** if needed:
   - Old integer IDs are still supported
   - New restaurants will use UUID format
   - Both formats work with all endpoints

4. **Install dependencies** for new tooling:

   ```bash
   npm install
   ```

5. **Run tests** to verify compatibility:
   ```bash
   npm test
   ```

---

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for details on our code of conduct and the process for submitting pull requests.

## License

This project is licensed under the MIT License - see the LICENSE file for details.
