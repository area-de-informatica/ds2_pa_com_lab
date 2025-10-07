document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos Comunes ---
    const mainContent = document.getElementById('main-content');
    const profileView = document.getElementById('profile-view');
    const messageContainer = document.createElement('div');
    messageContainer.id = 'message-container';
    document.body.appendChild(messageContainer);

    // --- NUEVO: Elemento del Mensaje de Bienvenida ---
    const welcomeMessageContainer = document.getElementById('welcome-message');

    // --- Menú de Configuración ---
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');

    if (settingsButton) {
        settingsButton.addEventListener('click', (event) => {
            event.stopPropagation();
            dropdownContent.classList.toggle('show');
            settingsButton.classList.toggle('open');
        });
    }

    window.addEventListener('click', () => {
        if (dropdownContent && dropdownContent.classList.contains('show')) {
            dropdownContent.classList.remove('show');
            settingsButton.classList.remove('open');
        }
    });

    // --- Vista de Perfil (Formulario Editable) ---
    const profileLink = document.getElementById('profile-link');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const profileEmail = document.getElementById('profile-email');
    const profileUsername = document.getElementById('profile-username');
    const profilePhone = document.getElementById('profile-phone');

    const currentUserEmail = localStorage.getItem('user_email');

    // --- Lógica para el Mensaje de Bienvenida ---
    function displayWelcomeMessage() {
        if (!currentUserEmail || !welcomeMessageContainer) return;

        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        let username = '';

        if (userProfileString) {
            const userProfile = JSON.parse(userProfileString);
            username = userProfile.username || '';
        }

        if (username) {
            // Usamos innerHTML para renderizar la etiqueta <strong>
            welcomeMessageContainer.innerHTML = `👋🏼 Bienvenido, <strong>${username}</strong>`;
        } else {
            welcomeMessageContainer.innerHTML = '👋🏼 ¡Bienvenido!';
        }
    }

    // Carga los datos del usuario en el formulario
    function loadProfileData() {
        if (!currentUserEmail) return;

        profileEmail.value = currentUserEmail;

        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        if (userProfileString) {
            const userProfile = JSON.parse(userProfileString);
            profileUsername.value = userProfile.username || '';
            profilePhone.value = userProfile.phone || '';
        } else {
            const emptyProfile = { username: '', phone: '' };
            localStorage.setItem(`profile_${currentUserEmail}`, JSON.stringify(emptyProfile));
            profileUsername.value = '';
            profilePhone.value = '';
        }
    }

    if (profileLink) {
        profileLink.addEventListener('click', (e) => {
            e.preventDefault();
            mainContent.style.display = 'none';
            profileView.style.display = 'block';
            loadProfileData();
            dropdownContent.classList.remove('show');
        });
    }

    if (closeProfileBtn) {
        closeProfileBtn.addEventListener('click', () => {
            profileView.style.display = 'none';
            mainContent.style.display = 'block';
        });
    }

    // Guarda los datos del formulario
    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUserEmail) return;

            const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
            const userProfile = userProfileString ? JSON.parse(userProfileString) : {};

            userProfile.username = profileUsername.value;
            userProfile.phone = profilePhone.value;
            
            localStorage.setItem(`profile_${currentUserEmail}`, JSON.stringify(userProfile));
            showMessage('¡Perfil guardado con éxito!');

            // Actualiza el mensaje de bienvenida después de guardar el perfil
            displayWelcomeMessage();
        });
    }

    // --- Cierre de Sesión ---
    const logoutButton = document.getElementById('logout-button');

    if (logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_email');
            window.location.href = 'index.html';
        });
    }

    // --- Función para Mostrar Mensajes (Toasts) ---
    function showMessage(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'toast--error' : ''}`.trim();
        toast.textContent = message;
        messageContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- INICIALIZACIÓN ---
    displayWelcomeMessage(); // Muestra el mensaje al cargar la página
});
