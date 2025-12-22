// STONE TYPES DATABASE - WITH YOUR LOCAL IMAGES
const stoneTypes = [
    {
        id: 1,
        name: 'Classic Jet Burnt - A2',
        type: 'Vizag Blue',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#2c3e50', '#34495e', '#1a252f'],
        thumbnail: 'assets/img/u1.jpg'
    },
    {
        id: 2,
        name: 'Classic Jet Burnt - A2',
        type: 'Viscont White',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#95a5a6', '#bdc3c7', '#7f8c8d'],
        thumbnail: 'assets/img/z1.jpg'
    },
    {
        id: 3,
        name: 'Classic Polished - D2',
        type: 'Viscont White',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#ecf0f1', '#bdc3c7', '#95a5a6'],
        thumbnail: 'assets/img/z2.jpg'
    },
    {
        id: 4,
        name: 'Classic Granite',
        type: 'Red Multicolor',
        dimensions: '80 x 60 x 12 cm',
        price: 11950,
        colors: ['#8b4513', '#a0522d', '#6b3410'],
        thumbnail: 'assets/img/z5.jpg'
    },
    {
        id: 5,
        name: 'Premium Black',
        type: 'Absolute Black',
        dimensions: '80 x 60 x 12 cm',
        price: 12950,
        colors: ['#1a1a1a', '#2d2d2d', '#0a0a0a'],
        thumbnail: 'assets/img/z7.jpg'
    }
];

// STATE
let state = {
    selectedStone: stoneTypes[0],
    includeTitle: false,
    titleText: '',
    persons: [{name: '', dates: ''}],
    legacyText: '',
    font: 'Cinzel',
    color: '#d4af37',
    textOffsetX: 0,
    textOffsetY: 0
};

// DRAGGING STATE
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let initialOffsetX = 0;
let initialOffsetY = 0;

// INITIALIZE
function init() {
    renderStoneList();
    addPerson();
    updatePreview();
    updatePrice();
    setupCanvasDragging();
}

// SETUP CANVAS DRAGGING
function setupCanvasDragging() {
    const canvas = document.getElementById('stoneCanvas');
    
    // Mouse events
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('mouseleave', handleDragEnd);
    
    // Touch events
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleDragEnd);
}

function handleDragStart(e) {
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialOffsetX = state.textOffsetX;
    initialOffsetY = state.textOffsetY;
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        initialOffsetX = state.textOffsetX;
        initialOffsetY = state.textOffsetY;
        e.preventDefault();
    }
}

function handleDragMove(e) {
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    state.textOffsetX = initialOffsetX + deltaX;
    state.textOffsetY = initialOffsetY + deltaY;
    
    updatePreview();
}

function handleTouchMove(e) {
    if (!isDragging || e.touches.length !== 1) return;
    
    const deltaX = e.touches[0].clientX - dragStartX;
    const deltaY = e.touches[0].clientY - dragStartY;
    
    state.textOffsetX = initialOffsetX + deltaX;
    state.textOffsetY = initialOffsetY + deltaY;
    
    updatePreview();
    e.preventDefault();
}

function handleDragEnd() {
    isDragging = false;
}

function resetTextPosition() {
    state.textOffsetX = 0;
    state.textOffsetY = 0;
    updatePreview();
}

// RENDER STONE LIST
function renderStoneList() {
    const container = document.getElementById('stoneList');
    container.innerHTML = stoneTypes.map(stone => `
        <div class="stone-item ${stone.id === state.selectedStone.id ? 'active' : ''}" onclick="selectStone(${stone.id})">
            <img src="${stone.thumbnail}" alt="${stone.name}" class="stone-thumbnail">
            <div class="stone-info">
                <div class="stone-name">${stone.name}</div>
                <div class="stone-details">${stone.type}</div>
                <div class="stone-details">Dimensions: ${stone.dimensions}</div>
                <div class="stone-price">${stone.price.toLocaleString('da-DK')},-</div>
            </div>
        </div>
    `).join('');
}

// SELECT STONE
function selectStone(stoneId) {
    state.selectedStone = stoneTypes.find(s => s.id === stoneId);
    renderStoneList();
    updatePrice();
    updatePreview();
}

// TOGGLE TITLE
function toggleTitle() {
    const checkbox = document.getElementById('includeTitle');
    const input = document.getElementById('titleInput');
    state.includeTitle = checkbox.checked;
    input.style.display = state.includeTitle ? 'block' : 'none';
    updatePrice();
    updatePreview();
}

// ADD PERSON
function addPerson() {
    const container = document.getElementById('personsContainer');
    const index = state.persons.length;
    state.persons.push({name: '', dates: ''});
    
    const personDiv = document.createElement('div');
    personDiv.className = 'person-entry';
    personDiv.innerHTML = `
        <label>Name</label>
        <input type="text" placeholder="F.eks. Jens Nielsen" oninput="updatePersonName(${index}, this.value)">
        <label>Datoer</label>
        <input type="text" placeholder="F.eks. 1940 - 2023" oninput="updatePersonDates(${index}, this.value)">
        ${index > 0 ? `<button class="remove-person" onclick="removePerson(${index})">Remove person</button>` : ''}
    `;
    container.appendChild(personDiv);
}

// REMOVE PERSON
function removePerson(index) {
    state.persons.splice(index, 1);
    const container = document.getElementById('personsContainer');
    container.innerHTML = '';
    state.persons.forEach(() => {
        addPerson();
    });
    updatePreview();
}

// UPDATE PERSON DATA
function updatePersonName(index, value) {
    state.persons[index].name = value;
    updatePreview();
}

function updatePersonDates(index, value) {
    state.persons[index].dates = value;
    updatePreview();
}

// SELECT FONT
function selectFont(element, font) {
    document.querySelectorAll('.font-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    state.font = font;
    updatePreview();
}

// SELECT COLOR
function selectColor(element, color) {
    document.querySelectorAll('.color-option').forEach(el => el.classList.remove('active'));
    element.classList.add('active');
    state.color = color;
    updatePreview();
}

// UPDATE PREVIEW
function updatePreview() {
    const canvas = document.getElementById('stoneCanvas');
    const ctx = canvas.getContext('2d');

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stoneImg = new Image();

    // Detect if image is remote (http/https) or local
    const isRemote = /^https?:\/\//i.test(state.selectedStone.thumbnail);

    if (isRemote) {
        stoneImg.crossOrigin = "anonymous"; // needed for remote images
    }

    stoneImg.onload = function () {
        // Draw stone image to fill canvas
        ctx.drawImage(stoneImg, 0, 0, canvas.width, canvas.height);

        // Add overlay for better text contrast
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Render text on top
        renderText(ctx);
    };

    stoneImg.onerror = function () {
        console.log('Image failed to load, using gradient fallback');

        // Gradient fallback
        const colors = state.selectedStone.colors || ['#999', '#777', '#555'];
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(0.5, colors[0]);
        gradient.addColorStop(1, colors[2]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add light texture
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        for (let i = 0; i < 2000; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 3,
                Math.random() * 3
            );
        }

        // Render text
        renderText(ctx);
    };

    // Trigger load
    stoneImg.src = state.selectedStone.thumbnail;
}

// RENDER TEXT ON CANVAS
function renderText(ctx) {
    // Set text properties
    ctx.fillStyle = state.color;
    ctx.textAlign = 'center';
    
    // Add text shadow for better visibility
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
    // Apply offset from dragging
    const centerX = 500 + state.textOffsetX;
    let yPos = 150 + state.textOffsetY;
    
    // Title
    if (state.includeTitle && state.titleText) {
        ctx.font = `600 42px ${state.font}`;
        ctx.fillText(state.titleText, centerX, yPos);
        yPos += 80;
    }
    
    // Decorative line
    if (state.includeTitle && state.titleText) {
        ctx.strokeStyle = state.color;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(centerX - 200, yPos);
        ctx.lineTo(centerX + 200, yPos);
        ctx.stroke();
        yPos += 80;
    }
    
    // Names
    state.persons.forEach(person => {
        if (person.name) {
            ctx.font = `600 56px ${state.font}`;
            ctx.fillText(person.name, centerX, yPos);
            yPos += 70;
            
            if (person.dates) {
                ctx.font = `400 36px ${state.font}`;
                ctx.fillText(person.dates, centerX, yPos);
                yPos += 100;
            } else {
                yPos += 60;
            }
        }
    });
    
    // Legacy text
    const legacyText = document.getElementById('legacyText').value;
    if (legacyText) {
        ctx.font = `italic 32px ${state.font}`;
        const maxWidth = 600;
        const words = legacyText.split(' ');
        let line = '';
        
        words.forEach(word => {
            const testLine = line + word + ' ';
            const metrics = ctx.measureText(testLine);
            if (metrics.width > maxWidth && line !== '') {
                ctx.fillText(line, centerX, yPos);
                line = word + ' ';
                yPos += 50;
            } else {
                line = testLine;
            }
        });
        ctx.fillText(line, centerX, yPos);
        yPos += 50;
    }
    
    // Bottom decoration
    if (state.persons.some(p => p.name) || legacyText) {
        ctx.strokeStyle = state.color;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.arc(centerX, yPos + 50, 40, 0, Math.PI * 2);
        ctx.stroke();
    }
}

// UPDATE PRICE
function updatePrice() {
    let total = state.selectedStone.price;
    if (state.includeTitle) total += 550;
    document.getElementById('totalPrice').textContent = total.toLocaleString('da-DK');
}

// DOWNLOAD DESIGN


function downloadDesign() {
    const canvas = document.getElementById('stoneCanvas');
    const link = document.createElement('a');
    link.download = `gravsten-${state.selectedStone.name.replace(/\s+/g, '-').toLowerCase()}.png`;
    link.href = canvas.toDataURL('image/png');
    link.click();
}


// SAVE TO CART
function saveToCart() {
    const design = {
        stone: state.selectedStone,
        title: state.titleText,
        persons: state.persons,
        legacy: document.getElementById('legacyText').value,
        font: state.font,
        color: state.color,
        totalPrice: state.selectedStone.price + (state.includeTitle ? 550 : 0)
    };
    console.log('Saving to cart:', design);
    alert('✓ Dit design er gemt i kurven!\n\nSten: ' + state.selectedStone.name + '\nTotal: ' + design.totalPrice.toLocaleString('da-DK') + ' DKK');
}

// RESET DESIGN
function resetDesign() {
    if (confirm('Er du sikker på, at du vil nulstille alt?')) {
        location.reload();
    }
}

// TOGGLE HELP POPUP
function toggleHelp() {
    const popup = document.getElementById('helpPopup');
    popup.classList.toggle('active');
}

// Close help popup when clicking outside
document.addEventListener('click', function(e) {
    const popup = document.getElementById('helpPopup');
    const helpBtn = document.querySelector('.help-button');
    if (popup && helpBtn && !popup.contains(e.target) && !helpBtn.contains(e.target)) {
        popup.classList.remove('active');
    }
});


// NAVIGATION PILLS FUNCTIONALITY
function showSection(sectionName) {
    // Hide all sections
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    // Remove active from all pills
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    // Show selected section
    const targetSection = document.getElementById('section-' + sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    // Add active to selected pill
    const targetPill = document.querySelector(`.nav-pill[data-section="${sectionName}"]`);
    if (targetPill) {
        targetPill.classList.add('active');
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);