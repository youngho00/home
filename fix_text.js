const fs = require('fs');
const path = require('path');

const mappings = {
    '\\?뚭컻': '소개',
    '\\?뚯떇': '소식',
    '\\?ㅺ??ㅻ뒗 \\?뚰듃\\?덉떗': '다가오는 파트너십',
    '二쇰Ц \\?꾪솴 \\?뺤씤': '주문 현황 확인',
    '諛곗넚 諛\\? 諛섑뭹': '배송 및 반품',
    '議곕┰ \\?ㅻ챸\\?\\? 寃€\\?\\?': '조립 설명서 검색',
    '\\?쇰컲\\?곸씤 吏덈Ц': '일반적인 질문',
    '臾몄쓽\\?섍린': '문의하기',
    '遺€\\?랁뭹 諛\\? 釉뚮┃': '부속품 및 브릭',
    '\\?쒕━利덈퀎 \\?명듃': '시리즈별 세트',
    '\\?곕졊蹂\\?': '연령별',
    '媛€寃⑸퀎': '가격별',
    '\\?낆젏 \\?쒗뭹': '독점 제품',
    '\\?좎씤 諛\\?\\? \\?됱궗': '할인 및 행사',
    '異쒖떆 \\?덉젙': '출시 예정',
    '\\?⑥쥌 \\?덉젙': '단종 예정',
    '\\?대찓\\?\\?': '이메일',
    '\\?대찓\\?쇱쓣 \\?낅젰\\?섏꽭\\?\\?': '이메일을 입력하세요',
    '鍮꾨?踰덊샇': '비밀번호',
    '鍮꾨?踰덊샇瑜\\?\\? \\?낅젰\\?섏꽭\\?\\?': '비밀번호를 입력하세요',
    '\\?뚯썝媛€\\?\\?': '회원가입',
    '\\?대쫫': '이름',
    '\\?대쫫\\?\\?\\? \\?낅젰\\?섏꽭\\?\\?': '이름을 입력하세요',
    '로그인/h2>': '로그인</h2>',
    '로그인/button>': '로그인</button>',
    '로그인/span>': '로그인</span>',
    '로그인><i': '로그인"><i',
    '?뚯썝媛€??/h2>': '회원가입</h2>',
    '?뚯썝媛€??/button>': '회원가입</button>',
    '?뚯썝媛€??/span>': '회원가입</span>',
    '브랜드 소개': '브랜드 소개', // Ensure this is correct
    '제품 소식': '제품 소식',
    '고객 지원€\\?\\?': '고객 지원'
};

const dir = 'c:/Users/user/Desktop/my';
const files = fs.readdirSync(dir).filter(f => f.endsWith('.html'));

files.forEach(file => {
    const filePath = path.join(dir, file);
    let content = fs.readFileSync(filePath, 'utf8');
    
    for (const [key, value] of Object.entries(mappings)) {
        const regex = new RegExp(key, 'g');
        content = content.replace(regex, value);
    }
    
    // Fix remaining common Mojibake patterns manually if needed
    content = content.replace(/α/g, '로그인');
    content = content.replace(/ȸ/g, '회원가입');
    content = content.replace(/̹  Ű\?/g, '이미 계정이 있으신가요?');
    content = content.replace(/ Ű\?/g, '계정이 없으신가요?');
    content = content.replace(/н߰ų ļյ 긯 Ű\?/g, '파손되거나 누락된 브릭이 있나요?');

    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed ${file}`);
});
