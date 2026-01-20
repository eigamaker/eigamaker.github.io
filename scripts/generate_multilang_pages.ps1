$ErrorActionPreference = 'Stop'

function Ensure-Dir([string]$Path) {
  if (-not (Test-Path $Path)) { New-Item -ItemType Directory -Force -Path $Path | Out-Null }
}

function Write-FileUtf8NoBom([string]$Path, [string]$Content) {
  $dir = Split-Path -Parent $Path
  if ($dir) { Ensure-Dir $dir }
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

function HreflangBlockAll([string[]]$AllLangs, [string]$RoutePathWithTrailingSlash, [string]$EnUrl) {
  $lines = New-Object System.Collections.Generic.List[string]
  $lines.Add('  <!-- hreflang -->') | Out-Null
  foreach ($l in $AllLangs) {
    if ($l -eq 'en') {
      $lines.Add("  <link rel=""alternate"" hreflang=""en"" href=""$EnUrl"" />") | Out-Null
    } else {
      $u = "https://profilecode.codes/$l$RoutePathWithTrailingSlash"
      $lines.Add("  <link rel=""alternate"" hreflang=""$l"" href=""$u"" />") | Out-Null
    }
  }
  $lines.Add("  <link rel=""alternate"" hreflang=""x-default"" href=""$EnUrl"" />") | Out-Null
  return ($lines -join "`n")
}

function Build-StubPage([string]$Hreflang, [string]$Lang, [string]$EnUrl, [string]$Title, [string]$Description, [string]$Heading, [string]$Body, [string]$GoEnglishLabel) {
  return @"
<!doctype html>
<html lang="$Lang">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$Title</title>
  <meta name="description" content="$Description">
  <link rel="canonical" href="$EnUrl">
  <meta name="robots" content="noindex,follow">
  <meta name="googlebot" content="noindex,follow">
$hreflang
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; padding: 24px; background: #f5f5f5; color: #222; }
    .card { max-width: 900px; margin: 0 auto; background: white; border-radius: 14px; padding: 22px; box-shadow: 0 6px 25px rgba(0,0,0,0.10); }
    h1 { margin: 0 0 10px; font-size: 1.35rem; }
    p { margin: 10px 0; line-height: 1.7; color: #444; }
    .cta { display: inline-block; margin-top: 10px; padding: 10px 14px; border-radius: 10px; background: #667eea; color: white; text-decoration: none; font-weight: 700; }
    .links { margin-top: 14px; }
    .links a { margin-right: 12px; color: #667eea; text-decoration: none; font-weight: 600; }
    .links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <div class="card">
    <h1>$Heading</h1>
    <p>$Body</p>
    <a class="cta" href="$EnUrl">$GoEnglishLabel</a>
    <div class="links">
      <a href="/$Lang/">Home</a>
      <a href="/$Lang/mbti/">MBTI</a>
      <a href="/$Lang/16-personality-test/">16 Personality Test</a>
      <a href="/$Lang/enneagram/">Enneagram</a>
    </div>
  </div>
</body>
</html>
"@
}

function Build-HomePage([string]$Hreflang, [string]$Lang, [string]$EnUrl, [string]$Title, [string]$Description, [string]$LangName) {
  return @"
<!doctype html>
<html lang="$Lang">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>$Title</title>
  <meta name="description" content="$Description">
  <link rel="canonical" href="$EnUrl">
  <meta name="robots" content="noindex,follow">
  <meta name="googlebot" content="noindex,follow">
$hreflang
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif; margin: 0; background: #f5f5f5; color: #222; }
    header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 48px 20px; text-align: center; }
    header h1 { margin: 0 0 10px; font-size: 2rem; }
    header p { margin: 0; opacity: 0.95; max-width: 900px; margin-left: auto; margin-right: auto; }
    .container { max-width: 1000px; margin: 0 auto; padding: 20px; }
    .grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px; margin-top: 18px; }
    .card { background: white; border-radius: 14px; padding: 18px; border: 2px solid #eee; }
    .card a { text-decoration: none; color: inherit; display: block; }
    .card h2 { margin: 0 0 8px; font-size: 1.2rem; color: #333; }
    .small { color: #666; line-height: 1.6; }
    .lang { margin-top: 14px; font-weight: 700; color: #fff; opacity: 0.95; }
    footer { padding: 22px 20px; text-align: center; color: #777; }
    .lang-links { margin-top: 10px; }
    .lang-links a { margin: 0 8px; color: #667eea; text-decoration: none; font-weight: 600; }
    .lang-links a:hover { text-decoration: underline; }
  </style>
</head>
<body>
  <header>
    <h1>Profilecode</h1>
    <p>$Description</p>
    <div class="lang">$LangName</div>
  </header>
  <div class="container">
    <div class="grid">
      <div class="card"><a href="/$Lang/mbti/"><h2>MBTI</h2><div class="small">Learn what MBTI is and explore 16 types.</div></a></div>
      <div class="card"><a href="/$Lang/16-personality-test/"><h2>16 Personality Test</h2><div class="small">Start a free test and understand your type.</div></a></div>
      <div class="card"><a href="/$Lang/enneagram/"><h2>Enneagram</h2><div class="small">Explore the Enneagram and 9 types.</div></a></div>
    </div>
  </div>
  <footer>
    <div><a href="$EnUrl">English (default)</a></div>
    <div class="lang-links">
      <a href="/en/">English</a>
      <a href="/ja/">日本語</a>
      <a href="/ko/">한국어</a>
      <a href="/zh/">简体中文</a>
      <a href="/zh_hant/">繁體中文</a>
      <a href="/fr/">Français</a>
      <a href="/es/">Español</a>
      <a href="/de/">Deutsch</a>
      <a href="/pt/">Português</a>
      <a href="/it/">Italiano</a>
      <a href="/id/">Bahasa Indonesia</a>
      <a href="/hi/">हिन्दी</a>
      <a href="/ar/">العربية</a>
    </div>
  </footer>
</body>
</html>
"@
}

$configPath = 'scripts/lang_pages_config.json'
if (-not (Test-Path $configPath)) { throw "Missing $configPath" }
$config = Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json
$allLangs = @('en') + @($config.supportedLanguages)

$mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')

foreach ($lang in $config.supportedLanguages) {
  # Home: skip ja/index.html (already full Japanese home)
  if ($lang -ne 'ja') {
    $homePath = "$lang/index.html"
    $enUrl = "https://profilecode.codes/en/"
    $title = $config.copy.home.title.$lang
    $desc  = $config.copy.home.desc.$lang
    $langName = $config.languageNames.$lang
    $hreflang = HreflangBlockAll $allLangs '/' $enUrl
    Write-FileUtf8NoBom $homePath (Build-HomePage $hreflang $lang $enUrl $title $desc $langName)
  }

  # Category stubs (localized)
  $stubHeading = $config.copy.stub.heading.$lang
  $stubBody    = $config.copy.stub.body.$lang
  $goEn        = $config.copy.stub.goEnglish.$lang

  $pages = @(
    @{ path = "$lang/mbti/index.html"; route = "/mbti/"; en = "https://profilecode.codes/en/mbti/"; title = "MBTI | Profilecode"; desc = $config.copy.home.desc.$lang },
    @{ path = "$lang/mbti/types/index.html"; route = "/mbti/types/"; en = "https://profilecode.codes/en/mbti/types/"; title = "MBTI Types | Profilecode"; desc = $config.copy.home.desc.$lang },
    @{ path = "$lang/16-personality-test/index.html"; route = "/16-personality-test/"; en = "https://profilecode.codes/en/16-personality-test/"; title = "16 Personality Test | Profilecode"; desc = $config.copy.home.desc.$lang },
    @{ path = "$lang/enneagram/index.html"; route = "/enneagram/"; en = "https://profilecode.codes/en/enneagram/"; title = "Enneagram | Profilecode"; desc = $config.copy.home.desc.$lang }
  )

  foreach ($p in $pages) {
    $hreflang = HreflangBlockAll $allLangs $p.route $p.en
    Write-FileUtf8NoBom $p.path (Build-StubPage $hreflang $lang $p.en $p.title $p.desc $stubHeading $stubBody $goEn)
  }

  # Type stubs
  foreach ($t in $mbtiTypes) {
    $path = "$lang/mbti/$t/index.html"
    $en   = "https://profilecode.codes/en/mbti/$t/"
    $route = "/mbti/$t/"
    $hreflang = HreflangBlockAll $allLangs $route $en
    Write-FileUtf8NoBom $path (Build-StubPage $hreflang $lang $en ("$t | Profilecode") $config.copy.home.desc.$lang $stubHeading $stubBody $goEn)
  }
  foreach ($n in 1..9) {
    $path = "$lang/enneagram/$n/index.html"
    $en   = "https://profilecode.codes/en/enneagram/$n/"
    $route = "/enneagram/$n/"
    $hreflang = HreflangBlockAll $allLangs $route $en
    Write-FileUtf8NoBom $path (Build-StubPage $hreflang $lang $en ("Enneagram Type $n | Profilecode") $config.copy.home.desc.$lang $stubHeading $stubBody $goEn)
  }
}

Write-Host 'generate_multilang_pages.ps1 completed.'


