# Complete sitemap.xml generator with all languages and metadata
$ErrorActionPreference = 'Stop'

$configPath = Join-Path $PSScriptRoot 'lang_pages_config.json'
$config = Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json
$allLangs = @('en') + $config.supportedLanguages

$baseUrl = 'https://profilecode.codes'
$today = Get-Date -Format "yyyy-MM-dd"

# MBTI types
$mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')

# Function to generate URL entry
function Add-UrlEntry {
    param(
        [string]$loc,
        [string]$lastmod,
        [string]$changefreq,
        [double]$priority
    )
    return @"
  <url>
    <loc>$loc</loc>
    <lastmod>$lastmod</lastmod>
    <changefreq>$changefreq</changefreq>
    <priority>$priority</priority>
  </url>
"@
}

$urlEntries = @()

# Generate URLs for each language
foreach ($lang in $allLangs) {
    # Home page
    $urlEntries += Add-UrlEntry "$baseUrl/$lang/" $today "weekly" 1.0
    
    # Categories
    $urlEntries += Add-UrlEntry "$baseUrl/$lang/mbti/" $today "weekly" 0.9
    $urlEntries += Add-UrlEntry "$baseUrl/$lang/mbti/types/" $today "monthly" 0.8
    $urlEntries += Add-UrlEntry "$baseUrl/$lang/16-personality-test/" $today "weekly" 0.9
    $urlEntries += Add-UrlEntry "$baseUrl/$lang/enneagram/" $today "weekly" 0.9
    
    # MBTI types
    foreach ($type in $mbtiTypes) {
        $urlEntries += Add-UrlEntry "$baseUrl/$lang/mbti/$type/" $today "monthly" 0.8
    }
    
    # Enneagram types
    foreach ($n in 1..9) {
        $urlEntries += Add-UrlEntry "$baseUrl/$lang/enneagram/$n/" $today "monthly" 0.8
    }
}

# Generate XML
$xml = '<?xml version="1.0" encoding="UTF-8"?>' + "`n"
$xml += '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">' + "`n"
$xml += ($urlEntries -join "`n")
$xml += "`n</urlset>`n"

# Write sitemap
$sitemapPath = Join-Path (Split-Path $PSScriptRoot -Parent) 'sitemap.xml'
Set-Content -Encoding UTF8 -NoNewline -Path $sitemapPath -Value $xml

$totalUrls = $urlEntries.Count
$totalLangs = $allLangs.Count
Write-Host "sitemap.xml updated with $totalUrls URLs across $totalLangs languages."
Write-Host "Languages: $($allLangs -join ', ')"

