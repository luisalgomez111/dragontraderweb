document.addEventListener('DOMContentLoaded', () => {

    // CONFIGURACIÓN: Credenciales para el Bot de Telegram que recibe los pedidos
    const TELEGRAM_BOT_TOKEN = "8796470455:AAERiu88kfYyEGZP4OLyIq_nWF5G-Vbwgk4";
    const TELEGRAM_CHAT_ID = "-5228386743";

    // BASE DE DATOS DE PRODUCTOS: Lista de imágenes, nombres y precios (actualmente en 0.00)
    const products = [
        { imgSrc: "Guantes de spa para mascotas.jpeg", name: "Guantes de Spa para Mascotas", price: 0.00 },
        { imgSrc: "bolsas para mascotas.jpeg", name: "Bolsas para Mascotas", price: 0.00 },
        { imgSrc: "botella de agua portatil para mascotas.jpeg", name: "Botella de Agua Portátil para Mascotas", price: 0.00 },
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

    // REFERENCIAS AL DOM: Captura de elementos para interactuar con HTML
    const catalogGrid = document.getElementById('catalog-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalAddCartBtn = document.getElementById('modal-add-cart');
    const closeBtn = document.querySelector('.close-btn');

    // Elementos del Carrito
    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const closeCart = document.querySelector('.close-cart');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalCount = document.getElementById('cart-total-count');
    const checkoutForm = document.getElementById('checkout-form');
    const checkoutBtn = document.getElementById('checkout-btn');

    // Entradas de Datos del Cliente
    const custName = document.getElementById('cust-name');
    const custPhone = document.getElementById('cust-phone');
    const custEmail = document.getElementById('cust-email');
    const custAddress = document.getElementById('cust-address');

    // ESTADO DE LA APLICACIÓN: Datos volátiles que cambian durante la sesión
    let cart = []; // Almacena los productos añadidos
    let currentModalProduct = null; // Producto seleccionado para el modal

    // RENDERIZADO DINÁMICO: Crea las tarjetas de productos a partir del array 'products'
    products.forEach((product, index) => {
        const productId = `prod-${index}`;
        const productName = product.name;
        const productPrice = product.price;

        // Crear contenedor de la tarjeta
        const card = document.createElement('div');
        card.className = 'product-card';

        // Contenedor de imagen
        const imgContainer = document.createElement('div');
        imgContainer.className = 'card-img-container';

        // Elemento imagen con carga diferida (lazy loading)
        const img = document.createElement('img');
        img.src = `assets/img/${product.imgSrc}`;
        img.alt = productName;
        img.className = 'product-img';
        img.loading = "lazy";

        // Div de información y botón de añadir
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
            e.stopPropagation(); // Evita abrir el modal al pulsar el botón
            addToCart({ id: productId, name: productName, imgSrc: product.imgSrc, price: productPrice });
        };

        infoDiv.appendChild(topDiv);
        infoDiv.appendChild(addBtn);

        // Ensamblar tarjeta y añadir al grid
        imgContainer.appendChild(img);
        card.appendChild(imgContainer);
        card.appendChild(infoDiv);
        catalogGrid.appendChild(card);

        // Evento para abrir el modal al hacer clic en la imagen
        imgContainer.addEventListener('click', () => {
            currentModalProduct = { id: productId, name: productName, imgSrc: product.imgSrc, price: productPrice };
            openModal(product.imgSrc, productName, productPrice);
        });
    });

    // FUNCIONES DEL MODAL: Para visualizar productos en detalle
    function openModal(imgSrc, title, price) {
        modalImg.src = `assets/img/${imgSrc}`;
        modalCaption.textContent = `${title} - $${price.toFixed(2)}`;
        modal.classList.add('show');
        document.body.style.overflow = 'hidden'; // Bloquea el scroll del fondo
    }

    function closeModal() {
        modal.classList.remove('show');
        setTimeout(() => { modalImg.src = ''; }, 300); // Limpia la imagen tras la animación
        document.body.style.overflow = 'auto'; // Restaura el scroll
    }

    modalAddCartBtn.addEventListener('click', () => {
        if (currentModalProduct) addToCart(currentModalProduct);
        closeModal();
    });

    closeBtn.addEventListener('click', closeModal);
    modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) closeModal();
    });

    // --- LÓGICA DEL CARRITO ---

    // Añade un producto al estado 'cart' y actualiza la UI
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            cart.push({ ...product, quantity: 1 });
        }
        updateCartUI();

        // Pequeña animación de salto en el botón flotante
        cartBtn.style.transform = 'scale(1.2)';
        setTimeout(() => { cartBtn.style.transform = 'scale(1)'; }, 200);
    }

    // Elimina un producto completamente del carrito
    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    // Ajusta la cantidad de un item (+1 o -1)
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

    // Sincroniza el estado del carrito con el HTML visible
    function updateCartUI() {
        // Cálculo de totales
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

        cartCount.textContent = totalItems;
        cartTotalCount.textContent = totalItems;

        const cartTotalPrice = document.getElementById('cart-total-price');
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        }

        // Bloquea el botón de envío si el carrito está vacío
        checkoutBtn.disabled = cart.length === 0;

        // Renderizado de items en el sidebar
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

    // Manejadores de eventos para los botones dinámicos del carrito
    document.addEventListener('updateQty', (e) => updateQuantity(e.detail.id, e.detail.d));
    document.addEventListener('removeCartItem', (e) => removeFromCart(e.detail));

    // Funciones para abrir y cerrar el sidebar del carrito
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

    // --- INTEGRACIÓN CON TELEGRAM (CHECKOUT) ---
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

        // CONSTRUCCIÓN DEL MENSAJE: Formateo amigable para el dueño de la tienda
        let messageText = `*NUEVO PEDIDO DE DRAGON TRADER*\n\n`;
        messageText += `*Cliente:* ${name}\n`;
        messageText += `*Teléfono:* ${phone}\n`;
        messageText += `*Email:* ${email}\n`;
        messageText += `*Dirección:* ${custAddress.value.trim()}\n\n`;
        messageText += `*Productos:*\n`;

        cart.forEach(item => {
            messageText += `- ${item.quantity}x ${item.name} ($${item.price.toFixed(2)} c/u) = $${(item.price * item.quantity).toFixed(2)}\n`;
        });

        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        messageText += `\n*Unidades Totales:* ${cartCount.textContent}\n`;
        messageText += `*Precio Total:* $${totalPrice.toFixed(2)}\n`;

        // Feedback visual en el botón durante el envío
        const originalBtnText = checkoutBtn.textContent;
        checkoutBtn.textContent = 'Enviando Pedido...';
        checkoutBtn.disabled = true;

        try {
            // Envío real a la API de Telegram
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
                alert('✅ ¡Pedido enviado con éxito! Nos pondremos en contacto contigo muy pronto para confirmar disponibilidad y pago.');
                cart = [];
                updateCartUI();
                closeCartSidebar();
            } else {
                throw new Error('Error al conectar con la API de Telegram');
            }
        } catch (error) {
            console.error('Error enviando a Telegram:', error);
            alert('❌ Hubo un error al procesar tu pedido. Por favor, intenta de nuevo más tarde o verifica tu conexión.');
        } finally {
            checkoutBtn.textContent = originalBtnText;
            checkoutBtn.disabled = false;
        }
    });

    // --- ANIMACIÓN DE TEXTO DINÁMICO (TYPEWRITER) ---
    // Simula una máquina de escribir cambiando frases en la portada.
    const dynamicText = document.getElementById('dynamic-text');
    const words = [
        "China - Venezuela",
        "Seguridad Total",
        "Confianza Plena",
        "Calidad Garantizada",
        "Envíos Seguros"
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let typeSpeed = 100;

    function type() {
        const currentWord = words[wordIndex];

        if (isDeleting) {
            dynamicText.textContent = currentWord.substring(0, charIndex - 1);
            charIndex--;
            typeSpeed = 50;
        } else {
            dynamicText.textContent = currentWord.substring(0, charIndex + 1);
            charIndex++;
            typeSpeed = 100;
        }

        // Lógica de transición entre escribir y borrar
        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000; // Espera en la palabra completa
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500); // Inicia tras la carga de la página

    // SEGUIMIENTO DE SCROLL: Resalta la sección activa en el menú de navegación
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
