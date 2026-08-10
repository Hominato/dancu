/**
 * AmeriCU Credit Union — Multi-Step Transfer Engine & Validation
 */

let transferState = {
    currentStep: 1,
    type: 'internal', // internal, member, external
    recipient: null,
    fromAccountId: 'acc_checking',
    toAccountId: 'acc_savings',
    amount: 0,
    date: new Date().toISOString().slice(0, 10),
    memo: ''
};

document.addEventListener('DOMContentLoaded', () => {
    initTransferWizard();
});

function initTransferWizard() {
    setupTypeSelection();
    setupBeneficiariesDropdown();
    setupAccountDropdowns();
    setupNavigationButtons();
}

// Step 1: Type Selection Cards
function setupTypeSelection() {
    const cards = document.querySelectorAll('.type-option-card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            cards.forEach(c => c.classList.remove('selected'));
            card.classList.add('selected');
            transferState.type = card.getAttribute('data-type');
        });
    });
}

// Step 2: Beneficiaries Dropdown Population
function setupBeneficiariesDropdown() {
    const select = document.getElementById('transfer-beneficiary-select');
    if (!select) return;

    const beneficiaries = Storage.getBeneficiaries();
    select.innerHTML = '<option value="new">-- Enter New Recipient --</option>' + 
        beneficiaries.map(b => `<option value="${b.id}">${b.nickname || b.name} (${b.bankName} •••• ${b.mask})</option>`).join('');

    select.addEventListener('change', (e) => {
        const val = e.target.value;
        const newFields = document.getElementById('new-recipient-fields');
        if (val === 'new') {
            if (newFields) newFields.style.display = 'grid';
            transferState.recipient = null;
        } else {
            if (newFields) newFields.style.display = 'none';
            const b = beneficiaries.find(item => item.id === val);
            transferState.recipient = b;
        }
    });
}

// Step 3: Populate From / To Account Selects
function setupAccountDropdowns() {
    const fromSelect = document.getElementById('transfer-from-account');
    const toSelect = document.getElementById('transfer-to-account');
    const dateInput = document.getElementById('transfer-date');

    if (dateInput) dateInput.value = transferState.date;

    const accounts = Storage.getAccounts();

    if (fromSelect) {
        fromSelect.innerHTML = accounts.map(a => 
            `<option value="${a.id}">${a.name} (•••• ${a.mask}) - ${App.formatCurrency(a.availableBalance)}</option>`
        ).join('');

        fromSelect.addEventListener('change', (e) => {
            transferState.fromAccountId = e.target.value;
            updateAvailableBalanceNotice();
        });
    }

    if (toSelect) {
        toSelect.innerHTML = accounts.map(a => 
            `<option value="${a.id}">${a.name} (•••• ${a.mask})</option>`
        ).join('');

        toSelect.addEventListener('change', (e) => {
            transferState.toAccountId = e.target.value;
        });
    }

    updateAvailableBalanceNotice();
}

function updateAvailableBalanceNotice() {
    const notice = document.getElementById('available-bal-notice');
    const fromSelect = document.getElementById('transfer-from-account');
    if (!notice || !fromSelect) return;

    const acc = Storage.getAccountById(fromSelect.value);
    if (acc) {
        notice.textContent = `Available Balance: ${App.formatCurrency(acc.availableBalance)}`;
    }
}

// Step Navigation Handlers & Validations
function setupNavigationButtons() {
    // Step 1 -> Step 2
    document.getElementById('step1-next-btn')?.addEventListener('click', () => {
        if (transferState.type === 'internal') {
            document.getElementById('recipient-internal-msg').style.display = 'block';
            document.getElementById('recipient-form-wrap').style.display = 'none';
        } else {
            document.getElementById('recipient-internal-msg').style.display = 'none';
            document.getElementById('recipient-form-wrap').style.display = 'block';
        }
        goToStep(2);
    });

    // Step 2 -> Step 3
    document.getElementById('step2-next-btn')?.addEventListener('click', () => {
        if (transferState.type !== 'internal') {
            const benSelect = document.getElementById('transfer-beneficiary-select').value;
            if (benSelect === 'new') {
                const name = document.getElementById('recip-name').value.trim();
                const bank = document.getElementById('recip-bank').value.trim();
                const routing = document.getElementById('recip-routing').value.trim();
                const account = document.getElementById('recip-account').value.trim();

                if (!name || !bank || !routing || !account) {
                    App.showToast('Please fill out all recipient fields.', 'error');
                    return;
                }
                if (routing.length !== 9 || isNaN(routing)) {
                    App.showToast('Routing number must be exactly 9 numeric digits.', 'error');
                    return;
                }

                transferState.recipient = { name, bankName: bank, routingNumber: routing, accountNumber: account, mask: account.slice(-4) };
            }
        }

        // Adjust Step 3 "To Account" visibility
        const toWrap = document.getElementById('to-account-wrap');
        if (toWrap) {
            toWrap.style.display = transferState.type === 'internal' ? 'block' : 'none';
        }

        goToStep(3);
    });

    // Step 3 -> Step 4
    document.getElementById('step3-next-btn')?.addEventListener('click', () => {
        const amountVal = parseFloat(document.getElementById('transfer-amount').value);
        const fromAccId = document.getElementById('transfer-from-account').value;
        const toAccId = document.getElementById('transfer-to-account').value;
        const memo = document.getElementById('transfer-memo').value.trim();

        const fromAcc = Storage.getAccountById(fromAccId);

        if (isNaN(amountVal) || amountVal <= 0) {
            App.showToast('Please enter a valid transfer amount greater than $0.00.', 'error');
            return;
        }

        if (amountVal > fromAcc.availableBalance) {
            App.showToast(`Insufficient available balance. Available: ${App.formatCurrency(fromAcc.availableBalance)}`, 'error');
            return;
        }

        if (transferState.type === 'internal' && fromAccId === toAccId) {
            App.showToast('Source and destination accounts must be different.', 'error');
            return;
        }

        transferState.fromAccountId = fromAccId;
        transferState.toAccountId = toAccId;
        transferState.amount = amountVal;
        transferState.memo = memo || (transferState.type === 'internal' ? 'Internal Transfer' : 'Member Transfer');

        // Populate Step 4 Review Screen
        const toAcc = Storage.getAccountById(toAccId);
        document.getElementById('rev-from-account').textContent = `${fromAcc.name} (•••• ${fromAcc.mask})`;

        if (transferState.type === 'internal') {
            document.getElementById('rev-to-recipient').textContent = `${toAcc.name} (•••• ${toAcc.mask})`;
        } else if (transferState.recipient) {
            document.getElementById('rev-to-recipient').textContent = `${transferState.recipient.name} (${transferState.recipient.bankName} •••• ${transferState.recipient.mask})`;
        }

        document.getElementById('rev-amount').textContent = App.formatCurrency(transferState.amount);
        document.getElementById('rev-date').textContent = App.formatDate(document.getElementById('transfer-date').value);
        document.getElementById('rev-memo').textContent = transferState.memo;

        goToStep(4);
    });

    // Step 4 Submit -> Step 5 Execution
    document.getElementById('submit-transfer-btn')?.addEventListener('click', async () => {
        const btn = document.getElementById('submit-transfer-btn');
        btn.disabled = true;
        btn.innerHTML = '<span>Processing Transfer...</span>';

        await App.simulateDelay(1000);

        // Deduct from Source Account
        Storage.updateBalance(transferState.fromAccountId, -transferState.amount);

        let recipientName = '';
        const fromAcc = Storage.getAccountById(transferState.fromAccountId);

        if (transferState.type === 'internal') {
            // Add to Destination Account
            Storage.updateBalance(transferState.toAccountId, transferState.amount);
            const toAcc = Storage.getAccountById(transferState.toAccountId);
            recipientName = toAcc.name;
        } else if (transferState.recipient) {
            recipientName = transferState.recipient.name;
        }

        // Record Transaction
        const newTrx = Storage.addTransaction({
            merchant: transferState.type === 'internal' ? `Transfer to ${recipientName}` : `Payment to ${recipientName}`,
            category: 'Transfer',
            accountId: transferState.fromAccountId,
            amount: transferState.amount,
            type: 'debit',
            status: 'Completed',
            memo: transferState.memo
        });

        // Add System Notification
        Storage.addNotification({
            type: 'transfer',
            title: 'Transfer Completed',
            message: `${App.formatCurrency(transferState.amount)} transfer to ${recipientName} processed successfully.`,
            read: false
        });

        // Update Step 5 Receipts
        document.getElementById('conf-ref-code').textContent = newTrx.ref;
        document.getElementById('conf-amount').textContent = App.formatCurrency(transferState.amount);
        document.getElementById('conf-from').textContent = fromAcc.name;
        document.getElementById('conf-to').textContent = recipientName;

        App.showToast('Transfer completed successfully!', 'success');
        goToStep(5);
    });

    // Back Buttons
    document.querySelectorAll('.wizard-back-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (transferState.currentStep > 1) {
                goToStep(transferState.currentStep - 1);
            }
        });
    });
}

function goToStep(stepNumber) {
    transferState.currentStep = stepNumber;

    // Update Step Indicator UI
    document.querySelectorAll('.step-item').forEach(item => {
        const step = parseInt(item.getAttribute('data-step'));
        if (step === stepNumber) {
            item.classList.add('active');
            item.classList.remove('completed');
        } else if (step < stepNumber) {
            item.classList.remove('active');
            item.classList.add('completed');
        } else {
            item.classList.remove('active', 'completed');
        }
    });

    // Show/Hide Step Containers
    document.querySelectorAll('.transfer-wizard-step').forEach(stepEl => {
        stepEl.style.display = 'none';
    });
    const currentStepEl = document.getElementById(`transfer-step-${stepNumber}`);
    if (currentStepEl) currentStepEl.style.display = 'block';

    window.scrollTo({ top: 0, behavior: 'smooth' });
}
