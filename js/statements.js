/**
 * AmeriCU Credit Union — Statement Rendering & Printing Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    initStatementGenerator();
});

function initStatementGenerator() {
    const generateBtn = document.getElementById('generate-stmt-btn');
    if (generateBtn) {
        generateBtn.addEventListener('click', () => {
            const accountId = document.getElementById('stmt-account-select').value;
            const period = document.getElementById('stmt-period-select').value;
            renderStatementPaper(accountId, period);
        });
    }

    // Check URL parameters for pre-selected account
    const urlParams = new URLSearchParams(window.location.search);
    const accountId = urlParams.get('account') || 'acc_checking';

    const accSelect = document.getElementById('stmt-account-select');
    if (accSelect) accSelect.value = accountId;

    renderStatementPaper(accountId, 'aug2026');
}

function renderStatementPaper(accountId, periodKey) {
    const paper = document.getElementById('statement-paper-area');
    if (!paper) return;

    const user = Storage.getUser();
    const account = Storage.getAccountById(accountId) || Storage.getAccounts()[0];
    const allTrx = Storage.getTransactions().filter(t => t.accountId === account.id);

    let periodLabel = 'August 1, 2026 – August 10, 2026';
    let filteredTrx = allTrx;

    if (periodKey === 'jul2026') {
        periodLabel = 'July 1, 2026 – July 31, 2026';
        filteredTrx = allTrx.filter(t => t.date.startsWith('2026-07'));
    } else if (periodKey === 'aug2026') {
        periodLabel = 'August 1, 2026 – August 10, 2026';
        filteredTrx = allTrx.filter(t => t.date.startsWith('2026-08'));
    } else if (periodKey === 'last3m') {
        periodLabel = 'June 1, 2026 – August 10, 2026';
        filteredTrx = allTrx;
    }

    let totalCredits = 0;
    let totalDebits = 0;

    filteredTrx.forEach(t => {
        if (t.type === 'credit') totalCredits += t.amount;
        else totalDebits += t.amount;
    });

    const endingBalance = account.currentBalance;
    const beginningBalance = endingBalance - totalCredits + totalDebits;

    paper.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:flex-start; border-bottom:2px solid #123B72; padding-bottom:1.5rem; margin-bottom:1.5rem;">
            <div>
                <div style="display:flex; align-items:center; gap:0.5rem; margin-bottom:0.25rem;">
                    <img src="assets/images/logo.png" alt="AmeriCU Credit Union" style="max-height:42px;">
                </div>
                <div style="font-size:0.8rem; color:#6B7280;">742 Financial Way, Suite 400 • Springfield, OR 97477 • (800) 555-AMERICU</div>
            </div>
            <div style="text-align:right;">
                <div style="font-size:1.25rem; font-weight:800; color:#172033;">ACCOUNT STATEMENT</div>
                <div style="font-size:0.85rem; color:#6B7280; margin-top:0.2rem;">${periodLabel}</div>
            </div>
        </div>

        <div style="display:grid; grid-template-columns:1fr 1fr; gap:2rem; margin-bottom:2rem; font-size:0.875rem;">
            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1rem; border-radius:8px;">
                <div style="font-weight:700; color:#123B72; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem;">Member Information</div>
                <div style="font-weight:700; font-size:1rem; color:#172033;">${user.fullName}</div>
                <div style="color:#6B7280;">${user.address}</div>
                <div style="color:#6B7280;">${user.city}, ${user.state} ${user.zip}</div>
                <div style="color:#6B7280; margin-top:0.35rem;">Member ID: <strong>${user.memberNumber}</strong></div>
            </div>

            <div style="background:#F8FAFC; border:1px solid #E2E8F0; padding:1rem; border-radius:8px;">
                <div style="font-weight:700; color:#123B72; margin-bottom:0.5rem; text-transform:uppercase; font-size:0.75rem;">Account Summary</div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>Account Name:</span><strong>${account.name}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>Account Number:</span><strong>•••• ${account.mask}</strong>
                </div>
                <div style="display:flex; justify-content:space-between; margin-bottom:0.25rem;">
                    <span>Routing Number:</span><strong>${account.routingNumber}</strong>
                </div>
                <div style="display:flex; justify-content:space-between;">
                    <span>Dividend APY:</span><strong>${account.apy}</strong>
                </div>
            </div>
        </div>

        <!-- Financial Summary Bar -->
        <div style="display:grid; grid-template-columns:repeat(4, 1fr); gap:1rem; background:#123B72; color:white; padding:1.25rem; border-radius:8px; margin-bottom:2rem; text-align:center;">
            <div>
                <div style="font-size:0.7rem; opacity:0.8; text-transform:uppercase;">Beginning Balance</div>
                <div style="font-size:1.15rem; font-weight:700; margin-top:0.2rem;">${App.formatCurrency(beginningBalance)}</div>
            </div>
            <div>
                <div style="font-size:0.7rem; opacity:0.8; text-transform:uppercase;">Total Credits (+)</div>
                <div style="font-size:1.15rem; font-weight:700; margin-top:0.2rem; color:#4ADE80;">+${App.formatCurrency(totalCredits)}</div>
            </div>
            <div>
                <div style="font-size:0.7rem; opacity:0.8; text-transform:uppercase;">Total Debits (-)</div>
                <div style="font-size:1.15rem; font-weight:700; margin-top:0.2rem; color:#FCA5A5;">-${App.formatCurrency(totalDebits)}</div>
            </div>
            <div>
                <div style="font-size:0.7rem; opacity:0.8; text-transform:uppercase;">Ending Balance</div>
                <div style="font-size:1.25rem; font-weight:800; margin-top:0.2rem;">${App.formatCurrency(endingBalance)}</div>
            </div>
        </div>

        <!-- Transaction Activity Table -->
        <h3 style="font-size:1.1rem; font-weight:700; color:#172033; margin-bottom:0.75rem;">Itemized Activity Detail</h3>
        <table style="width:100%; border-collapse:collapse; text-align:left; font-size:0.85rem;">
            <thead>
                <tr style="background:#F1F5F9; border-bottom:2px solid #CBD5E1;">
                    <th style="padding:8px 12px;">Date</th>
                    <th style="padding:8px 12px;">Transaction Reference</th>
                    <th style="padding:8px 12px;">Description</th>
                    <th style="padding:8px 12px;">Category</th>
                    <th style="padding:8px 12px; text-align:right;">Amount</th>
                </tr>
            </thead>
            <tbody>
                ${filteredTrx.map(t => {
                    const isCredit = t.type === 'credit';
                    return `
                        <tr style="border-bottom:1px solid #E2E8F0;">
                            <td style="padding:10px 12px;">${App.formatDate(t.date)}</td>
                            <td style="padding:10px 12px; font-family:monospace; color:#6B7280;">${t.ref}</td>
                            <td style="padding:10px 12px; font-weight:600;">${t.merchant} ${t.memo ? `(${t.memo})` : ''}</td>
                            <td style="padding:10px 12px;">${t.category}</td>
                            <td style="padding:10px 12px; text-align:right; font-weight:700; color:${isCredit ? '#16A34A' : '#172033'};">
                                ${App.formatCurrency(t.amount, true)}
                            </td>
                        </tr>
                    `;
                }).join('')}
            </tbody>
        </table>

        <div style="margin-top:2.5rem; border-top:1px solid #E2E8F0; padding-top:1rem; font-size:0.75rem; color:#94A3B8; text-align:center;">
            This e-Statement is generated for demo simulation purposes. Insured by NCUA up to $250,000.
        </div>
    `;
}
