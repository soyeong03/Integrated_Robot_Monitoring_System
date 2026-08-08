@echo off
chcp 65001 >nul 2>&1
cls

echo ======================================================================
echo Robot Fleet Monitoring API Server
echo ======================================================================
echo.

cd /d "%~dp0"

REM Check the project-root environment file.
if not exist "..\..\.env" (
    echo [WARNING] Project-root .env not found.
    echo [INFO] Set InfluxDB values as shell environment variables when needed.
    echo.
)

REM Check Python packages
echo [INFO] Checking Python packages...
python -c "import fastapi" >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Required packages not installed.
    echo [INFO] Installing packages (trying pre-built wheels first)...
    pip install --upgrade pip
    pip install --only-binary :all: -r requirements.txt
    if %errorlevel% neq 0 (
        echo [WARNING] Pre-built wheel installation failed.
        echo [INFO] Trying installation without wheel restriction...
        pip install -r requirements.txt
        if %errorlevel% neq 0 (
            echo [ERROR] Package installation failed.
            echo [INFO] Trying minimal installation (fastapi, uvicorn only)...
            pip install --only-binary :all: fastapi uvicorn
            if %errorlevel% neq 0 (
                pip install fastapi uvicorn
            )
        )
    )
    echo [OK] Package installation completed.
    echo.
)

REM Server mode selection
echo ======================================================================
echo Select server mode:
echo   1. InfluxDB mode (main_with_influx.py) - Recommended
echo   2. Simulation mode (main.py) - Simple, no InfluxDB needed
echo ======================================================================
set /p MODE="Select (1 or 2, default: 2): "

if "%MODE%"=="" set MODE=2
if "%MODE%"=="1" goto influx_mode
goto sim_mode

:influx_mode
echo.
echo [INFO] Starting InfluxDB mode...
echo [INFO] Server: http://localhost:8000
echo [INFO] API Docs: http://localhost:8000/docs
echo.
echo [INFO] Press Ctrl+C to stop
echo ======================================================================
echo.
python main_with_influx.py
goto end

:sim_mode
echo.
echo [INFO] Starting simulation mode...
echo [INFO] Server: http://localhost:8000
echo [INFO] API Docs: http://localhost:8000/docs
echo.
echo [INFO] Press Ctrl+C to stop
echo ======================================================================
echo.
python main.py
goto end

:end
pause
