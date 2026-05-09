document.addEventListener('DOMContentLoaded', () => {
  if (!window.BancaStorage) {
    console.error('No se cargó storage.js antes de dashboard.js');
    return;
  }

  const user = BancaStorage.getCurrentUser();

  if (!user) {
    window.location.href = './login.html';
    return;
  }

  const userName = document.getElementById('userName');
  const balanceValue = document.getElementById('balanceValue');
  const toggleBalance = document.getElementById('toggleBalance');
  const latestTransactions = document.getElementById('latestTransactions');
  const logoutBtn = document.getElementById('logoutBtn');

  let balanceVisible = true;

  userName.textContent = user.fullName;
  balanceValue.textContent = formatMoney(user.balance);

  toggleBalance.addEventListener('click', () => {
    balanceVisible = !balanceVisible;

    if (balanceVisible) {
      balanceValue.textContent = formatMoney(user.balance);
      toggleBalance.textContent = '👁️';
    } else {
      balanceValue.textContent = '••••••';
      toggleBalance.textContent = '🙈';
    }
  });

  renderLatestTransactions(user.id, latestTransactions);

  logoutBtn.addEventListener('click', () => {
    BancaStorage.clearSession();
    window.location.href = './logout.html';
  });
});

function renderLatestTransactions(userId, container) {
  const transactions = BancaStorage
    .getTransactions(userId)
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 3);

  if (transactions.length === 0) {
    container.innerHTML = '<p>No hay transacciones todavía.</p>';
    return;
  }

  container.innerHTML = transactions.map(tx => `
    <article class="transaction-card">
      <div>
        <strong>${tx.description}</strong>
        <p>${tx.counterparty}</p>
      </div>

      <span class="${tx.direction === 'in' ? 'amount-in' : 'amount-out'}">
        ${tx.direction === 'in' ? '+' : '-'} ${formatMoney(tx.amount)}
      </span>
    </article>
  `).join('');
}

function formatMoney(amount) {
  return Number(amount).toLocaleString('es-VE', {
    style: 'currency',
    currency: 'USD'
  });
}