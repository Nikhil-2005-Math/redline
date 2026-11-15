@echo off
title REDLINE - Cyber Safety & Threat Intelligence Ecosystem
color 0C

echo ======================================================================
echo    REDLINE: Cyber Safety & Threat Intelligence Ecosystem
echo    "Understand the Threat. Recognize the Risk. Protect Yourself."
echo ======================================================================
echo.

echo [*] Starting Python Flask Backend on http://127.0.0.1:5000 ...
start "REDLINE Backend" cmd /k "cd backend && python app.py"

echo [*] Waiting 3 seconds for backend initialization...
timeout /t 3 /nobreak > nul

echo [*] Starting Frontend Development Server on http://127.0.0.1:5173 ...
start "REDLINE Frontend" cmd /k "cd frontend && npm.cmd run dev"

echo.
echo ======================================================================
echo    REDLINE is starting!
echo    Frontend: http://127.0.0.1:5173
echo    Backend:  http://127.0.0.1:5000/api/health
echo ======================================================================
echo.
pause
