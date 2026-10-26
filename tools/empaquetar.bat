@echo off
rem Doble clic para crear build\juego-itch.zip
powershell -NoProfile -ExecutionPolicy Bypass -File "%~dp0empaquetar.ps1"
pause
