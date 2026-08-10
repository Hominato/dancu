/**
 * AmeriCU Credit Union — Bill Pay Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    renderBillsGrid();
    renderBillHistoryTable();
    setupBillModals();
});

function renderBillsGrid() {
    const grid = document.getElementById('bills-grid');
    if (!grid) return;

    const bills = Storage.getBills();

    if (bills.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--color-text-muted);">No billers registered. Click "+ Add New Biller".</div>';
        return;
    }

    grid.innerHTML = bills.map(bill => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:0.85rem;">
                <div>
                    <h3 style="font-size:1.15rem; font-weight:700;">${bill.biller}</h3>
                    <div style="font-size:0.75rem; color:var(--color-text-muted);">${bill.category} • Acc #${bill.accountNumber}</div>
                </div>
                <span class="status-badge status-${bill.status.toLowerCase()}">${bill.status}</span>
            </div>

            <div style="margin:1rem 0;">
                <div style="font-size:0.75rem; color:var(--color-text-muted); text-transform:uppercase;">Amount Due</div>
                <div style="font-size:1.75rem; font-weight:800; color:var(--color-text);">${App.formatCurrency(bill.amount)}</div>
                <div style="font-size:0.8rem; color:var(--color-text-muted);">Due Date: <strong>${App.formatDate(bill.dueDate)}</strong></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); padding-top:0.85rem;">
                <span style="font-size:0.75rem; color:${bill.autoPay ? 'var(--color-success)' : 'var(--color-text-muted)'}; font-weight:600;">
                    ${bill.autoPay ? '✓ AutoPay Enabled' : 'AutoPay Off'}
                </span>
                <div style="display:flex; gap:0.5rem;">
                    <button onclick="openPayBillModal('${bill.id}')" class="btn btn-accent btn-sm">Pay Now</button>
                    <button onclick="deleteBillConfirm('${bill.id}')" class="btn btn-outline btn-sm" style="color:var(--color-danger); font-size:0.7rem;">Remove</button>
                </div>
            </div>
        </div>
    `).join('');
}

function renderBillHistoryTable() {
    const tbody = document.getElementById('bill-history-tbody');
    if (!tbody) return;

    const allTrx = Storage.getTransactions();
    const billTrx = allTrx.filter(t => t.category === 'Utilities' || t.category === 'Insurance' || t.merchant.includes('Payment') || t.merchant.includes('Company'));

    if (billTrx.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6" style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">No bill payments recorded yet.</td></tr>';
        return;
    }

    const accountsMap = {};
    Storage.getAccounts().forEach(a => accountsMap[a.id] = a.name);

    tbody.innerHTML = billTrx.slice(0, 6).map(t => `
        <tr>
            <td>${App.formatDate(t.date)}</td>
            <td><strong style="color:var(--color-text);">${t.merchant}</strong></td>
            <td>${t.category}</td>
            <td style="color:var(--color-text-muted);">${accountsMap[t.accountId] || 'Primary Checking'}</td>
            <td class="amount-debit">${App.formatCurrency(t.amount)}</td>
            <td><span class="status-badge status-completed">Paid</span></td>
        </tr>
    `).join('');
}

function setupBillModals() {
    const addBtn = document.getElementById('add-biller-btn');
    const payForm = document.getElementById('pay-bill-form');
    const addForm = document.getElementById('add-biller-form');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            addForm.reset();
            App.openModal('add-biller-modal');
        });
    }

    if (payForm) {
        payForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const billId = document.getElementById('pay-bill-id').value;
            const fromAccId = document.getElementById('pay-from-account').value;
            const amount = parseFloat(document.getElementById('pay-amount').value);
            const billerName = document.getElementById('pay-biller-name').value;

            const fromAcc = Storage.getAccountById(fromAccId);

            if (amount > fromAcc.availableBalance) {
                App.showToast(`Insufficient balance in ${fromAcc.name}. Available: ${App.formatCurrency(fromAcc.availableBalance)}`, 'error');
                return;
            }

            // Deduct Balance
            Storage.updateBalance(fromAccId, -amount);

            // Record Transaction
            Storage.addTransaction({
                merchant: `${billerName} Bill Payment`,
                category: 'Utilities',
                accountId: fromAccId,
                amount: amount,
                type: 'debit',
                status: 'Completed',
                memo: `Bill pay ref #${billId}`
            });

            // Notification
            Storage.addNotification({
                type: 'bill',
                title: 'Bill Payment Completed',
                message: `Paid ${App.formatCurrency(amount)} to ${billerName} from ${fromAcc.name}.`,
                read: false
            });

            App.closeModal('pay-bill-modal');
            renderBillsGrid();
            renderBillHistoryTable();
            App.showToast(`Bill payment of ${App.formatCurrency(amount)} to ${billerName} submitted!`, 'success');
        });
    }

    if (addForm) {
        addForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const biller = document.getElementById('new-biller-name').value.trim();
            const category = document.getElementById('new-biller-cat').value;
            const accountNumber = document.getElementById('new-biller-acc').value.trim();
            const amount = parseFloat(document.getElementById('new-biller-amount').value);
            const autoPay = document.getElementById('new-biller-autopay').checked;

            Storage.saveBill({
                biller,
                category,
                accountNumber,
                amount,
                dueDate: new Date(Date.now() + 14 * 86400000).toISOString().slice(0, 10),
                autoPay
            });

            App.closeModal('add-biller-modal');
            renderBillsGrid();
            App.showToast('New biller registered.', 'success');
        });
    }
}

function openPayBillModal(billId) {
    const bills = Storage.getBills();
    const bill = bills.find(b => b.id === billId);
    if (!bill) return;

    document.getElementById('pay-bill-id').value = bill.id;
    document.getElementById('pay-biller-name').value = bill.biller;
    document.getElementById('pay-amount').value = bill.amount;
    document.getElementById('pay-date').value = new Date().toISOString().slice(0, 10);

    const fromSelect = document.getElementById('pay-from-account');
    if (fromSelect) {
        fromSelect.innerHTML = Storage.getAccounts().map(a => 
            `<option value="${a.id}">${a.name} (${App.formatCurrency(a.availableBalance)})</option>`
        ).join('');
    }

    App.openModal('pay-bill-modal');
}

function deleteBillConfirm(billId) {
    if (confirm('Remove this biller from your bill pay list?')) {
        Storage.deleteBill(billId);
        renderBillsGrid();
        App.showToast('Biller removed.', 'info');
    }
}
