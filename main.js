document.addEventListener('DOMContentLoaded', () => {
    // 1. Smooth Custom Cursor
    const cursor = document.getElementById('cursor');
    const hoverables = document.querySelectorAll('.hoverable, a, button:not(.login-btn)');

    let mouseX = 0, mouseY = 0, cursorX = 0, cursorY = 0;
    let lastScrollY = 0, targetScroll = 0, currentScroll = 0;

    if (cursor && window.matchMedia("(pointer: fine)").matches) {
        cursor.style.visibility = 'visible';
        document.addEventListener('mousemove', (e) => {
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

        if (msgs.length === 0) return;

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
});
