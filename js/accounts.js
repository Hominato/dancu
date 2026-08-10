/**
 * AmeriCU Credit Union — Accounts & Account Details Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    if (document.getElementById('accounts-list-container')) {
        renderAccountsOverview();
    }
    if (document.getElementById('account-title-header')) {
        renderAccountDetailsPage();
    }
});

// Render Accounts Overview Page (`accounts.html`)
function renderAccountsOverview() {
    const container = document.getElementById('accounts-list-container');
    if (!container) return;

    const accounts = Storage.getAccounts();

    container.innerHTML = accounts.map(acc => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; flex-wrap:wrap; gap:1rem;">
                <div>
                    <span class="status-badge status-active">${acc.type}</span>
                    <h3 style="font-size:1.35rem; font-weight:800; margin-top:0.35rem;">${acc.name}</h3>
                    <div style="font-size:0.85rem; color:var(--color-text-muted); margin-top:0.25rem;">
                        Account Number: <strong>•••• ${acc.mask}</strong> • Routing Number: <strong>${acc.routingNumber}</strong>
                    </div>
                </div>

                <div style="text-align:right;">
                    <div style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Available Balance</div>
                    <div style="font-size:2rem; font-weight:800; color:var(--color-text);">${App.formatCurrency(acc.availableBalance)}</div>
                    <div style="font-size:0.8rem; color:var(--color-text-muted);">Current Balance: ${App.formatCurrency(acc.currentBalance)}</div>
                </div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); margin-top:1.25rem; padding-top:1rem; flex-wrap:wrap; gap:0.75rem;">
                <div style="font-size:0.8rem; color:var(--color-text-muted);">
                    Dividend APY Yield: <strong style="color:var(--color-accent);">${acc.apy}</strong>
                </div>
                <div style="display:flex; gap:0.75rem;">
                    <a href="account-details.html?id=${acc.id}" class="btn btn-outline btn-sm">View Details & History</a>
                    <a href="transfers.html?from=${acc.id}" class="btn btn-primary btn-sm">Transfer Funds</a>
                    <a href="statements.html?account=${acc.id}" class="btn btn-outline btn-sm">Statement</a>
                </div>
            </div>
        </div>
    `).join('');
}

// Render Account Details Page (`account-details.html`)
function renderAccountDetailsPage() {
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('id') || 'acc_checking';

    const account = Storage.getAccountById(accountId) || Storage.getAccounts()[0];

    // Populate Hero Details
    document.getElementById('acc-detail-name').textContent = account.name;
    document.getElementById('acc-detail-type').textContent = account.type;
    document.getElementById('acc-detail-number').textContent = `•••• ${account.mask}`;
    document.getElementById('acc-detail-routing').textContent = account.routingNumber;
    document.getElementById('acc-detail-avail-bal').textContent = App.formatCurrency(account.availableBalance);
    document.getElementById('acc-detail-curr-bal').textContent = App.formatCurrency(account.currentBalance);
    document.getElementById('acc-detail-apy').textContent = `${account.apy} APY`;

    // Filter Account Transactions
    const allTrx = Storage.getTransactions();
    let accountTrx = allTrx.filter(t => t.accountId === account.id);

    function renderTable(filterQuery = '') {
        const tbody = document.getElementById('acc-trx-tbody');
        if (!tbody) return;

        let filtered = accountTrx;
        if (filterQuery) {
            const q = filterQuery.toLowerCase();
            filtered = accountTrx.filter(t => 
                t.merchant.toLowerCase().includes(q) || 
                t.category.toLowerCase().includes(q) ||
                (t.memo && t.memo.toLowerCase().includes(q))
            );
        }

        if (filtered.length === 0) {
            tbody.innerHTML = '<tr><td colspan="5" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No matching transactions found.</td></tr>';
            return;
        }

        tbody.innerHTML = filtered.map(t => {
            const isCredit = t.type === 'credit';
            return `
                <tr>
                    <td>${App.formatDate(t.date)}</td>
                    <td>
                        <div style="font-weight:600;">${t.merchant}</div>
                        <div style="font-size:0.75rem; color:var(--color-text-muted);">${t.memo || t.ref}</div>
                    </td>
                    <td>${t.category}</td>
                    <td class="${isCredit ? 'amount-credit' : 'amount-debit'}">${App.formatCurrency(t.amount, true)}</td>
                    <td><span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span></td>
                </tr>
            `;
        }).join('');
    }

    renderTable();

    // Search Input Listener
    const searchInput = document.getElementById('acc-trx-search');
    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderTable(e.target.value.trim());
        });
    }
}
