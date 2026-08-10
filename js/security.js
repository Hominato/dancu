/**
 * AmeriCU Credit Union — Security Settings Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadSecuritySettings();

    const passForm = document.getElementById('password-form');
    if (passForm) {
        passForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const curr = document.getElementById('curr-password').value;
            const newP = document.getElementById('new-password').value;
            const conf = document.getElementById('confirm-password').value;

            if (newP.length < 8) {
                App.showToast('New password must be at least 8 characters.', 'error');
                return;
            }

            if (newP !== conf) {
                App.showToast('New passwords do not match.', 'error');
                return;
            }

            App.showToast('Password updated successfully.', 'success');
            passForm.reset();

            Storage.addNotification({
                type: 'security',
                title: 'Password Changed',
                message: 'Your account password was updated successfully.'
            });
        });
    }

    const mfaToggle = document.getElementById('mfa-toggle');
    if (mfaToggle) {
        mfaToggle.addEventListener('change', (e) => {
            Storage.saveSettings({ mfaEnabled: e.target.checked });
            App.showToast(`Two-Factor Authentication ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
        });
    }

    const biometricToggle = document.getElementById('biometric-toggle');
    if (biometricToggle) {
        biometricToggle.addEventListener('change', (e) => {
            Storage.saveSettings({ biometricEnabled: e.target.checked });
            App.showToast(`Biometric authentication ${e.target.checked ? 'enabled' : 'disabled'}.`, 'info');
        });
    }
});

function loadSecuritySettings() {
    const settings = Storage.getSettings();
    const mfaToggle = document.getElementById('mfa-toggle');
    const biometricToggle = document.getElementById('biometric-toggle');

    if (mfaToggle) mfaToggle.checked = settings.mfaEnabled !== false;
    if (biometricToggle) biometricToggle.checked = settings.biometricEnabled !== false;
}
