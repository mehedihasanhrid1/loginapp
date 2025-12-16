/* ================= UTILITIES ================= */

function getUsers() {
    return JSON.parse(localStorage.getItem("users") || "[]");
}

function saveUsers(users) {
    localStorage.setItem("users", JSON.stringify(users));
}

function getLoggedUser() {
    return JSON.parse(localStorage.getItem("loggedUser"));
}

/* ================= PASSWORD RULE ================= */

function isValidPassword(password) {
    return password.length >= 6;
}

/* ================= SHOW / HIDE PASSWORD ================= */

document.addEventListener("click", e => {
    if (e.target.classList.contains("toggle-eye")) {
        const icon = e.target;
        const input = icon.previousElementSibling;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    }
});

/* ================= SIGNUP ================= */

const signupBtn = document.getElementById("signupBtn");

if (signupBtn) {
    signupBtn.onclick = () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password)
            return showToast("All fields are required");

        if (!isValidPassword(password))
            return showToast("Password must be at least 6 characters");

        const users = getUsers();

        if (users.some(u => u.email === email))
            return showToast("Email already registered");

        users.push({ name, email, password });
        saveUsers(users);

        showToast("Account created successfully", "success");
        setTimeout(() => location.href = "index.html", 800);
    };
}

/* ================= LOGIN ================= */

const loginBtn = document.getElementById("loginBtn");

if (loginBtn) {
    loginBtn.onclick = () => {
        const email = document.getElementById("loginEmail").value.trim();
        const password = document.getElementById("loginPassword").value.trim();

        if (!email || !password)
            return showToast("Email and password required");

        const users = getUsers();

        const user = users.find(
            u => u.email === email && u.password === password
        );

        if (!user)
            return showToast("Invalid login credentials");

        localStorage.setItem("loggedUser", JSON.stringify(user));
        showToast("Login successful", "success");

        setTimeout(() => location.href = "dashboard.html", 800);
    };
}

/* ================= DASHBOARD ================= */

const loggedUser = getLoggedUser();

if (loggedUser) {
    const userName = document.getElementById("userName");
    const userEmail = document.getElementById("userEmail");

    if (userName) userName.textContent = loggedUser.name;
    if (userEmail) userEmail.textContent = loggedUser.email;
}

/* ================= CHANGE PASSWORD ================= */

const changePassBtn = document.getElementById("changePassBtn");

if (changePassBtn) {
    changePassBtn.onclick = () => {
        const newPassword = document.getElementById("newPassword").value.trim();
        const confirmPassword = document.getElementById("confirmPassword").value.trim();

        if (!newPassword || !confirmPassword)
            return showToast("All fields are required");

        if (!isValidPassword(newPassword))
            return showToast("Password must be at least 6 characters");

        if (newPassword !== confirmPassword)
            return showToast("Passwords do not match");

        const users = getUsers();
        const index = users.findIndex(u => u.email === loggedUser.email);

        if (index === -1)
            return showToast("User session invalid");

        users[index].password = newPassword;
        saveUsers(users);

        localStorage.setItem("loggedUser", JSON.stringify(users[index]));

        showToast("Password updated successfully", "success");

        newPassword.value = "";
        confirmPassword.value = "";
    };
}

/* ================= LOGOUT ================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("loggedUser");
        location.href = "index.html";
    };
}
