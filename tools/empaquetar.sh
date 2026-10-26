#!/usr/bin/env bash
# Crea build/juego-itch.zip para itch.io (macOS / Linux). Uso: bash tools/empaquetar.sh
set -euo pipefail
cd "$(dirname "$0")/.."

[ -f index.html ] || { echo "No encuentro index.html"; exit 1; }
[ -f lib/phaser.min.js ] || echo "Aviso: falta lib/phaser.min.js; el juego dependerá de internet para cargar Phaser."

mkdir -p build
rm -f build/juego-itch.zip
zip -rq build/juego-itch.zip index.html lib src assets -x '*.gitkeep' '*.DS_Store'

echo "Listo: build/juego-itch.zip ($(unzip -l build/juego-itch.zip | tail -1 | awk '{print $2}') archivos, $(du -h build/juego-itch.zip | cut -f1))"
