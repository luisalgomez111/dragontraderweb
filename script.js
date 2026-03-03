document.addEventListener('DOMContentLoaded', () => {

    // Config: Tu usuario de Telegram
    const TELEGRAM_USER = "LuisAlGomez";

    // Array with all the provided image filenames
    const productImages = [
        "0.jpeg", "1.jpeg", "2.jpeg", "3.jpeg", "4.jpeg",
        "5.jpeg", "6.jpeg", "7.jpeg", "8.jpg", "9.jpg",
        "10.jpg", "11.jpg", "12.jpg"
    ];

    const catalogGrid = document.getElementById('catalog-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalAddCartBtn = document.getElementById('modal-add-cart');
    const closeBtn = document.querySelector('.close-btn');

    // Cart Elements
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalCount = document.getElementById('cart-total-count');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Customer Inputs
    const custName = document.getElementById('cust-name');
    const custPhone = document.getElementById('cust-phone');
    const custEmail = document.getElementById('cust-email');

    // Cart State
    let cart = [];
    let currentModalProduct = null;

    // Dynamically create product cards
    productImages.forEach((imgSrc, index) => {
        const productId = `prod-${index}`;
        const productName = `Producto ${index + 1}`;

        // Create card container
        const card = document.createElement('div');
        card.className = 'product-card';

        // Card Image Container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';

        // Image element
        const img = document.createElement('img');
        img.src = `assets/img/${imgSrc}`;
        img.alt = productName;
        img.className = 'product-img';
        img.loading = "lazy";

        // Product Info and Add button
        const infoDiv = document.createElement('div');
        infoDiv.className = 'card-info';

        const title = document.createElement('h3');
        title.textContent = productName;

        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.textContent = 'Agregar';
        addBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent opening modal
            addToCart({ id: productId, name: productName, imgSrc: imgSrc });
        };

        infoDiv.appendChild(title);
        infoDiv.appendChild(addBtn);

        // Assemble card
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(infoDiv);

        // Add to grid
        catalogGrid.appendChild(card);

        // Click event on image to open modal
        imgContainer.addEventListener('click', () => {
            currentModalProduct = { id: productId, name: productName, imgSrc: imgSrc };
            openModal(imgSrc, productName);
        });
    });

    // Modal Functions
    function openModal(imgSrc, title) {
        modalImg.src = `assets/img/${imgSrc}`;
        modalCaption.textContent = title;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => {
            modalImg.src = '';
        }, 300);
        document.body.style.overflow = 'auto';
    }

    modalAddCartBtn.addEventListener('click', () => {
        if (currentModalProduct) addToCart(currentModalProduct);
        closeModal();
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => {
        if (e.target === modal) closeModal();
    });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });

    // --- Cart Functions ---

    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();

        // Small animation on cart button
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 200);
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            item.quantity += delta;
            if (item.quantity <= 0) {
                removeFromCart(productId);
            } else {
                updateCartUI();
            }
        }
    }

    function updateCartUI() {
        // Update counts
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
        cartTotalCount.textContent = totalItems;

        // Enable/disable checkout
        checkoutBtn.disabled = cart.length === 0;

        // Render items
        cartItemsContainer.innerHTML = '';
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = '<p class="empty-cart-msg">Tu carrito está vacío.</p>';
            return;
        }

        cart.forEach(item => {
            const itemElement = document.createElement('div');
            itemElement.className = 'cart-item';
            itemElement.innerHTML = `
                <img src="assets/img/${item.imgSrc}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4>${item.name}</h4>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="document.dispatchEvent(new CustomEvent('updateQty', {detail: {id: '${item.id}', d: -1}}))">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="document.dispatchEvent(new CustomEvent('updateQty', {detail: {id: '${item.id}', d: 1}}))">+</button>
                    </div>
                </div>
                <button class="cart-item-remove" onclick="document.dispatchEvent(new CustomEvent('removeCartItem', {detail: '${item.id}'}))">Quitar</button>
            `;
            cartItemsContainer.appendChild(itemElement);
        });
    }

    // Global listeners for inline onclick events in dynamic HTML
    document.addEventListener('updateQty', (e) => updateQuantity(e.detail.id, e.detail.d));
    document.addEventListener('removeCartItem', (e) => removeFromCart(e.detail));

    // Cart UI Toggles
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = 'auto';
    }

    cartBtn.addEventListener('click', openCart);
    closeCart.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);

    // --- Telegram Checkout ---
    checkoutForm.addEventListener('submit', (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const name = custName.value.trim();
        const phone = custPhone.value.trim();
        const email = custEmail.value.trim();

        if (!name || !phone || !email) {
            alert('Por favor completa todos tus datos antes de hacer el pedido.');
            return;
        }

        let message = `Hola, soy ${name}.\n`;
        message += `Mi teléfono es: ${phone}\n`;
        message += `Mi correo es: ${email}\n\n`;
        message += "Estoy interesado en comprar los siguientes productos del catálogo de Dragon Trader:\n\n";

        cart.forEach(item => {
            message += `- ${item.quantity}x ${item.name}\n`;
        });

        message += `\nTotal de unidades: ${cartCount.textContent}\n`;
        message += "¿Podrían indicarme el precio total y los métodos de pago/envío disponibles?";

        const encodedMessage = encodeURIComponent(message);

        // Standard Telegram link
        const telegramUrl = `https://t.me/${TELEGRAM_USER}?text=${encodedMessage}`;

        window.open(telegramUrl, '_blank');
    });

    // Active nav
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('nav ul li a');
    window.addEventListener('scroll', () => {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            if (scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').includes(current)) {
                link.classList.add('active');
            }
        });
    });
});
