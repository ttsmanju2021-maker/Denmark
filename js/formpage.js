// STONE TYPES DATABASE
const stoneTypes = [
    {
        id: 1,
        name: 'Classic Jet Burnt - A2',
        type: 'Vizag Blue',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#2c3e50', '#34495e', '#1a252f'],
        thumbnail: 'img/u1.jpg'
    },
    {
        id: 2,
        name: 'Classic Jet Burnt - A2',
        type: 'Viscont White',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#95a5a6', '#bdc3c7', '#7f8c8d'],
        thumbnail: 'img/z1.jpg'
    },
    {
        id: 3,
        name: 'Classic Polished - D2',
        type: 'Viscont White',
        dimensions: '80 x 60 x 12 cm',
        price: 10950,
        colors: ['#ecf0f1', '#bdc3c7', '#95a5a6'],
        thumbnail: 'img/z2.jpg'
    },
    {
        id: 4,
        name: 'Classic Granite',
        type: 'Red Multicolor',
        dimensions: '80 x 60 x 12 cm',
        price: 11950,
        colors: ['#8b4513', '#a0522d', '#6b3410'],
        thumbnail: 'img/z5.jpg'
    },
    {
        id: 5,
        name: 'Premium Black',
        type: 'Absolute Black',
        dimensions: '80 x 60 x 12 cm',
        price: 12950,
        colors: ['#1a1a1a', '#2d2d2d', '#0a0a0a'],
        thumbnail: 'img/z7.jpg'
    }
];

// DECORATION DATABASE WITH SVG/IMAGE PATHS
const decorationTypes = {
    'rose': { 
        name: 'Rose', 
        price: 850,
        image: 'https://cdn-icons-png.flaticon.com/512/2972/2972185.png'
    },
    'cross': { 
        name: 'Cross', 
        price: 750,
        image: 'https://cdn-icons-png.flaticon.com/512/2026/2026296.png'
    },
    'dove': { 
        name: 'Dove', 
        price: 850,
        image: 'https://cdn-icons-png.flaticon.com/512/2913/2913133.png'
    },
    'heart': { 
        name: 'Heart', 
        price: 650,
        image: 'https://cdn-icons-png.flaticon.com/512/833/833472.png'
    },
    'angel': { 
        name: 'Angel', 
        price: 950,
        image: 'https://cdn-icons-png.flaticon.com/512/2917/2917995.png'
    },
    'flower': { 
        name: 'Flower', 
        price: 750,
        image: 'https://cdn-icons-png.flaticon.com/512/1202/1202926.png'
    },
    'anchor': { 
        name: 'Anchor', 
        price: 650,
        image: 'https://cdn-icons-png.flaticon.com/512/2865/2865506.png'
    },
    'butterfly': { 
        name: 'Butterfly', 
        price: 750,
        image: 'https://cdn-icons-png.flaticon.com/512/3209/3209186.png'
    }
};

// STATE
let state = {
    selectedStone: stoneTypes[0],
    includeTitle: false,
    titleText: '',
    persons: [],
    legacyText: '',
    font: 'Cinzel',
    color: '#d4af37',
    textOffsetX: 0,
    textOffsetY: 0,
    decorations: []
};

// DRAGGING STATE FOR TEXT
let isDragging = false;
let dragStartX = 0;
let dragStartY = 0;
let initialOffsetX = 0;
let initialOffsetY = 0;

// DRAGGING STATE FOR DECORATIONS
let draggingDecoration = null;
let decorationDragStartX = 0;
let decorationDragStartY = 0;
let decorationInitialX = 0;
let decorationInitialY = 0;

// Loaded images cache
const loadedImages = {};

// INITIALIZE
function init() {
    renderStoneList();
    renderDecorationList();
    addPerson();
    updatePreview();
    updatePrice();
    setupCanvasDragging();
    preloadDecorationImages();
}

// PRELOAD DECORATION IMAGES
function preloadDecorationImages() {
    Object.keys(decorationTypes).forEach(key => {
        const img = new Image();
        img.crossOrigin = "anonymous";
        img.src = decorationTypes[key].image;
        img.onload = () => {
            loadedImages[key] = img;
        };
    });
}

// RENDER DECORATION LIST
function renderDecorationList() {
    const container = document.getElementById('decorationList');
    container.innerHTML = Object.keys(decorationTypes).map(key => {
        const dec = decorationTypes[key];
        return `
            <div class="decoration-item" onclick="addDecoration('${key}')">
                <div class="decoration-icon">
                    <img src="${dec.image}" alt="${dec.name}" crossorigin="anonymous">
                </div>
                <div class="decoration-name">${dec.name}</div>
                <div class="decoration-price">+${dec.price} DKK</div>
            </div>
        `;
    }).join('');
}

// SETUP CANVAS DRAGGING
function setupCanvasDragging() {
    const canvas = document.getElementById('stoneCanvas');
    
    canvas.addEventListener('mousedown', handleDragStart);
    canvas.addEventListener('mousemove', handleDragMove);
    canvas.addEventListener('mouseup', handleDragEnd);
    canvas.addEventListener('mouseleave', handleDragEnd);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', handleDragEnd);
}

function getCanvasCoordinates(e, canvas) {
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    
    let clientX, clientY;
    if (e.touches && e.touches.length > 0) {
        clientX = e.touches[0].clientX;
        clientY = e.touches[0].clientY;
    } else {
        clientX = e.clientX;
        clientY = e.clientY;
    }
    
    return {
        x: (clientX - rect.left) * scaleX,
        y: (clientY - rect.top) * scaleY
    };
}

function handleDragStart(e) {
    const canvas = document.getElementById('stoneCanvas');
    const coords = getCanvasCoordinates(e, canvas);
    
    // Check if clicking on a decoration
    for (let i = state.decorations.length - 1; i >= 0; i--) {
        const dec = state.decorations[i];
        const distance = Math.sqrt(Math.pow(coords.x - dec.x, 2) + Math.pow(coords.y - dec.y, 2));
        
        if (distance < dec.size / 2) {
            draggingDecoration = dec;
            decorationDragStartX = coords.x;
            decorationDragStartY = coords.y;
            decorationInitialX = dec.x;
            decorationInitialY = dec.y;
            return;
        }
    }
    
    // If not on decoration, drag text
    isDragging = true;
    dragStartX = e.clientX;
    dragStartY = e.clientY;
    initialOffsetX = state.textOffsetX;
    initialOffsetY = state.textOffsetY;
}

function handleTouchStart(e) {
    if (e.touches.length === 1) {
        const canvas = document.getElementById('stoneCanvas');
        const coords = getCanvasCoordinates(e, canvas);
        
        // Check if clicking on a decoration
        for (let i = state.decorations.length - 1; i >= 0; i--) {
            const dec = state.decorations[i];
            const distance = Math.sqrt(Math.pow(coords.x - dec.x, 2) + Math.pow(coords.y - dec.y, 2));
            
            if (distance < dec.size / 2) {
                draggingDecoration = dec;
                decorationDragStartX = coords.x;
                decorationDragStartY = coords.y;
                decorationInitialX = dec.x;
                decorationInitialY = dec.y;
                e.preventDefault();
                return;
            }
        }
        
        // If not on decoration, drag text
        isDragging = true;
        dragStartX = e.touches[0].clientX;
        dragStartY = e.touches[0].clientY;
        initialOffsetX = state.textOffsetX;
        initialOffsetY = state.textOffsetY;
        e.preventDefault();
    }
}

function handleDragMove(e) {
    if (draggingDecoration) {
        const canvas = document.getElementById('stoneCanvas');
        const coords = getCanvasCoordinates(e, canvas);
        
        const deltaX = coords.x - decorationDragStartX;
        const deltaY = coords.y - decorationDragStartY;
        
        draggingDecoration.x = decorationInitialX + deltaX;
        draggingDecoration.y = decorationInitialY + deltaY;
        
        updatePreview();
        return;
    }
    
    if (!isDragging) return;
    
    const deltaX = e.clientX - dragStartX;
    const deltaY = e.clientY - dragStartY;
    
    state.textOffsetX = initialOffsetX + deltaX;
    state.textOffsetY = initialOffsetY + deltaY;
    
    updatePreview();
}

function handleTouchMove(e) {
    if (draggingDecoration) {
        const canvas = document.getElementById('stoneCanvas');
        const coords = getCanvasCoordinates(e, canvas);
        
        const deltaX = coords.x - decorationDragStartX;
        const deltaY = coords.y - decorationDragStartY;
        
        draggingDecoration.x = decorationInitialX + deltaX;
        draggingDecoration.y = decorationInitialY + deltaY;
        
        updatePreview();
        e.preventDefault();
        return;
    }
    
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
    draggingDecoration = null;
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
            <img src="${stone.thumbnail}" alt="${stone.name}" class="stone-thumbnail" crossorigin="anonymous">
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
        <input type="text" placeholder="e.g. Jens Nielsen" oninput="updatePersonName(${index}, this.value)">
        <label>Dates</label>
        <input type="text" placeholder="e.g. 1940 - 2023" oninput="updatePersonDates(${index}, this.value)">
        ${index > 0 ? `<button class="remove-person" onclick="removePerson(${index})">Remove person</button>` : ''}
    `;
    container.appendChild(personDiv);
}

// REMOVE PERSON
function removePerson(index) {
    state.persons.splice(index, 1);
    const container = document.getElementById('personsContainer');
    container.innerHTML = '';
    state.persons.forEach((person, i) => {
        const personDiv = document.createElement('div');
        personDiv.className = 'person-entry';
        personDiv.innerHTML = `
            <label>Name</label>
            <input type="text" value="${person.name}" placeholder="e.g. Jens Nielsen" oninput="updatePersonName(${i}, this.value)">
            <label>Dates</label>
            <input type="text" value="${person.dates}" placeholder="e.g. 1940 - 2023" oninput="updatePersonDates(${i}, this.value)">
            ${i > 0 ? `<button class="remove-person" onclick="removePerson(${i})">Remove person</button>` : ''}
        `;
        container.appendChild(personDiv);
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

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const stoneImg = new Image();
    stoneImg.crossOrigin = "anonymous";

    stoneImg.onload = function () {
        ctx.drawImage(stoneImg, 0, 0, canvas.width, canvas.height);
        
        // Add overlay for better contrast
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        renderText(ctx);
    };

    stoneImg.onerror = function () {
        // Fallback gradient
        const colors = state.selectedStone.colors || ['#999', '#777', '#555'];
        const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
        gradient.addColorStop(0, colors[1]);
        gradient.addColorStop(0.5, colors[0]);
        gradient.addColorStop(1, colors[2]);
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        // Add texture
        ctx.fillStyle = 'rgba(255,255,255,0.02)';
        for (let i = 0; i < 2000; i++) {
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                Math.random() * 3,
                Math.random() * 3
            );
        }

        renderText(ctx);
    };

    stoneImg.src = state.selectedStone.thumbnail;
}

// RENDER TEXT ON CANVAS
function renderText(ctx) {
    ctx.fillStyle = state.color;
    ctx.textAlign = 'center';
    
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)';
    ctx.shadowBlur = 10;
    ctx.shadowOffsetX = 2;
    ctx.shadowOffsetY = 2;
    
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
    }
    
    // Render decorations
    renderDecorations(ctx);
}

// RENDER DECORATIONS ON CANVAS
function renderDecorations(ctx) {
    state.decorations.forEach(dec => {
        const img = loadedImages[dec.type];
        if (!img || !img.complete) return;
        
        ctx.save();
        ctx.translate(dec.x, dec.y);
        ctx.rotate((dec.rotation * Math.PI) / 180);
        
        if (dec.mirrored) {
            ctx.scale(-1, 1);
        }
        
        // Apply color tint
        ctx.globalAlpha = 1;
        ctx.drawImage(img, -dec.size/2, -dec.size/2, dec.size, dec.size);
        
        // Color overlay
        if (dec.color !== '#ffffff') {
            ctx.globalCompositeOperation = 'multiply';
            ctx.fillStyle = dec.color;
            ctx.fillRect(-dec.size/2, -dec.size/2, dec.size, dec.size);
            ctx.globalCompositeOperation = 'destination-in';
            ctx.drawImage(img, -dec.size/2, -dec.size/2, dec.size, dec.size);
            ctx.globalCompositeOperation = 'source-over';
        }
        
        ctx.restore();
    });
}

// UPDATE PRICE
function updatePrice() {
    let total = state.selectedStone.price;
    if (state.includeTitle) total += 550;
    
    state.decorations.forEach(dec => {
        total += decorationTypes[dec.type].price;
    });
    
    document.getElementById('totalPrice').textContent = total.toLocaleString('da-DK');
}

// ADD DECORATION
function addDecoration(type) {
    const decoration = {
        id: Date.now(),
        type: type,
        x: 750,
        y: 400,
        rotation: 0,
        mirrored: false,
        color: '#ffffff',
        size: 100
    };
    
    state.decorations.push(decoration);
    updateActiveDecorations();
    updatePrice();
    updatePreview();
}

// REMOVE DECORATION
function removeDecoration(id) {
    state.decorations = state.decorations.filter(dec => dec.id !== id);
    updateActiveDecorations();
    updatePrice();
    updatePreview();
}

// ROTATE DECORATION
function rotateDecoration(id) {
    const dec = state.decorations.find(d => d.id === id);
    if (dec) {
        dec.rotation = (dec.rotation + 45) % 360;
        updatePreview();
    }
}

// MIRROR DECORATION
function mirrorDecoration(id) {
    const dec = state.decorations.find(d => d.id === id);
    if (dec) {
        dec.mirrored = !dec.mirrored;
        updatePreview();
    }
}

// CHANGE DECORATION COLOR
function changeDecorationColor(id, color) {
    const dec = state.decorations.find(d => d.id === id);
    if (dec) {
        dec.color = color;
        updatePreview();
    }
}

// UPDATE ACTIVE DECORATIONS LIST
function updateActiveDecorations() {
    const container = document.getElementById('activeDecorations');
    if (state.decorations.length === 0) {
        container.innerHTML = '';
        return;
    }
    
    container.innerHTML = '<h4 style="margin-bottom: 10px; color: var(--stone-dark); font-size: 0.95rem;">Active Decorations (Drag on stone to move):</h4>';
    
    state.decorations.forEach(dec => {
        const info = decorationTypes[dec.type];
        const div = document.createElement('div');
        div.className = 'active-decoration';
        div.innerHTML = `
            <div>
                <img src="${info.image}" style="width: 30px; height: 30px; margin-right: 10px; vertical-align: middle;" crossorigin="anonymous">
                <strong>${info.name}</strong>
            </div>
            <div class="active-decoration-controls">
                <button class="decoration-control-btn" onclick="rotateDecoration(${dec.id})" title="Rotate">
                    <span class="material-icons" style="font-size: 18px;">rotate_right</span>
                </button>
                <button class="decoration-control-btn" onclick="mirrorDecoration(${dec.id})" title="Mirror">
                    <span class="material-icons" style="font-size: 18px;">flip</span>
                </button>
                <input type="color" value="${dec.color}" onchange="changeDecorationColor(${dec.id}, this.value)" 
                       style="width: 30px; height: 30px; border: 1px solid #ddd; border-radius: 4px; cursor: pointer;" 
                       title="Change color">
                <button class="decoration-control-btn remove" onclick="removeDecoration(${dec.id})" title="Remove">
                    <span class="material-icons" style="font-size: 18px;">delete</span>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
}

// DOWNLOAD DESIGN - FIXED VERSION
function downloadDesign() {
    const canvas = document.getElementById('stoneCanvas');
    
    // Create a temporary canvas to ensure proper rendering
    const tempCanvas = document.createElement('canvas');
    tempCanvas.width = canvas.width;
    tempCanvas.height = canvas.height;
    const tempCtx = tempCanvas.getContext('2d');
    
    // Copy current canvas content
    tempCtx.drawImage(canvas, 0, 0);
    
    // Convert to blob and download
    tempCanvas.toBlob(function(blob) {
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        const fileName = `gravestone-design-${state.selectedStone.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.png`;
        link.download = fileName;
        link.href = url;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }, 'image/png', 1.0);
}

// SAVE TO CART
function saveToCart() {
    let totalPrice = state.selectedStone.price;
    if (state.includeTitle) totalPrice += 550;
    state.decorations.forEach(dec => {
        totalPrice += decorationTypes[dec.type].price;
    });
    
    const design = {
        stone: state.selectedStone,
        title: state.titleText,
        persons: state.persons,
        legacy: document.getElementById('legacyText').value,
        font: state.font,
        color: state.color,
        decorations: state.decorations,
        totalPrice: totalPrice
    };
    
    console.log('Saving to cart:', design);
    
    let message = '✓ Your design has been saved to cart!\n\n';
    message += 'Stone: ' + state.selectedStone.name + '\n';
    if (state.decorations.length > 0) {
        message += 'Decorations: ' + state.decorations.length + '\n';
    }
    message += 'Total: ' + totalPrice.toLocaleString('da-DK') + ' DKK';
    
    alert(message);
}

// RESET DESIGN
function resetDesign() {
    if (confirm('Are you sure you want to reset everything?')) {
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
    document.querySelectorAll('.section-content').forEach(section => {
        section.classList.remove('active');
    });
    
    document.querySelectorAll('.nav-pill').forEach(pill => {
        pill.classList.remove('active');
    });
    
    const targetSection = document.getElementById('section-' + sectionName);
    if (targetSection) {
        targetSection.classList.add('active');
    }
    
    const targetPill = document.querySelector(`.nav-pill[data-section="${sectionName}"]`);
    if (targetPill) {
        targetPill.classList.add('active');
    }
}

// Initialize on load
window.addEventListener('DOMContentLoaded', init);