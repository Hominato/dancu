/**
 * AmeriCU Credit Union — Virtual Card Controls & 3D Interactive Logic
 */

let cardState = {
    isFlipped: false,
    isUnmasked: false
};

document.addEventListener('DOMContentLoaded', () => {
    initCardControls();
});

function initCardControls() {
    const cardWrap = document.getElementById('card-3d-wrap');
    const toggleNumBtn = document.getElementById('toggle-card-num-btn');
    const freezeBtn = document.getElementById('freeze-card-btn');
    const limitsBtn = document.getElementById('set-limits-btn');

    // 3D Flip Card Handler
    if (cardWrap) {
        cardWrap.addEventListener('click', () => {
            cardState.isFlipped = !cardState.isFlipped;
            cardWrap.classList.toggle('flipped', cardState.isFlipped);
        });
    }

    // Toggle Masked Number
    if (toggleNumBtn) {
        toggleNumBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            cardState.isUnmasked = !cardState.isUnmasked;

            const numEl = document.getElementById('card-num-text');
            const card = Storage.getCards()[0];

            if (numEl && card) {
                numEl.textContent = cardState.isUnmasked ? card.number : `•••• •••• •••• ${card.mask}`;
            }

            toggleNumBtn.innerHTML = cardState.isUnmasked 
                ? '<span>Hide Card Details</span>' 
                : '<span>Show Card Details</span>';
        });
    }

    // Freeze / Unfreeze Handler
    if (freezeBtn) {
        freezeBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = Storage.getCards()[0];
            const isCurrentlyActive = card.status === 'Active';

            const actionText = isCurrentlyActive ? 'freeze' : 'unfreeze';
            
            if (confirm(`Are you sure you want to ${actionText} your Visa debit card?`)) {
                const updatedCard = Storage.toggleCardFreeze(card.id);
                renderCardStatusUI(updatedCard);

                Storage.addNotification({
                    type: 'security',
                    title: `Card ${updatedCard.status}`,
                    message: `Your AmeriCU Visa card ending in ${updatedCard.mask} has been ${updatedCard.status.toLowerCase()}.`,
                    read: false
                });

                App.showToast(`Card successfully ${updatedCard.status.toLowerCase()}.`, isCurrentlyActive ? 'warning' : 'success');
            }
        });
    }

    // Limits Modal Handler
    if (limitsBtn) {
        limitsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            const card = Storage.getCards()[0];
            document.getElementById('input-daily-limit').value = card.dailyLimit;
            document.getElementById('input-monthly-limit').value = card.monthlyLimit;
            App.openModal('limits-modal');
        });
    }

    const limitsForm = document.getElementById('limits-form');
    if (limitsForm) {
        limitsForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const daily = document.getElementById('input-daily-limit').value;
            const monthly = document.getElementById('input-monthly-limit').value;

            const card = Storage.getCards()[0];
            const updatedCard = Storage.updateCardLimits(card.id, daily, monthly);

            renderCardStatusUI(updatedCard);
            App.closeModal('limits-modal');
            App.showToast('Card spending limits updated.', 'success');
        });
    }

    // Initial UI Setup
    const card = Storage.getCards()[0];
    if (card) renderCardStatusUI(card);
}

function renderCardStatusUI(card) {
    const badge = document.getElementById('card-status-badge');
    const freezeBtn = document.getElementById('freeze-card-btn');
    const cardFront = document.getElementById('card-front-el');

    const isFrozen = card.status === 'Frozen';

    if (badge) {
        badge.textContent = card.status;
        badge.className = `status-badge ${isFrozen ? 'status-frozen' : 'status-active'}`;
    }

    if (freezeBtn) {
        freezeBtn.innerHTML = isFrozen ? '<span>Unfreeze Card</span>' : '<span>Freeze Card</span>';
        freezeBtn.className = isFrozen ? 'btn btn-accent' : 'btn btn-danger';
    }

    if (cardFront) {
        cardFront.classList.toggle('frozen-card', isFrozen);
        
        let existingOverlay = cardFront.querySelector('.frozen-badge-overlay');
        if (isFrozen && !existingOverlay) {
            const overlay = document.createElement('div');
            overlay.className = 'frozen-badge-overlay';
            overlay.textContent = 'FROZEN';
            cardFront.appendChild(overlay);
        } else if (!isFrozen && existingOverlay) {
            existingOverlay.remove();
        }
    }

    // Update Limits UI
    const spentVal = document.getElementById('spent-val');
    const limitVal = document.getElementById('limit-val');
    const dailyLimitVal = document.getElementById('daily-limit-val');
    const progressBar = document.getElementById('spent-progress-bar');

    if (spentVal) spentVal.textContent = App.formatCurrency(card.spentThisMonth);
    if (limitVal) limitVal.textContent = App.formatCurrency(card.monthlyLimit);
    if (dailyLimitVal) dailyLimitVal.textContent = App.formatCurrency(card.dailyLimit);

    if (progressBar) {
        const pct = Math.min(100, (card.spentThisMonth / card.monthlyLimit) * 100);
        progressBar.style.width = `${pct}%`;
    }
}
