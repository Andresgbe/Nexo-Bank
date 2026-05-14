/**
 * transaction-detail.js — Detalle individual de una transacción
 *
 * Lee el ID de la transacción desde el query string (?id=...) y muestra
 * todos sus datos:
 *  - Tipo (depósito / transferencia / pago móvil)
 *  - Dirección (entrada / salida) con color
 *  - Monto formateado
 *  - Fecha y hora completas
 *  - Descripción
 *  - Contraparte
 *  - Referencia / ID interno
 *
 * Seguridad: solo permite ver transacciones del usuario logueado.
 * Si el ID no existe o pertenece a otro usuario, muestra un mensaje
 * de error.
 */

const TransactionDetail = {

  user: null,
  tx: null,

  init(currentUser) {
    this.user = currentUser;

    // Saludo del topbar
    const greeting = document.getElementById('greetingName');
    if (greeting) greeting.textContent = currentUser.fullName;

    // Leer ?id=... del URL
    const params = new URLSearchParams(window.location.search);
    const txId = params.get('id');

    if (!txId) {
      this.renderNotFound('No se especificó ninguna transacción.');
      return;
    }

    // Buscar entre las transacciones del usuario actual (no de otros)
    const transactions = BancaStorage.getTransactions(currentUser.id);
    const tx = transactions.find(t => t.id === txId);

    if (!tx) {
      this.renderNotFound('No encontramos esta transacción en tu cuenta.');
      return;
    }

    this.tx = tx;
    this.render(tx);
  },

  /* ============================================
     RENDER PRINCIPAL
  ============================================ */
  render(tx) {
    const container = document.getElementById('txDetailContainer');
    if (!container) return;

    const isIn       = tx.direction === 'in';
    const sign       = isIn ? '+' : '-';
    const amountCls  = isIn ? 'amount-in' : 'amount-out';
    const typeLabel  = this.getTypeLabel(tx.type);
    const dirLabel   = isIn ? 'Entrada' : 'Salida';
    const dirBadge   = isIn ? 'success' : 'danger';

    container.innerHTML = `
      <!-- Encabezado: tipo, dirección y monto -->
      <div class="tx-detail-header">
        <div class="tx-detail-icon ${isIn ? 'in' : 'out'}">
          ${this.getTypeIcon(tx.type, isIn)}
        </div>

        <div class="tx-detail-header-info">
          <span class="badge accent">${typeLabel}</span>
          <span class="badge ${dirBadge}" style="margin-left:6px;">${dirLabel}</span>
          <h2 class="tx-detail-description">${this.escape(tx.description)}</h2>
          <p class="tx-detail-counterparty">
            ${isIn ? 'De' : 'A'}: <strong>${this.escape(tx.counterparty)}</strong>
          </p>
        </div>

        <div class="tx-detail-amount ${amountCls}">
          ${sign} ${this.formatMoney(tx.amount)}
        </div>
      </div>

      <!-- Tarjeta con todos los detalles -->
      <div class="card tx-detail-card">
        <h3 class="section-title" style="margin-bottom:18px;">Información completa</h3>

        <dl class="tx-detail-grid">

          <div class="tx-detail-row">
            <dt>Referencia</dt>
            <dd class="font-mono">${this.escape(tx.reference)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>ID de transacción</dt>
            <dd class="font-mono tx-detail-id">${this.escape(tx.id)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Tipo de operación</dt>
            <dd>${typeLabel}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Dirección</dt>
            <dd>${dirLabel} de dinero</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Monto</dt>
            <dd class="${amountCls}">${sign} ${this.formatMoney(tx.amount)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Fecha</dt>
            <dd>${this.formatDateLong(tx.date)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Hora</dt>
            <dd>${this.formatTime(tx.date)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>${isIn ? 'Origen' : 'Destino'}</dt>
            <dd>${this.escape(tx.counterparty)}</dd>
          </div>

          <div class="tx-detail-row">
            <dt>Descripción</dt>
            <dd>${this.escape(tx.description)}</dd>
          </div>

        </dl>

        <div class="tx-detail-actions">
          <a href="history.html" class="btn-outline">Volver al historial</a>
        </div>
      </div>
    `;
  },

  /* ============================================
     ESTADO: NO ENCONTRADA
  ============================================ */
  renderNotFound(message) {
    const container = document.getElementById('txDetailContainer');
    if (!container) return;

    container.innerHTML = `
      <div class="card tx-detail-empty">
        <div class="tx-detail-empty-icon">
          <svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10"/>
            <line x1="12" y1="8" x2="12" y2="12"/>
            <line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
        </div>
        <h2>Transacción no encontrada</h2>
        <p>${this.escape(message)}</p>
        <a href="history.html" class="btn-primary" style="max-width:260px;margin:20px auto 0;">
          Volver al historial
        </a>
      </div>
    `;
  },

  /* ============================================
     HELPERS
  ============================================ */

  getTypeLabel(type) {
    const labels = {
      deposit:        'Depósito',
      transfer:       'Transferencia',
      mobile_payment: 'Pago móvil'
    };
    return labels[type] || 'Movimiento';
  },

  /** Devuelve el SVG inline del ícono según el tipo de transacción */
  getTypeIcon(type, isIn) {
    if (type === 'deposit') {
      return `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <line x1="12" y1="5" x2="12" y2="19"/>
                <line x1="5" y1="12" x2="19" y2="12"/>
              </svg>`;
    }
    if (type === 'mobile_payment') {
      return `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <rect x="5" y="2" width="14" height="20" rx="2"/>
                <line x1="12" y1="18" x2="12.01" y2="18"/>
              </svg>`;
    }
    // transfer (por defecto)
    return `<svg fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <line x1="17" y1="3" x2="21" y2="7"/>
              <polyline points="21 7 21 11 17 11"/>
              <line x1="7" y1="21" x2="3" y2="17"/>
              <polyline points="3 17 3 13 7 13"/>
              <line x1="3" y1="17" x2="21" y2="7"/>
            </svg>`;
  },

  formatMoney(amount) {
    return Number(amount).toLocaleString('es-VE', {
      style: 'currency',
      currency: 'USD'
    });
  },

  formatDateLong(date) {
    return new Date(date).toLocaleDateString('es-VE', {
      weekday: 'long',
      day:     '2-digit',
      month:   'long',
      year:    'numeric'
    });
  },

  formatTime(date) {
    return new Date(date).toLocaleTimeString('es-VE', {
      hour:   '2-digit',
      minute: '2-digit',
      hour12: true
    });
  },

  /** Escape HTML básico para evitar inyección desde el localStorage */
  escape(str) {
    if (str == null) return '';
    return String(str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
};

window.TransactionDetail = TransactionDetail;