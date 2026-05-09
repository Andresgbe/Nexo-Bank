# Changelog — Nexo Bank / Banca 360

Registro de avances del proyecto.

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