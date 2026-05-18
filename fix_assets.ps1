# PowerShell script to safely update assets paths to root folder paths
# without character corruption (preserving UTF-8 encoding).

$dir = "c:\Users\user\Desktop\my"
$files = Get-ChildItem -Path $dir -Filter "*.*" -Recurse | Where-Object { $_.Extension -match "\.(html|css|js)$" }

Write-Host "Starting path replacements..."
Write-Host "Found $($files.Count) HTML/CSS/JS files to check."

foreach ($file in $files) {
    # Skip any script files we might match by accident
    if ($file.Name -match "fix_assets|fix_text|sync_header") {
        continue
    }

    # Read file using .NET StreamReader to guarantee perfect UTF-8 encoding
    $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
    $original = $content

    # 1. Replace assets/a.png -> qq.png (case-insensitive, local paths only)
    $content = [regex]::Replace($content, '(?<!https?://[^\s''"]+)assets/a\.png', 'qq.png', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    # 2. Replace other assets/ -> empty string (case-insensitive, local paths only)
    $content = [regex]::Replace($content, '(?<!https?://[^\s''"]+)assets/', '', [System.Text.RegularExpressions.RegexOptions]::IgnoreCase)

    if ($original -ne $content) {
        Write-Host "Modifying $($file.Name) :"
        
        # Display preview of changes (lines modified)
        $origLines = $original -split "\r?\n"
        $newLines = $content -split "\r?\n"
        for ($i = 0; $i -lt $origLines.Count; $i++) {
            if ($origLines[$i] -ne $newLines[$i]) {
                Write-Host "  Line $($i + 1):"
                Write-Host "    - $($origLines[$i].Trim())" -ForegroundColor Red
                Write-Host "    + $($newLines[$i].Trim())" -ForegroundColor Green
            }
        }

        # Write file back in perfect UTF-8
        [System.IO.File]::WriteAllText($file.FullName, $content, [System.Text.Encoding]::UTF8)
        Write-Host "Successfully updated $($file.Name)`n" -ForegroundColor Cyan
    }
}

Write-Host "Path replacement completed successfully!"
