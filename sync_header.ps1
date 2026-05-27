$dir = "."
$files = Get-ChildItem -Path $dir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

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

function Get-Header($activeCategory) {
    $homeActive = if ($activeCategory -eq "home") { "active" } else { "" }
    $brandActive = if ($activeCategory -eq "brand") { "active" } else { "" }
    $productsActive = if ($activeCategory -eq "products") { "active" } else { "" }
    $supportActive = if ($activeCategory -eq "support") { "active" } else { "" }
    $boardActive = if ($activeCategory -eq "board") { "active" } else { "" }

    return @"
    <header id="header">
        <nav>
            <div class="logo-norris hoverable" onclick="location.href='index.html'">
                Brick Mate
            </div>
            <ul class="nav-links">
                <li><a href="index.html" class="hoverable $homeActive">HOME</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $brandActive" data-category="brand">브랜드 소개</a>
                </li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $productsActive" data-category="products">제품 소식</a>
                </li>
                <li><a href="companies.html" class="hoverable">장바구니</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $supportActive" data-category="support">고객 지원</a>
                </li>
                <li><a href="board.html" class="hoverable $boardActive">팬 커뮤니티</a></li>
            </ul>
            <div class="header-right">
            </div>
        </nav>
    </header>
"@
}

$megaMenu = @"
    <div class="mega-menu-overlay" id="mega-menu">
        <div class="mega-menu-container">
            <div class="mega-menu-header">
                <div class="mega-menu-logo">
                    <img src="https://www.lego.com/cdn/cs/set-v2/assets/blt167439775079a408/logo-lego-brick.svg"
                        alt="LEGO" class="lego-square-logo">
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

    <!-- Lightbox Modal -->
    <div class="lightbox-overlay" id="lightbox">
        <div class="lightbox-content">
            <button class="lightbox-close" id="lightbox-close">&times;</button>
            <img src="" alt="확대 이미지" id="lightbox-img">
        </div>
    </div>
"@

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $activeCategory = ""
    if ($file.Name -match "about|news|partnership") { $activeCategory = "brand" }
    elseif ($file.Name -match "series|age|price|new|exclusive|deals|coming-soon|last-chance") { $activeCategory = "products" }
    elseif ($file.Name -match "order|shipping|assembly|faq|contact|bricks") { $activeCategory = "support" }
    elseif ($file.Name -match "board") { $activeCategory = "board" }
    
    $content = $content -replace '<link rel="stylesheet" href="style.css">', '<link rel="stylesheet" href="style.css?v=1.1">'
    
    # Remove existing header and insert new one
    if ($content -match '(?s)<header id="header".*?</header>') {
        $content = $content -replace '(?s)<header id="header".*?</header>', ("PLACEHOLDER_HEADER")
        $content = $content -replace "PLACEHOLDER_HEADER", ($promoBar + "`n`n" + (Get-Header $activeCategory))
    }
    
    if ($content -notlike "*id=`"mega-menu`"*") {
        $content = $content -replace '</body>', ($megaMenu + "`n`n</body>")
    }
    
    $content = $content -replace '<script src="main.js"></script>', '<script src="main.js?v=1.1"></script>'
    
    if ($content -notlike "*family=Outfit*") {
        $content = $content -replace 'family=Inter:wght@400;700;900', 'family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900'
    }

    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Updated $($file.Name)"
}
