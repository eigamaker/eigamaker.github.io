$ErrorActionPreference = 'Stop'

function Write-FileUtf8NoBom([string]$Path, [string]$Content) {
  $utf8NoBom = New-Object System.Text.UTF8Encoding($false)
  [System.IO.File]::WriteAllText($Path, $Content, $utf8NoBom)
}

$configPath = 'scripts/lang_pages_config.json'
$config = Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json
$langs = @('en') + @($config.supportedLanguages)

function RouteFromFile([string]$FullName) {
  # ex: en/mbti/intj/index.html -> /en/mbti/intj/
  $root = (Get-Location).Path
  $rel = $FullName
  if ($rel.StartsWith($root)) {
    $rel = $rel.Substring($root.Length).TrimStart('\','/')
  }
  $p = $rel -replace '\\','/'
  if ($p.EndsWith('index.html')) { $p = $p.Substring(0, $p.Length - 'index.html'.Length) }
  if (-not $p.StartsWith('/')) { $p = '/' + $p }
  return $p
}

function UrlForLang([string]$Route, [string]$Lang) {
  if ($Lang -eq 'en') { return "https://profilecode.codes$Route" }
  # replace leading /en/ with /{lang}/
  if ($Route -like '/en/*') {
    $tail = $Route.Substring(4) # keep leading slash in tail
    return "https://profilecode.codes/$Lang/$tail"
  }
  # fallback: just prefix
  return "https://profilecode.codes/$Lang$Route"
}

function BuildHreflangBlock([string]$Route) {
  $enUrl = UrlForLang $Route 'en'
  $lines = @()
  $lines += '    <!-- hreflang -->'
  foreach ($l in $langs) {
    $u = UrlForLang $Route $l
    $lines += "    <link rel=""alternate"" hreflang=""$l"" href=""$u"" />"
  }
  $lines += "    <link rel=""alternate"" hreflang=""x-default"" href=""$enUrl"" />"
  return ($lines -join "`n")
}

function ReplaceHreflang([string]$Html, [string]$NewBlock) {
  # Replace existing hreflang block if present
  $pattern = '(?s)\s*<!--\s*hreflang\s*-->\s*(?:<link\s+rel="alternate"[^>]*>\s*)+'
  if ($Html -match $pattern) {
    return [regex]::Replace($Html, $pattern, "`n$NewBlock`n", 1)
  }
  # Else insert after canonical
  $canon = [regex]::Match($Html, '<link\s+rel="canonical"[^>]*>')
  if (-not $canon.Success) { return $Html }
  return $Html.Substring(0, $canon.Index + $canon.Length) + "`n`n$NewBlock`n" + $Html.Substring($canon.Index + $canon.Length)
}

$files = Get-ChildItem -Path 'en' -Recurse -Filter 'index.html'
foreach ($f in $files) {
  $route = RouteFromFile $f.FullName
  $newBlock = BuildHreflangBlock $route
  $html = Get-Content -Raw -Encoding UTF8 $f.FullName
  $updated = ReplaceHreflang $html $newBlock
  if ($updated -ne $html) {
    Write-FileUtf8NoBom $f.FullName $updated
  }
}

Write-Host 'update_hreflang_all.ps1 completed.'


