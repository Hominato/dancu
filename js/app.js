/**
 * AmeriCU Credit Union — Central Application Manager & UI Framework
 */

const App = {
    init() {
        this.checkAuth();
        this.applyTheme();
        this.setupHeader();
        this.setupSidebar();
        this.setupMobileNav();
        this.setupModalListeners();
        this.updateNotificationBadge();
    },

    // Authentication Guard
    checkAuth() {
        const publicPages = ['login.html', 'register.html', 'index.html'];
        const currentPage = window.location.pathname.split('/').pop() || 'index.html';
        const session = Storage.getAuthSession();

        if (!session.isLoggedIn || !session.mfaVerified) {
            if (!publicPages.includes(currentPage) && currentPage !== '') {
                window.location.href = 'login.html';
            }
        } else {
            if (currentPage === 'login.html' || currentPage === 'register.html' || currentPage === 'index.html' || currentPage === '') {
                window.location.href = 'dashboard.html';
            }
        }
    },

    // Theme Engine (Light / Dark / System)
    applyTheme(themeChoice) {
        const settings = Storage.getSettings();
        const selectedTheme = themeChoice || settings.theme || 'system';
        
        let targetTheme = selectedTheme;
        if (selectedTheme === 'system') {
            targetTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }

        document.documentElement.setAttribute('data-theme', targetTheme);
    },

    setThemePreference(themeChoice) {
        Storage.saveSettings({ theme: themeChoice });
        this.applyTheme(themeChoice);
        this.showToast(`Theme updated to ${themeChoice}`, 'info');
    },

    // Header & User UI bindings
    setupHeader() {
        const user = Storage.getUser();
        
        const avatarEls = document.querySelectorAll('.user-avatar-initials');
        const nameEls = document.querySelectorAll('.user-display-name');
        
        const initials = `${user.firstName?.[0] || 'A'}${user.lastName?.[0] || 'M'}`;
        
        avatarEls.forEach(el => el.textContent = initials);
        nameEls.forEach(el => el.textContent = user.fullName || `${user.firstName} ${user.lastName}`);
    },

    updateNotificationBadge() {
        const notifications = Storage.getNotifications();
        const unreadCount = notifications.filter(n => !n.read).length;
        const badges = document.querySelectorAll('.notification-unread-count');

        badges.forEach(badge => {
            if (unreadCount > 0) {
                badge.textContent = unreadCount > 9 ? '9+' : unreadCount;
                badge.style.display = 'inline-flex';
            } else {
                badge.style.display = 'none';
            }
        });
    },

    // Sidebar & Navigation Highlights
    setupSidebar() {
        const currentPage = window.location.pathname.split('/').pop() || 'dashboard.html';
        const navLinks = document.querySelectorAll('.nav-item');

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            if (href === currentPage) {
                link.classList.add('active');
            } else {
                link.classList.remove('active');
            }
        });
    },

    // Mobile Navigation & Drawer Overlay
    setupMobileNav() {
        const menuBtn = document.querySelector('.menu-toggle-btn');
        const sidebar = document.querySelector('.sidebar');
        
        if (menuBtn && sidebar) {
            menuBtn.addEventListener('click', () => {
                sidebar.classList.toggle('mobile-open');
            });

            // Close sidebar when clicking outside on mobile
            document.addEventListener('click', (e) => {
                if (window.innerWidth <= 1024) {
                    if (!sidebar.contains(e.target) && !menuBtn.contains(e.target) && sidebar.classList.contains('mobile-open')) {
                        sidebar.classList.remove('mobile-open');
                    }
                }
            });
        }
    },

    // Reusable Toast Notification System
    showToast(message, type = 'success', duration = 4000) {
        let container = document.querySelector('.toast-container');
        if (!container) {
            container = document.createElement('div');
            container.className = 'toast-container';
            document.body.appendChild(container);
        }

        const toast = document.createElement('div');
        toast.className = `toast toast-${type}`;

        const icons = {
            success: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/></svg>`,
            error: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"/></svg>`,
            warning: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/></svg>`,
            info: `<svg fill="none" stroke="currentColor" viewBox="0 0 24 24" width="20" height="20"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>`
        };

        toast.innerHTML = `
            ${icons[type] || icons.info}
            <span>${message}</span>
        `;

        container.appendChild(toast);

        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transform = 'translateX(100%)';
            toast.style.transition = 'all 0.3s ease';
            setTimeout(() => toast.remove(), 300);
        }, duration);
    },

    // Modal Controller
    openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    },

    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    },

    setupModalListeners() {
        // ESC key closes modals
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal-overlay.active');
                if (activeModal) {
                    App.closeModal(activeModal.id);
                }
            }
        });

        // Click outside closes modals
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal-overlay')) {
                App.closeModal(e.target.id);
            }
        });
    },

    // Formatters
    formatCurrency(amount, showSign = false) {
        const val = parseFloat(amount);
        const formatted = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD'
        }).format(Math.abs(val));

        if (showSign && val > 0) return `+${formatted}`;
        if (val < 0) return `-${formatted}`;
        return formatted;
    },

    formatDate(dateString, includeTime = false) {
        if (!dateString) return '';
        const d = new Date(dateString);
        const options = {
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        };
        if (includeTime) {
            options.hour = 'numeric';
            options.minute = '2-digit';
            options.hour12 = true;
        }
        return d.toLocaleDateString('en-US', options);
    },

    formatCardNumber(num) {
        if (!num) return '•••• •••• •••• ••••';
        const str = num.replace(/\s+/g, '');
        return str.replace(/(.{4})/g, '$1 ').trim();
    },

    // Simulated Delay for Realistic Loading UX
    async simulateDelay(ms = 600) {
        return new Promise(resolve => setTimeout(resolve, ms));
    },

    // Global Logout Handler
    handleLogout() {
        Storage.logout();
        this.showToast('You have been securely signed out.', 'info');
        setTimeout(() => {
            window.location.href = 'login.html';
        }, 800);
    }
};

// Initialize App when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    App.init();
});
