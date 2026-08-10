/**
 * AmeriCU Credit Union — Authentication & MFA Logic
 */

document.addEventListener('DOMContentLoaded', () => {
    setupLoginForm();
    setupMFAForm();
    setupRegisterForm();
    setupPasswordToggle();
});

// Step 1: Login Form Submission
function setupLoginForm() {
    const loginForm = document.getElementById('login-form');
    if (!loginForm) return;

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const email = document.getElementById('username').value.trim();
        const password = document.getElementById('password').value;

        if (!email || !password) {
            App.showToast('Please enter both email and password.', 'error');
            return;
        }

        const submitBtn = document.getElementById('login-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Verifying credentials...</span>';

        await App.simulateDelay(800);

        // Demo Validation
        if (email.toLowerCase() === 'oeoeieoeow@gmail.com' && password === 'Redpuddin22!') {
            // Save initial auth state (Step 1 complete, MFA required)
            Storage.setAuthSession({
                isLoggedIn: true,
                mfaVerified: false,
                user: { email, name: 'Karlee Grey' }
            });

            // Transition to Step 2: MFA Screen
            document.getElementById('login-step-1').style.display = 'none';
            document.getElementById('login-step-2').style.display = 'block';

            App.showToast('Password verified. Please enter MFA code.', 'info');

            // Focus first MFA input
            const firstInput = document.querySelector('.mfa-input');
            if (firstInput) firstInput.focus();

        } else {
            App.showToast('Invalid email or password. Use demo credentials shown on page.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Sign In</span>';
        }
    });

    // Forgot Password link mock
    const forgotLink = document.getElementById('forgot-password-link');
    if (forgotLink) {
        forgotLink.addEventListener('click', (e) => {
            e.preventDefault();
            App.showToast('Password reset link sent to oeoeieoeow@gmail.com (Simulation)', 'info');
        });
    }
}

// Step 2: MFA Verification Logic
function setupMFAForm() {
    const mfaForm = document.getElementById('mfa-form');
    const inputs = document.querySelectorAll('.mfa-input');
    if (!mfaForm || inputs.length === 0) return;

    // Auto-advance focus on typing & handle backspace
    inputs.forEach((input, index) => {
        input.addEventListener('input', (e) => {
            if (e.target.value && index < inputs.length - 1) {
                inputs[index + 1].focus();
            }
        });

        input.addEventListener('keydown', (e) => {
            if (e.key === 'Backspace' && !e.target.value && index > 0) {
                inputs[index - 1].focus();
            }
        });

        // Auto paste 6-digit code
        input.addEventListener('paste', (e) => {
            const pasteData = e.clipboardData.getData('text').trim();
            if (/^\d{6}$/.test(pasteData)) {
                e.preventDefault();
                pasteData.split('').forEach((char, i) => {
                    if (inputs[i]) inputs[i].value = char;
                });
                inputs[5].focus();
            }
        });
    });

    // MFA Form Submit
    mfaForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        const enteredCode = Array.from(inputs).map(i => i.value).join('');

        if (enteredCode.length < 6) {
            App.showToast('Please enter the full 6-digit verification code.', 'error');
            return;
        }

        const submitBtn = document.getElementById('mfa-submit-btn');
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Authenticating...</span>';

        await App.simulateDelay(600);

        if (enteredCode === '846493') {
            const session = Storage.getAuthSession();
            session.mfaVerified = true;
            Storage.setAuthSession(session);

            App.showToast('Authentication successful! Loading dashboard...', 'success');

            setTimeout(() => {
                window.location.href = 'dashboard.html';
            }, 600);
        } else {
            App.showToast('Invalid verification code. Please try again.', 'error');
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Verify & Continue</span>';
        }

    });

    // Back to Login button
    const backBtn = document.getElementById('mfa-back-btn');
    if (backBtn) {
        backBtn.addEventListener('click', () => {
            document.getElementById('login-step-2').style.display = 'none';
            document.getElementById('login-step-1').style.display = 'block';
            const loginSubmit = document.getElementById('login-submit-btn');
            if (loginSubmit) {
                loginSubmit.disabled = false;
                loginSubmit.innerHTML = '<span>Sign In</span>';
            }
        });
    }

    // Resend MFA Code
    const resendBtn = document.getElementById('resend-mfa-btn');
    if (resendBtn) {
        resendBtn.addEventListener('click', (e) => {
            e.preventDefault();
            App.showToast('New MFA code sent! Test code remains 846493.', 'info');
        });
    }
}

// Password Visibility Toggler
function setupPasswordToggle() {
    const toggleBtn = document.getElementById('toggle-password-btn');
    const passwordInput = document.getElementById('password');

    if (toggleBtn && passwordInput) {
        toggleBtn.addEventListener('click', () => {
            const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
            passwordInput.setAttribute('type', type);
        });
    }
}


// Registration Form Logic
function setupRegisterForm() {
    const registerForm = document.getElementById('register-form');
    if (!registerForm) return;

    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();

        App.showToast('Processing demo membership application...', 'info');
        await App.simulateDelay(1000);

        // Auto authenticate newly registered demo member
        Storage.setAuthSession({
            isLoggedIn: true,
            mfaVerified: true,
            user: { email: 'oeoeieoeow@gmail.com', name: 'Karlee Grey' }
        });

        App.showToast('Membership approved! Welcome to AmeriCU.', 'success');
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 800);
    });
}
