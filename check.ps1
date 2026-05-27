$files = Get-ChildItem -Path "c:\Users\user\Desktop\my" -Filter "*.html"
foreach ($file in $files) {
    try {
        $content = [System.IO.File]::ReadAllText($file.FullName, [System.Text.Encoding]::UTF8)
        
        # HTML tag counts
        $htmlCount = ([regex]::Matches($content, "(?i)<html")).Count
        $bodyCount = ([regex]::Matches($content, "(?i)<body")).Count
        
        Write-Host "File: $($file.Name) | HTML: $htmlCount | BODY: $bodyCount"
    }
    catch {
        Write-Host "Error: $($file.Name)"
    }
}
