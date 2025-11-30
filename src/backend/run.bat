@echo off
cd /d "%~dp0"

echo ======================================================================
echo Robot Monitoring System - Backend Server
echo ======================================================================
echo.

REM Check if Python is available
python --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Python is not installed or not in PATH
    echo Please install Python 3.11+ from https://www.python.org/
    pause
    exit /b 1
)

REM Check and install packages
echo [1/3] Checking packages...
python -c "import fastapi" >nul 2>&1
if %errorlevel% neq 0 (
    echo [2/3] Installing packages (this may take a minute)...
    python -m pip install --upgrade pip --quiet
    python -m pip install --only-binary :all: -r requirements_minimal.txt
    if %errorlevel% neq 0 (
        echo [WARNING] Pre-built package installation failed.
        echo Trying alternative installation method...
        python -m pip install fastapi uvicorn python-dotenv
    )
    echo [OK] Packages installed.
) else (
    echo [OK] Packages already installed.
)

echo [3/3] Starting server...
echo.
echo ======================================================================
echo Server running at: http://localhost:8000
echo API docs at: http://localhost:8000/docs
echo ======================================================================
echo Press Ctrl+C to stop
echo.

python main.py

pause

