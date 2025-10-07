document.addEventListener('DOMContentLoaded', () => {

    // --- Elementos del DOM ---
    const mainContent = document.getElementById('main-content');
    const profileView = document.getElementById('profile-view');
    const welcomeMessageContainer = document.getElementById('welcome-message');
    const messageContainer = document.getElementById('message-container') || document.body;

    // --- Menú de Configuración y Perfil ---
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const profileLink = document.getElementById('profile-link');
    const closeProfileBtn = document.getElementById('close-profile-btn');
    const profileForm = document.getElementById('profile-form');
    const logoutButton = document.getElementById('logout-button');
    const profileEmailInput = document.getElementById('profile-email');
    const profileUsernameInput = document.getElementById('profile-username');
    const profilePhoneInput = document.getElementById('profile-phone');

    const currentUserEmail = localStorage.getItem('user_email');

    // --- Funciones de Perfil y Bienvenida ---
    function displayWelcomeMessage() {
        if (!currentUserEmail || !welcomeMessageContainer) return;
        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        const username = userProfileString ? (JSON.parse(userProfileString).username || '') : '';
        welcomeMessageContainer.innerHTML = username ? `👋🏼 Bienvenido, <strong>${username}</strong>` : '👋🏼 ¡Bienvenido!';
    }

    function loadProfileData() {
        if (!currentUserEmail) return;
        profileEmailInput.value = currentUserEmail;
        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        if (userProfileString) {
            const userProfile = JSON.parse(userProfileString);
            profileUsernameInput.value = userProfile.username || '';
            profilePhoneInput.value = userProfile.phone || '';
        }
    }

    if (profileForm) {
        profileForm.addEventListener('submit', (e) => {
            e.preventDefault();
            if (!currentUserEmail) return;
            const userProfile = { username: profileUsernameInput.value, phone: profilePhoneInput.value };
            localStorage.setItem(`profile_${currentUserEmail}`, JSON.stringify(userProfile));
            showMessage('¡Perfil guardado con éxito!');
            displayWelcomeMessage(); // Actualiza el saludo
        });
    }

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
            if(settingsButton) settingsButton.classList.remove('open');
        }
    });

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
    
    if(logoutButton) {
        logoutButton.addEventListener('click', () => {
            localStorage.removeItem('access_token');
            localStorage.removeItem('user_email');
            window.location.href = 'index.html';
        });
    }

    // --- Lógica del Modal de Cursos (Crear/Editar) ---
    const courseModal = document.getElementById('course-modal');
    const addCourseBtn = document.getElementById('add-course-btn');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const courseForm = document.getElementById('course-form');
    const modalTitle = document.getElementById('modal-title');
    const courseIdInput = document.getElementById('course-id');
    const courseNameInput = document.getElementById('course-name');
    const courseDescriptionInput = document.getElementById('course-description');
    
    let cursosCache = []; 

    if (addCourseBtn) {
        addCourseBtn.addEventListener('click', () => {
            courseForm.reset();
            courseIdInput.value = '';
            modalTitle.textContent = 'Crear Nuevo Curso';
            courseModal.style.display = 'flex';
        });
    }

    const closeCourseModal = () => {
        if(courseModal) courseModal.style.display = 'none';
    };

    if (closeModalBtn) closeModalBtn.addEventListener('click', closeCourseModal);
    window.addEventListener('click', (event) => {
        if (event.target === courseModal) closeCourseModal();
    });

    if (courseForm) {
        courseForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = courseIdInput.value;
            const url = id ? `/cursos/${id}` : '/cursos';
            const method = id ? 'PATCH' : 'POST';

            const courseData = { nombre: courseNameInput.value, descripcion: courseDescriptionInput.value };

            try {
                const response = await fetch(url, { method, headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(courseData) });
                if (!response.ok) throw new Error('La petición falló');
                
                showMessage(`¡Curso ${id ? 'actualizado' : 'creado'} con éxito!`);
                closeCourseModal();
                cargarCursos(); 

            } catch (error) {
                showMessage(`Error al ${id ? 'actualizar' : 'crear'} el curso`, true);
            }
        });
    }

    // --- Cargar y Mostrar Cursos ---
    async function cargarCursos() {
        const grid = document.querySelector('.subject-cards-grid');
        if (!grid) return;

        try {
            const response = await fetch('/cursos');
            if (!response.ok) throw new Error(`Error: ${response.statusText}`);
            cursosCache = await response.json();

            grid.innerHTML = ''; 
            if (cursosCache.length === 0) {
                grid.innerHTML = '<p>No hay cursos disponibles. ¡Crea el primero!</p>';
                return;
            }
            
            const icons = ['fas fa-book-open', 'fas fa-atom', 'fas fa-palette', 'fas fa-laptop-code'];
            cursosCache.forEach((curso, index) => {
                const card = document.createElement('div');
                card.className = 'subject-card';
                const iconClass = icons[index % icons.length];

                card.innerHTML = `
                    <a href="#" class="card-content-link" data-curso-id="${curso._id}">
                        <div class="card-icon"><i class="${iconClass}"></i></div>
                        <h3 class="card-caption">${curso.nombre}</h3>
                        <p class="card-description">${curso.descripcion}</p>
                    </a>
                    <div class="card-actions">
                        <button class="btn btn-edit" data-id="${curso._id}">Editar</button>
                        <button class="btn btn-delete" data-id="${curso._id}">Eliminar</button>
                    </div>
                `;
                grid.appendChild(card);
            });

        } catch (error) {
            grid.innerHTML = '<p>Hubo un error al cargar los cursos.</p>';
        }
    }

    // --- Delegación de Eventos para Tarjetas ---
    const subjectGrid = document.querySelector('.subject-cards-grid');
    if(subjectGrid) {
        subjectGrid.addEventListener('click', async (e) => {
            const target = e.target;
            
            if (target.closest('.btn-edit')) {
                const id = target.closest('.btn-edit').dataset.id;
                const cursoAEditar = cursosCache.find(c => c._id === id);
                if (!cursoAEditar) return;

                courseIdInput.value = cursoAEditar._id;
                courseNameInput.value = cursoAEditar.nombre;
                courseDescriptionInput.value = cursoAEditar.descripcion;
                modalTitle.textContent = 'Editar Curso';
                courseModal.style.display = 'flex';
            }

            else if (target.closest('.btn-delete')) {
                const id = target.closest('.btn-delete').dataset.id;
                if (!confirm('¿Estás seguro de que quieres eliminar este curso?')) return;

                try {
                    const response = await fetch(`/cursos/${id}`, { method: 'DELETE' });
                    if (!response.ok) throw new Error('La petición de borrado falló');
                    showMessage('Curso eliminado con éxito.');
                    cargarCursos();
                } catch (error) {
                    showMessage('No se pudo eliminar el curso.', true);
                }
            }

            else if (target.closest('.card-content-link')) {
                e.preventDefault();
                const cursoId = target.closest('.card-content-link').dataset.cursoId;
                console.log(`Navegar al curso con ID: ${cursoId}`);
                showMessage(`Próximamente: Módulo para el curso ${cursoId}`);
            }
        });
    }
    
    // --- Toast para mensajes ---
    function showMessage(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'toast--error' : ''}`.trim();
        toast.textContent = message;
        messageContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3000);
    }

    // --- INICIALIZACIÓN ---
    displayWelcomeMessage();
    cargarCursos();
});
