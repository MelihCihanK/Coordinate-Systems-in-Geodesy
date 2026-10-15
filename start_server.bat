@echo off
chcp 65001 > nul
echo GEO203E - Coordinate Systems in Geodesy (http://localhost:8000)
start http://localhost:8000
python -m http.server 8000
pause