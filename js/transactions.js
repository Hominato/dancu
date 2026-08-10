/**
 * AmeriCU Credit Union — Transactions Module Logic & Pagination
 */

let trxState = {
    currentPage: 1,
    pageSize: 10,
    search: '',
    category: 'all',
    account: 'all',
    type: 'all'
};

document.addEventListener('DOMContentLoaded', () => {
    initTransactionFilters();
    renderTransactionsTable();
});

function initTransactionFilters() {
    const searchInput = document.getElementById('trx-search-input');
    const catSelect = document.getElementById('trx-category-select');
    const accSelect = document.getElementById('trx-account-select');
    const typeSelect = document.getElementById('trx-type-select');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            trxState.search = e.target.value.trim().toLowerCase();
            trxState.currentPage = 1;
            renderTransactionsTable();
        });
    }

    if (catSelect) {
        catSelect.addEventListener('change', (e) => {
            trxState.category = e.target.value;
            trxState.currentPage = 1;
            renderTransactionsTable();
        });
    }

    if (accSelect) {
        accSelect.addEventListener('change', (e) => {
            trxState.account = e.target.value;
            trxState.currentPage = 1;
            renderTransactionsTable();
        });
    }

    if (typeSelect) {
        typeSelect.addEventListener('change', (e) => {
            trxState.type = e.target.value;
            trxState.currentPage = 1;
            renderTransactionsTable();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            if (trxState.currentPage > 1) {
                trxState.currentPage--;
                renderTransactionsTable();
            }
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            const total = getFilteredTransactions().length;
            const maxPage = Math.ceil(total / trxState.pageSize);
            if (trxState.currentPage < maxPage) {
                trxState.currentPage++;
                renderTransactionsTable();
            }
        });
    }
}

function getFilteredTransactions() {
    const all = Storage.getTransactions();

    return all.filter(t => {
        // Search Filter
        if (trxState.search) {
            const matchMerchant = t.merchant.toLowerCase().includes(trxState.search);
            const matchRef = t.ref.toLowerCase().includes(trxState.search);
            const matchMemo = t.memo ? t.memo.toLowerCase().includes(trxState.search) : false;
            if (!matchMerchant && !matchRef && !matchMemo) return false;
        }

        // Category Filter
        if (trxState.category !== 'all' && t.category !== trxState.category) {
            return false;
        }

        // Account Filter
        if (trxState.account !== 'all' && t.accountId !== trxState.account) {
            return false;
        }

        // Type Filter
        if (trxState.type !== 'all' && t.type !== trxState.type) {
            return false;
        }

        return true;
    });
}

function renderTransactionsTable() {
    const tbody = document.getElementById('all-trx-tbody');
    const infoText = document.getElementById('trx-pagination-info');
    const prevBtn = document.getElementById('prev-page-btn');
    const nextBtn = document.getElementById('next-page-btn');

    if (!tbody) return;

    const filtered = getFilteredTransactions();
    const total = filtered.length;
    const maxPage = Math.ceil(total / trxState.pageSize) || 1;

    if (trxState.currentPage > maxPage) trxState.currentPage = maxPage;

    const startIndex = (trxState.currentPage - 1) * trxState.pageSize;
    const pageItems = filtered.slice(startIndex, startIndex + trxState.pageSize);

    if (pageItems.length === 0) {
        tbody.innerHTML = '<tr><td colspan="7" style="text-align:center; padding:2rem; color:var(--color-text-muted);">No transactions match your search filters.</td></tr>';
        if (infoText) infoText.textContent = 'Showing 0 of 0 transactions';
        return;
    }

    const accountsMap = {};
    Storage.getAccounts().forEach(a => accountsMap[a.id] = `${a.name} (•••• ${a.mask})`);

    tbody.innerHTML = pageItems.map(t => {
        const isCredit = t.type === 'credit';
        const accountName = accountsMap[t.accountId] || 'Primary Checking';

        return `
            <tr style="cursor:pointer;" onclick="openTransactionDetails('${t.id}')">
                <td>${App.formatDate(t.date, true)}</td>
                <td>
                    <div style="font-weight:600;">${t.merchant}</div>
                    <div style="font-size:0.75rem; color:var(--color-text-muted); font-family:monospace;">${t.ref}</div>
                </td>
                <td>${t.category}</td>
                <td style="font-size:0.8rem; color:var(--color-text-muted);">${accountName}</td>
                <td class="${isCredit ? 'amount-credit' : 'amount-debit'}">${App.formatCurrency(t.amount, true)}</td>
                <td><span class="status-badge status-${t.status.toLowerCase()}">${t.status}</span></td>
                <td><button class="btn btn-outline btn-sm" style="padding:2px 8px; font-size:0.7rem;">Receipt</button></td>
            </tr>
        `;
    }).join('');

    const endIndex = Math.min(startIndex + trxState.pageSize, total);
    if (infoText) infoText.textContent = `Showing ${startIndex + 1}-${endIndex} of ${total} transactions`;

    if (prevBtn) prevBtn.disabled = trxState.currentPage === 1;
    if (nextBtn) nextBtn.disabled = trxState.currentPage >= maxPage;
}

function openTransactionDetails(trxId) {
    const transactions = Storage.getTransactions();
    const t = transactions.find(item => item.id === trxId);
    if (!t) return;

    const accountsMap = {};
    Storage.getAccounts().forEach(a => accountsMap[a.id] = `${a.name} (•••• ${a.mask})`);

    const isCredit = t.type === 'credit';
    const amountEl = document.getElementById('dtl-amount');
    
    if (amountEl) {
        amountEl.textContent = App.formatCurrency(t.amount, true);
        amountEl.style.color = isCredit ? 'var(--color-success)' : 'var(--color-text)';
    }

    document.getElementById('dtl-merchant').textContent = t.merchant;
    document.getElementById('dtl-ref').textContent = t.ref;
    document.getElementById('dtl-date').textContent = App.formatDate(t.date, true);
    document.getElementById('dtl-category').textContent = t.category;
    document.getElementById('dtl-account').textContent = accountsMap[t.accountId] || 'Primary Checking';
    document.getElementById('dtl-memo').textContent = t.memo || 'Standard Transaction';
    document.getElementById('dtl-status').textContent = t.status;
    document.getElementById('dtl-status').className = `status-badge status-${t.status.toLowerCase()}`;

    App.openModal('trx-detail-modal');
}
