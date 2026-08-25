// ==========================================================================
// Travel_X Authentication & Interactive Toast System
// ==========================================================================

const logregBox = document.querySelector('.logreg-box');
const loginLink = document.querySelector('.login-link');
const registerLink = document.querySelector('.register-link');
const loginForm = document.getElementById('loginForm');
const registerForm = document.getElementById('registerForm');
const forgotPasswordLink = document.getElementById('forgotPasswordLink');
const alertContainer = document.getElementById('alertToastContainer');

// --- 1. Form Switching ---
if (registerLink && logregBox) {
    registerLink.addEventListener('click', (e) => {
        e.preventDefault();
        logregBox.classList.add('active');
        clearFormErrors();
    });
}

if (loginLink && logregBox) {
    loginLink.addEventListener('click', (e) => {
        e.preventDefault();
        logregBox.classList.remove('active');
        clearFormErrors();
    });
}

// --- 2. Luxury Toast / Alert Engine ---
function showToast(type = 'info', title = '', message = '', duration = 4200) {
    if (!alertContainer) return;

    const toast = document.createElement('div');
    toast.className = `alert-toast ${type}`;

    let iconClass = 'bx-info-circle';
    if (type === 'success') iconClass = 'bx-check-circle';
    else if (type === 'error') iconClass = 'bx-error-circle';
    else if (type === 'warning') iconClass = 'bx-shield-quarter';

    toast.innerHTML = `
        <div class="toast-icon-box">
            <i class='bx ${iconClass}'></i>
        </div>
        <div class="toast-content">
            <div class="toast-title">${escapeHtml(title)}</div>
            <div class="toast-desc">${escapeHtml(message)}</div>
        </div>
        <button type="button" class="toast-close" aria-label="Close notification">
            <i class='bx bx-x'></i>
        </button>
        <div class="toast-progress" style="animation-duration: ${duration}ms;"></div>
    `;

    alertContainer.appendChild(toast);

    // Trigger enter transition
    requestAnimationFrame(() => {
        toast.classList.add('show');
    });

    const closeBtn = toast.querySelector('.toast-close');
    let dismissTimeout;

    function dismiss() {
        clearTimeout(dismissTimeout);
        toast.classList.remove('show');
        toast.classList.add('hide');
        setTimeout(() => {
            if (toast.parentElement) {
                toast.parentElement.removeChild(toast);
            }
        }, 400);
    }

    if (closeBtn) {
        closeBtn.addEventListener('click', dismiss);
    }

    dismissTimeout = setTimeout(dismiss, duration);
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// --- 3. Input Focus & Autofill Value Management ---
document.querySelectorAll('.input-box input').forEach((input) => {
    function checkVal() {
        const parent = input.closest('.input-box');
        const hasContent = input.value && input.value.trim() !== '';
        if (hasContent) {
            input.classList.add('has-val');
        } else {
            input.classList.remove('has-val');
        }
        if (parent && hasContent) {
            parent.classList.remove('error');
        }
    }

    input.addEventListener('input', checkVal);
    input.addEventListener('change', checkVal);
    input.addEventListener('paste', () => setTimeout(checkVal, 10));
    input.addEventListener('animationstart', (e) => {
        if (e.animationName && e.animationName.toLowerCase().includes('autofill')) {
            checkVal();
        }
    });

    input.addEventListener('focus', () => {
        const parent = input.closest('.input-box');
        if (parent) parent.classList.add('focus');
        checkVal();
    });
    
    input.addEventListener('blur', () => {
        const parent = input.closest('.input-box');
        if (parent) parent.classList.remove('focus');
        checkVal();
    });

    checkVal();
});

// Periodic check for passive browser autofill without direct user interaction
setInterval(() => {
    document.querySelectorAll('.input-box input').forEach((input) => {
        if (input.value && input.value.trim() !== '') {
            input.classList.add('has-val');
        }
    });
}, 300);

// --- 4. Password Visibility Toggle ---
document.querySelectorAll('.pwd-toggle').forEach((toggle) => {
    toggle.addEventListener('click', function () {
        const inputBox = this.closest('.input-box');
        const input = inputBox ? inputBox.querySelector('input') : null;
        const icon = this.querySelector('i');

        if (input) {
            if (input.type === 'password') {
                input.type = 'text';
                if (icon) {
                    icon.classList.remove('bx-show');
                    icon.classList.add('bx-hide');
                }
            } else {
                input.type = 'password';
                if (icon) {
                    icon.classList.remove('bx-hide');
                    icon.classList.add('bx-show');
                }
            }
        }
    });
});

// --- 5. Helper Shake & Clear ---
function triggerShake(formBox) {
    if (!formBox) return;
    formBox.classList.remove('shake');
    void formBox.offsetWidth; // Reflow
    formBox.classList.add('shake');
    setTimeout(() => {
        formBox.classList.remove('shake');
    }, 500);
}

function clearFormErrors() {
    document.querySelectorAll('.input-box').forEach(el => el.classList.remove('error'));
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// --- 6. Interactive Login Form Submission ---
if (loginForm) {
    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFormErrors();

        const formBox = this.closest('.form-box');
        const emailInput = document.getElementById('loginEmail');
        const passwordInput = document.getElementById('loginPassword');
        const loginBtn = document.getElementById('loginBtn');
        const btnText = loginBtn ? loginBtn.querySelector('.btn-text') : null;

        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        // Validation
        if (!email) {
            triggerShake(formBox);
            if (emailInput) emailInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Email Required', 'Please enter your registered email address.');
            emailInput?.focus();
            return;
        }

        if (!isValidEmail(email)) {
            triggerShake(formBox);
            if (emailInput) emailInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Invalid Email Format', 'Please enter a valid email address (e.g. user@domain.com).');
            emailInput?.focus();
            return;
        }

        if (!password) {
            triggerShake(formBox);
            if (passwordInput) passwordInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Password Required', 'Please enter your account password.');
            passwordInput?.focus();
            return;
        }

        if (password.length < 6) {
            triggerShake(formBox);
            if (passwordInput) passwordInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Password Too Short', 'Password must be at least 6 characters long.');
            passwordInput?.focus();
            return;
        }

        // Simulating Authentication
        if (loginBtn) {
            loginBtn.classList.add('loading');
            if (btnText) btnText.textContent = 'Authenticating...';
        }

        setTimeout(() => {
            if (loginBtn) {
                loginBtn.classList.remove('loading');
                loginBtn.classList.add('success-state');
                if (btnText) btnText.innerHTML = "<i class='bx bx-check'></i> Verified";
            }

            // Save demo session
            try {
                localStorage.setItem('travelx_user', JSON.stringify({
                    email: email,
                    name: email.split('@')[0],
                    loggedIn: true,
                    loginTime: new Date().toISOString()
                }));
            } catch (err) {}

            showToast('success', 'Login Successful!', `Welcome back, ${email.split('@')[0]}! Redirecting to Travel_X...`, 3000);

            setTimeout(() => {
                window.location.href = '../Tour&Travel.html';
            }, 1800);
        }, 900);
    });
}

// --- 7. Interactive Register Form Submission ---
if (registerForm) {
    registerForm.addEventListener('submit', function (e) {
        e.preventDefault();
        clearFormErrors();

        const formBox = this.closest('.form-box');
        const nameInput = document.getElementById('registerName');
        const emailInput = document.getElementById('registerEmail');
        const passwordInput = document.getElementById('registerPassword');
        const agreeTerms = document.getElementById('agreeTerms');
        const registerBtn = document.getElementById('registerBtn');
        const btnText = registerBtn ? registerBtn.querySelector('.btn-text') : null;

        const name = nameInput ? nameInput.value.trim() : '';
        const email = emailInput ? emailInput.value.trim() : '';
        const password = passwordInput ? passwordInput.value : '';

        if (!name) {
            triggerShake(formBox);
            if (nameInput) nameInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Name Required', 'Please enter your full name.');
            nameInput?.focus();
            return;
        }

        if (!email || !isValidEmail(email)) {
            triggerShake(formBox);
            if (emailInput) emailInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Valid Email Required', 'Please provide a valid email address to create your account.');
            emailInput?.focus();
            return;
        }

        if (!password || password.length < 6) {
            triggerShake(formBox);
            if (passwordInput) passwordInput.closest('.input-box')?.classList.add('error');
            showToast('error', 'Secure Password Required', 'Password must be at least 6 characters long.');
            passwordInput?.focus();
            return;
        }

        if (!agreeTerms || !agreeTerms.checked) {
            triggerShake(formBox);
            showToast('warning', 'Terms & Conditions', 'Please check the box to agree to the terms & conditions.');
            agreeTerms?.focus();
            return;
        }

        // Simulating Registration
        if (registerBtn) {
            registerBtn.classList.add('loading');
            if (btnText) btnText.textContent = 'Creating Account...';
        }

        setTimeout(() => {
            if (registerBtn) {
                registerBtn.classList.remove('loading');
                registerBtn.classList.add('success-state');
                if (btnText) btnText.innerHTML = "<i class='bx bx-check'></i> Registered";
            }

            showToast('success', 'Account Created!', `Welcome to Travel_X Explorers Club, ${name}! Please sign in with your credentials.`, 4000);

            // Automatically switch back to login and prefill email
            setTimeout(() => {
                if (logregBox) logregBox.classList.remove('active');
                const loginEmail = document.getElementById('loginEmail');
                if (loginEmail) {
                    loginEmail.value = email;
                    loginEmail.classList.add('has-val');
                }
                const loginPassword = document.getElementById('loginPassword');
                if (loginPassword) loginPassword.focus();

                // Reset register button
                if (registerBtn) {
                    registerBtn.classList.remove('success-state');
                    if (btnText) btnText.textContent = 'Register';
                }
                registerForm.reset();
            }, 1600);
        }, 1000);
    });
}

// --- 8. Forget Password Handler ---
if (forgotPasswordLink) {
    forgotPasswordLink.addEventListener('click', (e) => {
        e.preventDefault();
        const loginEmail = document.getElementById('loginEmail');
        const email = loginEmail ? loginEmail.value.trim() : '';

        if (email && isValidEmail(email)) {
            showToast('info', 'Password Reset Dispatched', `A password reset link has been sent to ${email}. Please check your inbox.`);
        } else {
            showToast('info', 'Password Recovery', 'Please enter your registered email address in the Email field, then click "Forget Password?".');
            if (loginEmail) loginEmail.focus();
        }
    });
}

// --- 9. Navigation Header Blur on Scroll ---
const header = document.getElementById("header");
function handleNavScroll() {
    if (window.scrollY > 20) {
        header?.classList.add("scrolled");
    } else {
        header?.classList.remove("scrolled");
    }
}
window.addEventListener("scroll", handleNavScroll, { passive: true });
handleNavScroll();

// --- 10. Scroll Progress Bar ---
function initScrollProgress() {
    let progressBar = document.getElementById("scrollProgress");
    if (!progressBar) {
        progressBar = document.createElement("div");
        progressBar.id = "scrollProgress";
        progressBar.className = "scroll-progress-bar";
        document.body.prepend(progressBar);
    }
    window.addEventListener("scroll", () => {
        const scrollTop = window.scrollY || document.documentElement.scrollTop;
        const docHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        progressBar.style.width = scrollPercent + "%";
    }, { passive: true });
}
initScrollProgress();