/**
 * transfer.js — Transferencias bancarias
 *
 * Permite simular una salida de dinero desde la cuenta del usuario.
 */

const Transfer = {
  user: null,

  init(currentUser) {
    this.user = currentUser;

    const greetingName = document.getElementById('greetingName');
    const form = document.getElementById('transferForm');

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
    const beneficiaryInput = document.getElementById('beneficiary');
    const accountNumberInput = document.getElementById('accountNumber');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const message = document.getElementById('transferMessage');

    const beneficiary = beneficiaryInput.value.trim();
    const accountNumber = accountNumberInput.value.trim();
    const amount = Number(amountInput.value);
    const description = descriptionInput.value.trim();

    const isValid = this.validateForm(
      beneficiary,
      accountNumber,
      amount,
      description
    );

    if (!isValid) return;

    const result = BancaStorage.createTransaction({
      userId: this.user.id,
      type: 'transfer',
      direction: 'out',
      amount,
      description,
      counterparty: `${beneficiary} · ${accountNumber}`
    });

    if (!result.ok) {
      message.textContent = result.message;
      message.style.color = 'var(--danger)';
      return;
    }

    message.textContent = 'Transferencia realizada correctamente. Redirigiendo al dashboard...';
    message.style.color = 'var(--success)';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  },

  validateForm(beneficiary, accountNumber, amount, description) {
    let valid = true;

    valid = this.validateField(
      beneficiary.length > 0,
      'beneficiary',
      'beneficiaryError'
    ) && valid;

    valid = this.validateField(
      accountNumber.length > 0,
      'accountNumber',
      'accountNumberError'
    ) && valid;

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