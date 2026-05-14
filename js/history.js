/**
 * history.js — Historial de movimientos
 *
 * Muestra todas las transacciones del usuario y permite filtrar:
 * - Todos
 * - Solo entradas
 * - Solo salidas
 *
 * Cada tarjeta es clickeable y abre el detalle individual en
 * transaction-detail.html?id=...
 */

const HistoryPage = {
  user: null,
  currentFilter: 'all',

  init(currentUser) {
    this.user = currentUser;

    const greetingName = document.getElementById('greetingName');

    if (greetingName) {
      greetingName.textContent = this.user.fullName;
    }

    this.setupFilters();
    this.renderTransactions();
  },

  setupFilters() {
    const buttons = document.querySelectorAll('.filter-btn');

    buttons.forEach((button) => {
      button.addEventListener('click', () => {
        buttons.forEach((btn) => btn.classList.remove('active'));

        button.classList.add('active');
        this.currentFilter = button.dataset.filter;

        this.renderTransactions();
      });
    });
  },

  renderTransactions() {
    const container = document.getElementById('historyList');

    if (!container || !this.user) return;

    let transactions = BancaStorage
      .getTransactions(this.user.id)
      .sort((a, b) => new Date(b.date) - new Date(a.date));

    if (this.currentFilter !== 'all') {
      transactions = transactions.filter(tx => tx.direction === this.currentFilter);
    }

    if (transactions.length === 0) {
      container.innerHTML = `
        <div class="transaction-card">
          <div>
            <strong>No hay movimientos para este filtro</strong>
            <p>Prueba con otro filtro o realiza una operación.</p>
          </div>
        </div>
      `;
      return;
    }

    // Cada tarjeta es un <a> que lleva al detalle
    container.innerHTML = transactions.map(tx => `
      <a href="transaction-detail.html?id=${encodeURIComponent(tx.id)}"
         class="transaction-card transaction-card-link">
        <div>
          <strong>${tx.description}</strong>
          <p>
            ${this.getTypeLabel(tx.type)}
            · ${tx.counterparty}
            · ${this.formatDate(tx.date)}
            · Ref: ${tx.reference}
          </p>
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

  getTypeLabel(type) {
    const labels = {
      deposit: 'Depósito',
      transfer: 'Transferencia',
      mobile_payment: 'Pago móvil'
    };

    return labels[type] || 'Movimiento';
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