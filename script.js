/**
 * Dragon Trader - Premium Catalog JavaScript
 * Modern, interactive functionality with Telegram integration
 */

document.addEventListener('DOMContentLoaded', () => {
    // ============================================
    // CONFIGURATION
    // ============================================
    const TELEGRAM_BOT_TOKEN = "8796470455:AAERiu88kfYyEGZP4OLyIq_nWF5G-Vbwgk4";
    const TELEGRAM_CHAT_ID = "-5228386743";

    // ============================================
    // PRODUCT DATA
    // ============================================
    const groupedProducts = [
        {
            id: "sig-nylon-collar",
            name: "Signature Nylon Collar",
            category: "collar",
            variants: [
                { id: "sig-nylon-collar-xs", size: "XS", price: 2.30, stock: 43, code: "DCSN002" },
                { id: "sig-nylon-collar-s", size: "S", price: 2.70, stock: 1, code: "DCSN002" },
                { id: "sig-nylon-collar-m", size: "M", price: 3.80, stock: 45, code: "DCSN002" },
                { id: "sig-nylon-collar-l", size: "L", price: 4.20, stock: 49, code: "DCSN002" },
                { id: "sig-nylon-collar-xl", size: "XL", price: 4.90, stock: 42, code: "DCSN002" }
            ]
        },
        {
            id: "sig-nylon-leash",
            name: "Signature Nylon Dog Leash",
            category: "leash",
            variants: [
                { id: "sig-nylon-leash-s", size: "S", price: 3.10, stock: 44, code: "DCSN1048 (4ft)" },
                { id: "sig-nylon-leash-xl", size: "XL", price: 4.80, stock: 39, code: "DCSN1048 (4ft)" }
            ]
        },
        {
            id: "doco-loco-leash",
            name: "DOCO® LOCO Leash - 5ft",
            category: "leash",
            variants: [
                { id: "doco-loco-leash-s", size: "S", price: 3.70, stock: 79, code: "DCL1060" },
                { id: "doco-loco-leash-m", size: "M", price: 4.40, stock: 80, code: "DCL1060" }
            ]
        },
        {
            id: "doco-super-conf",
            name: "DOCO® Super Confortable",
            category: "harness",
            variants: [
                { id: "doco-super-conf-xs", size: "XS", price: 8.53, stock: 34, code: "DCA313" },
                { id: "doco-super-conf-s", size: "S", price: 8.81, stock: 16, code: "DCA313" },
                { id: "doco-super-conf-m", size: "M", price: 9.52, stock: 18, code: "DCA313" },
                { id: "doco-super-conf-l", size: "L", price: 10.83, stock: 13, code: "DCA313" },
                { id: "doco-super-conf-xl", size: "XL", price: 12.33, stock: 17, code: "DCA313" }
            ]
        },
        {
            id: "vario-power",
            name: "VARIO Power Harness",
            category: "harness",
            variants: [
                { id: "vario-power-xs", size: "XS", price: 7.80, stock: 17, code: "DVX1" },
                { id: "vario-power-s", size: "S", price: 8.10, stock: 14, code: "DVX1" },
                { id: "vario-power-m", size: "M", price: 9.30, stock: 11, code: "DVX1" },
                { id: "vario-power-l", size: "L", price: 9.90, stock: 16, code: "DVX1" },
                { id: "vario-power-xl", size: "XL", price: 12.10, stock: 12, code: "DVX1" }
            ]
        },
        {
            id: "doco-licking-mats",
            name: "Licking Mats for Dogs and Cats",
            category: "accessory",
            variants: [
                { id: "doco-licking-mats-u", size: "Única", price: 3.90, stock: 50, code: "X1X1" }
            ]
        }
    ];

    // ============================================
    // STATE
    // ============================================
    let cart = [];
    let currentModalProduct = null;
    let selectedVariant = null;
    let currentFilter = 'all';

    // ============================================
    // DOM ELEMENTS
    // ============================================
    const catalogGrid = document.getElementById('catalog-grid');
    const modal = document.getElementById('image-modal');
    const modalImg = document.getElementById('modal-img');
    const modalTitle = document.getElementById('modal-title');
    const modalCategory = document.getElementById('modal-category');
    const modalPrice = document.getElementById('modal-price');
    const modalVariants = document.getElementById('modal-variants');
    const modalStockInfo = document.getElementById('modal-stock-info');
    const modalAddCartBtn = document.getElementById('modal-add-cart');
    const modalClose = document.querySelector('.modal-close');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    const cartBtn = document.getElementById('cart-btn');
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartClose = document.querySelector('.cart-close');
    const cartOverlay = document.getElementById('cart-overlay');
    const cartItemsContainer = document.getElementById('cart-items');
    const cartCount = document.getElementById('cart-count');
    const cartTotalCount = document.getElementById('cart-total-count');
    const cartTotalPrice = document.getElementById('cart-total-price');

    const checkoutForm = document.getElementById('checkout-form');
    const checkoutBtn = document.getElementById('checkout-btn');

    const toast = document.getElementById('toast');

    // ============================================
    // INITIALIZE AOS ANIMATIONS
    // ============================================
    AOS.init({
        duration: 800,
        once: true,
        offset: 100
    });

    // ============================================
    // HEADER SCROLL EFFECT
    // ============================================
    const header = document.getElementById('header');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ============================================
    // MOBILE MENU
    // ============================================
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileMenuClose = document.getElementById('mobile-menu-close');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    mobileMenuBtn.addEventListener('click', () => {
        mobileMenu.classList.add('open');
        document.body.style.overflow = 'hidden';
    });

    mobileMenuClose.addEventListener('click', closeMobileMenu);

    mobileNavLinks.forEach(link => {
        link.addEventListener('click', closeMobileMenu);
    });

    function closeMobileMenu() {
        mobileMenu.classList.remove('open');
        document.body.style.overflow = '';
    }

    // ============================================
    // PARTICLES ANIMATION
    // ============================================
    const canvas = document.getElementById('particles-canvas');
    const ctx = canvas.getContext('2d');
    let particles = [];
    let animationId = null;

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function createParticles() {
        particles = [];
        const particleCount = Math.min(50, Math.floor((canvas.width * canvas.height) / 15000));
        
        for (let i = 0; i < particleCount; i++) {
            particles.push({
                x: Math.random() * canvas.width,
                y: Math.random() * canvas.height,
                vx: (Math.random() - 0.5) * 0.5,
                vy: (Math.random() - 0.5) * 0.5,
                radius: Math.random() * 2 + 1,
                opacity: Math.random() * 0.5 + 0.2
            });
        }
    }

    function drawParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        particles.forEach((particle, i) => {
            // Update position
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Wrap around edges
            if (particle.x < 0) particle.x = canvas.width;
            if (particle.x > canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = canvas.height;
            if (particle.y > canvas.height) particle.y = 0;
            
            // Draw particle
            ctx.beginPath();
            ctx.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(212, 175, 55, ${particle.opacity})`;
            ctx.fill();
            
            // Draw connections
            particles.slice(i + 1).forEach(other => {
                const dx = particle.x - other.x;
                const dy = particle.y - other.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                
                if (distance < 100) {
                    ctx.beginPath();
                    ctx.moveTo(particle.x, particle.y);
                    ctx.lineTo(other.x, other.y);
                    ctx.strokeStyle = `rgba(212, 175, 55, ${0.1 * (1 - distance / 100)})`;
                    ctx.stroke();
                }
            });
        });
        
        animationId = requestAnimationFrame(drawParticles);
    }

    // Initialize particles
    resizeCanvas();
    createParticles();
    drawParticles();

    window.addEventListener('resize', () => {
        resizeCanvas();
        createParticles();
    });

    // ============================================
    // TYPEWRITER EFFECT
    // ============================================
    const dynamicText = document.getElementById('dynamic-text');
    const words = ["China", "Calidad", "Confianza", "Seguridad", "Excelencia"];
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

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            typeSpeed = 2000;
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            typeSpeed = 500;
        }

        setTimeout(type, typeSpeed);
    }

    setTimeout(type, 1500);

    // ============================================
    // RENDER PRODUCTS
    // ============================================
    function getCategoryLabel(category) {
        const labels = {
            'collar': 'Collar',
            'leash': 'Correa',
            'harness': 'Pechera',
            'accessory': 'Accesorio'
        };
        return labels[category] || 'Producto';
    }

    function renderProducts() {
        catalogGrid.innerHTML = '';
        
        groupedProducts.forEach((product, index) => {
            // Calculate price range
            const prices = product.variants.map(v => v.price);
            const minPrice = Math.min(...prices);
            const maxPrice = Math.max(...prices);
            const priceDisplay = minPrice === maxPrice 
                ? `$${minPrice.toFixed(2)}` 
                : `$${minPrice.toFixed(2)} - $${maxPrice.toFixed(2)}`;
            
            // Calculate total stock
            const totalStock = product.variants.reduce((sum, v) => sum + v.stock, 0);
            const isLowStock = totalStock < 20;
            
            // Create card
            const card = document.createElement('div');
            card.className = 'product-card';
            card.dataset.category = product.category;
            card.setAttribute('data-aos', 'fade-up');
            card.setAttribute('data-aos-delay', (index % 4) * 100);
            
            card.innerHTML = `
                <div class="card-image-wrapper">
                    <img src="assets/img/${product.variants[0].code}.webp" alt="${product.name}" class="product-img" loading="lazy">
                    <div class="card-overlay">
                        <button class="quick-view-btn">Ver detalles</button>
                    </div>
                    <div class="stock-badge ${isLowStock ? 'low' : ''}">
                        <i class="fa-solid fa-box"></i>
                        <span>${totalStock} disp.</span>
                    </div>
                </div>
                <div class="card-content">
                    <span class="card-category">${getCategoryLabel(product.category)}</span>
                    <h3 class="card-title">${product.name}</h3>
                    <div class="card-footer">
                        <span class="card-price">${priceDisplay}</span>
                        <button class="card-btn" aria-label="Agregar al carrito">
                            <i class="fa-solid fa-plus"></i>
                        </button>
                    </div>
                </div>
            `;
            
            // Click events
            card.querySelector('.card-image-wrapper').addEventListener('click', () => {
                openModal(product);
            });
            
            card.querySelector('.card-btn').addEventListener('click', (e) => {
                e.stopPropagation();
                openModal(product);
            });
            
            catalogGrid.appendChild(card);
        });
    }

    renderProducts();

    // ============================================
    // FILTER PRODUCTS
    // ============================================
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const filter = btn.dataset.filter;
            currentFilter = filter;
            
            // Update active state
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            // Filter cards
            const cards = document.querySelectorAll('.product-card');
            cards.forEach(card => {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.classList.remove('hidden');
                } else {
                    card.classList.add('hidden');
                }
            });
        });
    });

    // ============================================
    // MODAL FUNCTIONS
    // ============================================
    function openModal(product) {
        currentModalProduct = product;
        selectedVariant = null;
        
        modalImg.src = `assets/img/${product.variants[0].code}.webp`;
        modalTitle.textContent = product.name;
        modalCategory.textContent = getCategoryLabel(product.category);
        modalPrice.textContent = 'Selecciona una opción';
        
        // Render variants
        modalVariants.innerHTML = '';
        product.variants.forEach(variant => {
            const btn = document.createElement('button');
            btn.className = 'variant-btn';
            btn.textContent = variant.size;
            
            if (variant.stock <= 0) {
                btn.disabled = true;
                btn.innerHTML = `${variant.size} <small>(Agotado)</small>`;
            }
            
            btn.addEventListener('click', () => {
                document.querySelectorAll('.variant-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                selectVariant(variant);
            });
            
            modalVariants.appendChild(btn);
        });
        
        // Reset add button
        modalAddCartBtn.disabled = true;
        modalAddCartBtn.innerHTML = `
            <i class="fa-solid fa-cart-plus"></i>
            <span>Selecciona una opción</span>
        `;
        
        modalStockInfo.innerHTML = `
            <i class="fa-solid fa-box"></i>
            <span>${product.variants.reduce((sum, v) => sum + v.stock, 0)} unidades en stock</span>
        `;
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function selectVariant(variant) {
        selectedVariant = variant;
        modalPrice.textContent = `$${variant.price.toFixed(2)}`;
        modalStockInfo.innerHTML = `
            <i class="fa-solid fa-box"></i>
            <span>${variant.stock} unidades disponibles</span>
        `;
        modalAddCartBtn.disabled = false;
        modalAddCartBtn.innerHTML = `
            <i class="fa-solid fa-cart-plus"></i>
            <span>Agregar al carrito</span>
        `;
    }

    function closeModal() {
        modal.classList.remove('show');
        document.body.style.overflow = '';
        setTimeout(() => {
            modalImg.src = '';
        }, 300);
    }

    modalClose.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.classList.contains('show')) {
            closeModal();
        }
    });

    modalAddCartBtn.addEventListener('click', () => {
        if (currentModalProduct && selectedVariant) {
            addToCart({
                id: selectedVariant.id,
                name: `${currentModalProduct.name} (${selectedVariant.size})`,
                price: selectedVariant.price,
                stock: selectedVariant.stock,
                code: selectedVariant.code
            });
            closeModal();
            showToast('¡Producto agregado!', 'Se añadió al carrito correctamente');
        }
    });

    // ============================================
    // CART FUNCTIONS
    // ============================================
    function addToCart(product) {
        const existingItem = cart.find(item => item.id === product.id);
        
        if (existingItem) {
            if (existingItem.quantity < product.stock) {
                existingItem.quantity += 1;
            } else {
                showToast('Stock limitado', `Solo hay ${product.stock} unidades disponibles`, 'warning');
                return;
            }
        } else {
            if (product.stock > 0) {
                cart.push({ ...product, quantity: 1 });
            } else {
                showToast('Producto agotado', 'Este producto no tiene stock disponible', 'error');
                return;
            }
        }
        
        updateCartUI();
        animateCartButton();
    }

    function removeFromCart(productId) {
        cart = cart.filter(item => item.id !== productId);
        updateCartUI();
    }

    function updateQuantity(productId, delta) {
        const item = cart.find(i => i.id === productId);
        if (item) {
            const newQuantity = item.quantity + delta;
            if (newQuantity <= 0) {
                removeFromCart(productId);
            } else if (newQuantity <= item.stock) {
                item.quantity = newQuantity;
                updateCartUI();
            } else {
                showToast('Stock limitado', `Solo hay ${item.stock} unidades disponibles`, 'warning');
            }
        }
    }

    function updateCartUI() {
        // Calculate totals
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Update counters
        cartCount.textContent = totalItems;
        cartTotalCount.textContent = totalItems;
        if (cartTotalPrice) {
            cartTotalPrice.textContent = `$${totalPrice.toFixed(2)}`;
        }
        
        // Enable/disable checkout button
        checkoutBtn.disabled = cart.length === 0;
        
        // Render cart items
        cartItemsContainer.innerHTML = '';
        
        if (cart.length === 0) {
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <div class="empty-cart-icon">
                        <i class="fa-solid fa-cart-arrow-down"></i>
                    </div>
                    <p>Tu carrito está vacío</p>
                    <span>Agrega productos para comenzar</span>
                </div>
            `;
            return;
        }
        
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <img src="assets/img/${item.code}.webp" alt="${item.name}">
                </div>
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-code">Cod: ${item.code}</p>
                    <p class="cart-item-price">$${item.price.toFixed(2)} c/u</p>
                </div>
                <div class="cart-item-actions">
                    <p class="cart-item-subtotal">$${(item.price * item.quantity).toFixed(2)}</p>
                    <div class="quantity-control">
                        <button class="qty-btn" data-action="decrease" data-id="${item.id}">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" data-action="increase" data-id="${item.id}">+</button>
                    </div>
                    <button class="cart-item-remove" data-id="${item.id}">Quitar</button>
                </div>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        // Add event listeners to cart item buttons
        cartItemsContainer.querySelectorAll('.qty-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const id = btn.dataset.id;
                const action = btn.dataset.action;
                updateQuantity(id, action === 'increase' ? 1 : -1);
            });
        });
        
        cartItemsContainer.querySelectorAll('.cart-item-remove').forEach(btn => {
            btn.addEventListener('click', () => {
                removeFromCart(btn.dataset.id);
            });
        });
    }

    function animateCartButton() {
        cartBtn.querySelector('.cart-btn-inner').style.transform = 'scale(1.2)';
        setTimeout(() => {
            cartBtn.querySelector('.cart-btn-inner').style.transform = 'scale(1)';
        }, 200);
    }

    // ============================================
    // CART SIDEBAR
    // ============================================
    function openCart() {
        cartSidebar.classList.add('open');
        cartOverlay.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    function closeCartSidebar() {
        cartSidebar.classList.remove('open');
        cartOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    cartBtn.addEventListener('click', openCart);
    cartClose.addEventListener('click', closeCartSidebar);
    cartOverlay.addEventListener('click', closeCartSidebar);

    // ============================================
    // TOAST NOTIFICATION
    // ============================================
    function showToast(title, message, type = 'success') {
        const toastIcon = toast.querySelector('.toast-icon i');
        
        if (type === 'success') {
            toastIcon.className = 'fa-solid fa-check-circle';
            toastIcon.parentElement.style.background = 'rgba(16, 185, 129, 0.1)';
            toastIcon.style.color = 'var(--color-success)';
        } else if (type === 'warning') {
            toastIcon.className = 'fa-solid fa-exclamation-circle';
            toastIcon.parentElement.style.background = 'rgba(245, 158, 11, 0.1)';
            toastIcon.style.color = 'var(--color-warning)';
        } else if (type === 'error') {
            toastIcon.className = 'fa-solid fa-times-circle';
            toastIcon.parentElement.style.background = 'rgba(239, 68, 68, 0.1)';
            toastIcon.style.color = 'var(--color-error)';
        }
        
        toast.querySelector('.toast-title').textContent = title;
        toast.querySelector('.toast-message').textContent = message;
        
        toast.classList.add('show');
        
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }

    // ============================================
    // CHECKOUT - TELEGRAM INTEGRATION
    // ============================================
    checkoutForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        if (cart.length === 0) return;
        
        const name = document.getElementById('cust-name').value.trim();
        const phone = document.getElementById('cust-phone').value.trim();
        const email = document.getElementById('cust-email').value.trim();
        const address = document.getElementById('cust-address').value.trim();
        
        if (!name || !phone || !email || !address) {
            showToast('Datos incompletos', 'Por favor completa todos los campos', 'warning');
            return;
        }
        
        // Build message
        let messageText = `🛍️ *NUEVO PEDIDO - DRAGON TRADER*\n\n`;
        messageText += `👤 *Cliente:* ${name}\n`;
        messageText += `📞 *Teléfono:* ${phone}\n`;
        messageText += `📧 *Email:* ${email}\n`;
        messageText += `📍 *Dirección:* ${address}\n\n`;
        messageText += `📦 *Productos:*\n`;
        
        cart.forEach(item => {
            messageText += `• ${item.quantity}x [${item.code}] ${item.name} - $${item.price.toFixed(2)} c/u = $${(item.price * item.quantity).toFixed(2)}\n`;
        });
        
        const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        messageText += `\n📊 *Resumen:*\n`;
        messageText += `• Items totales: ${cart.reduce((sum, item) => sum + item.quantity, 0)}\n`;
        messageText += `• Total: $${totalPrice.toFixed(2)}\n`;
        
        // Update button state
        const originalText = checkoutBtn.innerHTML;
        checkoutBtn.disabled = true;
        checkoutBtn.innerHTML = `
            <i class="fa-solid fa-spinner fa-spin"></i>
            <span>Enviando...</span>
        `;
        
        try {
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
                showToast('¡Pedido enviado!', 'Nos pondremos en contacto contigo pronto');
                cart = [];
                updateCartUI();
                closeCartSidebar();
                checkoutForm.reset();
            } else {
                throw new Error('Error en la respuesta de Telegram');
            }
        } catch (error) {
            console.error('Error sending to Telegram:', error);
            showToast('Error al enviar', 'Por favor intenta de nuevo más tarde', 'error');
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.innerHTML = originalText;
        }
    });

    // ============================================
    // SMOOTH SCROLL FOR NAV LINKS
    // ============================================
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ============================================
    // ACTIVE NAV LINK ON SCROLL
    // ============================================
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link');
    
    window.addEventListener('scroll', () => {
        let current = '';
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollY >= sectionTop - 200) {
                current = section.getAttribute('id');
            }
        });
        
        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${current}`) {
                link.classList.add('active');
            }
        });
    });

    // ============================================
    // INITIALIZE CART UI
    // ============================================
    updateCartUI();
});
