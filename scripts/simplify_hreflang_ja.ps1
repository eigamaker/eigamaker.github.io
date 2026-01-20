$ErrorActionPreference='Stop'
$jaPages = Get-ChildItem -Path 'ja' -Recurse -Filter 'index.html' | Where-Object { $_.FullName -ne (Resolve-Path 'ja/index.html') }

foreach($f in $jaPages){
  $c = Get-Content -Raw -Encoding UTF8 $f.FullName
  $relPath = $f.FullName.Replace((Get-Location).Path + '\', '').Replace('\', '/')
  $jaUrl = 'https://profilecode.codes/' + $relPath.Replace('/index.html', '/')
  $enUrl = $jaUrl.Replace('/ja/', '/en/')
  
  # hreflang を en, ja, x-default のみに変更
  $newHreflang = "  <!-- hreflang -->`n"
  $newHreflang += "  <link rel=`"alternate`" hreflang=`"ja`" href=`"$jaUrl`" />`n"
  $newHreflang += "  <link rel=`"alternate`" hreflang=`"en`" href=`"$enUrl`" />`n"
  $newHreflang += "  <link rel=`"alternate`" hreflang=`"x-default`" href=`"$enUrl`" />`n"
  
  # 既存の hreflang ブロックを検索して置換
  if($c -match '(?s)<!-- hreflang -->.*?x-default[^>]*>'){
    $c = $c -replace '(?s)<!-- hreflang -->.*?x-default[^>]*>', $newHreflang.TrimEnd()
    $utf8NoBom = New-Object System.Text.UTF8Encoding $false
    [System.IO.File]::WriteAllText($f.FullName, $c, $utf8NoBom)
  }
}

Write-Host "Updated hreflang on /ja/ pages to en/ja/x-default only."

