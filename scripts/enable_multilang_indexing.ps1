# Enable indexing for non-English pages and set canonical to self
$ErrorActionPreference = 'Stop'

$configPath = Join-Path $PSScriptRoot 'lang_pages_config.json'
$config = Get-Content -Raw -Encoding UTF8 $configPath | ConvertFrom-Json
$langs = $config.supportedLanguages | Where-Object { $_ -ne 'en' }

$baseUrl = 'https://profilecode.codes'

# Patterns to update
$patterns = @(
    @{
        Path = '*/*/index.html'
        Exclude = @('en', 'mbti/types', 'enneagram/types', '16-personality-test/types')
    },
    @{
        Path = '*/*/*/index.html'
        Exclude = @('en', 'mbti/types', 'enneagram/types', '16-personality-test/types')
    },
    @{
        Path = '*/*/*/*/index.html'
        Exclude = @('en', 'mbti/types', 'enneagram/types', '16-personality-test/types')
    }
)

foreach ($lang in $langs) {
    Write-Host "Processing $lang..."
    
    # Home page
    $homePath = "$lang/index.html"
    if (Test-Path $homePath) {
        $content = Get-Content -Raw -Encoding UTF8 $homePath
        $selfUrl = "$baseUrl/$lang/"
        
        # Remove noindex (handle both /> and >)
        $content = $content -replace '<meta name="robots" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="robots" content="noindex,follow">', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow">', ''
        
        # Update canonical to self (handle both /> and >)
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/"\s*/>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/">', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        
        Set-Content -NoNewline -Encoding UTF8 $homePath $content
    }
    
    # Category pages
    $categories = @('mbti', '16-personality-test', 'enneagram')
    foreach ($cat in $categories) {
        $catPath = "$lang/$cat/index.html"
        if (Test-Path $catPath) {
            $content = Get-Content -Raw -Encoding UTF8 $catPath
            $selfUrl = "$baseUrl/$lang/$cat/"
            
        # Remove noindex (handle both /> and >)
        $content = $content -replace '<meta name="robots" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="robots" content="noindex,follow">', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow">', ''
        
        # Update canonical to self (handle both /> and >)
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/' + [regex]::Escape($cat) + '/"\s*/>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/' + [regex]::Escape($cat) + '/">', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/' + [regex]::Escape($cat) + '/"\s*>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
            
            Set-Content -NoNewline -Encoding UTF8 $catPath $content
        }
    }
    
    # MBTI type pages
    $mbtiTypes = @('intj','intp','entj','entp','infj','infp','enfj','enfp','istj','isfj','estj','esfj','istp','isfp','estp','esfp')
    foreach ($type in $mbtiTypes) {
        $typePath = "$lang/mbti/$type/index.html"
        if (Test-Path $typePath) {
            $content = Get-Content -Raw -Encoding UTF8 $typePath
            $selfUrl = "$baseUrl/$lang/mbti/$type/"
            
            # Remove noindex (handle both /> and >)
            $content = $content -replace '<meta name="robots" content="noindex,follow"\s*/>', ''
            $content = $content -replace '<meta name="robots" content="noindex,follow">', ''
            $content = $content -replace '<meta name="googlebot" content="noindex,follow"\s*/>', ''
            $content = $content -replace '<meta name="googlebot" content="noindex,follow">', ''
            
            # Update canonical to self (handle both /> and >)
            $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/mbti/' + [regex]::Escape($type) + '/"\s*/>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
            $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/mbti/' + [regex]::Escape($type) + '/">', "<link rel=`"canonical`" href=`"$selfUrl`" />"
            
            Set-Content -NoNewline -Encoding UTF8 $typePath $content
        }
    }
    
    # Enneagram type pages
    foreach ($n in 1..9) {
        $typePath = "$lang/enneagram/$n/index.html"
        if (Test-Path $typePath) {
            $content = Get-Content -Raw -Encoding UTF8 $typePath
            $selfUrl = "$baseUrl/$lang/enneagram/$n/"
            
            # Remove noindex (handle both /> and >)
            $content = $content -replace '<meta name="robots" content="noindex,follow"\s*/>', ''
            $content = $content -replace '<meta name="robots" content="noindex,follow">', ''
            $content = $content -replace '<meta name="googlebot" content="noindex,follow"\s*/>', ''
            $content = $content -replace '<meta name="googlebot" content="noindex,follow">', ''
            
            # Update canonical to self (handle both /> and >)
            $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/enneagram/' + $n + '/"\s*/>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
            $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/enneagram/' + $n + '/">', "<link rel=`"canonical`" href=`"$selfUrl`" />"
            
            Set-Content -NoNewline -Encoding UTF8 $typePath $content
        }
    }
    
    # mbti/types/index.html
    $typesPath = "$lang/mbti/types/index.html"
    if (Test-Path $typesPath) {
        $content = Get-Content -Raw -Encoding UTF8 $typesPath
        $selfUrl = "$baseUrl/$lang/mbti/types/"
        
        # Remove noindex (handle both /> and >)
        $content = $content -replace '<meta name="robots" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="robots" content="noindex,follow">', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow"\s*/>', ''
        $content = $content -replace '<meta name="googlebot" content="noindex,follow">', ''
        
        # Update canonical to self (handle both /> and >)
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/mbti/types/"\s*/>', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        $content = $content -replace '<link rel="canonical" href="https://profilecode\.codes/en/mbti/types/">', "<link rel=`"canonical`" href=`"$selfUrl`" />"
        
        Set-Content -NoNewline -Encoding UTF8 $typesPath $content
    }
}

Write-Host 'enable_multilang_indexing.ps1 completed.'

