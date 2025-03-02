@echo off
echo Starting Barangay Case Management System...

REM Check if Node.js is installed
where node >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Node.js is not installed. Please install Node.js to run this application.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Check if npm is installed
where npm >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo npm is not installed. Please install npm to run this application.
    echo Press any key to exit...
    pause >nul
    exit /b 1
)

REM Navigate to the script directory
cd /d "%~dp0"

REM Check if the app is already built
if not exist "dist" (
    echo Building the application for the first time...
    call npm run build
)

REM Start the application in production mode
echo Starting the application in production mode...
set NODE_ENV=production
call npx electron electron/main.cjs

REM Check if the application started successfully
if %ERRORLEVEL% NEQ 0 (
    echo Failed to start the application.
    echo Press any key to exit...
    pause >nul
    exit /b 1
) 