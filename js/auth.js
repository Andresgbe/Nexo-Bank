/**
 * auth.js — Lógica de autenticación
 */

/* ---- LOGIN ---- */
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();
  if (validateLogin()) startLoginSpinner();
});

function validateLogin() {
  const email    = document.getElementById('email');
  const password = document.getElementById('password');
  const emailErr = document.getElementById('emailError');
  const passErr  = document.getElementById('passwordError');
  let valid = true;

  // Validar cédula/email
  if (!email.value.trim()) {
    email.classList.add('error');
    emailErr.classList.add('visible');
    valid = false;
  } else {
    email.classList.remove('error');
    emailErr.classList.remove('visible');
  }

  // Validar contraseña
  if (!password.value.trim()) {
    password.classList.add('error');
    passErr.classList.add('visible');
    valid = false;
  } else {
    password.classList.remove('error');
    passErr.classList.remove('visible');
  }

  return valid;
}

function startLoginSpinner() {
  const btn     = document.getElementById('loginBtn');
  const text    = document.getElementById('loginBtnText');
  const spinner = document.getElementById('loginSpinner');

  // Mostrar spinner, ocultar texto
  btn.disabled         = true;
  text.style.display   = 'none';
  spinner.style.display = 'block';

  // Esperar exactamente 2 segundos → redirigir al dashboard
  setTimeout(() => {
    window.location.href = 'pages/dashboard.html';
  }, 2000);
}

/* ---- MOSTRAR/OCULTAR CONTRASEÑA ---- */
function togglePasswordVisibility() {
  const input   = document.getElementById('password');
  const eyeOpen = document.getElementById('passEyeOpen');
  const eyeClosed = document.getElementById('passEyeClosed');
  const isHidden = input.type === 'password';

  input.type = isHidden ? 'text' : 'password';
  eyeOpen.style.display   = isHidden ? 'none' : '';
  eyeClosed.style.display = isHidden ? ''     : 'none';
}