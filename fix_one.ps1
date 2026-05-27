param($fileName, $activeCat)

$filePath = Join-Path (Get-Location) $fileName
$content = [System.IO.File]::ReadAllText($filePath, [System.Text.Encoding]::UTF8)

# Korean strings using char codes
$brandTxt = [char]0xBE0C + [char]0xB79C + [char]0xB4DC + " " + [char]0xC18C + [char]0xAC1C
$productsTxt = [char]0xC81C + [char]0xD488 + " " + [char]0xC18C + [char]0xC2DD
$supportTxt = [char]0xACE0 + [char]0xAC1D + " " + [char]0xC9C0 + [char]0xC6D0
$loginTxt = [char]0xB85C + [char]0xADF8 + [char]0xC778
$cartTxt = [char]0xC7A5 + [char]0xBC14 + [char]0xAD6C + [char]0xB2C8

# Promo messages
$p1 = "6" + [char]0xB9CC + [char]0xC6D0 + " " + [char]0xC774 + [char]0xC0C1 + " " + [char]0xC900 + [char]0xBB38 + [char]0xC2DC + " " + [char]0xBB34 + [char]0xB8CC + " " + [char]0xBC30 + [char]0xC1A1 + "!"
$p2 = [char]0xD560 + [char]0xC778 + " " + [char]0xBC0F + " " + [char]0xD589 + [char]0xC0AC + [char]0xC911 + " " + [char]0xC9C0 + [char]0xAE08 + " " + [char]0xAC6C + [char]0xB9E4 + [char]0xD574 + " " + [char]0xBC34 + [char]0xC138 + [char]0xC694 + "."
$p3 = [char]0xC2E0 + [char]0xC11C + [char]0xD488 + [char]0xC744 + " " + [char]0xD55C + [char]0xBC88 + " " + [char]0xB458 + [char]0xB7EC + [char]0xBC34 + [char]0xC138 + [char]0xC694 + "."
$p4 = [char]0xC9C0 + [char]0xAE08 + " " + [char]0xB2F9 + [char]0xC7A5 + " " + [char]0xB2E8 + [char]0xC911 + " " + [char]0xC608 + [char]0xC815 + " " + [char]0xC11C + [char]0xD488 + [char]0xC744 + " " + [char]0xAC6C + [char]0xB9E4 + [char]0xD574 + " " + [char]0xBC34 + [char]0xC138 + [char]0xC694 + "."

$b = if ($activeCat -eq "brand") { "active" } else { "" }
$p = if ($activeCat -eq "products") { "active" } else { "" }
$s = if ($activeCat -eq "support") { "active" } else { "" }

$playzoneTxt = "PLAY" + [char]0xC874

# Snippets
$promoBar = @"
    <div class="promo-bar">
        <button class="playzone-btn hoverable" onclick="location.href='playzone.html'">$playzoneTxt</button>
        <div class="promo-bar-content">
            <button class="promo-arrow" id="promo-prev">&lt;</button>
            <div class="promo-bar-inner">
                <span class="promo-msg active">$p1</span>
                <span class="promo-msg">$p2</span>
                <span class="promo-msg">$p3</span>
                <span class="promo-msg">$p4</span>
            </div>
            <button class="promo-arrow" id="promo-next">&gt;</button>
        </div>
        <button class="promo-login-btn hoverable" id="promo-open-login">$loginTxt</button>
    </div>
"@

$header = @"
    <header id="header">
        <nav>
            <div class="logo-norris hoverable" onclick="location.href='index.html'">
                Brick Mate
            </div>
            <ul class="nav-links">
                <li><a href="index.html" class="hoverable">HOME</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $b" data-category="brand">$brandTxt</a>
                </li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $p" data-category="products">$productsTxt</a>
                </li>
                <li><a href="companies.html" class="hoverable">$cartTxt</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $s" data-category="support">$supportTxt</a>
                </li>
            </ul>
            <div class="header-right">
            </div>
        </nav>
    </header>
"@

# Fix Mojibake in the whole file first
$mojibakeMap = @{
    "濡쒓렇??" = [char]0xB85C + [char]0xADF8 + [char]0xC778
    "?λ컮援щ땲" = [char]0xC7A5 + [char]0xBC14 + [char]0xAD6C + [char]0xB2C8
    "?뚯썝媛€??" = [char]0xD68C + [char]0xC6D0 + [char]0xAC00 + [char]0xC785
}
foreach ($key in $mojibakeMap.Keys) { $content = $content.Replace($key, $mojibakeMap[$key]) }

# Remove everything between body and main/section
$newContent = @()
$inBody = $false
$skipped = $false
foreach ($line in ($content -split "`r?`n")) {
    if ($line -match "<body") {
        $newContent += $line
        $newContent += '    <div class="custom-cursor" id="cursor"></div>'
        $newContent += $promoBar
        $newContent += $header
        $inBody = $true
        continue
    }
    if ($inBody -and -not $skipped) {
        if ($line -match "<main" -or $line -match "<section") {
            $skipped = $true
            $newContent += $line
        }
        continue
    }
    $newContent += $line
}

$finalContent = $newContent -join "`r`n"

# Ensure Mega Menu
if ($finalContent -notlike "*id=`"mega-menu`"*") {
    # Get mega menu from index.html (already read previously or just hardcode it here safely)
    $megaMenu = @"
    <div class="mega-menu-overlay" id="mega-menu">
        <div class="mega-menu-container">
            <div class="mega-menu-header">
                <div class="mega-menu-logo">
                    <span style="font-family: 'Outfit', 'Inter', sans-serif; font-size: 1.4rem; font-weight: 900; color: #ffcc00; letter-spacing: -0.5px;">Brick Mate</span>
                </div>
                <nav class="mega-menu-nav">
                    <button class="mega-nav-btn" data-category="brand">$brandTxt</button>
                    <button class="mega-nav-btn" data-category="products">$productsTxt</button>
                    <button class="mega-nav-btn" data-category="support">$supportTxt</button>
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
    $finalContent = $finalContent.Replace("</body>", "$megaMenu`n</body>")
}

# Versioning
$finalContent = $finalContent.Replace('href="style.css"', 'href="style.css?v=1.1"')
$finalContent = $finalContent.Replace('src="main.js"', 'src="main.js?v=1.1"')

[System.IO.File]::WriteAllText($filePath, $finalContent, [System.Text.Encoding]::UTF8)
