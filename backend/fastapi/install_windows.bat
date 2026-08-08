@echo off
echo ======================================================================
echo Installing packages for Windows (using pre-built wheels only)
echo ======================================================================
echo.

cd /d "%~dp0"

echo [INFO] Upgrading pip...
python -m pip install --upgrade pip

echo [INFO] Installing packages using pre-built wheels only...
echo [INFO] This avoids Rust compilation errors on Windows
echo.

pip install --only-binary :all: fastapi uvicorn python-dotenv

if %errorlevel% neq 0 (
    echo [ERROR] Installation failed with --only-binary option.
    echo [INFO] Trying without restriction (may take longer)...
    pip install fastapi uvicorn python-dotenv
)

echo.
echo [OK] Installation completed!
echo.
echo You can now run: python main.py
echo.
pause

