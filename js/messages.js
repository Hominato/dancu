/**
 * AmeriCU Credit Union — Secure Messaging Logic
 */

let currentFolder = 'inbox';

document.addEventListener('DOMContentLoaded', () => {
    renderMessages('inbox');

    document.querySelectorAll('.folder-item').forEach(fi => {
        fi.addEventListener('click', () => {
            renderMessages(fi.getAttribute('data-folder'));
        });
    });

    const composeBtn = document.getElementById('compose-btn');
    if (composeBtn) {
        composeBtn.addEventListener('click', () => App.openModal('compose-modal'));
    }

    const composeForm = document.getElementById('compose-form');
    if (composeForm) {
        composeForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const subject = document.getElementById('compose-subject').value.trim();
            const body = document.getElementById('compose-body').value.trim();
            
            if (!subject || !body) {
                App.showToast('Please fill out both subject and message body.', 'error');
                return;
            }

            Storage.sendMessage({ subject, body });
            App.closeModal('compose-modal');
            composeForm.reset();
            renderMessages(currentFolder);
            App.showToast('Secure message sent to AmeriCU Support.', 'success');
        });
    }
});

function renderMessages(folder) {
    currentFolder = folder;
    const panel = document.getElementById('message-list-panel');
    const detailPanel = document.getElementById('message-detail-panel');
    if (detailPanel) detailPanel.style.display = 'none';
    if (panel) panel.style.display = 'block';

    const allMessages = Storage.getMessages();
    const filtered = folder === 'archived'
        ? allMessages.filter(m => m.folder === 'archived')
        : folder === 'sent'
        ? allMessages.filter(m => m.folder === 'sent')
        : allMessages.filter(m => m.folder === 'inbox');

    document.querySelectorAll('.folder-item').forEach(fi => {
        fi.classList.toggle('active', fi.getAttribute('data-folder') === folder);
    });

    if (!panel) return;

    if (filtered.length === 0) {
        panel.innerHTML = '<div style="padding:3rem; text-align:center; color:var(--color-text-muted);">No messages in this folder.</div>';
        return;
    }

    panel.innerHTML = filtered.map(msg => `
        <div class="message-item ${!msg.read ? 'unread' : ''}" onclick="openMessage('${msg.id}')">
            <div class="message-avatar-icon">${msg.sender ? msg.sender.charAt(0) : 'T'}</div>
            <div style="flex:1; min-width:0;">
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:0.2rem;">
                    <span style="font-weight:${msg.read ? '500' : '700'}; color:var(--color-text);">${msg.sender || 'AmeriCU Support'}</span>
                    <span style="font-size:0.75rem; color:var(--color-text-muted);">${App.formatDate(msg.date)}</span>
                </div>
                <div style="font-size:0.875rem; font-weight:${msg.read ? '400' : '600'};">${msg.subject}</div>
                <div style="font-size:0.775rem; color:var(--color-text-muted); white-space:nowrap; overflow:hidden; text-overflow:ellipsis;">${(msg.body || '').substring(0, 80)}...</div>
            </div>
        </div>
    `).join('');
}

function openMessage(msgId) {
    const messages = Storage.getMessages();
    const msg = messages.find(m => m.id === msgId);
    if (!msg) return;

    Storage.markMessageRead(msgId);
    App.updateNotificationBadge();

    const detailPanel = document.getElementById('message-detail-panel');
    const listPanel = document.getElementById('message-list-panel');

    if (listPanel) listPanel.style.display = 'none';
    if (detailPanel) {
        detailPanel.style.display = 'block';
        detailPanel.innerHTML = `
            <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:1.5rem; flex-wrap:wrap; gap:0.5rem;">
                <button onclick="renderMessages('${currentFolder}')" class="btn btn-outline btn-sm">← Back to ${currentFolder.charAt(0).toUpperCase() + currentFolder.slice(1)}</button>
                <div style="display:flex; gap:0.5rem;">
                    <button onclick="archiveMsg('${msg.id}')" class="btn btn-outline btn-sm">Archive</button>
                    <button onclick="deleteMsg('${msg.id}')" class="btn btn-danger btn-sm">Delete</button>
                </div>
            </div>

            <h2 style="font-size:1.35rem; font-weight:800; margin-bottom:0.5rem;">${msg.subject}</h2>

            <div style="display:flex; justify-content:space-between; padding:0.75rem 0; border-bottom:1px solid var(--color-border); margin-bottom:1.5rem; flex-wrap:wrap; gap:0.5rem;">
                <div>
                    <div style="font-size:0.85rem; font-weight:600;">${msg.sender}</div>
                    <div style="font-size:0.75rem; color:var(--color-text-muted);">To: Alex Morgan (You)</div>
                </div>
                <span style="font-size:0.8rem; color:var(--color-text-muted);">${App.formatDate(msg.date, true)}</span>
            </div>

            <div style="font-size:0.95rem; line-height:1.7; color:var(--color-text); margin-bottom:2rem;">${msg.body}</div>

            <div style="padding-top:1.5rem; border-top:1px solid var(--color-border);">
                <label class="form-label" style="font-weight:600;">Reply to Support</label>
                <textarea id="reply-body" class="form-control" rows="3" placeholder="Type your response..." style="margin-bottom:0.75rem; resize:vertical;"></textarea>
                <button onclick="sendReply('${msg.id}')" class="btn btn-primary">Send Reply</button>
            </div>
        `;
    }
}

function archiveMsg(msgId) {
    const messages = Storage.getMessages();
    const msg = messages.find(m => m.id === msgId);
    if (msg) {
        msg.folder = 'archived';
        localStorage.setItem('americu_messages', JSON.stringify(messages));
        App.showToast('Message moved to Archive.', 'info');
        renderMessages(currentFolder);
    }
}

function deleteMsg(msgId) {
    if (confirm('Delete this message permanently?')) {
        Storage.deleteMessage(msgId);
        App.showToast('Message deleted.', 'info');
        renderMessages(currentFolder);
    }
}

function sendReply(originalId) {
    const replyInput = document.getElementById('reply-body');
    const body = replyInput ? replyInput.value.trim() : '';
    if (!body) {
        App.showToast('Please type a reply message before sending.', 'error');
        return;
    }

    const messages = Storage.getMessages();
    const originalMsg = messages.find(m => m.id === originalId);

    Storage.sendMessage({
        subject: `Re: ${originalMsg ? originalMsg.subject : 'Support Inquiry'}`,
        body: body
    });

    App.showToast('Reply sent securely to AmeriCU Support.', 'success');
    renderMessages('sent');
}
