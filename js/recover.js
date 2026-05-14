/**
 * recover.js — Recuperación de contraseña en 3 pasos
 *
 *  Paso 1: el usuario ingresa cédula o email → buscamos en BancaStorage.
 *  Paso 2: mostramos la pregunta de seguridad guardada → debe responderla.
 *  Paso 3: si acertó, le pedimos una nueva contraseña (6 dígitos numéricos).
 *
 *  Las respuestas se comparan en minúsculas y sin espacios al inicio/fin
 *  para evitar fricción innecesaria al usuario.
 */

const Recover = {

  /** Usuario que estamos intentando recuperar (se setea en paso 1). */
  user: null,

  /** Paso actual: 1 | 2 | 3 */
  step: 1,

  /* ============================================
     INICIALIZACIÓN
  ============================================ */
  init() {
    document.getElementById('findUserForm')
            .addEventListener('submit', (e) => { e.preventDefault(); this.handleStep1(); });

    document.getElementById('answerForm')
            .addEventListener('submit', (e) => { e.preventDefault(); this.handleStep2(); });

    document.getElementById('newPasswordForm')
            .addEventListener('submit', (e) => { e.preventDefault(); this.handleStep3(); });

    // Solo dígitos en los 2 campos del paso 3
    ['newPassword', 'confirmNewPassword'].forEach(id => {
      const input = document.getElementById(id);
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '').slice(0, 6);
      });
    });
  },

  /* ============================================
     PASO 1 — Buscar usuario
  ============================================ */
  handleStep1() {
    const input  = document.getElementById('identifier');
    const errMsg = document.getElementById('identifierError');

    input.classList.remove('error');
    errMsg.classList.remove('visible');

    const id = input.value.trim();
    if (!id) {
      input.classList.add('error');
      errMsg.textContent = 'Este campo es obligatorio.';
      errMsg.classList.add('visible');
      return;
    }

    const user = BancaStorage.findUser(id);

    // No existe → error genérico (sin filtrar info sensible)
    if (!user) {
      input.classList.add('error');
      errMsg.textContent = 'No encontramos una cuenta con esos datos.';
      errMsg.classList.add('visible');
      return;
    }

    // Edge case: si el usuario no tiene pregunta de seguridad guardada
    if (!user.securityQuestions || user.securityQuestions.length === 0) {
      input.classList.add('error');
      errMsg.textContent = 'Esta cuenta no tiene pregunta de seguridad configurada.';
      errMsg.classList.add('visible');
      return;
    }

    // OK → avanzamos al paso 2
    this.user = user;
    document.getElementById('questionDisplay').textContent =
      user.securityQuestions[0].question;
    this.goToStep(2);
  },

  /* ============================================
     PASO 2 — Verificar respuesta
  ============================================ */
  handleStep2() {
    const input  = document.getElementById('answer');
    const errMsg = document.getElementById('answerError');

    input.classList.remove('error');
    errMsg.classList.remove('visible');

    const userAnswer  = input.value.trim().toLowerCase();
    const savedAnswer = (this.user.securityQuestions[0].answer || '').trim().toLowerCase();

    if (!userAnswer) {
      input.classList.add('error');
      errMsg.textContent = 'Ingresa tu respuesta.';
      errMsg.classList.add('visible');
      return;
    }

    if (userAnswer !== savedAnswer) {
      input.classList.add('error');
      errMsg.textContent = 'Respuesta incorrecta. Inténtalo de nuevo.';
      errMsg.classList.add('visible');
      return;
    }

    // OK → avanzamos al paso 3
    this.goToStep(3);
  },

  /* ============================================
     PASO 3 — Cambiar contraseña
  ============================================ */
  handleStep3() {
    const newInput     = document.getElementById('newPassword');
    const confirmInput = document.getElementById('confirmNewPassword');
    const newErr       = document.getElementById('newPasswordError');
    const confirmErr   = document.getElementById('confirmNewPasswordError');
    const message      = document.getElementById('recoverMessage');

    // Limpiar estado previo
    [newInput, confirmInput].forEach(i => i.classList.remove('error'));
    [newErr, confirmErr].forEach(e => e.classList.remove('visible'));
    message.className = 'form-message';
    message.textContent = '';

    const next    = newInput.value.trim();
    const confirm = confirmInput.value.trim();
    const passRegex = /^\d{6}$/;

    let valid = true;

    if (!passRegex.test(next)) {
      newInput.classList.add('error');
      newErr.classList.add('visible');
      valid = false;
    }

    if (next !== confirm) {
      confirmInput.classList.add('error');
      confirmErr.classList.add('visible');
      valid = false;
    }

    if (valid && next === this.user.password) {
      newInput.classList.add('error');
      newErr.textContent = 'La nueva contraseña debe ser distinta a la anterior.';
      newErr.classList.add('visible');
      valid = false;
    }

    if (!valid) return;

    // Persistir
    const updated = BancaStorage.updateUser(this.user.id, { password: next });

    if (!updated) {
      message.className = 'form-message error visible';
      message.textContent = 'No se pudo actualizar la contraseña. Intenta de nuevo.';
      return;
    }

    message.className = 'form-message success visible';
    message.textContent = '¡Contraseña actualizada! Redirigiendo al inicio de sesión…';

    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1500);
  },

  /* ============================================
     NAVEGACIÓN DE PASOS
  ============================================ */
  goToStep(n) {
    this.step = n;

    // Mostrar/ocultar bloques
    [1, 2, 3].forEach(i => {
      document.getElementById('step' + i).style.display = (i === n) ? 'block' : 'none';
    });

    // Actualizar indicador visual
    [1, 2, 3].forEach(i => {
      const dot = document.getElementById('dot' + i);
      dot.classList.remove('active', 'completed');
      if (i < n)       dot.classList.add('completed');
      else if (i === n) dot.classList.add('active');
    });
    [1, 2].forEach(i => {
      const line = document.getElementById('line' + i);
      line.classList.toggle('completed', i < n);
    });
  }
};

/* ============================================
   Mostrar/ocultar contraseña (global)
============================================ */
function toggleVisibility(inputId, iconId) {
  const input = document.getElementById(inputId);
  const icon  = document.getElementById(iconId);
  const isHidden = input.type === 'password';
  input.type = isHidden ? 'text' : 'password';

  icon.innerHTML = isHidden
    ? `<path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
       <line x1="1" y1="1" x2="23" y2="23"/>`
    : `<path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
       <circle cx="12" cy="12" r="3"/>`;
}

document.addEventListener('DOMContentLoaded', () => Recover.init());
window.Recover = Recover;