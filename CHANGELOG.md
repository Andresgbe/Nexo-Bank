# Changelog — Nexo Bank / Banca 360

Registro de avances del proyecto.

---

## v0.3.0 — Profile, registration, password recovery and transaction detail

### Added
- **Profile module** (`pages/profile.html`, `js/profile.js`):
  - User profile view with avatar generated from initials.
  - Editable personal data (full name and email), with cedula locked as identifier.
  - Password change form with current-password verification.
  - Email uniqueness validation when updating.
  - Dedicated logout zone with confirmation styling.
- **Logout screen** (`pages/logout.html`):
  - "Sesión finalizada" confirmation page shown after closing the session.
  - Success icon, brand message and link back to login.
- **Registration module** (`pages/register.html`, `js/register.js`):
  - Full registration form with strict validation (cedula format, email, 6-digit numeric password).
  - Password confirmation field with match validation.
  - Mandatory security question (predefined dropdown with 6 options).
  - Duplicate detection by cedula and by email.
  - Loading spinner before completing registration.
- **Password recovery flow** (`pages/recover.html`, `js/recover.js`):
  - 3-step flow: identify user, verify security answer, set new password.
  - Visual step indicator with active/completed states.
  - Case-insensitive answer comparison (trimmed) for better UX.
  - Prevents reusing the previous password.
- **Transaction detail view** (`pages/transaction-detail.html`, `js/transaction-detail.js`):
  - Individual transaction page accessed by query string (`?id=...`).
  - Header with colored icon (green for income, red for outflow), type and direction badges, description, counterparty and large amount.
  - Full information card with 9 fields: reference, internal ID, operation type, direction, amount, date (long format), time, origin/destination and description.
  - Security check: users can only view their own transactions.
  - "Not found" state when the transaction does not exist or does not belong to the user.
- **Clickable transaction cards** on both dashboard (latest 3) and history page, with hover effect and animated arrow.
- **AI usage documentation** (`AI_USAGE.md`) as required by the project guidelines.

### Changed
- `index.html`: "Forgot password" link now points to the recovery flow (`pages/recover.html`).
- `js/history.js`: each transaction card is now a clickable link to its detail view.
- `js/dashboard.js`: latest 3 transactions are now clickable and lead to the detail view.
- `styles/dashboard.css`: extended with profile, logout screen, transaction card hover and transaction detail styles.
- `styles/auth.css`: extended with step indicator, security question box, form divider, select dropdown and form message components.

### Test user
- Identifier: V-12345678
- Password: 123456
- Security answer: firulais

---

## v0.1.0 — Auth session and dashboard base

### Added
- Login flow connected with simulated user data from localStorage.
- Demo user seed for development access.
- Active session creation after successful login.
- Protected dashboard access using the current session.
- Dashboard layout styles.
- Sidebar navigation.
- Balance card with show/hide functionality.
- Recent transactions section connected to stored transactions.

### Fixed
- Dashboard no longer redirects back to login after valid credentials.
- Dashboard icons no longer render as oversized SVG elements.
- Dashboard now displays authenticated user name, current balance, and last 3 transactions.

### Test user
- Identifier: V-12345678
- Password: 123456