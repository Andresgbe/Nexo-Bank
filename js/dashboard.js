/**
 * dashboard.js — Control del Dashboard principal
 *
 * Se encarga de:
 * - Mostrar nombre del usuario logueado
 * - Mostrar saldo actual
 * - Ocultar / mostrar saldo
 * - Renderizar últimas 3 transacciones (clickeables → detalle)
 */

const Dashboard = {
  user: null,
  balanceVisible: true,

  init(currentUser) {
    this.user = currentUser;

    this.renderUserInfo();
    this.renderBalance();
    this.renderLatestTransactions();
  },

  renderUserInfo() {
    const greetingName = document.getElementById('greetingName');

    if (greetingName && this.user) {
      greetingName.textContent = this.user.fullName;
    }
  },

  renderBalance() {
    const balanceAmount = document.getElementById('balanceAmount');

    if (!balanceAmount || !this.user) return;

    balanceAmount.textContent = this.balanceVisible
      ? this.formatMoney(this.user.balance)
      : '••••••';
  },

  renderLatestTransactions() {
    const txList = document.getElementById('txList');

    if (!txList || !this.user) return;

    const transactions = BancaStorage
      .getTransactions(this.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice(0, 3);

    if (transactions.length === 0) {
      txList.innerHTML = `
        <div class="transaction-card">
          <div>
            <strong>No hay transacciones todavía</strong>
            <p>Cuando realices una operación, aparecerá aquí.</p>
          </div>
        </div>
      `;
      return;
    }

    // Cada tarjeta es un <a> que abre el detalle de la transacción
    txList.innerHTML = transactions.map(tx => `
      <a href="transaction-detail.html?id=${encodeURIComponent(tx.id)}"
         class="transaction-card transaction-card-link">
        <div>
          <strong>${tx.description}</strong>
          <p>${tx.counterparty} · ${this.formatDate(tx.date)}</p>
        </div>

        <div class="tx-card-right">
          <span class="${tx.direction === 'in' ? 'amount-in' : 'amount-out'}">
            ${tx.direction === 'in' ? '+' : '-'} ${this.formatMoney(tx.amount)}
          </span>
          <span class="tx-card-arrow">→</span>
        </div>
      </a>
    `).join('');
  },

  toggleBalance() {
    this.balanceVisible = !this.balanceVisible;
    this.renderBalance();

    const eyeOpen = document.getElementById('balanceEyeOpen');
    const eyeClosed = document.getElementById('balanceEyeClosed');

    if (!eyeOpen || !eyeClosed) return;

    eyeOpen.style.display = this.balanceVisible ? '' : 'none';
    eyeClosed.style.display = this.balanceVisible ? 'none' : '';
  },

  formatMoney(amount) {
    return Number(amount).toLocaleString('es-VE', {
      style: 'currency',
      currency: 'USD'
    });
  },

  formatDate(date) {
    return new Date(date).toLocaleDateString('es-VE', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  }
};

/**
 * Función global porque el HTML llama:
 * onclick="toggleBalance()"
 */
function toggleBalance() {
  Dashboard.toggleBalance();
}