document.addEventListener('DOMContentLoaded', () => {
    // Vincula los manejadores de eventos a los formularios
    document.getElementById('register-form').addEventListener('submit', handleRegister);
    document.getElementById('login-form').addEventListener('submit', handleLogin);
    document.getElementById('logout-button').addEventListener('click', handleLogout);

    checkAuthState();
});

function showMessage(message, isError = false) {
    const messageContainer = document.getElementById('message-container');
    // Asegúrate de que el contenedor de mensajes esté visible
    messageContainer.style.display = 'block'; 
    messageContainer.textContent = message;
    messageContainer.style.color = isError ? 'red' : 'green';
    // Opcional: Ocultar el mensaje después de unos segundos
    setTimeout(() => {
        messageContainer.style.display = 'none';
    }, 5000);
}

async function handleRegister(event) {
    event.preventDefault();
    const username = document.getElementById('register-username').value;
    const email = document.getElementById('register-email').value;
    const password = document.getElementById('register-password').value;

    try {
        const response = await fetch('/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, email, password }),
        });

        if (response.ok) {
            showMessage('¡Registro exitoso! Ahora puedes iniciar sesión.');
            document.getElementById('register-form').reset();
        } else {
            const error = await response.json();
            // Muestra el mensaje de error del backend
            showMessage(Array.isArray(error.message) ? error.message.join(', ') : error.message, true);
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor.', true);
    }
}

async function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;

    try {
        const response = await fetch('/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // CORREGIDO: Se cambió 'pass' por 'password' para que coincida con el backend
            body: JSON.stringify({ email, password }),
        });

        if (response.ok) {
            const data = await response.json();
            localStorage.setItem('access_token', data.access_token);
            // No mostramos mensaje aquí, el cambio de estado es suficiente
            checkAuthState(); 
        } else {
            const error = await response.json();
            // Muestra el mensaje de error del backend ("Credenciales incorrectas")
            showMessage(error.message, true);
        }
    } catch (error) {
        showMessage('Error de conexión con el servidor.', true);
    }
}

function handleLogout() {
    localStorage.removeItem('access_token');
    checkAuthState();
}

function checkAuthState() {
    const token = localStorage.getItem('access_token');
    const authContainer = document.getElementById('auth-container');
    const contentContainer = document.getElementById('content-container');
    const welcomeMessage = document.getElementById('welcome-message');

    if (token) {
        // Opcional: Decodificar el token para mostrar el nombre de usuario
        // const payload = JSON.parse(atob(token.split('.')[1]));
        // welcomeMessage.textContent = `Bienvenido, ${payload.email}!`;
        authContainer.style.display = 'none';
        contentContainer.style.display = 'block';
    } else {
        authContainer.style.display = 'block';
        contentContainer.style.display = 'none';
    }
}
