/**
 * profile.js — Lógica del módulo de Perfil
 *
 * Maneja:
 *  - Carga inicial de datos del usuario en pantalla.
 *  - Edición de datos personales (nombre completo y email).
 *    La cédula NO se puede editar (es el identificador principal).
 *  - Cambio de contraseña con la misma regla de validación
 *    del registro: exactamente 6 dígitos numéricos + confirmación.
 *
 * Depende de: storage.js, auth-guard.js, theme.js
 */

const Profile = {

  /** Usuario actual en memoria. Se actualiza tras cada cambio. */
  user: null,

  /**
   * Punto de entrada. Lo llama profile.html luego de AuthGuard.protect().
   * @param {object} user usuario autenticado
   */
  init(user) {
    this.user = user;
    this.render(user);
    this.bindProfileForm();
    this.bindPasswordForm();
  },

  /* ============================================
     RENDER — pinta los datos del usuario
  ============================================ */
  render(user) {
    // Saludo del topbar
    const firstName = (user.fullName || '').split(' ')[0] || 'Usuario';
    document.getElementById('greetingName').textContent = firstName;

    // Encabezado del perfil
    document.getElementById('profileAvatar').textContent = this.getInitials(user.fullName);
    document.getElementById('profileName').textContent   = user.fullName;
    document.getElementById('profileEmail').textContent  = user.email;
    document.getElementById('profileCedula').textContent = user.cedula;

    // Inputs del formulario de datos personales
    document.getElementById('fullName').value = user.fullName;
    document.getElementById('email').value    = user.email;
    document.getElementById('cedula').value   = user.cedula;
  },

  /** Obtiene iniciales para el avatar (ej. "Juan Pérez" → "JP"). */
  getInitials(name) {
    if (!name) return '?';
    const parts = name.trim().split(/\s+/);
    const first = parts[0]?.charAt(0) || '';
    const last  = parts.length > 1 ? parts[parts.length - 1].charAt(0) : '';
    return (first + last).toUpperCase();
  },

  /* ============================================
     FORMULARIO — DATOS PERSONALES
  ============================================ */
  bindProfileForm() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handleProfileSubmit();
    });
  },

  handleProfileSubmit() {
    const fullNameInput = document.getElementById('fullName');
    const emailInput    = document.getElementById('email');
    const fullNameErr   = document.getElementById('fullNameError');
    const emailErr      = document.getElementById('emailError');
    const message       = document.getElementById('profileMessage');

    // Limpiar estados previos
    [fullNameInput, emailInput].forEach(i => i.classList.remove('error'));
    [fullNameErr, emailErr].forEach(e => e.classList.remove('visible'));
    message.className = 'form-message';
    message.textContent = '';

    const fullName = fullNameInput.value.trim();
    const email    = emailInput.value.trim().toLowerCase();

    let valid = true;

    // Validar nombre completo
    if (fullName.length < 3) {
      fullNameInput.classList.add('error');
      fullNameErr.classList.add('visible');
      valid = false;
    }

    // Validar email (formato básico)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      emailInput.classList.add('error');
      emailErr.classList.add('visible');
      valid = false;
    }

    // Si cambió el email, asegurar que no esté en uso por otro usuario
    if (valid && email !== this.user.email.toLowerCase()) {
      const otro = BancaStorage.findUser(email);
      if (otro && otro.id !== this.user.id) {
        emailInput.classList.add('error');
        emailErr.textContent = 'Ese correo ya está registrado por otro usuario.';
        emailErr.classList.add('visible');
        valid = false;
      }
    }

    if (!valid) return;

    // Persistir cambios
    const updated = BancaStorage.updateUser(this.user.id, {
      fullName,
      email
    });

    if (!updated) {
      this.showMessage(message, 'error', 'No se pudo actualizar el perfil.');
      return;
    }

    // Refrescar referencia interna y vista
    this.user = updated;
    this.render(updated);

    this.showMessage(message, 'success', 'Datos actualizados correctamente.');
  },

  /* ============================================
     FORMULARIO — CAMBIO DE CONTRASEÑA
  ============================================ */
  bindPasswordForm() {
    const form = document.getElementById('passwordForm');
    if (!form) return;

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      this.handlePasswordSubmit();
    });

    // Forzar solo dígitos en los 3 campos
    ['currentPassword', 'newPassword', 'confirmPassword'].forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 6);
      });
    });
  },

  handlePasswordSubmit() {
    const currentInput = document.getElementById('currentPassword');
    const newInput     = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmPassword');

    const currentErr = document.getElementById('currentPasswordError');
    const newErr     = document.getElementById('newPasswordError');
    const confirmErr = document.getElementById('confirmPasswordError');
    const message    = document.getElementById('passwordMessage');

    // Limpiar estados previos
    [currentInput, newInput, confirmInput].forEach(i => i.classList.remove('error'));
    [currentErr, newErr, confirmErr].forEach(e => e.classList.remove('visible'));
    message.className = 'form-message';
    message.textContent = '';

    const current = currentInput.value.trim();
    const next    = newInput.value.trim();
    const confirm = confirmInput.value.trim();

    // Regex: exactamente 6 dígitos numéricos (igual que el registro)
    const passRegex = /^\d{6}$/;
    let valid = true;

    // 1. Contraseña actual debe coincidir con la guardada
    if (current !== this.user.password) {
      currentInput.classList.add('error');
      currentErr.classList.add('visible');
      valid = false;
    }

    // 2. Nueva contraseña debe cumplir el formato
    if (!passRegex.test(next)) {
      newInput.classList.add('error');
      newErr.classList.add('visible');
      valid = false;
    }

    // 3. Confirmación debe coincidir
    if (next !== confirm) {
      confirmInput.classList.add('error');
      confirmErr.classList.add('visible');
      valid = false;
    }

    // 4. (UX) Que no sea idéntica a la actual
    if (valid && next === this.user.password) {
      newInput.classList.add('error');
      newErr.textContent = 'La nueva contraseña debe ser distinta a la actual.';
      newErr.classList.add('visible');
      valid = false;
    }

    if (!valid) return;

    // Persistir
    const updated = BancaStorage.updateUser(this.user.id, { password: next });

    if (!updated) {
      this.showMessage(message, 'error', 'No se pudo actualizar la contraseña.');
      return;
    }

    this.user = updated;

    // Limpiar campos
    currentInput.value = '';
    newInput.value     = '';
    confirmInput.value = '';

    // Restaurar texto por defecto del error (por si se cambió arriba)
    newErr.textContent = 'Debe contener exactamente 6 dígitos numéricos.';

    this.showMessage(message, 'success', 'Contraseña actualizada correctamente.');
  },

  /* ============================================
     UTILIDADES
  ============================================ */
  showMessage(el, type, text) {
    el.className = 'form-message ' + type + ' visible';
    el.textContent = text;
    // Auto-ocultar a los 4 segundos
    setTimeout(() => {
      el.classList.remove('visible');
    }, 4000);
  }
};

/* ============================================
   Mostrar/ocultar contraseña (global, igual que en login)
============================================ */
function toggleFieldVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  // Cambia el ícono entre "ojo abierto" y "ojo cerrado"
  icon.innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
       <line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
       <circle cx="12" cy="12" r="3"/>`;
}

window.Profile = Profile;