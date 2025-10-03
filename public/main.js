document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del Menú Desplegable ---
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');

    // --- Elementos de Navegación y Contenido ---
    const mainPanel = document.querySelector('.main-content');
    const profileView = document.getElementById('profile-view');
    const profileLink = document.getElementById('profile-link');
    const logoutButton = document.getElementById('logout-button');

    // --- Lógica para Mostrar/Ocultar el Menú Desplegable ---
    if (settingsButton) {
        settingsButton.addEventListener('click', (event) => {
            event.stopPropagation(); 
            dropdownContent.classList.toggle('show');
            settingsButton.classList.toggle('open');
        });
    }

    // Cierra el menú si el usuario hace clic fuera de él
    window.addEventListener('click', () => {
        if (dropdownContent && dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
            settingsButton.classList.remove('open');
        }
    });

    // --- Lógica de Navegación ---
    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            if (mainPanel) mainPanel.style.display = 'none';
            if (profileView) profileView.style.display = 'block';
            
            dropdownContent.classList.remove('show');
            settingsButton.classList.remove('open');
        });
    }

    // --- Lógica de Cierre de Sesión ---
    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            // **CORREGIDO: Se elimina el token correcto**
            localStorage.removeItem('access_token');
            
            // Redirigimos al usuario a la página de inicio/login
            window.location.href = 'index.html';
        });
    }
});
