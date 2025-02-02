("DOMContentLoaded", function () {
    const form = document.querySelector("form");

    form.addEventListener("submit", function (event) {
        event.preventDefault();

        const email = form.querySelector('input[type="email"]').value.trim();
        const password = form.querySelector('input[type="password"]').value.trim();

        if (!email || !password) {
            alert("Please fill in all fields.");
            return;
        }

        // Dummy authentication check
        if (email === "user@example.com" && password === "password123") {
            alert("Login successful!");
            // Redirect to dashboard or another page
            window.location.href = "dashboard.html"; 
        } else {
            alert("Invalid email or password.");
        }
    });
})();