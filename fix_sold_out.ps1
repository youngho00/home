$files = @(
    "series-minifigures.html",
    "series-editions.html",
    "series-landmark.html",
    "series-art.html",
    "series-animation.html",
    "series-technic.html",
    "series-rides.html",
    "series-music.html"
)

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "File not found: $file"
        continue
    }

    Write-Host "Processing $file..."
    # Read file with UTF8 encoding
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file), [System.Text.Encoding]::UTF8)

    # Use Regex to find and replace
    # We match: <div class="landmark-card hoverable">...<h3 class="card-name">NAME</h3>...<button class="btn-sold-out" disabled>...
    # We will search cards one by one
    $pattern = '(?s)<div class="landmark-card hoverable">.*?</div>\s*</div>'
    $matches = [regex]::Matches($content, $pattern)

    foreach ($match in $matches) {
        $cardContent = $match.Value
        if ($cardContent -match 'btn-sold-out') {
            # Extract product name
            if ($cardContent -match '<h3 class="card-name">(.*?)</h3>') {
                $productName = $Matches[1].Trim()
                $productName = [regex]::Replace($productName, '<[^>]*>', '') # remove tags
                
                $newButton = "<button class=\"btn-cart-add hoverable\" onclick=\"addToCart('$productName')\">`r`n                            <i class=\"fa-solid fa-bag-shopping\"></i> 장바구니 담기`r`n                        </button>"
                
                $updatedCard = [regex]::Replace($cardContent, '<button class="btn-sold-out"[^>]*>.*?</button>', $newButton)
                
                # Replace back in the main content
                $content = $content.Replace($cardContent, $updatedCard)
                Write-Host "  Converted sold-out card '$productName' in $file"
            }
        }
    }

    # Write back in UTF-8 without BOM
    [System.IO.File]::WriteAllText((Resolve-Path $file), $content, [System.Text.Encoding]::UTF8)
    Write-Host "Successfully updated $file"
}
