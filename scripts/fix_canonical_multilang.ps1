# Fix canonical URLs for all non-English pages
$ErrorActionPreference = 'Stop'

$langs = @('ar','de','es','fr','hi','id','it','ja','ko','pt','zh','zh_hant')
$cats = @('mbti','16-personality-test','enneagram')
$mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')

foreach ($lang in $langs) {
    Write-Host "Fixing canonical for $lang..."
    
    # Home page
    $hp = "$lang/index.html"
    if (Test-Path $hp) {
        $c = Get-Content -Raw -Encoding UTF8 $hp
        $c = $c -replace 'href="https://profilecode\.codes/en/"', "href=`"https://profilecode.codes/$lang/`""
        Set-Content -NoNewline -Encoding UTF8 $hp $c
    }
    
    # Category pages
    foreach ($cat in $cats) {
        $p = "$lang/$cat/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $c = $c -replace 'href="https://profilecode\.codes/en/' + [regex]::Escape($cat) + '/"', "href=`"https://profilecode.codes/$lang/$cat/`""
            Set-Content -NoNewline -Encoding UTF8 $p $c
        }
    }
    
    # MBTI type pages
    foreach ($type in $mbtiTypes) {
        $p = "$lang/mbti/$type/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $c = $c -replace 'href="https://profilecode\.codes/en/mbti/' + [regex]::Escape($type) + '/"', "href=`"https://profilecode.codes/$lang/mbti/$type/`""
            $c = $c -replace 'href="https://profilecode\.codes/en/mbti/' + [regex]::Escape($type) + '/"\s*>', "href=`"https://profilecode.codes/$lang/mbti/$type/`">"
            Set-Content -NoNewline -Encoding UTF8 $p $c
        }
    }
    
    # Enneagram type pages
    foreach ($n in 1..9) {
        $p = "$lang/enneagram/$n/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $c = $c -replace 'href="https://profilecode\.codes/en/enneagram/' + $n + '/"', "href=`"https://profilecode.codes/$lang/enneagram/$n/`""
            Set-Content -NoNewline -Encoding UTF8 $p $c
        }
    }
    
    # mbti/types/index.html
    $tp = "$lang/mbti/types/index.html"
    if (Test-Path $tp) {
        $c = Get-Content -Raw -Encoding UTF8 $tp
        $c = $c -replace 'href="https://profilecode\.codes/en/mbti/types/"', "href=`"https://profilecode.codes/$lang/mbti/types/`""
        Set-Content -NoNewline -Encoding UTF8 $tp $c
    }
}

Write-Host 'fix_canonical_multilang.ps1 completed.'

