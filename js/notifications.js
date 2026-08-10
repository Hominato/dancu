/**
 * AmeriCU Credit Union — Notifications Center Logic
 */

let activeFilter = 'all';

const NOTIF_ICONS = {
    transfer:    `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"/></svg>`,
    transaction: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    security:    `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>`,
    bill:        `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 14l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`,
    system:      `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
};

const NOTIF_COLORS = {
    transfer: 'success',
    transaction: 'success',
    security: 'warning',
    bill: 'danger',
    system: 'info'
};

document.addEventListener('DOMContentLoaded', () => {
    renderNotifications();

    document.querySelectorAll('.filter-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            activeFilter = tab.getAttribute('data-type');
            document.querySelectorAll('.filter-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            renderNotifications();
        });
    });
});

function renderNotifications() {
    const list = document.getElementById('notifications-list');
    if (!list) return;

    let notifs = Storage.getNotifications();
    if (activeFilter !== 'all') {
        notifs = notifs.filter(n => n.type === activeFilter);
    }

    if (notifs.length === 0) {
        list.innerHTML = '<div style="padding:3rem; text-align:center; color:var(--color-text-muted);">No notifications to display.</div>';
        return;
    }

    list.innerHTML = notifs.map(n => `
        <div class="notif-item ${n.read ? '' : 'unread'}" onclick="readNotif('${n.id}')">
            <div class="notif-icon ${NOTIF_COLORS[n.type] || 'info'}">${NOTIF_ICONS[n.type] || NOTIF_ICONS.system}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.25rem;">
                    <span style="font-weight:${n.read ? '500' : '700'}; font-size:0.9rem; color:var(--color-text);">${n.title}</span>
                    <span style="font-size:0.75rem; color:var(--color-text-muted); flex-shrink:0; margin-left:0.5rem;">${App.formatDate(n.date, true)}</span>
                </div>
                <div style="font-size:0.85rem; color:var(--color-text-muted); line-height:1.4;">${n.message || n.body}</div>
            </div>
            <button onclick="event.stopPropagation(); deleteNotif('${n.id}')" style="background:none; border:none; color:var(--color-text-muted); cursor:pointer; font-size:1rem; padding:0 4px;" title="Dismiss">&times;</button>
        </div>
    `).join('');
}

function readNotif(id) {
    const notifs = Storage.getNotifications();
    const n = notifs.find(item => item.id === id);
    if (n && !n.read) {
        n.read = true;
        localStorage.setItem('americu_notifications', JSON.stringify(notifs));
        App.updateNotificationBadge();
        renderNotifications();
    }
}

function deleteNotif(id) {
    Storage.deleteNotification(id);
    App.updateNotificationBadge();
    renderNotifications();
    App.showToast('Notification dismissed.', 'info');
}

function markAllRead() {
    Storage.markNotificationsRead();
    App.updateNotificationBadge();
    renderNotifications();
    App.showToast('All notifications marked as read.', 'success');
}

function clearAll() {
    if (confirm('Are you sure you want to clear all notifications?')) {
        Storage.clearAllNotifications();
        App.updateNotificationBadge();
        renderNotifications();
        App.showToast('Notifications cleared.', 'info');
    }
}
