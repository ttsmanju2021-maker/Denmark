        // TOGGLE CART PREVIEW
        function toggleCartPreview() {
            const preview = document.getElementById('cartPreview');
            preview.classList.toggle('active');
        }

        // CLOSE PREVIEW WHEN CLICKING OUTSIDE
        document.addEventListener('click', function (e) {
            const container = document.querySelector('.cart-icon-container');
            const preview = document.getElementById('cartPreview');
            if (!container.contains(e.target) && preview.classList.contains('active')) {
                preview.classList.remove('active');
            }
        });

        // GO TO CART PAGE
        function goToCart() {
            // In production, use your actual cart page URL
            window.location.href = 'cartpage.html';
            // Or open in new artifact:
            // alert('Opening cart page...');
        }

        // ADD TO CART DEMO
        function addToCartDemo() {
            // Update badge
            const badge = document.getElementById('cartBadge');
            let count = parseInt(badge.textContent);
            badge.textContent = count + 1;

            // Animate badge
            badge.style.animation = 'none';
            setTimeout(() => {
                badge.style.animation = 'badgePop 0.5s cubic-bezier(0.4, 0, 0.2, 1)';
            }, 10);

            // Show notification
            const notification = document.getElementById('cartNotification');
            notification.classList.add('show');
            setTimeout(() => {
                notification.classList.remove('show');
            }, 3000);
        }

        // CART STATE MANAGEMENT
        let cartState = {
            items: [
                {
                    id: 1,
                    name: 'Classic Jet Burnt - A2',
                    type: 'Vizag Blue',
                    price: 10950,
                    image: 'https://images.unsplash.com/photo-1611348524140-53c9a25263d6?w=60&h=70&fit=crop'
                },
                {
                    id: 2,
                    name: 'Classic Polished - D2',
                    type: 'Viscont White',
                    price: 10950,
                    image: 'https://images.unsplash.com/photo-1563804165-eae4850e46b4?w=60&h=70&fit=crop'
                }
            ]
        };

        // UPDATE CART COUNT
        function updateCartCount() {
            document.getElementById('cartBadge').textContent = cartState.items.length;
        }
   