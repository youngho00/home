$files = Get-ChildItem -Filter "*.html" | Where-Object { $_.Name -ne "index.html" }

foreach ($file in $files) {
    $activeCat = ""
    if ($file.Name -match "about|news|partnership") { $activeCat = "brand" }
    elseif ($file.Name -match "series|age|price|new|exclusive|deals|coming-soon|last-chance") { $activeCat = "products" }
    elseif ($file.Name -match "order|shipping|assembly|faq|contact|bricks") { $activeCat = "support" }
    
    .\fix_one.ps1 -fileName $file.Name -activeCat $activeCat
    Write-Host "Fixed $($file.Name)"
}
