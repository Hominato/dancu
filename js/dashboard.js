/**
 * AmeriCU Credit Union — Dashboard Logic & SVG Interactive Chart
 */

document.addEventListener('DOMContentLoaded', () => {
    loadDashboardBalances();
    renderAccountCards();
    renderRecentTransactions();
    renderUpcomingBills();
    initBalanceChart();
});

// Load Portfolio Totals
function loadDashboardBalances() {
    const accounts = Storage.getAccounts();
    
    let total = 0;
    let available = 0;

    accounts.forEach(acc => {
        total += acc.currentBalance;
        available += acc.availableBalance;
    });

    const totalEl = document.getElementById('dash-total-balance');
    const availEl = document.getElementById('dash-available-balance');

    if (totalEl) totalEl.textContent = App.formatCurrency(total);
    if (availEl) availEl.textContent = App.formatCurrency(available);
}

// Render Accounts Cards Grid
function renderAccountCards() {
    const grid = document.getElementById('dash-accounts-grid');
    if (!grid) return;

    const accounts = Storage.getAccounts();

    grid.innerHTML = accounts.map(acc => `
        <div class="account-card" onclick="window.location.href='account-details.html?id=${acc.id}'" style="cursor:pointer;">
            <div class="account-card-header">
                <div>
                    <div class="account-name">${acc.name}</div>
                    <div class="account-mask">•••• ${acc.mask}</div>
                </div>
                <span class="status-badge status-active" style="font-size:0.7rem;">${acc.apy} APY</span>
            </div>
            <div>
                <div class="account-balance-label">Available Balance</div>
                <div class="account-balance-val">${App.formatCurrency(acc.availableBalance)}</div>
            </div>
            <div style="display:flex; justify-content:space-between; margin-top:1rem; font-size:0.775rem; color:var(--color-text-muted);">
                <span>Routing: ${acc.routingNumber}</span>
                <span style="color:var(--color-secondary); font-weight:600;">Details →</span>
            </div>
        </div>
    `).join('');
}

// Render Recent 5 Transactions
function renderRecentTransactions() {
    const container = document.getElementById('dash-recent-transactions');
    if (!container) return;

    const transactions = Storage.getTransactions().slice(0, 5);

    if (transactions.length === 0) {
        container.innerHTML = '<div style="text-align:center; padding:1.5rem; color:var(--color-text-muted);">No transactions recorded.</div>';
        return;
    }

    container.innerHTML = transactions.map(trx => {
        const isCredit = trx.type === 'credit';
        const amountFormatted = App.formatCurrency(trx.amount, true);
        const amountClass = isCredit ? 'amount-credit' : 'amount-debit';

        return `
            <div style="display:flex; align-items:center; justify-content:space-between; padding:0.85rem 0; border-bottom:1px solid var(--color-border);">
                <div style="display:flex; align-items:center; gap:0.85rem;">
                    <div style="width:40px; height:40px; border-radius:50%; background:${isCredit ? 'rgba(22,163,74,0.12)' : 'var(--color-bg)'}; color:${isCredit ? 'var(--color-success)' : 'var(--color-text-muted)'}; display:flex; align-items:center; justify-content:center;">
                        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20">
                            ${isCredit 
                                ? '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 14l-7 7m0 0l-7-7m7 7V3"/>'
                                : '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18"/>'
                            }
                        </svg>
                    </div>
                    <div>
                        <div style="font-weight:600; font-size:0.9rem; color:var(--color-text);">${trx.merchant}</div>
                        <div style="font-size:0.775rem; color:var(--color-text-muted);">${App.formatDate(trx.date)} • ${trx.category}</div>
                    </div>
                </div>
                <div style="text-align:right;">
                    <div class="${amountClass}">${amountFormatted}</div>
                    <span class="status-badge status-${trx.status.toLowerCase()}" style="font-size:0.65rem;">${trx.status}</span>
                </div>
            </div>
        `;
    }).join('');
}

// Render Upcoming Bills Widget
function renderUpcomingBills() {
    const container = document.getElementById('dash-upcoming-bills');
    if (!container) return;

    const bills = Storage.getBills().slice(0, 3);

    container.innerHTML = bills.map(bill => `
        <div style="display:flex; align-items:center; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid var(--color-border);">
            <div>
                <div style="font-weight:600; font-size:0.875rem;">${bill.biller}</div>
                <div style="font-size:0.75rem; color:var(--color-text-muted);">Due ${App.formatDate(bill.dueDate)}</div>
            </div>
            <div style="display:flex; align-items:center; gap:0.75rem;">
                <div style="font-weight:700; font-size:0.9rem;">${App.formatCurrency(bill.amount)}</div>
                <button onclick="window.location.href='bills.html'" class="btn btn-outline btn-sm" style="padding:2px 8px; font-size:0.7rem;">Pay</button>
            </div>
        </div>
    `).join('');
}

// SVG Interactive Balance History Chart
function initBalanceChart() {
    const svg = document.getElementById('balance-chart-svg');
    if (!svg) return;

    const chartDataSets = {
        '7d': [
            { label: 'Aug 4', value: 22850 },
            { label: 'Aug 5', value: 23100 },
            { label: 'Aug 6', value: 23450 },
            { label: 'Aug 7', value: 23200 },
            { label: 'Aug 8', value: 23800 },
            { label: 'Aug 9', value: 24200 },
            { label: 'Aug 10', value: 24850.65 }
        ],
        '30d': [
            { label: 'Jul 12', value: 19500 },
            { label: 'Jul 18', value: 20200 },
            { label: 'Jul 24', value: 21100 },
            { label: 'Jul 30', value: 22400 },
            { label: 'Aug 4', value: 23100 },
            { label: 'Aug 10', value: 24850.65 }
        ],
        '90d': [
            { label: 'May', value: 16200 },
            { label: 'Jun', value: 18400 },
            { label: 'Jul', value: 21800 },
            { label: 'Aug', value: 24850.65 }
        ],
        '1y': [
            { label: 'Sep 25', value: 12000 },
            { label: 'Nov 25', value: 14500 },
            { label: 'Jan 26', value: 17200 },
            { label: 'Mar 26', value: 19800 },
            { label: 'May 26', value: 21500 },
            { label: 'Aug 26', value: 24850.65 }
        ]
    };

    function renderChart(period = '30d') {
        const data = chartDataSets[period] || chartDataSets['30d'];
        const svgWidth = 700;
        const svgHeight = 220;
        const padding = 35;

        const values = data.map(d => d.value);
        const minVal = Math.min(...values) * 0.95;
        const maxVal = Math.max(...values) * 1.05;

        const points = data.map((d, index) => {
            const x = padding + (index / (data.length - 1)) * (svgWidth - padding * 2);
            const y = svgHeight - padding - ((d.value - minVal) / (maxVal - minVal)) * (svgHeight - padding * 2);
            return { x, y, label: d.label, value: d.value };
        });

        // Path string building
        const dPath = points.reduce((acc, point, i) => {
            return i === 0 ? `M ${point.x} ${point.y}` : `${acc} L ${point.x} ${point.y}`;
        }, '');

        const areaPath = `${dPath} L ${points[points.length - 1].x} ${svgHeight - padding} L ${points[0].x} ${svgHeight - padding} Z`;

        svg.innerHTML = `
            <defs>
                <linearGradient id="chartGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stop-color="#20B486" stop-opacity="0.4"/>
                    <stop offset="100%" stop-color="#20B486" stop-opacity="0.0"/>
                </linearGradient>
            </defs>

            <!-- Grid Lines -->
            <line x1="${padding}" y1="${padding}" x2="${svgWidth - padding}" y2="${padding}" stroke="var(--color-border)" stroke-dasharray="4"/>
            <line x1="${padding}" y1="${svgHeight / 2}" x2="${svgWidth - padding}" y2="${svgHeight / 2}" stroke="var(--color-border)" stroke-dasharray="4"/>
            <line x1="${padding}" y1="${svgHeight - padding}" x2="${svgWidth - padding}" y2="${svgHeight - padding}" stroke="var(--color-border)"/>

            <!-- Gradient Fill Area -->
            <path d="${areaPath}" fill="url(#chartGradient)"/>

            <!-- Line Path -->
            <path d="${dPath}" fill="none" stroke="#20B486" stroke-width="3" stroke-linecap="round"/>

            <!-- Data Points & Labels -->
            ${points.map(p => `
                <g class="chart-point-group">
                    <circle cx="${p.x}" cy="${p.y}" r="5" fill="#20B486" stroke="var(--color-surface)" stroke-width="2" />
                    <text x="${p.x}" y="${svgHeight - 10}" text-anchor="middle" font-size="11" fill="var(--color-text-muted)" font-family="Inter">${p.label}</text>
                    <text x="${p.x}" y="${p.y - 12}" text-anchor="middle" font-size="11" font-weight="700" fill="var(--color-text)" font-family="Inter">${App.formatCurrency(p.value)}</text>
                </g>
            `).join('')}
        `;
    }

    renderChart('30d');

    // Period Button Click Controls
    const buttons = document.querySelectorAll('.chart-period-btn');
    buttons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            buttons.forEach(b => b.classList.remove('active'));
            e.target.classList.add('active');
            renderChart(e.target.getAttribute('data-period'));
        });
    });
}
