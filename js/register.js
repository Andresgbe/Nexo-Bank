/**
 * register.js — Lógica del registro de usuarios
 *
 * Reglas (del enunciado):
 *  - Contraseña: exactamente 6 dígitos numéricos.
 *  - Confirmación de contraseña: debe coincidir.
 *  - Pregunta de seguridad: obligatoria (la usaremos en recover.js).
 *
 * También evita registrar duplicados por cédula o por email.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('registerForm');
  if (!form) return;

  // Forzar solo dígitos en los 2 campos de contraseña
  ['password', 'confirmPassword'].forEach(id => {
    const input = document.getElementById(id);
    input.addEventListener('input', () => {
      input.value = input.value.replace(/\D/g, '').slice(0, 6);
    });
  });

  // Auto-mayúscula en cédula al perder foco (V-12345678)
  const cedulaInput = document.getElementById('cedula');
  cedulaInput.addEventListener('blur', () => {
    cedulaInput.value = cedulaInput.value.trim().toUpperCase();
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    handleRegister();
  });
});

function handleRegister() {
  // Referencias a los campos
  const cedulaInput     = document.getElementById('cedula');
  const fullNameInput   = document.getElementById('fullName');
  const emailInput      = document.getElementById('email');
  const passwordInput   = document.getElementById('password');
  const confirmInput    = document.getElementById('confirmPassword');
  const questionInput   = document.getElementById('securityQuestion');
  const answerInput     = document.getElementById('securityAnswer');

  // Referencias a los errores
  const errors = {
    cedula:           document.getElementById('cedulaError'),
    fullName:         document.getElementById('fullNameError'),
    email:            document.getElementById('emailError'),
    password:         document.getElementById('passwordError'),
    confirmPassword:  document.getElementById('confirmPasswordError'),
    securityQuestion: document.getElementById('securityQuestionError'),
    securityAnswer:   document.getElementById('securityAnswerError')
  };

  const message = document.getElementById('registerMessage');

  // Limpiar estado previo
  Object.values(errors).forEach(e => e.classList.remove('visible'));
  [cedulaInput, fullNameInput, emailInput, passwordInput, confirmInput, answerInput]
    .forEach(i => i.classList.remove('error'));
  message.className = 'form-message';
  message.textContent = '';

  // Leer valores
  const cedula   = cedulaInput.value.trim().toUpperCase();
  const fullName = fullNameInput.value.trim();
  const email    = emailInput.value.trim().toLowerCase();
  const password = passwordInput.value.trim();
  const confirm  = confirmInput.value.trim();
  const question = questionInput.value;
  const answer   = answerInput.value.trim();

  let valid = true;

  // 1. Cédula — patrón V-12345678 / E-12345678 / J-12345678 (7-9 dígitos)
  const cedulaRegex = /^[VEJ]-\d{7,9}$/;
  if (!cedulaRegex.test(cedula)) {
    cedulaInput.classList.add('error');
    errors.cedula.classList.add('visible');
    valid = false;
  }

  // 2. Nombre completo — al menos 3 caracteres
  if (fullName.length < 3) {
    fullNameInput.classList.add('error');
    errors.fullName.classList.add('visible');
    valid = false;
  }

  // 3. Email — formato básico
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    emailInput.classList.add('error');
    errors.email.classList.add('visible');
    valid = false;
  }

  // 4. Contraseña — exactamente 6 dígitos numéricos
  const passRegex = /^\d{6}$/;
  if (!passRegex.test(password)) {
    passwordInput.classList.add('error');
    errors.password.classList.add('visible');
    valid = false;
  }

  // 5. Confirmación — debe coincidir
  if (password !== confirm) {
    confirmInput.classList.add('error');
    errors.confirmPassword.classList.add('visible');
    valid = false;
  }

  // 6. Pregunta de seguridad — debe haber selección
  if (!question) {
    questionInput.classList.add('error');
    errors.securityQuestion.classList.add('visible');
    valid = false;
  }

  // 7. Respuesta — mínimo 2 caracteres
  if (answer.length < 2) {
    answerInput.classList.add('error');
    errors.securityAnswer.classList.add('visible');
    valid = false;
  }

  if (!valid) return;

  // 8. Validar duplicados (cédula o email)
  if (BancaStorage.userExists(cedula)) {
    cedulaInput.classList.add('error');
    errors.cedula.textContent = 'Ya existe una cuenta con esta cédula.';
    errors.cedula.classList.add('visible');
    return;
  }

  if (BancaStorage.userExists(email)) {
    emailInput.classList.add('error');
    errors.email.textContent = 'Ya existe una cuenta con este correo.';
    errors.email.classList.add('visible');
    return;
  }

  // 9. Todo OK: crear usuario y mostrar spinner
  startRegisterSpinner({
    id:       BancaStorage.uuid(),
    cedula,
    fullName,
    email,
    password,
    balance:  0,
    securityQuestions: [
      { question, answer: answer.toLowerCase() }
    ],
    createdAt: new Date().toISOString()
  });
}

function startRegisterSpinner(newUser) {
  const btn     = document.getElementById('registerBtn');
  const text    = document.getElementById('registerBtnText');
  const spinner = document.getElementById('registerSpinner');
  const message = document.getElementById('registerMessage');

  btn.disabled = true;
  text.style.display = 'none';
  spinner.style.display = 'block';

  // Simulamos validación con "servidor central" (≈1.5s)
  setTimeout(() => {
    BancaStorage.saveUser(newUser);

    message.className = 'form-message success visible';
    message.textContent = '¡Cuenta creada exitosamente! Redirigiendo al inicio de sesión…';

    // Redirige al login después de un segundo
    setTimeout(() => {
      window.location.href = '../index.html';
    }, 1200);
  }, 1500);
}

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