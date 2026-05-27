function Get-FileEncoding {
    param ([string]$Path)
    $bom = New-Object Byte[] 4
    $file = New-Object System.IO.FileStream($Path, [System.IO.FileMode]::Open, [System.IO.FileAccess]::Read)
    $null = $file.Read($bom, 0, 4)
    $file.Close()
    
    # BOM check
    if ($bom[0] -eq 0xef -and $bom[1] -eq 0xbb -and $bom[2] -eq 0xbf) {
        return "utf8-bom"
    }
    if ($bom[0] -eq 0xff -and $bom[1] -eq 0xfe) {
        return "utf16-le"
    }
    if ($bom[0] -eq 0xfe -and $bom[1] -eq 0xff) {
        return "utf16-be"
    }
    
    # No BOM. Let's check if it is valid UTF-8
    try {
        $bytes = [System.IO.File]::ReadAllBytes($Path)
        # Check if bytes are valid UTF8
        $utf8Decoder = [System.Text.Encoding]::UTF8.GetDecoder()
        $charCount = $utf8Decoder.GetCharCount($bytes, 0, $bytes.Length, $true)
        return "utf8-nobom"
    }
    catch {
        return "ansi-or-corrupted"
    }
}

$files = Get-ChildItem -Path "c:\Users\user\Desktop\my" -Filter "*.html"
foreach ($file in $files) {
    $encoding = Get-FileEncoding $file.FullName
    Write-Host "$($file.Name) Encoding: $encoding"
}
