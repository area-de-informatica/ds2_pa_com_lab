
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Módulo.js cargado y ejecutándose.");

    // --- 1. OBTENER INFORMACIÓN ESENCIAL Y AUTENTICACIÓN ---
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c =>
                '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
            ).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) {
            console.error("Error al decodificar JWT:", e);
            return null;
        }
    }

    const token = localStorage.getItem('access_token');
    if (!token) {
        window.location.replace('index.html');
        return;
    }

    const decodedToken = decodeJwt(token);
    if (!decodedToken) {
        localStorage.clear();
        window.location.replace('index.html');
        return;
    }
    
    const userRole = decodedToken.role;
    const userId = decodedToken.sub;
    const isAdmin = userRole === 'admin';
    const cursoId = new URLSearchParams(window.location.search).get('cursoId');
    const currentUserEmail = localStorage.getItem('user_email');
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };

    // --- 2. REFERENCIAS A ELEMENTOS DEL DOM ---
    const welcomeMessageContainer = document.getElementById('welcome-message');
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const profileLink = document.getElementById('profile-link');
    const moduleTitle = document.getElementById('module-title');
    const moduleContent = document.getElementById('module-content');
    const unitsContainer = document.getElementById('course-units-container');
    const mainContent = document.querySelector('.main-content');
    const tabNav = document.getElementById('admin-tab-nav');
    const listaEstudiantes = document.getElementById('lista-estudiantes');
    const messageContainer = document.getElementById('message-container');

    // --- 3. FUNCIONES DEL HEADER ---
    function displayWelcomeMessage() {
        if (!currentUserEmail || !welcomeMessageContainer) return;
        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        let username = currentUserEmail.split('@')[0];
        if (userProfileString) {
            try {
                const profile = JSON.parse(userProfileString);
                username = profile.username || username;
            } catch (e) {
                console.error("Error al parsear perfil de usuario:", e);
            }
        }
        welcomeMessageContainer.innerHTML = `👋🏼 Bienvenido, <strong>${username}</strong>`;
    }

    function setupHeaderEventListeners() {
        if (settingsButton) {
            settingsButton.addEventListener('click', (e) => {
                e.stopPropagation();
                if (dropdownContent) dropdownContent.classList.toggle('show');
            });
        }

        if (logoutButton) {
            logoutButton.addEventListener('click', () => {
                localStorage.clear();
                window.location.href = 'index.html';
            });
        }
        
        if (profileLink) {
            profileLink.addEventListener('click', (e) => {
                e.preventDefault();
                alert("La edición del perfil se realiza en la página principal.");
                window.location.href = 'main.html';
            });
        }

        window.addEventListener('click', (e) => {
            if (dropdownContent && !settingsButton.contains(e.target) && !dropdownContent.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    // --- 4. LÓGICA DE LA PÁGINA DEL MÓDULO ---
    if (!cursoId) {
        mainContent.innerHTML = '<h1>Error: No se ha especificado un curso.</h1><a href="main.html" class="btn">Volver</a>';
        return;
    }

    try {
        const response = await fetch(`/cursos/${cursoId}`, { headers: authHeaders });
        if (!response.ok) {
            mainContent.innerHTML = response.status === 404 
                ? '<h1>Error 404: El curso no fue encontrado.</h1>' 
                : '<h1>Error: No se pudo cargar el curso.</h1>';
            throw new Error('Error en la petición del curso.');
        }

        const curso = await response.json();
        const isEnrolled = curso.inscritos && curso.inscritos.some(estudiante => estudiante._id === userId);

        if (!isAdmin && !isEnrolled) {
            mainContent.innerHTML = '<h1>Acceso Denegado</h1><p>No estás inscrito en este curso.</p><a href="main.html" class="btn">Volver</a>';
            return;
        }

        document.title = `Módulo: ${curso.nombre}`;
        moduleTitle.textContent = `MÓDULO: ${curso.nombre.toUpperCase()}`;
        moduleContent.textContent = curso.descripcion;
        renderizarUnidades(curso.unidades || []);

        if (isAdmin) {
            tabNav.style.display = 'flex';
            renderizarListaEstudiantes(curso.inscritos || []);
            setupAdminFunctionality(cursoId, authHeaders);
        }

    } catch (error) {
        console.error("Error fatal al cargar la página del módulo:", error);
        if (!mainContent.innerHTML.includes("Acceso Denegado")) {
           mainContent.innerHTML = '<h1>Ha ocurrido un error inesperado.</h1><a href="main.html" class="btn">Volver</a>';
        }
    }

    // --- 5. FUNCIONES AUXILIARES DEL MÓDULO ---
    function renderizarUnidades(unidades) {
        unitsContainer.innerHTML = unidades.length > 0 
            ? '<p>El contenido del curso y sus unidades se mostrarán aquí.</p>' 
            : '<p>Este curso aún no tiene unidades definidas.</p>';
    }
    
    function renderizarListaEstudiantes(inscritos) {
        if (!listaEstudiantes) return;
        listaEstudiantes.innerHTML = '';
        if (inscritos.length > 0) {
            inscritos.forEach(estudiante => {
                if (!estudiante) return;
                const studentCard = document.createElement('div');
                studentCard.className = 'student-card';
                studentCard.innerHTML = `
                    <div class="student-info">
                        <i class="fas fa-user-circle student-icon"></i>
                        <div class="student-details">
                            <span class="student-name">${estudiante.username || 'Usuario sin nombre'}</span>
                            <span class="student-email">${estudiante.email}</span>
                        </div>
                    </div>
                    <button class="btn-delete-student" data-student-id="${estudiante._id}" aria-label="Eliminar estudiante">
                        <i class="fas fa-trash-alt"></i>
                    </button>
                `;
                listaEstudiantes.appendChild(studentCard);
            });
        } else {
            listaEstudiantes.innerHTML = '<p class="empty-list-message">No hay estudiantes inscritos.</p>';
        }
    }

    function setupAdminFunctionality(cursoId, authHeaders) {
        const formInscribir = document.getElementById('form-inscribir');
        if(formInscribir){
            formInscribir.addEventListener('submit', async (e) => {
                e.preventDefault();
                const usuarioIdInput = e.target.elements.usuarioId;
                if (!usuarioIdInput.value) {
                    showMessage('El ID de usuario no puede estar vacío.', true);
                    return;
                }
                try {
                    const res = await fetch(`/cursos/${cursoId}/inscribir`, {
                        method: 'POST',
                        headers: authHeaders,
                        body: JSON.stringify({ usuarioId: usuarioIdInput.value })
                    });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Error al inscribir');
                    
                    showMessage('¡Estudiante inscrito con éxito!');
                    usuarioIdInput.value = '';
                    
                    const updatedCourse = await fetch(`/cursos/${cursoId}`, { headers: authHeaders });
                    const cursoActualizado = await updatedCourse.json();
                    renderizarListaEstudiantes(cursoActualizado.inscritos);

                } catch (error) {
                    showMessage(error.message, true);
                }
            });
        }

        const tabLinks = tabNav.querySelectorAll('.tab-link');
        const tabPanes = document.querySelectorAll('.tab-pane');
        if(tabNav){
            tabNav.addEventListener('click', (e) => {
                if (e.target.classList.contains('tab-link')) {
                    const targetTab = e.target.dataset.tab;
                    
                    tabLinks.forEach(link => link.classList.remove('active'));
                    e.target.classList.add('active');

                    tabPanes.forEach(pane => {
                         if (pane.id === targetTab) {
                            pane.classList.add('active');
                        } else {
                            pane.classList.remove('active');
                        }
                    });
                }
            });
        }
        
        if(listaEstudiantes){
            listaEstudiantes.addEventListener('click', async (e) => {
                const deleteButton = e.target.closest('.btn-delete-student');
                if (!deleteButton) return;

                const studentIdToDelete = deleteButton.dataset.studentId;
                if (confirm('¿Estás seguro de que quieres eliminar a este estudiante?')) {
                    try {
                        const response = await fetch(`/cursos/${cursoId}/eliminar-estudiante`, {
                            method: 'POST',
                            headers: authHeaders,
                            body: JSON.stringify({ usuarioId: studentIdToDelete })
                        });
                        const responseData = await response.json();
                        if (!response.ok) throw new Error(responseData.message || 'Error al eliminar.');

                        showMessage('¡Estudiante eliminado con éxito!');
                        const updatedCourse = await fetch(`/cursos/${cursoId}`, { headers: authHeaders });
                        const cursoActualizado = await updatedCourse.json();
                        renderizarListaEstudiantes(cursoActualizado.inscritos);

                    } catch (error) {
                        showMessage(error.message, true);
                    }
                }
            });
        }
    }

    function showMessage(message, isError = false) {
        if (!messageContainer) return;
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'error' : ''}`;
        toast.textContent = message;
        messageContainer.appendChild(toast);
        setTimeout(() => {
            toast.classList.add('fade-out');
            toast.addEventListener('transitionend', () => toast.remove());
        }, 3000);
    }
    
    // --- 6. SECUENCIA DE INICIALIZACIÓN ---
    displayWelcomeMessage();
    setupHeaderEventListeners();
});
