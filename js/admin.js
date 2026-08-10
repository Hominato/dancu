/**
 * AmeriCU Credit Union — Demo Admin Panel Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadAdminStats();

    const trxForm = document.getElementById('admin-trx-form');
    if (trxForm) {
        trxForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const accountId = document.getElementById('admin-trx-account').value;
            const merchant = document.getElementById('admin-trx-merchant').value.trim();
            const category = document.getElementById('admin-trx-category').value;
            const type = document.getElementById('admin-trx-type').value;
            const amount = parseFloat(document.getElementById('admin-trx-amount').value);

            if (isNaN(amount) || amount <= 0) {
                App.showToast('Please enter a valid positive amount.', 'error');
                return;
            }

            Storage.addTransaction({
                merchant,
                category,
                accountId,
                amount,
                type,
                memo: 'Simulated Admin Transaction'
            });

            const balanceChange = type === 'credit' ? amount : -amount;
            Storage.updateBalance(accountId, balanceChange);

            App.showToast(`Transaction of ${App.formatCurrency(amount)} added.`, 'success');
            trxForm.reset();
            loadAdminStats();
        });
    }

    const notifForm = document.getElementById('admin-notif-form');
    if (notifForm) {
        notifForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const type = document.getElementById('admin-notif-type').value;
            const title = document.getElementById('admin-notif-title').value.trim();
            const message = document.getElementById('admin-notif-msg').value.trim();

            Storage.addNotification({
                type,
                title,
                message
            });

            App.updateNotificationBadge();
            App.showToast('Notification triggered successfully.', 'success');
            notifForm.reset();
            loadAdminStats();
        });
    }
});

function loadAdminStats() {
    const accounts = Storage.getAccounts();
    const transactions = Storage.getTransactions();
    const beneficiaries = Storage.getBeneficiaries();
    const notifications = Storage.getNotifications();

    const totalBalance = accounts.reduce((acc, a) => acc + a.availableBalance, 0);

    const totalBalEl = document.getElementById('admin-total-balance');
    const trxCountEl = document.getElementById('admin-trx-count');
    const benCountEl = document.getElementById('admin-ben-count');
    const notifCountEl = document.getElementById('admin-notif-count');

    if (totalBalEl) totalBalEl.textContent = App.formatCurrency(totalBalance);
    if (trxCountEl) trxCountEl.textContent = transactions.length;
    if (benCountEl) benCountEl.textContent = beneficiaries.length;
    if (notifCountEl) notifCountEl.textContent = notifications.length;

    const accountSelect = document.getElementById('admin-trx-account');
    if (accountSelect) {
        accountSelect.innerHTML = accounts.map(acc => `
            <option value="${acc.id}">
                ${acc.name} (•••• ${acc.mask}) — ${App.formatCurrency(acc.availableBalance)}
            </option>
        `).join('');
    }
}

function resetEnvironmentData() {
    if (confirm('Are you sure you want to reset all demo data back to factory defaults? All custom transactions, beneficiaries, and updates will be restored.')) {
        Storage.resetToDefaults();
        App.showToast('Demo environment reset to initial seed state.', 'success');
        setTimeout(() => {
            window.location.reload();
        }, 1000);
    }
}
