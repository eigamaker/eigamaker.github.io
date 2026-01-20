$ErrorActionPreference = 'Stop'

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path $Path)) {
    New-Item -ItemType Directory -Force -Path $Path | Out-Null
  }
}

function Write-FileUtf8NoBom([string]$Path, [string]$Content) {
  Ensure-Dir (Split-Path -Parent $Path)
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function Ensure-JaStub([string]$Path, [string]$EnUrl, [string]$Title, [string]$Description) {
  if (Test-Path $Path) { return }
  $selfUrl = 'https://profilecode.codes/' + ($Path -replace '\\', '/')
  $html = @"
<!doctype html>
<html lang="ja">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$Title</title>
  <meta name="description" content="$Description">
  <link rel="canonical" href="$EnUrl">
  <meta name="robots" content="noindex,follow">
  <meta name="googlebot" content="noindex,follow">
  <link rel="alternate" hreflang="en" href="$EnUrl" />
  <link rel="alternate" hreflang="ja" href="$selfUrl" />
  <link rel="alternate" hreflang="x-default" href="$EnUrl" />
</head>
<body>
  <p>This page exists as a Japanese-language URL placeholder. Canonical is the English URL.</p>
  <p><a href="$EnUrl">Go to English (canonical)</a></p>
</body>
</html>
"@
  Write-FileUtf8NoBom $Path $html
}

function Ensure-HreflangAndBreadcrumb([string]$Path, [string]$EnUrl, [string]$JaUrl, [string[]]$BreadcrumbNames, [string[]]$BreadcrumbUrls) {
  $html = Get-Content -Raw $Path
  if ($html -match '<!-- hreflang -->') { return }

  $hreflangBlock = @"

    <!-- hreflang -->
    <link rel="alternate" hreflang="en" href="$EnUrl" />
    <link rel="alternate" hreflang="ja" href="$JaUrl" />
    <link rel="alternate" hreflang="x-default" href="$EnUrl" />
"@

  # BreadcrumbList JSON-LD
  $items = @()
  for ($i = 0; $i -lt $BreadcrumbNames.Count; $i++) {
    $pos = $i + 1
    $name = $BreadcrumbNames[$i]
    $url = $BreadcrumbUrls[$i]
    $items += "        { ""@type"": ""ListItem"", ""position"": $pos, ""name"": ""$name"", ""item"": ""$url"" }"
  }
  $itemsJson = ($items -join ",`n")
  $breadcrumbJsonLd = @"

    <script type="application/ld+json">
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": [
$itemsJson
      ]
    }
    </script>
"@

  # Insert after canonical
  $pattern = [regex]'<link\s+rel="canonical"\s+href="[^"]+"\s*/?>'
  $m = $pattern.Match($html)
  if (-not $m.Success) {
    throw "Canonical tag not found in $Path"
  }
  $canonicalTag = $m.Value
  $replacement = $canonicalTag + $hreflangBlock + $breadcrumbJsonLd
  $html = $pattern.Replace($html, [System.Text.RegularExpressions.MatchEvaluator]{ param($mm) $replacement }, 1)

  Write-FileUtf8NoBom $Path $html
}

$mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')
foreach ($t in $mbtiTypes) {
  $enPath = "en/mbti/$t/index.html"
  $enUrl  = "https://profilecode.codes/en/mbti/$t/"
  $jaPath = "ja/mbti/$t/index.html"
  $jaUrl  = "https://profilecode.codes/ja/mbti/$t/"

  Ensure-JaStub $jaPath $enUrl ("$($t.ToUpper()) (JA) | Profilecode") "$($t.ToUpper()) Japanese URL placeholder. Canonical is the English page."
  Ensure-HreflangAndBreadcrumb $enPath $enUrl $jaUrl @('Home','MBTI',$t.ToUpper()) @('https://profilecode.codes/en/','https://profilecode.codes/en/mbti/',$enUrl)
}

foreach ($n in 1..9) {
  $enPath = "en/enneagram/$n/index.html"
  $enUrl  = "https://profilecode.codes/en/enneagram/$n/"
  $jaPath = "ja/enneagram/$n/index.html"
  $jaUrl  = "https://profilecode.codes/ja/enneagram/$n/"

  Ensure-JaStub $jaPath $enUrl ("Enneagram Type $n (JA) | Profilecode") "Japanese URL placeholder. Canonical is the English page."
  Ensure-HreflangAndBreadcrumb $enPath $enUrl $jaUrl @('Home','Enneagram',"Type $n") @('https://profilecode.codes/en/','https://profilecode.codes/en/enneagram/',$enUrl)
}

# en/mbti/types
$enMbtiTypesPath = 'en/mbti/types/index.html'
$enMbtiTypesUrl  = 'https://profilecode.codes/en/mbti/types/'
$jaMbtiUrl       = 'https://profilecode.codes/ja/mbti/'
Ensure-HreflangAndBreadcrumb $enMbtiTypesPath $enMbtiTypesUrl $jaMbtiUrl @('Home','MBTI','Types') @('https://profilecode.codes/en/','https://profilecode.codes/en/mbti/',$enMbtiTypesUrl)

Write-Host 'seo_en_migration.ps1 completed.'


