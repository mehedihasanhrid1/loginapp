async function loadUsers() {
    try {
        const res = await fetch("user.json");
        if (!res.ok) throw new Error();
        return await res.json();
    } catch {
        showToast("Failed to load user data");
        return [];
    }
}

// Password validation rule
function isValidPassword(password) {
    return password.length >= 6;
}

// Show / Hide Password
document.addEventListener("click", e => {
    if (e.target.classList.contains("toggle-eye")) {
        const icon = e.target;
        const input = icon.previousElementSibling;

        if (input.type === "password") {
            input.type = "text";
            icon.classList.remove("fa-eye");
            icon.classList.add("fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.remove("fa-eye-slash");
            icon.classList.add("fa-eye");
        }
    }
});

/* ================= SIGNUP ================= */

if (document.getElementById("signupBtn")) {
    signupBtn.onclick = async () => {
        const name = document.getElementById("name").value.trim();
        const email = document.getElementById("email").value.trim();
        const password = document.getElementById("password").value.trim();

        if (!name || !email || !password)
            return showToast("All fields are required");

        if (!isValidPassword(password))
            return showToast("Password must be at least 6 characters");

        const users = await loadUsers();

        if (users.some(u => u.email === email))
            return showToast("Email already registered");

        showToast("Account validated successfully", "success");
        showToast("Backend required to store new user");

        setTimeout(() => location.href = "index.html", 1200);
    };
}

/* ================= LOGIN ================= */

if (document.getElementById("loginBtn")) {
    loginBtn.onclick = async () => {
        const email = loginEmail.value.trim();
        const password = loginPassword.value.trim();

        if (!email || !password)
            return showToast("Email and password required");

        const users = await loadUsers();

        const found = users.find(
            u => u.email === email && u.password === password
        );

        if (!found)
            return showToast("Invalid login credentials");

        localStorage.setItem("loggedUser", JSON.stringify(found));
        showToast("Login successful", "success");

        setTimeout(() => location.href = "dashboard.html", 800);
    };
}

/* ================= DASHBOARD ================= */

const loggedUser = JSON.parse(localStorage.getItem("loggedUser"));

if (loggedUser && document.getElementById("userName")) {
    userName.textContent = loggedUser.name;
    userEmail.textContent = loggedUser.email;
}

/* ================= CHANGE PASSWORD ================= */

if (document.getElementById("changePassBtn")) {
    changePassBtn.onclick = () => {
        const newPass = newPassword.value.trim();
        const confirmPass = confirmPassword.value.trim();

        if (!newPass || !confirmPass)
            return showToast("All fields are required");

        if (newPass.length < 6)
            return showToast("Password must be at least 6 characters");

        if (newPass !== confirmPass)
            return showToast("Passwords do not match");

        const updatedUser = { ...loggedUser, password: newPass };
        localStorage.setItem("loggedUser", JSON.stringify(updatedUser));

        showToast("Password updated for current session", "success");

        newPassword.value = "";
        confirmPassword.value = "";
    };
}


/* ================= LOGOUT ================= */

if (document.getElementById("logoutBtn")) {
    logoutBtn.onclick = () => {
        localStorage.removeItem("loggedUser");
        location.href = "index.html";
    };
}
