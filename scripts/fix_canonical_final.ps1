# Final fix for canonical URLs - more aggressive pattern matching
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
        $oldPattern = 'href="https://profilecode\.codes/en/"'
        $newUrl = "href=`"https://profilecode.codes/$lang/`""
        if ($c -match $oldPattern) {
            $c = $c -replace $oldPattern, $newUrl
            Set-Content -NoNewline -Encoding UTF8 $hp $c
            Write-Host "  Fixed $hp"
        }
    }
    
    # Category pages
    foreach ($cat in $cats) {
        $p = "$lang/$cat/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $oldPattern = 'href="https://profilecode\.codes/en/' + [regex]::Escape($cat) + '/"'
            $newUrl = "href=`"https://profilecode.codes/$lang/$cat/`""
            if ($c -match $oldPattern) {
                $c = $c -replace $oldPattern, $newUrl
                Set-Content -NoNewline -Encoding UTF8 $p $c
                Write-Host "  Fixed $p"
            }
        }
    }
    
    # MBTI type pages
    foreach ($type in $mbtiTypes) {
        $p = "$lang/mbti/$type/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $oldPattern = 'href="https://profilecode\.codes/en/mbti/' + [regex]::Escape($type) + '/"'
            $newUrl = "href=`"https://profilecode.codes/$lang/mbti/$type/`""
            if ($c -match $oldPattern) {
                $c = $c -replace $oldPattern, $newUrl
                Set-Content -NoNewline -Encoding UTF8 $p $c
                Write-Host "  Fixed $p"
            }
        }
    }
    
    # Enneagram type pages
    foreach ($n in 1..9) {
        $p = "$lang/enneagram/$n/index.html"
        if (Test-Path $p) {
            $c = Get-Content -Raw -Encoding UTF8 $p
            $oldPattern = 'href="https://profilecode\.codes/en/enneagram/' + $n + '/"'
            $newUrl = "href=`"https://profilecode.codes/$lang/enneagram/$n/`""
            if ($c -match $oldPattern) {
                $c = $c -replace $oldPattern, $newUrl
                Set-Content -NoNewline -Encoding UTF8 $p $c
                Write-Host "  Fixed $p"
            }
        }
    }
    
    # mbti/types/index.html
    $tp = "$lang/mbti/types/index.html"
    if (Test-Path $tp) {
        $c = Get-Content -Raw -Encoding UTF8 $tp
        $oldPattern = 'href="https://profilecode\.codes/en/mbti/types/"'
        $newUrl = "href=`"https://profilecode.codes/$lang/mbti/types/`""
        if ($c -match $oldPattern) {
            $c = $c -replace $oldPattern, $newUrl
            Set-Content -NoNewline -Encoding UTF8 $tp $c
            Write-Host "  Fixed $tp"
        }
    }
}

Write-Host 'fix_canonical_final.ps1 completed.'

