/**
 * AmeriCU Credit Union — Settings & Preferences Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSettings();

    document.querySelectorAll('.theme-choice-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const theme = btn.getAttribute('data-theme');
            App.setThemePreference(theme);
            highlightActiveTheme(theme);
        });
    });

    const accountSelect = document.getElementById('default-account-select');
    if (accountSelect) {
        accountSelect.addEventListener('change', (e) => {
            Storage.saveSettings({ defaultAccount: e.target.value });
            App.showToast('Default banking account saved.', 'success');
        });
    }

    const emailToggle = document.getElementById('email-notif-toggle');
    if (emailToggle) {
        emailToggle.addEventListener('change', (e) => {
            Storage.saveSettings({ emailNotifications: e.target.checked });
            App.showToast(`Email alerts ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
        });
    }

    const smsToggle = document.getElementById('sms-notif-toggle');
    if (smsToggle) {
        smsToggle.addEventListener('change', (e) => {
            Storage.saveSettings({ smsNotifications: e.target.checked });
            App.showToast(`SMS text alerts ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
        });
    }
});

function loadSettings() {
    const settings = Storage.getSettings();
    const accounts = Storage.getAccounts();

    highlightActiveTheme(settings.theme || 'system');

    const accountSelect = document.getElementById('default-account-select');
    if (accountSelect) {
        accountSelect.innerHTML = accounts.map(acc => `
            <option value="${acc.id}" ${settings.defaultAccount === acc.id ? 'selected' : ''}>
                ${acc.name} (•••• ${acc.mask}) — ${App.formatCurrency(acc.availableBalance)}
            </option>
        `).join('');
    }

    const emailToggle = document.getElementById('email-notif-toggle');
    const smsToggle = document.getElementById('sms-notif-toggle');

    if (emailToggle) emailToggle.checked = settings.emailNotifications !== false;
    if (smsToggle) smsToggle.checked = settings.smsNotifications !== false;
}

function highlightActiveTheme(currentTheme) {
    document.querySelectorAll('.theme-choice-btn').forEach(btn => {
        const theme = btn.getAttribute('data-theme');
        if (theme === currentTheme) {
            btn.classList.add('btn-primary');
            btn.classList.remove('btn-outline');
        } else {
            btn.classList.remove('btn-primary');
            btn.classList.add('btn-outline');
        }
    });
}
