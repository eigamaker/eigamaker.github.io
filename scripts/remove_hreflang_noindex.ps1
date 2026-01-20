$ErrorActionPreference='Stop'
$langs = @('ar','de','es','fr','hi','id','it','ko','pt','zh','zh_hant')

foreach($lang in $langs){
  $pages = Get-ChildItem -Path $lang -Recurse -Filter 'index.html' -ErrorAction SilentlyContinue
  foreach($f in $pages){
    $c = Get-Content -Raw -Encoding UTF8 $f.FullName
    # hreflang ブロックを削除（noindex ページなので hreflang は不要）
    if($c -match '(?s)<!-- hreflang -->.*?x-default[^>]*>'){
      $c = $c -replace '(?s)<!-- hreflang -->.*?x-default[^>]*>', ''
      $utf8NoBom = New-Object System.Text.UTF8Encoding $false
      [System.IO.File]::WriteAllText($f.FullName, $c, $utf8NoBom)
    }
  }
}

Write-Host "Removed hreflang from noindex multilingual pages."

