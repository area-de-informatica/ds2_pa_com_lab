
document.addEventListener('DOMContentLoaded', () => {
    const resourceTypes = [
        { type: 'file', title: 'Subir Archivo', icon: 'fa-file-upload', color: '#4A90E2' },
        { type: 'lesson', title: 'Área de texto y medios', icon: 'fa-file-alt', color: '#50E3C2' },
        { type: 'activity', title: 'Foro', icon: 'fa-comments', color: '#F5A623' }
    ];

    const resourceModal = document.getElementById('add-resource-modal');
    const resourceGrid = document.getElementById('resource-grid-container');
    const addResourceBtn = document.getElementById('add-resource-btn');
    const closeResourceModalBtn = document.getElementById('close-resource-modal-btn');
    
    if (!resourceModal || !resourceGrid || !addResourceBtn || !closeResourceModalBtn) {
        console.warn("Resource handler elements not found, skipping initialization.");
        return;
    }

    resourceGrid.innerHTML = resourceTypes.map(res => `
        <div class="resource-item" data-type="${res.type}">
            <i class="fas ${res.icon} resource-icon" style="color: ${res.color};"></i>
            <span class="resource-title">${res.title}</span>
        </div>
    `).join('');

    addResourceBtn.addEventListener('click', () => {
        resourceModal.style.display = 'flex';
    });

    const closeModal = () => resourceModal.style.display = 'none';
    closeResourceModalBtn.addEventListener('click', closeModal);
    resourceModal.addEventListener('click', (e) => {
        if (e.target === resourceModal) closeModal();
    });

    resourceGrid.addEventListener('click', (e) => {
        const item = e.target.closest('.resource-item');
        if (!item) return;

        const resourceType = item.dataset.type;
        closeModal();

        const event = new CustomEvent('add-resource', { 
            detail: { type: resourceType }
        });
        document.dispatchEvent(event);
    });
});
