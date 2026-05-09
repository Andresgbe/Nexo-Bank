/**
 * auth.js — Lógica de autenticación
 */

/* ---- LOGIN ---- */
document.getElementById('loginForm')?.addEventListener('submit', function(e) {
  e.preventDefault();

  if (!validateLogin()) return;

  // Para desarrollo: si no hay usuarios, crea el usuario demo
  if (BancaStorage.getUsers().length === 0) {
    BancaStorage.seed();
  }

  const identifier = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();
  const generalError = document.getElementById('loginGeneralError');

  const user = BancaStorage.findUser(identifier);

  if (!user || user.password !== password) {
    generalError.textContent = 'Cédula/correo o contraseña incorrectos.';
    generalError.classList.add('visible');
    return;
  }

  generalError.textContent = '';
  generalError.classList.remove('visible');

  startLoginSpinner(user);
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

function startLoginSpinner(user) {
  const btn     = document.getElementById('loginBtn');
  const text    = document.getElementById('loginBtnText');
  const spinner = document.getElementById('loginSpinner');

  btn.disabled = true;
  text.style.display = 'none';
  spinner.style.display = 'block';

  setTimeout(() => {
    BancaStorage.setSession(user.id);
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