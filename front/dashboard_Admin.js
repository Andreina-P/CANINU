let empleadoSeleccionado = null;

async function loadSession() {
    const res = await fetch("/session-info", { credentials: "include" });
    const data = await res.json();

    if (!data.logged || data.user.rol !== "admin") {
        window.location.href = "login.html";
        return;
    }

    document.getElementById("usernameField").innerText = "Admin: " + data.user.username;

    cargarEmpleados();
}

document.getElementById("logoutBtn").addEventListener("click", async () => {
    await fetch("/logout", { credentials: "include" });
    window.location.href = "login.html";
});

// ===============================
//  CARGAR EMPLEADOS
// ===============================
async function cargarEmpleados() {
    const res = await fetch("/api/empleados", { credentials: "include" });
    const data = await res.json();

    if (!data.success) {
        alert("Error al cargar empleados");
        return;
    }

    const tbody = document.getElementById("empleadosTable");
    tbody.innerHTML = "";

    data.empleados.forEach(emp => {
        tbody.innerHTML += `
            <tr>
                <td>${emp.id}</td>
                <td>${emp.username}</td>
                <td>${emp.email}</td>
                <td>${emp.fecha_creacion}</td>
                <td>
                    <button class="btn-edit" onclick="editarEmpleado(${emp.id}, '${emp.username}', '${emp.email}')">Editar</button>
                    <button class="btn-delete" onclick="eliminarEmpleado(${emp.id})">Eliminar</button>
                    <button class="btn-assign" onclick="abrirAsignacion(${emp.id}, '${emp.username}')">Asignar a Cita</button>
                </td>
            </tr>
        `;
    });
}

// ===============================
//  CREAR EMPLEADO
// ===============================
document.getElementById("formCrear").addEventListener("submit", async (e) => {
    e.preventDefault();

    const username = newUsername.value;
    const email = newEmail.value;
    const password = newPassword.value;

    const res = await fetch("/api/empleados", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password })
    });

    const data = await res.json();

    alert(data.message);
    if (data.success) {
        e.target.reset();
        cargarEmpleados();
    }
});

// ===============================
//  EDITAR EMPLEADO
// ===============================
async function editarEmpleado(id, username, email) {
    const nuevoNombre = prompt("Nuevo nombre:", username);
    if (!nuevoNombre) return;

    const nuevoEmail = prompt("Nuevo email:", email);
    if (!nuevoEmail) return;

    const nuevaPass = prompt("Nueva contraseña:", "");

    const res = await fetch(`/api/empleados/${id}`, {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            username: nuevoNombre,
            email: nuevoEmail,
            password: nuevaPass || null
        })
    });

    const data = await res.json();
    alert(data.message);
    cargarEmpleados();
}

// ===============================
//  ELIMINAR EMPLEADO
// ===============================
async function eliminarEmpleado(id) {
    if (!confirm("¿Seguro que deseas eliminar este empleado?")) return;

    const res = await fetch(`/api/empleados/${id}`, {
        method: "DELETE",
        credentials: "include"
    });

    const data = await res.json();
    alert(data.message);
    cargarEmpleados();
}

async function abrirAsignacion(idEmpleado, username) {
    empleadoSeleccionado = idEmpleado;

    document.getElementById("empSeleccionado").innerText =
        `Empleado seleccionado: ${username}`;

    document.getElementById("modalAsignar").style.display = "block";

    cargarCitas();
}

async function cargarCitas() {
    const res = await fetch("/api/citas/citas-pendientes", { credentials: "include" });
    const data = await res.json();
    console.log(data);

    const tabla = document.getElementById("tablaCitas");
    tabla.innerHTML = "";

    if (!data.success) {
        tabla.innerHTML = "<tr><td colspan='6'>Error cargando citas</td></tr>";
        return;
    }

    (data.citas || []).forEach(c => {
        tabla.innerHTML += `
        <tr>
            <td>${c.id}</td>
            <td>${c.fecha}</td>
            <td>${c.hora}</td>
            <td>${c.tipo_cita}</td>
            <td>${c.estado || 'Pendiente'}</td>
            <td><button onclick="asignarCita(${c.id})">Elegir</button></td>
        </tr>
    `;
});

}

async function asignarCita(idCita) {
    const res = await fetch("/api/citas/asignar-empleado", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            id_empleado: empleadoSeleccionado,
            id_cita: idCita
        })
    });

    const data = await res.json();

    if (data.error) {
        alert("Error: " + data.error);
        return;
    }

    alert("Empleado asignado correctamente");

    cargarCitas();
    cerrarModal();
}

function cerrarModal() {
    document.getElementById("modalAsignar").style.display = "none";
}
loadSession();
