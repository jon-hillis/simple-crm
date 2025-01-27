// Store neighbors in localStorage
let neighbors = JSON.parse(localStorage.getItem('neighbors')) || [];
let editingId = null;

// DOM Elements
const modal = document.getElementById('neighborModal');
const addNeighborBtn = document.getElementById('addNeighborBtn');
const closeBtn = document.querySelector('.close');
const neighborForm = document.getElementById('neighborForm');
const searchInput = document.getElementById('searchInput');
const neighborsList = document.getElementById('neighborsList');

// Event Listeners
addNeighborBtn.addEventListener('click', () => {
    editingId = null;
    neighborForm.reset();
    document.getElementById('modalTitle').textContent = 'Add New Neighbor';
    modal.style.display = 'block';
});

closeBtn.addEventListener('click', () => {
    modal.style.display = 'none';
});

window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

neighborForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const neighbor = {
        id: editingId || Date.now(),
        name: document.getElementById('name').value,
        address: document.getElementById('address').value,
        phone: document.getElementById('phone').value,
        email: document.getElementById('email').value,
        notes: document.getElementById('notes').value,
    };

    if (editingId) {
        const index = neighbors.findIndex(n => n.id === editingId);
        neighbors[index] = neighbor;
    } else {
        neighbors.push(neighbor);
    }

    saveAndRenderNeighbors();
    modal.style.display = 'none';
    neighborForm.reset();
});

searchInput.addEventListener('input', () => {
    renderNeighbors();
});

function saveAndRenderNeighbors() {
    localStorage.setItem('neighbors', JSON.stringify(neighbors));
    renderNeighbors();
}

function renderNeighbors() {
    const searchTerm = searchInput.value.toLowerCase();
    const filteredNeighbors = neighbors.filter(neighbor =>
        neighbor.name.toLowerCase().includes(searchTerm) ||
        neighbor.address.toLowerCase().includes(searchTerm)
    );

    neighborsList.innerHTML = filteredNeighbors.map(neighbor => `
        <div class="neighbor-card">
            <h3>${neighbor.name}</h3>
            <p><strong>Address:</strong> ${neighbor.address}</p>
            <p><strong>Phone:</strong> ${neighbor.phone || 'N/A'}</p>
            <p><strong>Email:</strong> ${neighbor.email || 'N/A'}</p>
            <p><strong>Notes:</strong> ${neighbor.notes || 'N/A'}</p>
            <div class="card-actions">
                <button onclick="editNeighbor(${neighbor.id})" class="primary-btn">Edit</button>
                <button onclick="deleteNeighbor(${neighbor.id})" class="primary-btn" style="background-color: #dc3545;">Delete</button>
            </div>
        </div>
    `).join('');
}

function editNeighbor(id) {
    const neighbor = neighbors.find(n => n.id === id);
    if (neighbor) {
        editingId = id;
        document.getElementById('name').value = neighbor.name;
        document.getElementById('address').value = neighbor.address;
        document.getElementById('phone').value = neighbor.phone;
        document.getElementById('email').value = neighbor.email;
        document.getElementById('notes').value = neighbor.notes;
        document.getElementById('modalTitle').textContent = 'Edit Neighbor';
        modal.style.display = 'block';
    }
}

function deleteNeighbor(id) {
    if (confirm('Are you sure you want to delete this neighbor?')) {
        neighbors = neighbors.filter(n => n.id !== id);
        saveAndRenderNeighbors();
    }
}

// Initial render
renderNeighbors(); 