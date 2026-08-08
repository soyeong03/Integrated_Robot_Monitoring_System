@echo off
cd /d "%~dp0"

echo ======================================================================
echo Starting server in simulation mode...
echo Server: http://localhost:8000
echo ======================================================================
echo.

REM Try to install minimal packages if needed
python -c "import fastapi" >nul 2>&1
if %errorlevel% neq 0 (
    echo Installing fastapi and uvicorn...
    echo [INFO] Trying to install pre-built packages (wheels only)...
    pip install --only-binary :all: fastapi uvicorn
    if %errorlevel% neq 0 (
        echo [WARNING] Wheel installation failed. Trying without restriction...
        pip install --upgrade pip
        pip install fastapi uvicorn
    )
)

python main.py

pause
