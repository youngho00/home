$files = Get-ChildItem -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    # 1. Clean up
    $content = $content -replace '(?s)<div class="promo-bar">.*?</div>', ''
    $content = $content -replace '(?s)<header id="header".*?</header>', ''
    $content = $content -replace '(?s)<div class="custom-cursor" id="cursor"></div>', ''
    $content = $content -replace '(?s)<div class="mega-menu-overlay"[\s\S]*?<div class="lightbox-overlay"[\s\S]*?<\/div>', ''
    $content = $content -replace '(?s)<div class="modal-overlay" id="login-modal">[\s\S]*?<div class="modal-overlay" id="signup-modal">[\s\S]*?<\/div>\s*<\/div>', ''
    $content = $content -replace '(?s)<div class="modal-overlay" id="login-modal">[\s\S]*?<\/div>\s*<div class="modal-overlay" id="signup-modal">[\s\S]*?<\/div>', ''

    # 2. Category
    $activeCat = ""
    if ($file.Name -match "about|news|partnership") { $activeCat = "brand" }
    elseif ($file.Name -match "series|age|price|new|exclusive|deals|coming-soon|last-chance") { $activeCat = "products" }
    elseif ($file.Name -match "order|shipping|assembly|faq|contact|bricks") { $activeCat = "support" }
    
    $b = if ($activeCat -eq "brand") { "active" } else { "" }
    $p = if ($activeCat -eq "products") { "active" } else { "" }
    $s = if ($activeCat -eq "support") { "active" } else { "" }

    # 3. Snippets (Using literals now, it's safer than my bad hex math)
    $promoBar = @"
    <div class="promo-bar">
        <button class="playzone-btn hoverable" onclick="location.href='playzone.html'">PLAY존</button>
        <div class="promo-bar-content">
            <button class="promo-arrow" id="promo-prev">&lt;</button>
            <div class="promo-bar-inner">
                <span class="promo-msg active">6만원 이상 주문시 무료 배송!</span>
                <span class="promo-msg">할인 및 행사중 지금 구매해 보세요.</span>
                <span class="promo-msg">신제품을 한번 둘러보세요.</span>
                <span class="promo-msg">지금 당장 단종 예정 제품을 구매해 보세요.</span>
            </div>
            <button class="promo-arrow" id="promo-next">&gt;</button>
        </div>
        <button class="promo-login-btn hoverable" id="promo-open-login">로그인</button>
    </div>
"@

    $header = @"
    <header id="header">
        <nav>
            <div class="logo-norris hoverable" onclick="location.href='index.html'">
                HWANG<br>YOUNGHO
            </div>
            <ul class="nav-links">
                <li><a href="index.html" class="hoverable">HOME</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $b" data-category="brand">브랜드 소개</a>
                </li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $p" data-category="products">제품 소식</a>
                </li>
                <li><a href="companies.html" class="hoverable">장바구니</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $s" data-category="support">고객 지원</a>
                </li>
            </ul>
            <div class="header-right">
            </div>
        </nav>
    </header>
"@

    $modals = @"
    <div class="modal-overlay" id="login-modal">
        <div class="modal-content">
            <button class="modal-close" id="close-login">&times;</button>
            <h2 class="modal-title">로그인</h2>
            <form class="modal-form">
                <div class="form-group">
                    <label for="email">이메일</label>
                    <input type="email" id="email" placeholder="이메일을 입력하세요" required>
                </div>
                <div class="form-group">
                    <label for="password">비밀번호</label>
                    <input type="password" id="password" placeholder="비밀번호를 입력하세요" required>
                </div>
                <button type="submit" class="modal-submit">로그인</button>
            </form>
            <div class="social-login">
                <p class="social-divider">다른 계정으로 계속</p>
                <div class="social-icons">
                    <a href="https://www.facebook.com/login" target="_blank" class="social-icon facebook hoverable"><i class="fab fa-facebook-f"></i></a>
                    <a href="https://accounts.google.com/signin" target="_blank" class="social-icon google hoverable"><i class="fab fa-google"></i></a>
                    <a href="https://appleid.apple.com/" target="_blank" class="social-icon apple hoverable"><i class="fab fa-apple"></i></a>
                    <a href="https://v3.account.samsung.com/" target="_blank" class="social-icon samsung hoverable"><i class="fa-solid fa-s"></i></a>
                </div>
            </div>
            <div class="modal-footer">
                계정이 없으신가요? <span class="modal-link" id="go-to-signup">회원가입</span>
            </div>
        </div>
    </div>

    <div class="modal-overlay" id="signup-modal">
        <div class="modal-content">
            <button class="modal-close" id="close-signup">&times;</button>
            <h2 class="modal-title">회원가입</h2>
            <form class="modal-form">
                <div class="form-group">
                    <label for="new-name">이름</label>
                    <input type="text" id="new-name" placeholder="이름을 입력하세요" required>
                </div>
                <div class="form-group">
                    <label for="new-email">이메일</label>
                    <input type="email" id="new-email" placeholder="이메일을 입력하세요" required>
                </div>
                <div class="form-group">
                    <label for="new-password">비밀번호</label>
                    <input type="password" id="new-password" placeholder="비밀번호를 입력하세요" required>
                </div>
                <button type="submit" class="modal-submit">회원가입</button>
            </form>
            <div class="modal-footer">
                이미 계정이 있으신가요? <span class="modal-link" id="go-to-login">로그인</span>
            </div>
        </div>
    </div>
"@

    $megaMenu = @"
    <div class="mega-menu-overlay" id="mega-menu">
        <div class="mega-menu-container">
            <div class="mega-menu-header">
                <div class="mega-menu-logo">
                    <img src="https://www.lego.com/cdn/cs/set-v2/assets/blt167439775079a408/logo-lego-brick.svg" alt="LEGO" class="lego-square-logo">
                </div>
                <nav class="mega-menu-nav">
                    <button class="mega-nav-btn" data-category="brand">브랜드 소개</button>
                    <button class="mega-nav-btn" data-category="products">제품 소식</button>
                    <button class="mega-nav-btn" data-category="support">고객 지원</button>
                </nav>
                <button class="mega-menu-close" id="close-mega-menu"><i class="fas fa-times"></i></button>
            </div>
            <div class="mega-menu-content">
                <div class="mega-category-pane" id="mega-pane-brand">
                    <ul class="mega-links-list">
                        <li><a href="about.html">소개</a></li>
                        <li><a href="news.html">소식</a></li>
                        <li><a href="partnership.html">다가오는 파트너십</a></li>
                    </ul>
                </div>
                <div class="mega-category-pane" id="mega-pane-support">
                    <ul class="mega-links-list">
                        <li><a href="order.html">주문 현황 확인</a></li>
                        <li><a href="shipping.html">배송 및 반품</a></li>
                        <li><a href="assembly.html">조립 설명서 검색</a></li>
                        <li><a href="faq.html">일반적인 질문</a></li>
                        <li><a href="contact.html">문의하기</a></li>
                        <li><a href="bricks.html">부속품 및 브릭</a></li>
                    </ul>
                </div>
                <div class="mega-category-pane" id="mega-pane-products">
                    <div class="mega-products-grid">
                        <ul class="mega-links-list">
                            <li><a href="series.html">시리즈별 세트</a></li>
                            <li><a href="age.html">연령별</a></li>
                            <li><a href="price.html">가격별</a></li>
                            <li><a href="new.html">신제품</a></li>
                        </ul>
                        <ul class="mega-links-list">
                            <li><a href="exclusive.html">독점 제품</a></li>
                            <li><a href="deals.html">할인 및 행사</a></li>
                            <li><a href="coming-soon.html">출시 예정</a></li>
                            <li><a href="last-chance.html">단종 예정</a></li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="lightbox-overlay" id="lightbox">
        <div class="lightbox-content">
            <button class="lightbox-close" id="lightbox-close">&times;</button>
            <img src="" alt="확대 이미지" id="lightbox-img">
        </div>
    </div>
"@

    # 4. Insertion
    if ($content -notmatch "<body") {
        $content = $content.Replace("</head>", "</head>`r`n<body class=`"dark-mode`">")
    }
    
    # Use a simpler string replace for body start to avoid $0 issues
    $content = $content.Replace("<body class=`"dark-mode`">", "<body class=`"dark-mode`">`r`n    <div class=`"custom-cursor`" id=`"cursor`"></div>`r`n$promoBar`r`n$header")
    $content = $content.Replace("<body class='dark-mode'>", "<body class='dark-mode'>`r`n    <div class=`"custom-cursor`" id=`"cursor`"></div>`r`n$promoBar`r`n$header")
    
    # Add modals and mega menu before </body>
    if ($content -notmatch "id=`"mega-menu`"") {
        $content = $content.Replace("</body>", "$modals`r`n$megaMenu`r`n</body>")
    }
    
    # Fix versioning
    $content = $content.Replace('href="style.css"', 'href="style.css?v=1.1"')
    $content = $content.Replace('src="main.js"', 'src="main.js?v=1.1"')

    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed $($file.Name)"
}
