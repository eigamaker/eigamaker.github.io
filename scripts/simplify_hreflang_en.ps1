$ErrorActionPreference='Stop'
$enPages = Get-ChildItem -Path 'en' -Recurse -Filter 'index.html' | Where-Object { $_.FullName -notmatch '\\node_modules\\' }

foreach($f in $enPages){
  $c = Get-Content -Raw -Encoding UTF8 $f.FullName
  $relPath = $f.FullName.Replace((Get-Location).Path + '\', '').Replace('\', '/')
  $baseUrl = 'https://profilecode.codes/' + $relPath.Replace('/index.html', '/')
  $jaUrl = $baseUrl.Replace('/en/', '/ja/')
  
  # hreflang を en, ja, x-default のみに変更
  $newHreflang = "    <!-- hreflang -->`n"
  $newHreflang += "    <link rel=`"alternate`" hreflang=`"en`" href=`"$baseUrl`" />`n"
  $newHreflang += "    <link rel=`"alternate`" hreflang=`"ja`" href=`"$jaUrl`" />`n"
  $newHreflang += "    <link rel=`"alternate`" hreflang=`"x-default`" href=`"$baseUrl`" />`n"
  
  # 既存の hreflang ブロックを検索して置換
  if($c -match '(?s)<!-- hreflang -->.*?x-default[^>]*>'){
    $c = $c -replace '(?s)<!-- hreflang -->.*?x-default[^>]*>', $newHreflang.TrimEnd()
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($f.FullName, $c, $utf8NoBom)
  }
}

Write-Host "Updated hreflang to en/ja/x-default only on /en/ pages."

