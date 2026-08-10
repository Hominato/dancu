/**
 * AmeriCU Credit Union — Profile Management Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    loadUserProfile();

    const form = document.getElementById('profile-form');
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();

            const updatedData = {
                firstName: document.getElementById('prof-fname').value.trim(),
                lastName: document.getElementById('prof-lname').value.trim(),
                email: document.getElementById('prof-email').value.trim(),
                phone: document.getElementById('prof-phone').value.trim(),
                address: document.getElementById('prof-address').value.trim(),
                city: document.getElementById('prof-city').value.trim(),
                state: document.getElementById('prof-state').value.trim().toUpperCase(),
                zip: document.getElementById('prof-zip').value.trim()
            };

            Storage.updateUserProfile(updatedData);
            App.setupHeader();
            App.showToast('Profile information updated successfully.', 'success');
        });
    }
});

function loadUserProfile() {
    const user = Storage.getUser();

    document.getElementById('prof-fname').value = user.firstName || '';
    document.getElementById('prof-lname').value = user.lastName || '';
    document.getElementById('prof-email').value = user.email || '';
    document.getElementById('prof-phone').value = user.phone || '';
    document.getElementById('prof-address').value = user.address || '';
    document.getElementById('prof-city').value = user.city || '';
    document.getElementById('prof-state').value = user.state || '';
    document.getElementById('prof-zip').value = user.zip || '';
    document.getElementById('prof-dob').value = user.dob || '';

    const memberNoEl = document.getElementById('profile-member-no');
    if (memberNoEl) memberNoEl.textContent = user.memberNumber || 'TU-884920';

    const joinedEl = document.getElementById('profile-joined-date');
    if (joinedEl) joinedEl.textContent = user.joinedDate ? App.formatDate(user.joinedDate) : 'March 2021';
}
