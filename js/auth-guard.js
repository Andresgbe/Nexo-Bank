/**
 * auth-guard.js — Protección de páginas internas
 *
 * Llamar AuthGuard.protect() al inicio de toda página que requiera
 * sesión activa (dashboard, transferencias, perfil, etc.).
 * Si no hay sesión, redirige al login automáticamente.
 *
 * Depende de storage.js (debe cargarse antes en el HTML).
 */

const AuthGuard = {

  /**
   * Verifica que haya un usuario logueado.
   * Si no, redirige al index.html (login).
   * @returns {object|null} usuario actual o null si no hay sesión
   */
  protect() {
    const user = Storage.getCurrentUser();
    if (!user) {
      window.location.href = '../index.html';
      return null;
    }
    return user;
  },

  /**
   * Cierra sesión y redirige a la pantalla de "Sesión finalizada".
   */
  logout() {
    Storage.clearSession();
    window.location.href = 'logout.html';
  }
};