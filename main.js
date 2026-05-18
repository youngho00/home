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

    if (!signupModal && loginModal) {
        document.body.insertAdjacentHTML('beforeend', `
        <div class="modal-overlay" id="signup-modal">
            <div class="modal-content">
                <button class="modal-close" id="close-signup">&times;</button>
                <h2 class="modal-title">회원가입</h2>
                <form class="modal-form">
                    <div class="form-group">
                        <label for="signup-name">이름</label>
                        <input type="text" id="signup-name" placeholder="이름을 입력하세요" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-email">이메일</label>
                        <input type="email" id="signup-email" placeholder="이메일을 입력하세요" required>
                    </div>
                    <div class="form-group">
                        <label for="signup-password">비밀번호</label>
                        <input type="password" id="signup-password" placeholder="비밀번호를 입력하세요" required>
                    </div>
                    <button type="submit" class="modal-submit" style="margin-top: 10px;">회원가입</button>
                </form>
                <div class="modal-footer">
                    이미 계정이 있으신가요? <span class="modal-link" id="go-to-login">로그인</span>
                </div>
            </div>
        </div>`);
        signupModal = document.getElementById('signup-modal');
    }

    const openLoginBtns = document.querySelectorAll('#open-login, #promo-open-login');
    const closeLogin = document.getElementById('close-login');
    const closeSignup = document.getElementById('close-signup');
    const goToSignup = document.getElementById('go-to-signup');
    const goToLogin = document.getElementById('go-to-login');

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
    
    if (goToSignup) goToSignup.addEventListener('click', () => { closeModal(loginModal); setTimeout(() => openModal(signupModal), 300); });
    if (goToLogin) goToLogin.addEventListener('click', () => { closeModal(signupModal); setTimeout(() => openModal(loginModal), 300); });

    window.addEventListener('click', (e) => {
        if (e.target === loginModal) closeModal(loginModal);
        if (e.target === signupModal) closeModal(signupModal);
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
