#!/bin/bash

echo "======================================================================"
echo "🚀 로봇 플릿 모니터링 API 서버 시작"
echo "======================================================================"

# 현재 디렉토리 확인
SCRIPT_DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"
cd "$SCRIPT_DIR"

# .env 파일 확인
if [ ! -f ".env" ]; then
    echo "⚠️  .env 파일이 없습니다."
    echo "📝 .env.example을 복사하여 .env 파일을 생성합니다..."
    cp .env.example .env
    echo ""
    echo "✅ .env 파일 생성 완료"
    echo "⚠️  .env 파일을 편집하여 INFLUXDB_TOKEN을 설정하세요."
    echo ""
fi

# Python 패키지 확인
echo "📦 Python 패키지 확인 중..."
if ! python -c "import fastapi" 2>/dev/null; then
    echo "⚠️  필요한 패키지가 설치되지 않았습니다."
    echo "📝 requirements.txt에서 패키지 설치 중..."
    pip install -r requirements.txt
    echo "✅ 패키지 설치 완료"
    echo ""
fi

# 서버 모드 선택
echo "======================================================================"
echo "서버 모드 선택:"
echo "  1. InfluxDB 연동 모드 (추천) - main_with_influx.py"
echo "  2. 시뮬레이션 모드 - main.py"
echo "======================================================================"
read -p "선택 (1 또는 2, 기본값: 1): " MODE

MODE=${MODE:-1}

if [ "$MODE" = "1" ]; then
    echo ""
    echo "✅ InfluxDB 연동 모드로 시작합니다..."
    echo "📡 http://localhost:8000"
    echo "📚 API 문서: http://localhost:8000/docs"
    echo ""
    echo "🛑 종료: Ctrl+C"
    echo "======================================================================"
    echo ""
    python main_with_influx.py
else
    echo ""
    echo "✅ 시뮬레이션 모드로 시작합니다..."
    echo "📡 http://localhost:8000"
    echo "📚 API 문서: http://localhost:8000/docs"
    echo ""
    echo "🛑 종료: Ctrl+C"
    echo "======================================================================"
    echo ""
    python main.py
fi
