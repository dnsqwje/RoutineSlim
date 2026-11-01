@echo off
setlocal
cd /d "%~dp0"
where node >nul 2>nul
if errorlevel 1 (
  echo Please install Node.js 24 LTS from https://nodejs.org and reopen this file.
  pause
  exit /b 1
)
where npm.cmd >nul 2>nul
if errorlevel 1 (
  echo npm was not found. Install Node.js 24 LTS with npm enabled.
  pause
  exit /b 1
)
echo Installing frontend dependencies...
call npm ci
if errorlevel 1 (
  echo Installation failed. Please copy the error message.
  pause
  exit /b 1
)
echo Starting RoutineSlim Web. Keep this window open.
call npm run dev -- --open
if errorlevel 1 (
  echo Startup failed. Please copy the error message.
  pause
  exit /b 1
)
