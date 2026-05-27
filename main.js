document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Custom Cursor
    const cursor = document.getElementById('cursor');
    const hoverables = document.querySelectorAll('.hoverable, a, button:not(.login-btn)');

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    let lastScrollY = 0, targetScroll = 0, currentScroll = 0;

    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        document.addEventListener('mousemove', (e) => {
            cursor.style.visibility = 'visible';
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        function animateCursor() {
            cursorX += (mouseX - cursorX) * 0.4;
            cursorY += (mouseY - cursorY) * 0.4;
            cursor.style.transform = `translate3d(${cursorX}px, ${cursorY}px, 0) translate(-50%, -50%)`;
            requestAnimationFrame(animateCursor);
        }
        animateCursor();

        hoverables.forEach(el => {
            el.addEventListener('mouseenter', () => cursor.classList.add('hover'));
            el.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
        });
    }

    // 2. Global Scroll Logic
    window.addEventListener('scroll', () => {
        targetScroll = window.scrollY;
    });

    function updateGlobalScroll() {
        currentScroll += (targetScroll - currentScroll) * 0.1;

        // 2.1 Horizontal Scroll (On-Track)
        const horizontalContainer = document.getElementById('on-track');
        const horizontalBelt = document.getElementById('horizontal-belt');
        if (horizontalContainer && horizontalBelt) {
            const hTop = horizontalContainer.offsetTop;
            const hHeight = horizontalContainer.offsetHeight;
            const hStart = hTop, hEnd = hTop + hHeight - window.innerHeight;

            if (currentScroll >= hStart && currentScroll <= hEnd) {
                const progress = (currentScroll - hStart) / (hHeight - window.innerHeight);
                const maxT = horizontalBelt.scrollWidth - window.innerWidth;
                horizontalBelt.style.transform = `translateX(${-progress * maxT}px)`;
                horizontalBelt.style.opacity = progress > 0.8 ? 1 - (progress - 0.8) / 0.2 : 1;
            }
        }

        // 2.2 Header Smart Behavior
        const header = document.getElementById('header');
        const promoBar = document.querySelector('.promo-bar');
        if (header) {
            if (currentScroll > lastScrollY && currentScroll > 200) {
                header.classList.add('header-hidden');
                if (promoBar) promoBar.classList.add('header-hidden');
            } else if (currentScroll < lastScrollY) {
                header.classList.remove('header-hidden');
                if (promoBar) promoBar.classList.remove('header-hidden');
            }
            header.classList.toggle('scrolled', currentScroll > 100);
        }


        lastScrollY = currentScroll;
        requestAnimationFrame(updateGlobalScroll);
    }
    updateGlobalScroll();

    // 3. Scroll Reveal Animations
    function initScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });

        document.querySelectorAll('.fade-in-up, .reveal-text').forEach(el => observer.observe(el));

        // Immediate reveal for hero elements
        document.querySelectorAll('.hero .reveal-text, .hero .fade-in-up, .collection-hero .cat-card-new, .section-container .reveal-text, .section-container .fade-in-up').forEach(el => {
            el.classList.add('visible');
        });
    }
    initScrollAnimations();

    // 4. Login & Signup Modal Logic
    const loginModal = document.getElementById('login-modal');
    let signupModal = document.getElementById('signup-modal');
    let loginFormModal = document.getElementById('login-form-modal');

    // Inject signup modal if not present
    if (!signupModal) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="signup-modal">
            <div class="modal-content">
                <button class="modal-close" id="close-signup">&times;</button>
                <h2 class="modal-title">\ud68c\uc6d0\uac00\uc785</h2>
                <form class="modal-form" onsubmit="event.preventDefault(); alert('\ud68c\uc6d0\uac00\uc785\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4!');"> 
                    <div class="form-group">
                        <label for="signup-name">\uc774\ub984</label>
                        <input type="text" id="signup-name" placeholder="\uc774\ub984\uc744 \uc785\ub825\ud558\uc138\uc694" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">\uc774\uba54\uc77c</label>
                        <input type="email" id="signup-email" placeholder="\uc774\uba54\uc77c\uc744 \uc785\ub825\ud558\uc138\uc694" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-password">\ube44\ubc00\ubc88\ud638</label>
                        <input type="password" id="signup-password" placeholder="\ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694" required>
                    </div>
                    <button type="submit" class="modal-submit">\ud68c\uc6d0\uac00\uc785</button>
                </form>
                <div class="modal-footer">
                    \uc774\ubbf8 \uacc4\uc815\uc774 \uc788\uc73c\uc2e0\uac00\uc694? <span class="modal-link" id="go-to-login-form">\ub85c\uadf8\uc778</span>
                </div>
            </div>
        </div>`);
        signupModal = document.getElementById('signup-modal');
    }

    // Inject login form modal if not present
    if (!loginFormModal) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="login-form-modal">
            <div class="modal-content">
                <button class="modal-close" id="close-login-form">&times;</button>
                <h2 class="modal-title">\ub85c\uadf8\uc778</h2>
                <form class="modal-form" onsubmit="event.preventDefault(); alert('\ub85c\uadf8\uc778\uc774 \uc644\ub8cc\ub418\uc5c8\uc2b5\ub2c8\ub2e4!');"> 
                    <div class="form-group">
                        <label for="lf-email">\uc774\uba54\uc77c</label>
                        <input type="email" id="lf-email" placeholder="\uc774\uba54\uc77c\uc744 \uc785\ub825\ud558\uc138\uc694" required>
                    </div>
                    <div class="form-group">
                        <label for="lf-password">\ube44\ubc00\ubc88\ud638</label>
                        <input type="password" id="lf-password" placeholder="\ube44\ubc00\ubc88\ud638\ub97c \uc785\ub825\ud558\uc138\uc694" required>
                    </div>
                    <button type="submit" class="modal-submit">\ub85c\uadf8\uc778</button>
                </form>
                <div class="login-form-social">
                    <p class="login-form-divider">\ub2e4\ub978 \uacc4\uc815\uc73c\ub85c \uacc4\uc18d</p>
                    <div class="login-form-social-icons">
                        <a href="https://www.facebook.com/login" target="_blank" class="lf-social-btn lf-facebook" title="Facebook"><i class="fab fa-facebook-f"></i></a>
                        <a href="https://accounts.google.com/signin" target="_blank" class="lf-social-btn lf-google" title="Google"><i class="fab fa-google"></i></a>
                        <a href="https://appleid.apple.com/" target="_blank" class="lf-social-btn lf-apple" title="Apple"><i class="fab fa-apple"></i></a>
                        <a href="https://v3.account.samsung.com/" target="_blank" class="lf-social-btn lf-samsung" title="Samsung"><span>\uc2ec\uc2dc\uc54a</span><b>S</b></a>
                    </div>
                </div>
                <div class="modal-footer">
                    \uacc4\uc815\uc774 \uc5c6\uc73c\uc2e0\uac00\uc694? <span class="modal-link" id="go-to-signup-from-login">\ud68c\uc6d0\uac00\uc785</span>
                </div>
            </div>
        </div>`);
        loginFormModal = document.getElementById('login-form-modal');
    }

    const openLoginBtns = document.querySelectorAll('#open-login, #promo-open-login');
    const closeLogin = document.getElementById('close-login');
    const closeSignup = document.getElementById('close-signup');
    const closeLoginForm = document.getElementById('close-login-form');
    const goToLoginForm = document.getElementById('go-to-login-form');
    const goToSignupFromLogin = document.getElementById('go-to-signup-from-login');

    const openModal = (modal) => {
        if (!modal) return;
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };
    const closeModal = (modal) => {
        if (!modal) return;
        modal.classList.remove('active');
        document.body.style.overflow = '';
    };

    openLoginBtns.forEach(btn => btn.addEventListener('click', () => openModal(loginModal)));
    if (closeLogin) closeLogin.addEventListener('click', () => closeModal(loginModal));
    if (closeSignup) closeSignup.addEventListener('click', () => closeModal(signupModal));
    if (closeLoginForm) closeLoginForm.addEventListener('click', () => closeModal(loginFormModal));

    // Insiders modal — '회원 가입' button opens signup modal
    document.querySelectorAll('.insiders-btn-primary').forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            setTimeout(() => openModal(signupModal), 300);
        });
    });

    // Insiders modal — '로그인' button opens login form modal
    document.querySelectorAll('.insiders-btn-secondary').forEach(btn => {
        btn.removeAttribute('onclick');
        btn.addEventListener('click', () => {
            closeModal(loginModal);
            setTimeout(() => openModal(loginFormModal), 300);
        });
    });

    // Cross-navigation between modals
    if (goToLoginForm) goToLoginForm.addEventListener('click', () => { closeModal(signupModal); setTimeout(() => openModal(loginFormModal), 300); });
    if (goToSignupFromLogin) goToSignupFromLogin.addEventListener('click', () => { closeModal(loginFormModal); setTimeout(() => openModal(signupModal), 300); });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === signupModal) closeModal(signupModal);
        if (e.target === loginFormModal) closeModal(loginFormModal);
    });

    // 5. Mega Menu Interaction
    const megaMenu = document.getElementById('mega-menu');
    const megaTriggers = document.querySelectorAll('.mega-trigger');
    const megaClose = document.getElementById('close-mega-menu');
    const megaNavBtns = document.querySelectorAll('.mega-nav-btn');
    const megaPanes = document.querySelectorAll('.mega-category-pane');

    const switchMegaCategory = (cat) => {
        megaNavBtns.forEach(btn => btn.classList.toggle('active', btn.dataset.category === cat));
        megaPanes.forEach(pane => pane.classList.toggle('active', pane.id === `mega-pane-${cat}`));
    };

    megaTriggers.forEach(trigger => {
        trigger.addEventListener('click', (e) => {
            e.preventDefault();
            const cat = trigger.dataset.category;
            if (megaMenu.classList.contains('active')) {
                const activeBtn = Array.from(megaNavBtns).find(b => b.classList.contains('active'));
                if (activeBtn && activeBtn.dataset.category === cat) megaMenu.classList.remove('active');
                else switchMegaCategory(cat);
            } else {
                megaMenu.classList.add('active');
                switchMegaCategory(cat);
            }
        });
    });

    if (megaClose) megaClose.addEventListener('click', () => megaMenu.classList.remove('active'));
    megaNavBtns.forEach(btn => btn.addEventListener('click', () => switchMegaCategory(btn.dataset.category)));

    // 6. Lightbox Logic (Universal)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const lightboxClose = document.getElementById('lightbox-close');
    const zoomIcons = document.querySelectorAll('.zoom-icon-v2, .zoom-btn');

    if (lightbox && lightboxImg && lightboxClose) {
        zoomIcons.forEach(icon => {
            icon.addEventListener('click', (e) => {
                e.stopPropagation();
                const card = icon.closest('.gear-item-v2, .gear-card');
                const img = card.querySelector('.brick-hover-image, .hover-img, .brick-img');
                if (img) {
                    lightboxImg.src = img.src;
                    lightbox.classList.add('active');
                    document.body.style.overflow = 'hidden';
                }
            });
        });

        const closeLBox = () => { lightbox.classList.remove('active'); document.body.style.overflow = ''; };
        lightboxClose.addEventListener('click', closeLBox);
        lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLBox(); });
        document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeLBox(); });
    }

    // 7. Promo Bar Carousel
    const promoBar = document.querySelector('.promo-bar');
    if (promoBar) {
        // Structure is now in HTML, just handle logic
        const msgs = promoBar.querySelectorAll('.promo-msg');
        let currentIdx = 0, isTrans = false;

        if (msgs.length > 0) {
            const showMsg = (idx, dir) => {
                if (isTrans || msgs.length === 0) return;
                isTrans = true;

                const prevIdx = currentIdx;
                
                // Prepare incoming (set start position)
                msgs[idx].style.transition = 'none';
                msgs[idx].style.transform = dir === 'next' ? 'translateY(-50%) translateX(100%)' : 'translateY(-50%) translateX(-100%)';
                msgs[idx].style.opacity = '0';
                msgs[idx].classList.add('active');
                
                msgs[idx].offsetHeight; // reflow
                
                msgs[idx].style.transition = '';
                
                // Outgoing
                msgs[prevIdx].style.opacity = '0';
                msgs[prevIdx].style.transform = dir === 'next' ? 'translateY(-50%) translateX(-100%)' : 'translateY(-50%) translateX(100%)';
                
                // Incoming
                msgs[idx].style.opacity = '1';
                msgs[idx].style.transform = 'translateY(-50%) translateX(0)';
                
                setTimeout(() => {
                    msgs[prevIdx].classList.remove('active');
                    currentIdx = idx;
                    isTrans = false;
                }, 600);
            };

            const prev = promoBar.querySelector('#promo-prev'), next = promoBar.querySelector('#promo-next');

            if (prev) prev.addEventListener('click', () => showMsg((currentIdx - 1 + msgs.length) % msgs.length, 'prev'));
            if (next) next.addEventListener('click', () => showMsg((currentIdx + 1) % msgs.length, 'next'));

            setInterval(() => { if (!isTrans) showMsg((currentIdx + 1) % msgs.length, 'next'); }, 5000);
        }
    }

    // Initialize cart badge on load
    if (window.updateCartBadge) {
        window.updateCartBadge();
    }
});

// 8. Global Cart Logic
let _memoryCart = [];
window.getCartItems = function() {
    try {
        const localData = localStorage.getItem('brickmate_cart');
        if (localData) {
            _memoryCart = JSON.parse(localData) || [];
        }
        return _memoryCart;
    } catch(e) {
        return _memoryCart;
    }
};

window.saveCartItems = function(items) {
    _memoryCart = items;
    try {
        localStorage.setItem('brickmate_cart', JSON.stringify(items));
    } catch(e) {
        console.warn("Storage not available, using memory cart cache", e);
    }
    if (window.updateCartBadge) window.updateCartBadge();
};

window.addToCartGlobal = function(name, price, image) {
    let items = window.getCartItems();
    let existing = items.find(item => item.name === name);
    if (existing) {
        existing.quantity += 1;
    } else {
        items.push({
            name: name,
            price: price,
            image: image || 'p1.png',
            quantity: 1
        });
    }
    window.saveCartItems(items);

    // Show toast
    const toast = document.getElementById('cart-toast');
    const toastMsg = document.getElementById('toast-message');
    if (toast && toastMsg) {
        toastMsg.textContent = `🛒 "${name}"이(가) 장바구니에 담겼습니다!`;
        toast.classList.add('show');
        setTimeout(() => {
            toast.classList.remove('show');
        }, 3000);
    }
};

window.updateCartBadge = function() {
    const items = window.getCartItems();
    const totalCount = items.reduce((sum, item) => sum + item.quantity, 0);
    
    // Find all links containing "장바구니"
    const navLinks = document.querySelectorAll('.nav-links a, nav a');
    navLinks.forEach(link => {
        if (link.textContent.trim().startsWith('장바구니')) {
            let badge = link.querySelector('.cart-badge');
            if (totalCount > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'cart-badge';
                    // Style badge
                    badge.style.background = '#ef4444';
                    badge.style.color = '#ffffff';
                    badge.style.fontSize = '0.75rem';
                    badge.style.fontWeight = '700';
                    badge.style.padding = '2px 7px';
                    badge.style.borderRadius = '10px';
                    badge.style.marginLeft = '6px';
                    badge.style.display = 'inline-block';
                    badge.style.verticalAlign = 'middle';
                    badge.style.lineHeight = '1.2';
                    link.appendChild(badge);
                }
                badge.textContent = totalCount;
            } else {
                if (badge) badge.remove();
            }
        }
    });
};

// Universal Overrider: If addToCart is called, automatically scrape price and image from DOM
window.addToCart = function(productName) {
    const cards = document.querySelectorAll('.landmark-card, .gear-card, .product-card, .item');
    let price = "0 원";
    let image = "";
    cards.forEach(card => {
        const nameEl = card.querySelector('.card-name, .gear-name, .product-name, h3, h4');
        if (nameEl && nameEl.textContent.trim().includes(productName)) {
            const priceEl = card.querySelector('.card-price, .gear-price, .product-price, .price');
            if (priceEl) price = priceEl.textContent.trim();
            const imgEl = card.querySelector('.card-image-wrap img, .gear-img-container img, .product-image img, img');
            if (imgEl) image = imgEl.getAttribute('src');
        }
    });

    if (!image) {
        // Simple search for any image with alt matching
        const imgEl = document.querySelector(`img[alt*="${productName}"]`);
        if (imgEl) image = imgEl.getAttribute('src');
    }

    if (window.addToCartGlobal) {
        window.addToCartGlobal(productName, price, image);
    }
};

// 5. Dynamic Client-Side Pagination (Max 9 cards per page)
document.addEventListener('DOMContentLoaded', () => {
    const grids = document.querySelectorAll('.landmark-grid');
    grids.forEach(grid => {
        const cards = Array.from(grid.querySelectorAll('.landmark-card'));
        if (cards.length <= 9) return; // Do nothing if 9 or fewer cards

        const itemsPerPage = 9;
        const totalPages = Math.ceil(cards.length / itemsPerPage);
        let currentPage = 1;

        // Create pagination container
        const paginationContainer = document.createElement('div');
        paginationContainer.className = 'pagination-container';

        // Prev arrow
        const prevArrow = document.createElement('button');
        prevArrow.className = 'page-arrow';
        prevArrow.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';
        prevArrow.disabled = true;

        // Page numbers wrapper
        const pageNumbers = document.createElement('div');
        pageNumbers.className = 'page-numbers';

        // Next arrow
        const nextArrow = document.createElement('button');
        nextArrow.className = 'page-arrow';
        nextArrow.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

        // Render page numbers
        function renderPageNumbers() {
            pageNumbers.innerHTML = '';
            for (let i = 1; i <= totalPages; i++) {
                const pageNum = document.createElement('span');
                pageNum.className = `page-num ${i === currentPage ? 'active' : ''}`;
                pageNum.textContent = i;
                // Add hoverable class for custom cursor compatibility
                pageNum.classList.add('hoverable');
                pageNum.addEventListener('click', () => {
                    goToPage(i);
                });
                pageNumbers.appendChild(pageNum);
            }
        }

        // Show active page cards and hide others
        function displayCards() {
            const startIdx = (currentPage - 1) * itemsPerPage;
            const endIdx = currentPage * itemsPerPage;

            cards.forEach((card, idx) => {
                if (idx >= startIdx && idx < endIdx) {
                    card.style.display = 'flex';
                } else {
                    card.style.display = 'none';
                }
            });

            // Update arrow disabled states
            prevArrow.disabled = (currentPage === 1);
            nextArrow.disabled = (currentPage === totalPages);
        }

        function goToPage(page) {
            if (page < 1 || page > totalPages) return;
            currentPage = page;
            renderPageNumbers();
            displayCards();
            
            // Scroll smoothly to the top of the page
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Arrow click events
        prevArrow.addEventListener('click', () => goToPage(currentPage - 1));
        nextArrow.addEventListener('click', () => goToPage(currentPage + 1));
        
        // Add hoverable class for custom cursor compatibility
        prevArrow.classList.add('hoverable');
        nextArrow.classList.add('hoverable');

        // Assemble and append pagination
        paginationContainer.appendChild(prevArrow);
        paginationContainer.appendChild(pageNumbers);
        paginationContainer.appendChild(nextArrow);

        // Append pagination container after the grid inside the section-container
        const sectionContainer = grid.parentElement;
        if (sectionContainer) {
            sectionContainer.appendChild(paginationContainer);
        }

        // Initial render and display
        renderPageNumbers();
        displayCards();
    });
});


// ─────────────────────────────────────────────
// MOBILE HAMBURGER MENU
// ─────────────────────────────────────────────
(function initMobileMenu() {
    const menuBtn = document.getElementById('mobile-menu-btn');
    const drawer = document.getElementById('mobile-nav-drawer');
    const overlay = document.getElementById('mobile-nav-overlay');
    const closeBtn = document.getElementById('mobile-nav-close');

    if (!menuBtn || !drawer) return;

    function openDrawer() {
        drawer.classList.add('open');
        menuBtn.classList.add('open');
        document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
        drawer.classList.remove('open');
        menuBtn.classList.remove('open');
        document.body.style.overflow = '';
    }

    menuBtn.addEventListener('click', openDrawer);
    if (closeBtn) closeBtn.addEventListener('click', closeDrawer);
    if (overlay) overlay.addEventListener('click', closeDrawer);

    // 서브메뉴 토글
    const subToggles = document.querySelectorAll('.mobile-sub-toggle');
    subToggles.forEach(function(btn) {
        btn.addEventListener('click', function() {
            var targetId = btn.getAttribute('data-target');
            var subMenu = document.getElementById(targetId);
            if (!subMenu) return;
            var isOpen = subMenu.classList.contains('open');
            document.querySelectorAll('.mobile-nav-sub').forEach(function(s) { s.classList.remove('open'); });
            document.querySelectorAll('.mobile-sub-toggle').forEach(function(b) { b.classList.remove('sub-open'); });
            if (!isOpen) {
                subMenu.classList.add('open');
                btn.classList.add('sub-open');
            }
        });
    });

    // ESC 키로 닫기
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') closeDrawer();
    });
})();
