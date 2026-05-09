/**
 * mobile-payment.js — Pago móvil
 *
 * Permite simular un pago móvil como salida de dinero.
 */

const MobilePayment = {
  user: null,

  init(currentUser) {
    this.user = currentUser;

    const greetingName = document.getElementById('greetingName');
    const form = document.getElementById('mobilePaymentForm');

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
    const bankInput = document.getElementById('bank');
    const phoneInput = document.getElementById('phone');
    const documentIdInput = document.getElementById('documentId');
    const amountInput = document.getElementById('amount');
    const descriptionInput = document.getElementById('description');
    const message = document.getElementById('mobilePaymentMessage');

    const beneficiary = beneficiaryInput.value.trim();
    const bank = bankInput.value.trim();
    const phone = phoneInput.value.trim();
    const documentId = documentIdInput.value.trim();
    const amount = Number(amountInput.value);
    const description = descriptionInput.value.trim();

    const isValid = this.validateForm(
      beneficiary,
      bank,
      phone,
      documentId,
      amount,
      description
    );

    if (!isValid) return;

    const result = BancaStorage.createTransaction({
      userId: this.user.id,
      type: 'mobile_payment',
      direction: 'out',
      amount,
      description,
      counterparty: `${beneficiary} · ${bank} · ${phone} · ${documentId}`
    });

    if (!result.ok) {
      message.textContent = result.message;
      message.style.color = 'var(--danger)';
      return;
    }

    message.textContent = 'Pago móvil realizado correctamente. Redirigiendo al dashboard...';
    message.style.color = 'var(--success)';

    setTimeout(() => {
      window.location.href = 'dashboard.html';
    }, 1000);
  },

  validateForm(beneficiary, bank, phone, documentId, amount, description) {
    let valid = true;

    valid = this.validateField(
      beneficiary.length > 0,
      'beneficiary',
      'beneficiaryError'
    ) && valid;

    valid = this.validateField(
      bank.length > 0,
      'bank',
      'bankError'
    ) && valid;

    valid = this.validateField(
      phone.length > 0,
      'phone',
      'phoneError'
    ) && valid;

    valid = this.validateField(
      documentId.length > 0,
      'documentId',
      'documentIdError'
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