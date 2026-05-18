$files = Get-ChildItem -Filter *.html
foreach ($file in $files) {
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $modified = $false
    if ($content -match '(?m)^\s*<li><a href="exclusive\.html">독점 제품</a></li>\r?\n?') {
        $content = $content -replace '(?m)^\s*<li><a href="exclusive\.html">독점 제품</a></li>\r?\n?', ''
        $modified = $true
    }
    if ($file.Name -eq 'series.html') {
        $btnHtml = "`n                    <div style=`"display: flex; gap: 15px; font-size: 0.85rem; font-weight: 900;`">`n                        <a href=`"#`" style=`"text-decoration: none; color: #000; display: inline-flex; align-items: center;`">제품 쇼핑 <i class=`"fas fa-chevron-right`" style=`"font-size: 0.7em; margin-left: 5px;`"></i></a>`n                        <a href=`"#`" style=`"text-decoration: none; color: #000; display: inline-flex; align-items: center;`">자세히 보기 <i class=`"fas fa-chevron-right`" style=`"font-size: 0.7em; margin-left: 5px;`"></i></a>`n                    </div>`n                </div>"
        $content = [regex]::Replace($content, "</p>\s*</div>", "</p>$btnHtml")
        $modified = $true
    }
    if ($modified) {
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
    }
}
if (Test-Path exclusive.html) { Remove-Item exclusive.html }
