
document.addEventListener('DOMContentLoaded', async () => {
    console.log("Módulo.js v26 - Eliminando TinyMCE");

    // --- 1. ESTADO CENTRAL Y AUTENTICACIÓN ---
    let state = {
        curso: null,
        editMode: false,
        currentUnitId: null
    };
    // ... (código de autenticación existente) ...
    function decodeJwt(token) {
        try {
            const base64Url = token.split('.')[1];
            const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
            const jsonPayload = decodeURIComponent(atob(base64).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
            return JSON.parse(jsonPayload);
        } catch (e) { return null; }
    }
    const token = localStorage.getItem('access_token');
    const decodedToken = decodeJwt(token);
    if (!token || !decodedToken) {
        localStorage.clear();
        window.location.replace('index.html');
        return;
    }
    const userRole = decodedToken.role;
    const userId = decodedToken.sub;
    const isAdmin = userRole === 'admin';
    const cursoId = new URLSearchParams(window.location.search).get('cursoId');
    const authHeaders = { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` };
    const authHeadersForFiles = { 'Authorization': `Bearer ${token}` };

    // --- 2. REFERENCIAS AL DOM ---
    const mainContent = document.querySelector('.main-content');
    const messageContainer = document.getElementById('message-container');
    const welcomeMessage = document.getElementById('welcome-message');
    const settingsButton = document.getElementById('settings-btn');
    const dropdownContent = document.getElementById('dropdown-content');
    const logoutButton = document.getElementById('logout-button');
    const profileLink = document.getElementById('profile-link');
    const moduleTitle = document.getElementById('module-title');
    const unitsListContainer = document.getElementById('units-list-container');
    const unitContentPlaceholder = document.getElementById('unit-content-placeholder');
    const unitContentDisplay = document.getElementById('unit-content-display');
    const lessonsContainer = document.getElementById('lessons-and-activities-container');
    const activityFormModal = document.getElementById('activity-form-modal');
    const activityModalTitle = document.getElementById('activity-modal-title');
    const activityFormContainer = document.getElementById('activity-form-container');

    // --- 3. INICIALIZACIÓN PRINCIPAL ---
    // ... (código de inicialización existente) ...
    if (!cursoId) {
        mainContent.innerHTML = '<h1>Error: No se ha especificado un curso.</h1><a href="main.html" class="btn">Volver</a>';
        return;
    }

    try {
        const response = await fetch(`/cursos/${cursoId}`, { headers: authHeaders });
        if (!response.ok) {
            throw new Error(response.status === 404 ? 'Curso no encontrado' : 'No se pudo cargar el curso');
        }
        state.curso = await response.json();

        const isEnrolled = state.curso.inscritos && state.curso.inscritos.some(estudiante => estudiante._id === userId);
        if (!isAdmin && !isEnrolled) {
            mainContent.innerHTML = '<h1>Acceso Denegado</h1><p>No estás inscrito en este curso.</p><a href="main.html" class="btn">Volver</a>';
            return;
        }
        initializePage(state.curso);
    } catch (error) {
        console.error("Error fatal al cargar la página del módulo:", error);
        mainContent.innerHTML = `<h1>Ha ocurrido un error inesperado.</h1><p>${error.message}</p><a href="main.html" class="btn">Volver</a>`;
    }

    // --- 4. INICIALIZACIÓN DE COMPONENTES ---
    function initializePage(curso) {
        initializeHeader(curso);
        if (isAdmin) {
            initializeAdminFunctionality(curso);
        } else {
            const addUnitBtn = document.getElementById('add-unit-btn');
            if (addUnitBtn) addUnitBtn.style.display = 'none';
        }
        initializeCourseContentView(curso);
    }
    
    function initializeAdminFunctionality(curso) {
        initializeAdminTabs(curso);
        initializeUnitModal();
        
        document.addEventListener('add-resource', (e) => {
            const { type } = e.detail;
            if (!state.currentUnitId) {
                showMessage('Por favor, selecciona una unidad primero.', true);
                return;
            }
            openActivityModal(type);
        });

        const closeActivityModalBtn = document.getElementById('close-activity-modal-btn');
        closeActivityModalBtn.addEventListener('click', () => activityFormModal.style.display = 'none');
        activityFormModal.addEventListener('click', e => {
            if (e.target === activityFormModal) activityFormModal.style.display = 'none';
        });
    }

    function openActivityModal(type) {
        activityFormModal.style.display = 'flex';
        let formHTML = '';
        
        if (type === 'file') {
            activityModalTitle.textContent = 'Añadiendo un nuevo Archivo';
            formHTML = createFileFormHTML();
        } else if (type === 'lesson') {
            activityModalTitle.textContent = 'Añadiendo un Área de texto y medios';
            formHTML = ``; // Próximamente
        } else if (type === 'activity') {
            activityModalTitle.textContent = 'Añadiendo un nuevo Foro';
            formHTML = ``; // Próximamente
        }
        
        activityFormContainer.innerHTML = formHTML;
        
        if (type === 'file') {
            setupFileFormLogic();
        }
    }

    function createFileFormHTML() {
        return `
            <form id="advanced-file-form" class="activity-form">
                <div class="form-section">
                    <div class="form-group">
                        <label for="file-name">Nombre</label>
                        <input type="text" id="file-name" name="name" placeholder="Ej: Guía de Repaso 1" required>
                    </div>
                    <div class="form-group">
                        <label for="file-description">Descripción</label>
                        <textarea id="file-description" name="description" placeholder="Añade una descripción detallada para este recurso..." rows="4"></textarea>
                    </div>
                </div>
                <div class="form-section">
                     <label>Seleccionar archivos</label>
                    <div id="file-drop-zone" class="file-drop-zone">
                        <div class="file-drop-zone-internal">
                            <i class="fas fa-cloud-upload-alt"></i>
                            <p>Puede arrastrar y soltar archivos aquí para añadirlos.</p>
                            <input type="file" id="file-input-hidden" multiple style="display: none;">
                            <button type="button" id="browse-files-btn" class="btn-secondary">Seleccionar archivos</button>
                        </div>
                    </div>
                    <div id="file-preview-list" class="file-preview-list"></div>
                </div>
                <div class="form-actions">
                    <button type="submit" class="btn btn-primary">Guardar cambios</button>
                    <button type="button" class="btn btn-secondary" id="cancel-file-form">Cancelar</button>
                </div>
            </form>
        `;
    }

    function setupFileFormLogic() {
        const form = document.getElementById('advanced-file-form');
        if (!form) return;

        const dropZone = document.getElementById('file-drop-zone');
        const fileInput = document.getElementById('file-input-hidden');
        const browseBtn = document.getElementById('browse-files-btn');
        const previewList = document.getElementById('file-preview-list');
        let selectedFiles = [];

        browseBtn.addEventListener('click', () => fileInput.click());
        fileInput.addEventListener('change', (e) => handleFiles(e.target.files));
        
        ['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
            dropZone.addEventListener(eventName, preventDefaults, false);
        });
        
        function preventDefaults(e) {
            e.preventDefault();
            e.stopPropagation();
        }
        
        dropZone.addEventListener('drop', (e) => {
            handleFiles(e.dataTransfer.files);
        });
        
        function handleFiles(files) {
            for (const file of files) {
                if (!selectedFiles.some(f => f.name === file.name && f.size === file.size)) {
                    selectedFiles.push(file);
                }
            }
            renderFilePreviews();
        }
        
        function renderFilePreviews() {
            previewList.innerHTML = '';
            selectedFiles.forEach((file, index) => {
                const fileEl = document.createElement('div');
                fileEl.className = 'file-preview-item';
                fileEl.innerHTML = `<span>${file.name}</span><button type="button" data-index="${index}">&times;</button>`;
                previewList.appendChild(fileEl);
            });
        }

        previewList.addEventListener('click', (e) => {
            if (e.target.tagName === 'BUTTON') {
                selectedFiles.splice(e.target.dataset.index, 1);
                renderFilePreviews();
            }
        });

        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            const name = form.elements.name.value;
            const description = form.elements.description.value;

            if (!name) {
                showMessage('El nombre es obligatorio.', true);
                return;
            }
            if (selectedFiles.length === 0) {
                showMessage('Debe seleccionar al menos un archivo.', true);
                return;
            }

            const formData = new FormData();
            formData.append('name', name);
            formData.append('description', description);
            // Adjuntar solo el primer archivo con el campo 'file'
            formData.append('file', selectedFiles[0]); 
            
            try {
                const response = await fetch(`/unidades/${state.currentUnitId}/archivos`, {
                    method: 'POST',
                    headers: authHeadersForFiles,
                    body: formData,
                });

                if (!response.ok) {
                    let errorMessage = `Error del servidor: ${response.status}`;
                    try {
                        const errData = await response.json();
                        errorMessage = errData.message || JSON.stringify(errData);
                    } catch (e) {
                        errorMessage = await response.text();
                    }
                    throw new Error(errorMessage);
                }
                
                showMessage('Archivo guardado con éxito.');
                activityFormModal.style.display = 'none';
                loadUnitContent(state.currentUnitId);
            } catch (error) {
                console.error("Fallo en la subida del archivo:", error);
                showMessage(error.message, true);
            }
        });

        document.getElementById('cancel-file-form').addEventListener('click', () => {
            activityFormModal.style.display = 'none';
        });
    }

    // ... (El resto del código de la aplicación)
     function initializeHeader(curso) {
        const currentUserEmail = localStorage.getItem('user_email');
        const userProfileString = localStorage.getItem(`profile_${currentUserEmail}`);
        let username = (userProfileString && JSON.parse(userProfileString).username) || currentUserEmail.split('@')[0];
        
        welcomeMessage.innerHTML = `👋🏼 Bienvenido, <strong>${username}</strong>`;
        document.title = `Módulo: ${curso.nombre}`;
        moduleTitle.textContent = `${curso.nombre.toUpperCase()}`;

        settingsButton.addEventListener('click', e => {
            e.stopPropagation();
            dropdownContent.classList.toggle('show');
        });
        logoutButton.addEventListener('click', () => {
            localStorage.clear();
            window.location.href = 'index.html';
        });
        profileLink.addEventListener('click', e => {
            e.preventDefault();
            window.location.href = 'main.html';
        });
        window.addEventListener('click', e => {
            if (!settingsButton.contains(e.target)) {
                dropdownContent.classList.remove('show');
            }
        });
    }

    function initializeAdminTabs(curso) {
        const tabNav = document.getElementById('admin-tab-nav');
        if (!tabNav) return;
        tabNav.style.display = 'flex';
        tabNav.addEventListener('click', e => {
            if (e.target.classList.contains('tab-link')) {
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
                document.querySelectorAll('.tab-pane').forEach(pane => pane.classList.toggle('active', pane.id === e.target.dataset.tab));
            }
        });
        renderStudentList(curso.inscritos || []);
        setupEnrollmentForm();
        setupStudentDeletion();
    }
    
    function initializeCourseContentView(curso) {
        unitsListContainer.addEventListener('click', handleUnitListClick);
        renderUnitsSidebar(curso.unidades || []);

        if (curso.unidades && curso.unidades.length > 0) {
            const firstUnitId = curso.unidades[0]._id;
            const firstUnitElement = unitsListContainer.querySelector(`[data-unit-id="${firstUnitId}"]`);
            if (firstUnitElement) {
                firstUnitElement.classList.add('active');
                loadUnitContent(firstUnitId);
            }
        }
    }

    // --- 5. LÓGICA DE UNIDADES (CRUD) ---

    function initializeUnitModal() {
        const addUnitBtn = document.getElementById('add-unit-btn');
        const modal = document.getElementById('add-unit-modal');
        const form = document.getElementById('add-unit-form');
        const closeModal = () => {
            modal.style.display = 'none';
            form.reset();
        };

        addUnitBtn.addEventListener('click', () => openUnitModal());
        document.getElementById('close-modal-btn').addEventListener('click', closeModal);
        modal.addEventListener('click', e => {
            if (e.target === modal) closeModal();
        });

        form.addEventListener('submit', handleUnitFormSubmit);
    }
    
    async function handleUnitFormSubmit(e) {
        e.preventDefault();
        const input = document.getElementById('unit-name-input');
        const name = input.value.trim();
        if (!name) {
            showMessage('El nombre no puede estar vacío.', true);
            return;
        }

        const url = state.editMode ? `/unidades/${state.currentUnitId}` : `/cursos/${cursoId}/unidades`;
        const method = state.editMode ? 'PATCH' : 'POST';

        try {
            const response = await fetch(url, {
                method,
                headers: authHeaders,
                body: JSON.stringify({ name })
            });
            const result = await response.json();
            if (!response.ok) throw new Error(result.message || 'Ocurrió un error.');

            if (state.editMode) {
                const index = state.curso.unidades.findIndex(u => u._id === state.currentUnitId);
                if (index !== -1) {
                    state.curso.unidades[index] = result;
                }
            } else {
                state.curso.unidades.push(result);
            }

            showMessage(`Sección ${state.editMode ? 'actualizada' : 'creada'} con éxito.`);
            renderUnitsSidebar(state.curso.unidades);
            document.getElementById('add-unit-modal').style.display = 'none';
            e.target.reset();

        } catch (error) {
            showMessage(error.message, true);
        }
    }

    async function handleUnitListClick(e) {
        const unitItem = e.target.closest('.unit-item');
        if (!unitItem) return;

        const unitId = unitItem.dataset.unitId;

        if (isAdmin) {
            if (e.target.closest('.btn-edit-unit')) {
                const unitToEdit = state.curso.unidades.find(u => u._id === unitId);
                if (unitToEdit) openUnitModal(unitToEdit);
                return;
            }

            if (e.target.closest('.btn-delete-unit')) {
                if (confirm('¿Estás seguro de que quieres eliminar esta sección?')) {
                    try {
                        const response = await fetch(`/cursos/${cursoId}/unidades/${unitId}`, { method: 'DELETE', headers: authHeaders });
                        if (!response.ok) throw new Error((await response.json()).message || 'Error al eliminar');
                        
                        showMessage('Sección eliminada con éxito.');
                        state.curso.unidades = state.curso.unidades.filter(u => u._id !== unitId);
                        renderUnitsSidebar(state.curso.unidades);
                        
                        unitContentDisplay.style.display = 'none';
                        unitContentPlaceholder.style.display = 'block';

                    } catch (error) { showMessage(error.message, true); }
                }
                return;
            }
        }

        document.querySelectorAll('.unit-item').forEach(item => item.classList.remove('active'));
        unitItem.classList.add('active');
        loadUnitContent(unitId);
    }

    function openUnitModal(unit = null) {
        const modal = document.getElementById('add-unit-modal');
        const title = document.getElementById('modal-title');
        const input = document.getElementById('unit-name-input');
        
        state.editMode = !!unit;
        state.currentUnitId = unit ? unit._id : null;
        
        title.textContent = state.editMode ? 'Editar Sección' : 'Añadir Nueva Sección';
        input.value = unit ? unit.name : '';
        
        modal.style.display = 'flex';
        input.focus();
    }

    function renderUnitsSidebar(unidades) {
        unitsListContainer.innerHTML = '';
        if (unidades && unidades.length > 0) {
            unidades.forEach(unidad => unitsListContainer.appendChild(createUnitElement(unidad)));
        } else {
            unitsListContainer.innerHTML = '<p class="empty-list-message">No hay unidades en este curso.</p>';
        }
    }

    function createUnitElement(unidad) {
        const div = document.createElement('div');
        div.className = 'unit-item';
        div.dataset.unitId = unidad._id;

        const adminActions = `
            <div class="unit-item-actions">
                <button class="btn-edit-unit" title="Editar"><i class="fas fa-pen"></i></button>
                <button class="btn-delete-unit" title="Eliminar"><i class="fas fa-trash"></i></button>
            </div>`;

        div.innerHTML = `<span>${unidad.name}</span> ${isAdmin ? adminActions : ''}`;
        return div;
    }
    async function loadUnitContent(unitId) {
        const id = unitId || state.currentUnitId;
        if (!id) return; 

        const unit = state.curso.unidades.find(u => u._id === id);
        if (!unit) return;

        state.currentUnitId = id;
    
        unitContentPlaceholder.style.display = 'none';
        unitContentDisplay.style.display = 'block';
        
        document.getElementById('unit-title-display').textContent = unit.name;
        
        const addContentButtons = document.querySelector('.unit-actions');
        if (addContentButtons) {
            addContentButtons.style.display = isAdmin ? 'flex' : 'none';
        }

        lessonsContainer.innerHTML = '<p>Cargando contenido...</p>';

        try {
            const url = `/unidades/${id}/Contenidos`;
            const response = await fetch(url, { headers: authHeaders, cache: 'no-cache' });

            if (!response.ok) throw new Error('No se pudo cargar el contenido de la unidad.');
            
            const data = await response.json();
            
            renderUnitDynamicContent(data.archivos, data.lecciones, data.actividades);

        } catch (error) {
            console.error("Error al cargar contenido de la unidad:", error);
            lessonsContainer.innerHTML = `<p style="color: red;">Error al cargar el contenido. ${error.message}</p>`;
        }
    }

    function renderUnitDynamicContent(archivos = [], lecciones = [], actividades = []) {
        lessonsContainer.innerHTML = ''; 

        const hasContent = (archivos && archivos.length > 0) || (lecciones && lecciones.length > 0) || (actividades && actividades.length > 0);

        if (!hasContent) {
            lessonsContainer.innerHTML = '<p>Aún no hay lecciones ni actividades en esta unidad.</p>';
            return;
        }

        if (archivos && archivos.length > 0) {
            archivos.forEach(archivo => {
                if (!archivo || !archivo.url) return; 
                const fileElement = document.createElement('div');
                fileElement.className = 'resource-item-list';
                
                fileElement.innerHTML = `
                    <a href="${archivo.url}" target="_blank" rel="noopener noreferrer" style="text-decoration: none; color: inherit; display: flex; align-items: center;">
                        <i class="fas fa-file-pdf" style="margin-right: 8px; color: #D32F2F;"></i>
                        <span>${archivo.name}</span>
                    </a>
                `;
                lessonsContainer.appendChild(fileElement);
            });
        }
    }
    // --- 7. PESTAÑA "PARTICIPANTES" ---
    function renderStudentList(inscritos) {
        const listaEstudiantes = document.getElementById('lista-estudiantes');
        if (!listaEstudiantes) return;
        listaEstudiantes.innerHTML = '';
        if (inscritos && inscritos.length > 0) {
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
                    <button class="btn-delete-student" data-student-id="${estudiante._id}" aria-label="Eliminar estudiante"><i class="fas fa-trash-alt"></i></button>
                `;
                listaEstudiantes.appendChild(studentCard);
            });
        } else {
            listaEstudiantes.innerHTML = '<p class="empty-list-message">No hay estudiantes inscritos.</p>';
        }
    }

    function setupEnrollmentForm() {
        const formInscribir = document.getElementById('form-inscribir');
        if (!formInscribir) return;
        formInscribir.addEventListener('submit', async e => {
            e.preventDefault();
            const usuarioId = e.target.elements.usuarioId.value;
            if (!usuarioId) return showMessage('El ID de usuario no puede estar vacío.', true);
            try {
                const res = await fetch(`/cursos/${cursoId}/inscribir`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ usuarioId }) });
                const data = await res.json();
                if (!res.ok) throw new Error(data.message || 'Error al inscribir');
                
                showMessage('¡Estudiante inscrito con éxito!');
                e.target.reset();
                state.curso.inscritos = data.inscritos;
                renderStudentList(state.curso.inscritos);
            } catch (error) { showMessage(error.message, true); }
        });
    }

    function setupStudentDeletion() {
        const container = document.getElementById('lista-estudiantes');
        if (!container) return;
        container.addEventListener('click', async e => {
            const deleteButton = e.target.closest('.btn-delete-student');
            if (!deleteButton) return;
            if (confirm('¿Seguro que quieres eliminar a este estudiante del curso?')) {
                const studentId = deleteButton.dataset.studentId;
                try {
                    const res = await fetch(`/cursos/${cursoId}/eliminar-estudiante`, { method: 'POST', headers: authHeaders, body: JSON.stringify({ usuarioId: studentId }) });
                    const data = await res.json();
                    if (!res.ok) throw new Error(data.message || 'Error al eliminar');

                    showMessage('¡Estudiante eliminado con éxito!');
                    state.curso.inscritos = data.inscritos;
                    renderStudentList(state.curso.inscritos);
                } catch (error) { showMessage(error.message, true); }
            }
        });
    }
    
    // --- 8. UTILIDADES ---
    function showMessage(message, isError = false) {
        const toast = document.createElement('div');
        toast.className = `toast ${isError ? 'toast--error' : ''}`;
        toast.textContent = message;
        messageContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 4000);
    }
});
