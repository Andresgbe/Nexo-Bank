/**
 * deposit.js — Registro de depósitos
 *
 * Permite simular una entrada de dinero en la cuenta del usuario.
 */

const Deposit = {
  user: null,

  init(currentUser) {
    this.user = currentUser;

    const greetingName = document.getElementById('greetingName');
    const form = document.getElementById('depositForm');

    if (greetingName) {
      greetingName.textContent = this.user.fullName;
    }

    if (form) {
      form.addEventListener('submit', (event) => {
        event.preventDefault();
        this.handleSubmit();
      });
    }
  },

  handleSubmit() {
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const counterpartyInput = document.getElementById('counterparty');
    const message = document.getElementById('depositMessage');

    const amount = Number(amountInput.value);
    const description = descriptionInput.value.trim();
    const counterparty = counterpartyInput.value.trim();

    const isValid = this.validateForm(amount, description, counterparty);

    if (!isValid) return;

    const result = BancaStorage.createTransaction({
      userId: this.user.id,
      type: 'deposit',
      direction: 'in',
      amount,
      description,
      counterparty
    });

    if (!result.ok) {
      message.textContent = result.message;
      message.style.color = 'var(--danger)';
      return;
    }

    message.textContent = 'Depósito registrado correctamente. Redirigiendo al dashboard...';
    message.style.color = 'var(--success)';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  },

  validateForm(amount, description, counterparty) {
    let valid = true;

    valid = this.validateField(
      amount > 0,
      'amount',
      'amountError'
    ) && valid;

    valid = this.validateField(
      description.length > 0,
      'description',
      'descriptionError'
    ) && valid;

    valid = this.validateField(
      counterparty.length > 0,
      'counterparty',
      'counterpartyError'
    ) && valid;

    return valid;
  },

  validateField(condition, inputId, errorId) {
    const input = document.getElementById(inputId);
    const error = document.getElementById(errorId);

    if (!input || !error) return condition;

    if (!condition) {
      input.classList.add('error');
      error.classList.add('visible');
      return false;
    }

    input.classList.remove('error');
    error.classList.remove('visible');
    return true;
  }
};