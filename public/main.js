document.addEventListener('DOMContentLoaded', () => {
    const logoutButton = document.getElementById('logout-button');

    // 1. Comprobar si hay un token con la clave CORRECTA.
    const token = localStorage.getItem('access_token'); // CORREGIDO: de 'token' a 'access_token'
    if (!token) {
        window.location.href = 'index.html';
        return; // Detener la ejecución si no hay token
    }

    // 2. Funcionalidad del botón de cerrar sesión
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // Limpiar el token correcto de localStorage
            localStorage.removeItem('access_token'); // CORREGIDO: de 'token' a 'access_token'
            
            // Redirigir a la página de inicio de sesión
            window.location.href = 'index.html';
        });
    }
});
