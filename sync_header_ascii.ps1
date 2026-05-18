$brandTxt = [char]0xBE0C + [char]0xB79C + [char]0xB4DC + " " + [char]0xC18C + [char]0xAC1C
$productsTxt = [char]0xC81C + [char]0xD488 + " " + [char]0xC18C + [char]0xC2DD
$supportTxt = [char]0xACE0 + [char]0xAC1D + " " + [char]0xC9C0 + [char]0xC6D0
$loginTxt = [char]0xB85C + [char]0xADF8 + [char]0xC778
$cartTxt = [char]0xC7A5 + [char]0xBC14 + [char]0xAD6C + [char]0xB2C8

# Promo messages (corrected typos from the old script)
$p1 = "6" + [char]0xB9CC + [char]0xC6D0 + " " + [char]0xC774 + [char]0xC0C1 + " " + [char]0xC8FC + [char]0xBB38 + [char]0xC2DC + " " + [char]0xBB34 + [char]0xB8CC + " " + [char]0xBC30 + [char]0xC1A1 + "!"
$p2 = [char]0xD560 + [char]0xC778 + " " + [char]0xBC0F + " " + [char]0xD589 + [char]0xC0AC + [char]0xC911 + " " + [char]0xC9C0 + [char]0xAE08 + " " + [char]0xAD6C + [char]0xB9E4 + [char]0xD574 + " " + [char]0xBCF4 + [char]0xC138 + [char]0xC694 + "."
$p3 = [char]0xC2E0 + [char]0xC81C + [char]0xD488 + [char]0xC744 + " " + [char]0xD55C + [char]0xBC88 + " " + [char]0xB458 + [char]0xB7EC + [char]0xBCF4 + [char]0xC138 + [char]0xC694 + "."
$p4 = [char]0xC9C0 + [char]0xAE08 + " " + [char]0xB2F9 + [char]0xC7A5 + " " + [char]0xB2E8 + [char]0xC885 + " " + [char]0xC608 + [char]0xC815 + " " + [char]0xC81C + [char]0xD488 + [char]0xC744 + " " + [char]0xAD6C + [char]0xB9E4 + [char]0xD574 + " " + [char]0xBCF4 + [char]0xC138 + [char]0xC694 + "."

$playzoneTxt = "PLAY" + [char]0xC874

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

function Get-Header($activeCategory) {
    $homeActive = if ($activeCategory -eq "home") { "active" } else { "" }
    $brandActive = if ($activeCategory -eq "brand") { "active" } else { "" }
    $productsActive = if ($activeCategory -eq "products") { "active" } else { "" }
    $supportActive = if ($activeCategory -eq "support") { "active" } else { "" }

    return @"
    <header id="header">
        <nav>
            <div class="logo-norris hoverable" onclick="location.href='index.html'">
                HWANG<br>YOUNGHO
            </div>
            <ul class="nav-links">
                <li><a href="index.html" class="hoverable $homeActive">HOME</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $brandActive" data-category="brand">$brandTxt</a>
                </li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $productsActive" data-category="products">$productsTxt</a>
                </li>
                <li><a href="companies.html" class="hoverable">$cartTxt</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger $supportActive" data-category="support">$supportTxt</a>
                </li>
            </ul>
            <div class="header-right">
            </div>
        </nav>
    </header>
"@
}

$dir = "."
$files = Get-ChildItem -Path $dir -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    $activeCategory = ""
    if ($file.Name -match "about|news|partnership") { $activeCategory = "brand" }
    elseif ($file.Name -match "series|age|price|new|exclusive|deals|coming-soon|last-chance") { $activeCategory = "products" }
    elseif ($file.Name -match "order|shipping|assembly|faq|contact|bricks") { $activeCategory = "support" }
    
    # 1. Clean up old/corrupted promo-bar and headers completely
    $content = $content -replace '(?s)<div class="custom-cursor" id="cursor"></div>', ''
    $content = $content -replace '(?s)<div class="promo-bar">.*?</header>', ''
    $content = $content -replace '(?s)<div class="promo-bar">.*?</div>\s*</div>\s*</div>', ''
    $content = $content -replace '(?s)<header id="header">.*?</header>', ''
    
    # Clean up any orphaned elements from previous runs
    $content = $content -replace '(?s)\s*<button class="promo-arrow" id="promo-next">&gt;</button>\s*</div>\s*</div>', ''
    
    # 2. Insert fresh, uncorrupted header and promo-bar right after <body> tag (regardless of attributes)
    if ($content -match '(?i)<body\b[^>]*>') {
        $bodyTag = $Matches[0]
        $newHeader = "`r`n    <div class=`"custom-cursor`" id=`"cursor`"></div>`r`n" + $promoBar + "`r`n" + (Get-Header $activeCategory)
        $content = $content.Replace($bodyTag, "$bodyTag$newHeader")
    }
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Restored and updated $($file.Name)"
}
