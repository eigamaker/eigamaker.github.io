# Update sitemap.xml to include all language URLs
$ErrorActionPreference = 'Stop'

$configPath = Join-Path $PSScriptRoot 'lang_pages_config.json'
$config = Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json
$langs = $config.supportedLanguages

$baseUrl = 'https://profilecode.codes'
$urls = @()

# Generate URLs for each language
foreach ($lang in $langs) {
    # Home
    $urls += "$baseUrl/$lang/"
    
    # Categories
    $urls += "$baseUrl/$lang/mbti/"
    $urls += "$baseUrl/$lang/mbti/types/"
    $urls += "$baseUrl/$lang/16-personality-test/"
    $urls += "$baseUrl/$lang/enneagram/"
    
    # MBTI types
    $mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')
    foreach ($type in $mbtiTypes) {
        $urls += "$baseUrl/$lang/mbti/$type/"
    }
    
    # Enneagram types
    foreach ($n in 1..9) {
        $urls += "$baseUrl/$lang/enneagram/$n/"
    }
}

# Sort URLs (English first, then alphabetical)
$urls = $urls | Sort-Object {
    if ($_ -match '/en/') { '0' }
    else { $_ -replace 'https://profilecode\.codes/', '' }
}

# Generate XML
$xml = '<?xml version="1.0" encoding="UTF-8"?>' + "`n"
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "`n"
foreach ($url in $urls) {
    $xml += "  <url><loc>$url</loc></url>`n"
}
$xml += '</urlset>' + "`n"

# Write sitemap
Set-Content -Encoding UTF8 -NoNewline -Path 'sitemap.xml' -Value $xml

Write-Host "sitemap.xml updated with $($urls.Count) URLs across $($langs.Count) languages."

