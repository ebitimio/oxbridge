// DOM Elements
const loginForm = document.getElementById('login-form');
const registerForm = document.getElementById('register-form');
const showRegisterLink = document.getElementById('show-register');
const showLoginLink = document.getElementById('show-login');
const loginFormElement = document.getElementById('loginForm');
const registerFormElement = document.getElementById('registerForm');

// Toggle between login and registration forms
showRegisterLink.addEventListener('click', (e) => {
    e.preventDefault();
    loginForm.classList.add('hidden');
    registerForm.classList.remove('hidden');
});

showLoginLink.addEventListener('click', (e) => {
    e.preventDefault();
    registerForm.classList.add('hidden');
    loginForm.classList.remove('hidden');
});

// Form validation functions
function validateEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function validatePassword(password) {
    return password.length >= 6;
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    errorElement.textContent = message;
    errorElement.style.display = 'block';
}

function hideError(elementId) {
    document.getElementById(elementId).style.display = 'none';
}

// User management functions
function getRegisteredUsers() {
    return JSON.parse(localStorage.getItem('registeredUsers') || '[]');
}

function saveRegisteredUser(user) {
    const users = getRegisteredUsers();
    // Check if user already exists
    const existingUserIndex = users.findIndex(u => u.email === user.email);
    if (existingUserIndex !== -1) {
        users[existingUserIndex] = user; // Update existing user
    } else {
        users.push(user); // Add new user
    }
    localStorage.setItem('registeredUsers', JSON.stringify(users));
}

function findUserByEmail(email) {
    const users = getRegisteredUsers();
    return users.find(user => user.email === email);
}

function authenticateUser(email, password) {
    const user = findUserByEmail(email);
    if (!user) {
        return { success: false, message: 'No account found with this email' };
    }
    if (user.password !== password) {
        return { success: false, message: 'Incorrect password' };
    }
    return { success: true, user: user };
}

// Login form submission
loginFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    
    let isValid = true;
    
    // Clear previous errors
    hideError('login-email-error');
    hideError('login-password-error');
    
    // Validate email
    if (!validateEmail(email)) {
        showError('login-email-error', 'Please enter a valid email address');
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword(password)) {
        showError('login-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    if (isValid) {
        // Check if user exists and credentials are correct
        const authResult = authenticateUser(email, password);
        
        if (!authResult.success) {
            if (authResult.message.includes('email')) {
                showError('login-email-error', authResult.message);
            } else {
                showError('login-password-error', authResult.message);
            }
            return;
        }
        
        // Store login state and user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userEmail', authResult.user.email);
        localStorage.setItem('userName', authResult.user.name);
        
        // Show loading state
        const submitBtn = loginFormElement.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Signing In...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Redirect to the landing page
            window.location.href = 'demo-landingpage.html';
        }, 1000);
    }
});

// Registration form submission
registerFormElement.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('register-name').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;
    const confirmPassword = document.getElementById('register-confirm').value;
    
    let isValid = true;
    
    // Clear previous errors
    hideError('register-name-error');
    hideError('register-email-error');
    hideError('register-password-error');
    hideError('register-confirm-error');
    
    // Validate name
    if (name.trim() === '') {
        showError('register-name-error', 'Please enter your full name');
        isValid = false;
    }
    
    // Validate email
    if (!validateEmail(email)) {
        showError('register-email-error', 'Please enter a valid email address');
        isValid = false;
    } else if (findUserByEmail(email)) {
        showError('register-email-error', 'An account with this email already exists');
        isValid = false;
    }
    
    // Validate password
    if (!validatePassword(password)) {
        showError('register-password-error', 'Password must be at least 6 characters');
        isValid = false;
    }
    
    // Validate password confirmation
    if (password !== confirmPassword) {
        showError('register-confirm-error', 'Passwords do not match');
        isValid = false;
    }
    
    if (isValid) {
        // Create new user object
        const newUser = {
            name: name.trim(),
            email: email,
            password: password, // In a real app, this would be hashed
            createdAt: new Date().toISOString()
        };
        
        // Save user to registered users
        saveRegisteredUser(newUser);
        
        // Store login state and user data
        localStorage.setItem('isLoggedIn', 'true');
        localStorage.setItem('userName', newUser.name);
        localStorage.setItem('userEmail', newUser.email);
        
        // Show loading state
        const submitBtn = registerFormElement.querySelector('.btn');
        const originalText = submitBtn.textContent;
        submitBtn.textContent = 'Creating Account...';
        submitBtn.disabled = true;
        
        // Simulate API call delay
        setTimeout(() => {
            // Redirect to the landing page
            window.location.href = 'demo-landingpage.html';
        }, 1000);
    }
});

// Check if user is already logged in
window.addEventListener('DOMContentLoaded', () => {
    if (localStorage.getItem('isLoggedIn') === 'true') {
        // User is already logged in, redirect to landing page
        window.location.href = 'demo-landingpage.html';
    }
    
    // Add real-time validation
    const emailInputs = document.querySelectorAll('input[type="email"]');
    emailInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validateEmail(input.value)) {
                const errorId = input.id + '-error';
                showError(errorId, 'Please enter a valid email address');
            }
        });
        
        input.addEventListener('input', () => {
            const errorId = input.id + '-error';
            hideError(errorId);
        });
    });
    
    const passwordInputs = document.querySelectorAll('input[type="password"]');
    passwordInputs.forEach(input => {
        input.addEventListener('blur', () => {
            if (input.value && !validatePassword(input.value)) {
                const errorId = input.id + '-error';
                showError(errorId, 'Password must be at least 6 characters');
            }
        });
        
        input.addEventListener('input', () => {
            const errorId = input.id + '-error';
            hideError(errorId);
        });
    });
    
    // Real-time password confirmation validation
    const confirmPasswordInput = document.getElementById('register-confirm');
    if (confirmPasswordInput) {
        confirmPasswordInput.addEventListener('input', () => {
            const password = document.getElementById('register-password').value;
            const confirmPassword = confirmPasswordInput.value;
            
            if (confirmPassword && password !== confirmPassword) {
                showError('register-confirm-error', 'Passwords do not match');
            } else {
                hideError('register-confirm-error');
            }
        });
    }
    
    // Real-time email availability check for registration
    const registerEmailInput = document.getElementById('register-email');
    if (registerEmailInput) {
        registerEmailInput.addEventListener('blur', () => {
            const email = registerEmailInput.value;
            if (email && validateEmail(email)) {
                if (findUserByEmail(email)) {
                    showError('register-email-error', 'An account with this email already exists');
                }
            }
        });
        
        registerEmailInput.addEventListener('input', () => {
            hideError('register-email-error');
        });
    }
    
    // Real-time name validation
    const registerNameInput = document.getElementById('register-name');
    if (registerNameInput) {
        registerNameInput.addEventListener('blur', () => {
            if (registerNameInput.value.trim() === '') {
                showError('register-name-error', 'Please enter your full name');
            }
        });
        
        registerNameInput.addEventListener('input', () => {
            hideError('register-name-error');
        });
    }
});