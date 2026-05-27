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

# Regular expression pattern to match the duplicate inline addToCart function
# Handles potential indentation differences smoothly
$pattern = '(?s)\s*function addToCart\(productName\)\s*\{\s*if\s*\(window\.addToCart\)\s*\{\s*window\.addToCart\(productName\);\s*\}\s*\}'

foreach ($file in $files) {
    if (-not (Test-Path $file)) {
        Write-Host "File not found: $file"
        continue
    }

    Write-Host "Processing $file..."
    
    # Read file content as UTF-8
    $content = [System.IO.File]::ReadAllText((Resolve-Path $file), [System.Text.Encoding]::UTF8)

    # Check if the pattern exists in the content
    if ($content -match $pattern) {
        # Replace the matched pattern with nothing
        $newContent = [regex]::Replace($content, $pattern, "")
        
        # Write the content back using UTF-8 (No BOM)
        # In PowerShell, using [System.IO.File]::WriteAllText with [System.Text.Encoding]::UTF8 
        # writes UTF-8 without BOM by default on .NET Core, but on .NET Framework it might write with BOM.
        # To strictly enforce UTF-8 without BOM, we can use a custom UTF8Encoding object:
        $utf8NoBOM = New-Object System.Text.UTF8Encoding($false)
        [System.IO.File]::WriteAllText((Resolve-Path $file), $newContent, $utf8NoBOM)
        
        Write-Host "  Successfully removed duplicate addToCart from $file"
    } else {
        Write-Host "  No duplicate addToCart found or already removed in $file"
    }
}
