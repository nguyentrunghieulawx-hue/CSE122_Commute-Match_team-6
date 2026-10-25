$root = 'O:\CSE122'
$files = Get-ChildItem -Path $root -Recurse -Filter '*.html'

foreach ($f in $files) {
  $path = $f.FullName
  $content = Get-Content -Path $path -Raw -Encoding UTF8

  # Skip if theme.js is already referenced
  if ($content -match 'theme\.js') {
    Write-Host ("SKIP (already has theme.js): " + $path)
    continue
  }

  # Determine the relative script path based on folder
  if ($path -match '\\DAI\\') {
    $rel = '../HIEU/js/theme.js'
  } elseif ($path -match '\\DUC\\') {
    $rel = '../HIEU/js/theme.js'
  } elseif ($path -match '\\HIEU\\') {
    $rel = 'js/theme.js'
  } else {
    $rel = 'HIEU/js/theme.js'
  }

  $scriptTag = '<script src="' + $rel + '"></' + 'script>'

  # Insert the script tag right before </body>
  $content = $content -replace '(</body>)', ('    ' + $scriptTag + "`n" + '$1')

  Set-Content -Path $path -Value $content -Encoding UTF8 -NoNewline
  Write-Host ("INJECTED into " + $path)
}

Write-Host "DONE."