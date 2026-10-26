# Crea el zip para subir a itch.io: build/juego-itch.zip
# Incluye index.html, lib/, src/ y assets/ con index.html en la raíz del zip.
# Se ejecuta con doble clic en empaquetar.bat (o desde PowerShell: .\tools\empaquetar.ps1)

$ErrorActionPreference = 'Stop'
$root = Split-Path -Parent $PSScriptRoot
Set-Location $root

if (-not (Test-Path 'index.html')) { throw 'No encuentro index.html en la carpeta del proyecto.' }
if (-not (Test-Path 'lib/phaser.min.js')) { Write-Warning 'Falta lib/phaser.min.js: el juego dependerá de internet para cargar Phaser.' }

$include = @('index.html', 'lib', 'src', 'assets')
$skip = @('.gitkeep', '.DS_Store', 'Thumbs.db', 'desktop.ini')

New-Item -ItemType Directory -Force -Path 'build' | Out-Null
$zipPath = Join-Path $root 'build/juego-itch.zip'
if (Test-Path $zipPath) { Remove-Item $zipPath }

Add-Type -AssemblyName System.IO.Compression
Add-Type -AssemblyName System.IO.Compression.FileSystem

# Se escribe entrada a entrada con barras "/" para que itch.io (servidores Linux) lea bien las rutas.
$zip = [System.IO.Compression.ZipFile]::Open($zipPath, 'Create')
$count = 0
try {
  foreach ($item in $include) {
    if (-not (Test-Path $item)) { continue }
    $files = if ((Get-Item $item).PSIsContainer) { Get-ChildItem $item -Recurse -File } else { Get-Item $item }
    foreach ($f in $files) {
      if ($skip -contains $f.Name) { continue }
      $rel = $f.FullName.Substring($root.Length + 1) -replace '\\', '/'
      [System.IO.Compression.ZipFileExtensions]::CreateEntryFromFile($zip, $f.FullName, $rel, 'Optimal') | Out-Null
      $count++
    }
  }
} finally { $zip.Dispose() }

$sizeMb = [math]::Round((Get-Item $zipPath).Length / 1MB, 2)
Write-Host ''
Write-Host "Listo: build/juego-itch.zip ($count archivos, $sizeMb MB)" -ForegroundColor Green
Write-Host 'Súbelo en itch.io como proyecto HTML y marca "This file will be played in the browser".'
if ($sizeMb -gt 50) { Write-Warning 'Pesa más de 50 MB: tardará en cargar en el móvil. Revisa imágenes y música.' }
