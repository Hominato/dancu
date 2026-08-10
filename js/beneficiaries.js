/**
 * AmeriCU Credit Union — Beneficiaries Management Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    renderBeneficiariesGrid();
    setupBeneficiaryModal();
});

function renderBeneficiariesGrid(searchQuery = '') {
    const grid = document.getElementById('beneficiaries-grid');
    if (!grid) return;

    let beneficiaries = Storage.getBeneficiaries();

    if (searchQuery) {
        const q = searchQuery.toLowerCase();
        beneficiaries = beneficiaries.filter(b => 
            b.name.toLowerCase().includes(q) || 
            b.bankName.toLowerCase().includes(q) || 
            (b.nickname && b.nickname.toLowerCase().includes(q))
        );
    }

    if (beneficiaries.length === 0) {
        grid.innerHTML = '<div style="grid-column: 1 / -1; text-align:center; padding:3rem; color:var(--color-text-muted);">No beneficiaries found. Click "+ Add Beneficiary" to create one.</div>';
        return;
    }

    grid.innerHTML = beneficiaries.map(b => `
        <div class="card">
            <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:1rem;">
                <div>
                    <h3 style="font-size:1.1rem; font-weight:700;">${b.nickname || b.name}</h3>
                    <div style="font-size:0.8rem; color:var(--color-text-muted);">${b.name}</div>
                </div>
                <span class="status-badge status-active">${b.accountType || 'Checking'}</span>
            </div>

            <div style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.6; margin-bottom:1.25rem;">
                <div>Bank: <strong style="color:var(--color-text);">${b.bankName}</strong></div>
                <div>Account: <strong>•••• ${b.mask || (b.accountNumber ? b.accountNumber.slice(-4) : '0000')}</strong></div>
                <div>Routing: <strong>${b.routingNumber}</strong></div>
            </div>

            <div style="display:flex; justify-content:space-between; align-items:center; border-top:1px solid var(--color-border); padding-top:0.85rem;">
                <a href="transfers.html" class="btn btn-primary btn-sm">Send Money</a>
                <div style="display:flex; gap:0.5rem;">
                    <button onclick="editBeneficiary('${b.id}')" class="btn btn-outline btn-sm">Edit</button>
                    <button onclick="deleteBeneficiaryConfirm('${b.id}')" class="btn btn-danger btn-sm" style="padding:4px 8px;">✕</button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupBeneficiaryModal() {
    const addBtn = document.getElementById('add-ben-btn');
    const searchInput = document.getElementById('ben-search');
    const form = document.getElementById('beneficiary-form');

    if (addBtn) {
        addBtn.addEventListener('click', () => {
            document.getElementById('ben-modal-title').textContent = 'Add New Beneficiary';
            form.reset();
            document.getElementById('ben-id').value = '';
            App.openModal('beneficiary-modal');
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            renderBeneficiariesGrid(e.target.value.trim());
        });
    }

    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const id = document.getElementById('ben-id').value;
            const name = document.getElementById('ben-name').value.trim();
            const bankName = document.getElementById('ben-bank').value.trim();
            const routingNumber = document.getElementById('ben-routing').value.trim();
            const accountNumber = document.getElementById('ben-account').value.trim();
            const accountType = document.getElementById('ben-type').value;
            const nickname = document.getElementById('ben-nickname').value.trim();

            if (routingNumber.length !== 9 || isNaN(routingNumber)) {
                App.showToast('Routing number must be exactly 9 numeric digits.', 'error');
                return;
            }

            Storage.saveBeneficiary({
                id: id || undefined,
                name,
                bankName,
                routingNumber,
                accountNumber,
                accountType,
                nickname
            });

            App.closeModal('beneficiary-modal');
            renderBeneficiariesGrid();
            App.showToast(id ? 'Beneficiary updated.' : 'Beneficiary added successfully.', 'success');
        });
    }
}

function editBeneficiary(id) {
    const beneficiaries = Storage.getBeneficiaries();
    const b = beneficiaries.find(item => item.id === id);
    if (!b) return;

    document.getElementById('ben-modal-title').textContent = 'Edit Beneficiary';
    document.getElementById('ben-id').value = b.id;
    document.getElementById('ben-name').value = b.name;
    document.getElementById('ben-bank').value = b.bankName;
    document.getElementById('ben-routing').value = b.routingNumber;
    document.getElementById('ben-account').value = b.accountNumber || '';
    document.getElementById('ben-type').value = b.accountType || 'Checking';
    document.getElementById('ben-nickname').value = b.nickname || '';

    App.openModal('beneficiary-modal');
}

function deleteBeneficiaryConfirm(id) {
    if (confirm('Are you sure you want to remove this beneficiary?')) {
        Storage.deleteBeneficiary(id);
        renderBeneficiariesGrid();
        App.showToast('Beneficiary deleted.', 'info');
    }
}
