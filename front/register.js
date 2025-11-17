document.getElementById("registerForm").addEventListener("submit", async (e) => {
    e.preventDefault();

    const nombre = document.getElementById("nombre").value.trim();
    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    const response = await fetch("http://localhost:3000/register", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nombre, email, password }),
    });

    const data = await response.json();

    if (!data.success) {
        alert("Error: " + data.message);
    } else {
        alert("Registro completado con éxito");
        window.location.href = "login.html";
    }
});

