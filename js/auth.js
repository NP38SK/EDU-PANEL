// Initialize users array from localStorage or use default
let users = JSON.parse(localStorage.getItem('users')) || [
    { email: "admin@gmail.com", password: hashPassword("admin123"), role: "admin" }
];

// Simple password hashing (for demonstration only - use proper hashing in production)
function hashPassword(password) {
    return btoa(password); // Basic encoding - replace with proper hashing in production
}

function verifyPassword(inputPassword, storedPassword) {
    return hashPassword(inputPassword) === storedPassword;
}

// Display messages
function showMessage(elementId, message, isError = true) {
    const messageDiv = document.getElementById(elementId);
    messageDiv.className = isError ? 'error-message' : 'success-message';
    messageDiv.textContent = message;
    setTimeout(() => messageDiv.textContent = '', 3000);
}

// Check if user is already logged in
window.onload = function() {
    try {
        const loggedInUser = JSON.parse(localStorage.getItem("currentUser"));
        if (loggedInUser) {
            redirectUser(loggedInUser.role);
        }
    } catch (error) {
        console.error('Session check failed:', error);
    }
};

function redirectUser(role) {
    const redirects = {
        admin: 'admin.html',
        student: 'student.html'
    };
    window.location.href = redirects[role] || 'index.html';
}

// Registration logic
const registerForm = document.getElementById("registerForm");
if (registerForm) {
    registerForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const registerBtn = document.getElementById("registerBtn");
        registerBtn.disabled = true;

        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("regEmail").value.toLowerCase();
        const password = document.getElementById("regPassword").value;
        const confirmPassword = document.getElementById("confirmPassword").value;
        const role = document.getElementById("role").value;

        // Validations
        if (users.some(u => u.email === email)) {
            showMessage("message", "Email already registered.");
            registerBtn.disabled = false;
            return;
        }

        if (password !== confirmPassword) {
            showMessage("message", "Passwords do not match.");
            registerBtn.disabled = false;
            return;
        }

        // Store new user
        const newUser = { 
            email, 
            password: hashPassword(password), 
            role, 
            name 
        };
        users.push(newUser);
        
        try {
            localStorage.setItem('users', JSON.stringify(users));
            showMessage("message", "Registration successful! Redirecting to login...", false);
            registerForm.reset();
            
            setTimeout(() => {
                window.location.href = "index.html";
            }, 2000);
        } catch (error) {
            showMessage("message", "Error saving user data.");
            registerBtn.disabled = false;
        }
    });
}

// Login logic
const loginForm = document.getElementById("loginForm");
if (loginForm) {
    loginForm.addEventListener("submit", function(event) {
        event.preventDefault();
        const loginBtn = document.getElementById("loginBtn");
        loginBtn.disabled = true;

        const email = document.getElementById("email").value.toLowerCase();
        const password = document.getElementById("password").value;
        const role = document.getElementById("role").value;

        const user = users.find(u => 
            u.email === email && 
            verifyPassword(password, u.password) && 
            u.role === role
        );

        if (user) {
            try {
                localStorage.setItem("currentUser", JSON.stringify(user));
                showMessage("message", "Login successful! Redirecting...", false);
                setTimeout(() => redirectUser(role), 1000);
            } catch (error) {
                showMessage("message", "Error saving session.");
                loginBtn.disabled = false;
            }
        } else {
            showMessage("message", "Invalid login details.");
            loginBtn.disabled = false;
        }
    });
}