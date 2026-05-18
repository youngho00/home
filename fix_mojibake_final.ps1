$files = Get-ChildItem -Filter "*.html"

$mojibakeMap = @{
    "6留뚯썝 ?댁긽 二쇰Ц??臾대즺 諛곗넚!" = "6만원 이상 주문시 무료 배송!"
    "?좎씤 諛??됱궗以?吏€湲?援щℓ??蹂댁꽭??" = "할인 및 행사중 지금 구매해 보세요."
    "?좎젣?덉쓣 ?쒕쾲 ?섎윭蹂댁꽭??" = "신제품을 한번 둘러보세요."
    "吏€湲??뱀옣 ?⑥쥌 ?덉젙 ?쒗뭹??援щℓ??蹂댁꽭??" = "지금 당장 단종 예정 제품을 구매해 보세요."
    "釉뚮옖???뚭컻" = "브랜드 소개"
    "?쒗뭹 ?뚯떇" = "제품 소식"
    "怨좉컼 吏€??" = "고객 지원"
    "濡쒓렇??" = "로그인"
    "?λ컮援щ땲" = "장바구니"
    "?뚭컻" = "소개"
    "?뚯떇" = "소식"
    "二쇰Ц ?꾪솴 ?뺤씤" = "주문 현황 확인"
    "諛곗넚 諛?諛섑뭹" = "배송 및 반품"
    "議곕┰ ?챸?쒓?" = "조립 설명서 검색"
    "?쇰컲?곸씤 吏덈Ц" = "일반적인 질문"
    "臾몄쓽?섍린" = "문의하기"
    "遺€?랁뭹 諛?釉뚮┃" = "부속품 및 브릭"
    "?쒕━利눮퀎 ?명듃" = "시리즈별 세트"
    "?곕졊蹂?" = "연령별"
    "媛€寃⑸퀎" = "가격별"
    "?낆젏 ?쒗뭹" = "독점 제품"
    "?좎씤 諛??됱궗" = "할인 및 행사"
    "異쒖떆 ?덉젙" = "출시 예정"
    "?⑥쥌 ?덉젙" = "단종 예정"
}

foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    
    foreach ($key in $mojibakeMap.Keys) {
        $content = $content.Replace($key, $mojibakeMap[$key])
    }
    
    [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    Write-Host "Fixed $($file.Name)"
}
