# REDLINE Cybersecurity Ecosystem Startup Script
Write-Host "======================================================================" -ForegroundColor Red
Write-Host "   REDLINE: Cyber Safety & Threat Intelligence Ecosystem" -ForegroundColor White
Write-Host "   'Understand the Threat. Recognize the Risk. Protect Yourself.'" -ForegroundColor Gray
Write-Host "======================================================================" -ForegroundColor Red

# 1. Start Backend
Write-Host "`n[*] Starting Backend Flask API on port 5000..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\backend'; python app.py"

Start-Sleep -Seconds 3

# 2. Start Frontend
Write-Host "[*] Starting Frontend Vite Server on port 5173..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "Set-Location '$PSScriptRoot\frontend'; npm.cmd run dev"

Write-Host "`n[+] REDLINE Ecosystem Launched!" -ForegroundColor Green
Write-Host "    Frontend: http://127.0.0.1:5173" -ForegroundColor Yellow
Write-Host "    Backend:  http://127.0.0.1:5000/api/health" -ForegroundColor Yellow
