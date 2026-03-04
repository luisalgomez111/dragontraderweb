document.addEventListener('DOMContentLoaded', () => {

    // Config: Tu enlace directo de WhatsApp
    const WHATSAPP_LINK = "https://wa.me/qr/EAQCS6O2STTOD1"; // Enlace QR proporcionado

    // Config: Telegram Bot (Reemplaza con tus credenciales de Telegram)
    const TELEGRAM_BOT_TOKEN = "8796470455:AAERiu88kfYyEGZP4OLyIq_nWF5G-Vbwgk4"; // EJEMPLO: 7123456789:AAGY...
    const TELEGRAM_CHAT_ID = "8796470455";     // EJEMPLO: 1029384756

    // Array with all the products (image, name, and price)
    const products = [
        { imgSrc: "Guantes de spa para mascotas.jpeg", name: "Guantes de Spa para Mascotas", price: 0.00 },
        { imgSrc: "bolsas para mascotas.jpeg", name: "Bolsas para Mascotas", price: 0.00 },
        { imgSrc: "botella de agua portatil para mascotas.jpeg", name: "Botella de Agua Portátil para Mascotas", price: 0.00 },
        { imgSrc: "collar para perro.jpeg", name: "Collar para Perro", price: 0.00 },
        { imgSrc: "collar para perro.jpg", name: "Collar para Perro (Variante)", price: 0.00 },
        { imgSrc: "collar para perros de colores.jpg", name: "Collar para Perros de Colores", price: 0.00 },
        { imgSrc: "correa para perro de colores.jpg", name: "Correa para Perro de Colores", price: 0.00 },
        { imgSrc: "correa para perro doco.jpg", name: "Correa para Perro Doco", price: 0.00 },
        { imgSrc: "entrenador de mascotas.jpeg", name: "Entrenador de Mascotas", price: 0.00 },
        { imgSrc: "pechera para perro doco vertex.jpg", name: "Pechera para Perro Doco Vertex", price: 0.00 },
        { imgSrc: "pechera para perro.jpeg", name: "Pechera para Perro", price: 0.00 },
        { imgSrc: "tapetes antiestres.jpeg", name: "Tapetes Antiestrés", price: 0.00 },
        { imgSrc: "toallitas antibacterianas para mascotas.jpeg", name: "Toallitas Antibacterianas para Mascotas", price: 0.00 }
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
    products.forEach((product, index) => {
        const productId = `prod-${index}`;
        const productName = product.name;
        const productPrice = product.price;

        // Create card container
        const card = document.createElement('div');
        card.className = 'product-card';

        // Card Image Container
        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';

        // Image element
        const img = document.createElement('img');
        img.src = `assets/img/${product.imgSrc}`;
        img.alt = productName;
        img.className = 'product-img';
        img.loading = "lazy";

        // Product Info and Add button
        const infoDiv = document.createElement('div');
        infoDiv.className = 'card-info';

        const topDiv = document.createElement('div');
        topDiv.className = 'card-info-top';

        const title = document.createElement('h3');
        title.textContent = productName;

        const priceEl = document.createElement('div');
        priceEl.className = 'product-price';
        priceEl.textContent = `$${productPrice.toFixed(2)}`;

        topDiv.appendChild(title);
        topDiv.appendChild(priceEl);

        const addBtn = document.createElement('button');
        addBtn.className = 'add-btn';
        addBtn.textContent = 'Agregar al Carrito';
        addBtn.onclick = (e) => {
            e.stopPropagation(); // Prevent opening modal
            addToCart({ id: productId, name: productName, imgSrc: product.imgSrc, price: productPrice });
        };

        infoDiv.appendChild(topDiv);
        infoDiv.appendChild(addBtn);

        // Assemble card
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(infoDiv);

        // Add to grid
        catalogGrid.appendChild(card);

        // Click event on image to open modal
        imgContainer.addEventListener('click', () => {
            currentModalProduct = { id: productId, name: productName, imgSrc: product.imgSrc, price: productPrice };
            openModal(product.imgSrc, productName, productPrice);
        });
    });

    // Modal Functions
    function openModal(imgSrc, title, price) {
        modalImg.src = `assets/img/${imgSrc}`;
        modalCaption.textContent = `${title} - $${price.toFixed(2)}`;
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
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCount.textContent = totalItems;
        cartTotalCount.textContent = totalItems;

        const cartTotalPrice = document.getElementById('cart-total-price');
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        }

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
                    <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="document.dispatchEvent(new CustomEvent('updateQty', {detail: {id: '${item.id}', d: -1}}))">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="document.dispatchEvent(new CustomEvent('updateQty', {detail: {id: '${item.id}', d: 1}}))">+</button>
                    </div>
                </div>
                <div class="cart-item-right" style="display:flex; flex-direction:column; align-items:flex-end; gap:8px;">
                    <p class="cart-item-subtotal" style="font-weight:bold; color:var(--primary-color);">$${(item.price * item.quantity).toFixed(2)}</p>
                    <button class="cart-item-remove" style="margin-left:0;" onclick="document.dispatchEvent(new CustomEvent('removeCartItem', {detail: '${item.id}'}))">Quitar</button>
                </div>
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
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        if (cart.length === 0) return;

        const name = custName.value.trim();
        const phone = custPhone.value.trim();
        const email = custEmail.value.trim();

        if (!name || !phone || !email) {
            alert('Por favor completa todos tus datos antes de hacer el pedido.');
            return;
        }

        // Construir mensaje amigable en formato Markdown para Telegram
        let messageText = `🆕 *NUEVO PEDIDO DE DRAGON TRADER*\n\n`;
        messageText += `👤 *Cliente:* ${name}\n`;
        messageText += `📞 *Teléfono:* ${phone}\n`;
        messageText += `📧 *Email:* ${email}\n\n`;
        messageText += `🛒 *Productos:*\n`;

        cart.forEach(item => {
            messageText += `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)} c/u) = $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        messageText += `\n📦 *Unidades Totales:* ${cartCount.textContent}\n`;
        messageText += `💰 *Precio Total:* $${totalPrice.toFixed(2)}\n`;

        // Si el usuario no ha configurado el Bot aún, usar WhatsApp de respaldo
        if (TELEGRAM_BOT_TOKEN === "TU_BOT_TOKEN_AQUI" || TELEGRAM_CHAT_ID === "TU_CHAT_ID_AQUI") {
            // Revertimos automáticamente a WhatsApp si no hemos cambiado las constantes
            alert("⚠️ El Bot de Telegram aún no está configurado.\n\nSerás redirigido a enviar el pedido manualmente por WhatsApp por ahora.");
            let wpMessage = `Hola, soy ${name}.\nMi teléfono es: ${phone}\nMi correo es: ${email}\n\nEstoy interesado en comprar:\n\n`;
            cart.forEach(item => {
                wpMessage += `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)} c/u)\n`;
            });
            wpMessage += `\nTotal estimado: $${totalPrice.toFixed(2)}`;
            const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(wpMessage)}`;
            window.open(whatsappUrl, '_blank');
            return;
        }

        // Cambiar estado del botón
        const originalBtnText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Enviando Pedido...';
        checkoutBtn.disabled = true;

        try {
            // Petición HTTP a la API de Telegram (invisible para el cliente)
            const response = await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    chat_id: TELEGRAM_CHAT_ID,
                    text: messageText,
                    parse_mode: 'Markdown'
                })
            });

            if (response.ok) {
                // Éxito: limpiar carrito y notificar cliente
                alert('✅ ¡Pedido enviado con éxito! Nos pondremos en contacto contigo muy pronto para confirmar disponibilidad y pago.');
                cart = [];
                updateCartUI();
                closeCartSidebar();
            } else {
                throw new Error('Error al conectar con la API de Telegram');
            }
        } catch (error) {
            // Si la conexión a Telegram falla por alguna razón (ej. no hay internet), intentar llevar a WhatsApp
            console.error('Error enviando a Telegram:', error);
            alert('❌ Hubo un error al enviar tu pedido por el sistema interno. Te redirigiremos a WhatsApp.');
            let wpMessage = `Hola, intenté hacer el pedido automáticamente pero hubo un error. Soy ${name}. Quería pedir mercancía por $${totalPrice.toFixed(2)}`;
            const whatsappUrl = `${WHATSAPP_LINK}?text=${encodeURIComponent(wpMessage)}`;
            window.open(whatsappUrl, '_blank');
        } finally {
            // Restaurar botón al final
            checkoutBtn.textContent = originalBtnText;
            checkoutBtn.disabled = false;
        }
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
