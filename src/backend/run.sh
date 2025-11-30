#!/bin/bash

cd "$(dirname "$0")"

echo "======================================================================"
echo "Robot Monitoring System - Backend Server"
echo "======================================================================"
echo ""

# Check if Python is available
if ! command -v python3 &> /dev/null; then
    echo "[ERROR] Python3 is not installed"
    exit 1
fi

# Check and install packages
echo "[1/3] Checking packages..."
if ! python3 -c "import fastapi" 2>/dev/null; then
    echo "[2/3] Installing packages..."
    python3 -m pip install --upgrade pip --quiet
    python3 -m pip install -r requirements_minimal.txt
    echo "[OK] Packages installed."
else
    echo "[OK] Packages already installed."
fi

echo "[3/3] Starting server..."
echo ""
echo "======================================================================"
echo "Server running at: http://localhost:8000"
echo "API docs at: http://localhost:8000/docs"
echo "======================================================================"
echo "Press Ctrl+C to stop"
echo ""

python3 main.py

