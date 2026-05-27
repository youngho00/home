const fs = require('fs');
const path = require('path');

const dir = '.';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html') && f !== 'index.html');

const promoBar = `
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
`;

function getHeader(activeCategory) {
    const brandActive = activeCategory === 'brand' ? 'active' : '';
    const productsActive = activeCategory === 'products' ? 'active' : '';
    const supportActive = activeCategory === 'support' ? 'active' : '';
    const boardActive = activeCategory === 'board' ? 'active' : '';

    return `
    <header id="header">
        <nav>
            <div class="logo-norris hoverable" onclick="location.href='index.html'">
                Brick Mate
            </div>
            <ul class="nav-links">
                <li><a href="index.html" class="hoverable">HOME</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger ${brandActive}" data-category="brand">브랜드 소개</a>
                </li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger ${productsActive}" data-category="products">제품 소식</a>
                </li>
                <li><a href="companies.html" class="hoverable">장바구니</a></li>
                <li class="nav-item-mega">
                    <a href="javascript:void(0)" class="hoverable mega-trigger ${supportActive}" data-category="support">고객 지원</a>
                </li>
                <li><a href="board.html" class="hoverable ${boardActive}">팬 커뮤니티</a></li>
            </ul>
            <div class="header-right">
            </div>
        </nav>
    </header>
`;
}

const megaMenu = `
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
`;

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');

    // 1. Remove ANY existing promo-bar and header to start clean
    content = content.replace(/<div class="promo-bar">[\s\S]*?<\/div>[\s\S]*?<div class="promo-bar">[\s\S]*?<\/div>/g, ''); // Fix double promo bars
    content = content.replace(/<div class="promo-bar">[\s\S]*?<\/div>/g, '');
    content = content.replace(/<header id="header"[\s\S]*?<\/header>/g, '');

    // 2. Determine active category
    let activeCategory = '';
    if (file.match(/about|news|partnership/)) activeCategory = 'brand';
    else if (file.match(/series|age|price|new|exclusive|deals|coming-soon|last-chance/)) activeCategory = 'products';
    else if (file.match(/order|shipping|assembly|faq|contact|bricks/)) activeCategory = 'support';
    else if (file.match(/board/)) activeCategory = 'board';

    // 3. Insert new promo bar and header after <body>
    content = content.replace(/<body[\s\S]*?>/, (match) => {
        return match + '\n    <div class="custom-cursor" id="cursor"></div>\n' + promoBar + '\n' + getHeader(activeCategory);
    });

    // 4. Ensure only one custom-cursor
    content = content.replace(/(<div class="custom-cursor" id="cursor"><\/div>\s*)+/g, '<div class="custom-cursor" id="cursor"></div>\n');

    // 5. Replace Mega Menu and Lightbox (start clean)
    content = content.replace(/<div class="mega-menu-overlay"[\s\S]*?<!-- Lightbox Modal -->[\s\S]*?<div class="lightbox-overlay"[\s\S]*?<\/div>[\s\S]*?<\/div>/g, '');
    content = content.replace(/<div class="mega-menu-overlay"[\s\S]*?<\/div>\s*<div class="lightbox-overlay"[\s\S]*?<\/div>/g, '');
    
    // Add before script tag or </body>
    if (content.indexOf('id="mega-menu"') === -1) {
        content = content.replace('</body>', megaMenu + '\n</body>');
    }

    // 6. Update style and script links
    content = content.replace(/href="style\.css(\?v=1\.1)?"/g, 'href="style.css?v=1.1"');
    content = content.replace(/src="main\.js(\?v=1\.1)?"/g, 'src="main.js?v=1.1"');

    // 7. Fix fonts
    if (!content.includes('family=Outfit')) {
        content = content.replace(/family=Inter:wght@400;700;900/, 'family=Inter:wght@400;700;900&family=Outfit:wght@400;700;900');
    }

    // 8. Fix Mojibake (Korean characters)
    // We use common patterns from fix_text.js but applied to the whole file
    const mojibakeMap = {
        '釉뚮옖???뚭컻': '브랜드 소개',
        '?쒗뭹 ?뚯떇': '제품 소식',
        '怨좉컼 吏€??': '고객 지원',
        '濡쒓렇??': '로그인',
        '?λ컮援щ땲': '장바구니',
        '?뚭컻': '소개',
        '?뚯떇': '소식',
        '?ㅺ??ㅻ뒗 ?뚰듃?덉떗': '다가오는 파트너십',
        '二쇰Ц ?꾪솴 ?뺤씤': '주문 현황 확인',
        '諛곗넚 諛?諛섑뭹': '배송 및 반품',
        '議곕┰ ?챸?쒓?': '조립 설명서 검색',
        '?쇰컲?곸씤 吏덈Ц': '일반적인 질문',
        '臾몄쓽?섍린': '문의하기',
        '遺€?랁뭹 諛?釉뚮┃': '부속품 및 브릭',
        '?쒕━利눮퀎 ?명듃': '시리즈별 세트',
        '?곕졊蹂?': '연령별',
        '媛€寃⑸퀎': '가격별',
        '?낆젏 ?쒗뭹': '독점 제품',
        '?좎씤 諛??됱궗': '할인 및 행사',
        '異쒖떆 ?덉젙': '출시 예정',
        '?⑥쥌 ?덉젙': '단종 예정',
        '吏€湲?援щℓ??蹂댁꽭??': '지금 구매해 보세요.',
        '?좎젣?덉쓣 ?쒕쾲 ?섎윭蹂댁꽭??': '신제품을 한번 둘러보세요.',
        '吏€湲??뱀옣 ?⑥쥌 ?덉젙 ?쒗뭹??援щℓ??蹂댁꽭??': '지금 당장 단종 예정 제품을 구매해 보세요.',
        '6留뚯썝 ?댁긽 二쇰Ц??臾대즺 諛곗넚!': '6만원 이상 주문시 무료 배송!',
        '?좎씤 諛??됱궗以?吏€湲?援щℓ??蹂댁꽭??': '할인 및 행사중 지금 구매해 보세요.'
    };

    for (const [key, value] of Object.entries(mojibakeMap)) {
        content = content.split(key).join(value);
    }

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated and fixed ${file}`);
});
