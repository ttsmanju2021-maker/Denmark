
        // GENERATE PARTICLES
        function createParticles() {
            const container = document.getElementById('particles');
            for (let i = 0; i < 30; i++) {
                const particle = document.createElement('div');
                particle.className = 'particle';
                particle.style.left = Math.random() * 100 + '%';
                particle.style.animationDelay = Math.random() * 15 + 's';
                particle.style.animationDuration = (Math.random() * 10 + 10) + 's';
                container.appendChild(particle);
            }
        }
        

        // CART DATA
        let cartItems = [
            {
                id: 1,
                name: 'Classic Jet Burnt - A2',
                type: 'Vizag Blue',
                dimensions: '80 x 60 x 12 cm',
                price: 10950,
                quantity: 1,
                image: 'assets/img/u1.jpg',
                features: {
                    'Titel': 'Bagermester',
                    'Navn': 'Jens Nielsen',
                    'Tekst': 'Elsket og savnet',
                    'Skrifttype': 'Cinzel',
                    'Farve': 'Guld'
                }
            },
            {
                id: 2,
                name: 'Classic Polished - D2',
                type: 'Viscont White',
                dimensions: '80 x 60 x 12 cm',
                price: 10950,
                quantity: 1,
                 image: 'assets/img/z1.jpg',
                features: {
                    'Navn': 'Anna Petersen',
                    'Skrifttype': 'Playfair',
                    'Farve': 'Sølv'
                }
            }
        ];

        // RENDER CART
        function renderCart() {
            const container = document.getElementById('cartItems');
            
            container.innerHTML = cartItems.map((item, index) => `
                <div class="cart-card">
                    <div class="cart-item">
                        <div class="item-image-container">
                            <img src="${item.image}" alt="${item.name}" class="item-image">
                            <div class="image-overlay"></div>
                        </div>
                        
                        <div class="item-details">
                            <div class="item-title">${item.name}</div>
                            <div class="item-specs">
                                <div class="spec-row">
                                    <span class="material-icons">category</span>
                                    <span>${item.type}</span>
                                </div>
                                <div class="spec-row">
                                    <span class="material-icons">straighten</span>
                                    <span>Dimensioner: ${item.dimensions}</span>
                                </div>
                            </div>

                            <div class="quantity-control">
                                <button class="qty-btn" onclick="updateQuantity(${index}, -1)">
                                    <span class="material-icons">remove</span>
                                </button>
                                <span class="qty-value">${item.quantity}</span>
                                <button class="qty-btn" onclick="updateQuantity(${index}, 1)">
                                    <span class="material-icons">add</span>
                                </button>
                            </div>

                            <div class="item-features">
                                ${Object.entries(item.features).map(([key, value]) => `
                                    <div class="feature-item">
                                        <span>${key}:</span>
                                        <span>${value}</span>
                                    </div>
                                `).join('')}
                            </div>
                        </div>

                        <div class="item-actions">
                            <div class="item-price">${(item.price * item.quantity).toLocaleString('da-DK')} DKK</div>
                            <button class="action-btn btn-edit" onclick="editItem(${index})">
                                <span class="material-icons">edit</span>
                                <span>Edit</span>
                            </button>
                            <button class="action-btn btn-download" onclick="downloadItem(${index})">
                                <span class="material-icons">download</span>
                                <span>Download</span>
                            </button>
                            <button class="action-btn btn-remove" onclick="removeItem(${index})">
                                <span class="material-icons">delete</span>
                                <span>Delete</span>
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');

            updateSummary();
        }

        // UPDATE SUMMARY
        function updateSummary() {
            const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
            const vat = Math.round(subtotal * 0.25);
            const total = subtotal + vat;

            document.getElementById('subtotal').textContent = subtotal.toLocaleString('da-DK');
            document.getElementById('vat').textContent = vat.toLocaleString('da-DK');
            document.getElementById('total').textContent = total.toLocaleString('da-DK');
            document.getElementById('itemCount').textContent = cartItems.length;
        }

        // UPDATE QUANTITY
        function updateQuantity(index, change) {
            cartItems[index].quantity = Math.max(1, cartItems[index].quantity + change);
            renderCart();
        }

        // REMOVE ITEM
        function removeItem(index) {
            if (confirm('Er du sikker på, at du vil deletee dette produkt?')) {
                cartItems.splice(index, 1);
                renderCart();
            }
        }

        // EDIT ITEM
        function editItem(index) {
            alert('Åbner design editor for: ' + cartItems[index].name);
        }

        // DOWNLOAD ITEM
        function downloadItem(index) {
            alert('Downloader design for: ' + cartItems[index].name);
        }

        // APPLY PROMO
        function applyPromo() {
            const code = document.getElementById('promoCode').value;
            if (code) {
                alert('Rabatkode "' + code + '" anvendt!');
            }
        }

        // CHECKOUT
        function checkout() {
            alert('Går til betalingsside...\nTotal: ' + document.getElementById('total').textContent + ' DKK');
        }

        // GO BACK
        function goBack() {
            window.history.back();
        }

        // INITIALIZE
        window.addEventListener('DOMContentLoaded', () => {
            createParticles();
            renderCart();
        });
    