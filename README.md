# Integrated Robot Monitoring System

Robot-arm, UGV, Drone 각 3대의 상태와 센서 데이터를 모니터링하는 프로젝트입니다.
현재 React 프론트엔드, 호환용 FastAPI 백엔드, Python 시뮬레이터, InfluxDB 인프라로 구성되어 있으며 `backend/`는 향후 Spring Boot 전환 지점입니다.

## 프로젝트 구조

```text
.
├── frontend/                 # React + TypeScript + Vite
│   ├── src/                  # 기존 React 소스와 로봇 타입
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   └── fastapi/              # Spring Boot 대체 전까지 유지하는 기존 API
├── simulator/                # InfluxDB용 Python 더미 데이터 생성기
├── infra/
│   ├── docker-compose.yml    # FastAPI 및 InfluxDB 구성
│   └── docker/legacy/        # 중복 Dockerfile 원본 보관 후보
├── docs/                     # 실행 및 문제 해결 문서
└── .env.example             # 안전한 환경 변수 이름과 예시
```

환경 설정은 프로젝트 루트 `.env`만 사용하며 Git에서 제외됩니다. 실제 값은 저장소 문서나 코드에 복사하지 마세요.

```bash
cp .env.example .env
```

운영 전에 `.env`의 `CHANGE_ME` 항목을 로컬 값으로 변경합니다.

## 빠른 실행

모든 명령은 프로젝트 루트에서 실행합니다.

### 1. FastAPI 시뮬레이션 서버

```bash
python3 -m pip install -r backend/fastapi/requirements_minimal.txt
python3 backend/fastapi/main.py
```

API는 `http://localhost:8000`, Swagger UI는 `http://localhost:8000/docs`입니다.

### 2. React 프론트엔드

별도 터미널에서 실행합니다.

```bash
cd frontend
npm install
npm run dev
```

프론트엔드는 `http://localhost:5173`에서 열립니다. 백엔드 연결에 실패하면 브라우저 시뮬레이션 데이터로 전환됩니다.

### 3. InfluxDB 연동

```bash
cp .env.example .env
docker compose --env-file .env -f infra/docker-compose.yml config
docker compose --env-file .env -f infra/docker-compose.yml up -d influxdb
python3 simulator/quick_generate.py
python3 backend/fastapi/main_with_influx.py
```

InfluxDB 연동에는 `INFLUXDB_URL`, `INFLUXDB_USERNAME`, `INFLUXDB_PASSWORD`, `INFLUXDB_TOKEN`, `INFLUXDB_ORG`, `INFLUXDB_BUCKET` 설정이 필요합니다.

## 주요 진입점

- 프론트엔드: `frontend/src/main.tsx`
- React 애플리케이션: `frontend/src/App.tsx`
- FastAPI 시뮬레이션: `backend/fastapi/main.py`
- FastAPI + InfluxDB: `backend/fastapi/main_with_influx.py`
- 대화형 데이터 생성: `simulator/generate_dummy_data.py`
- 빠른 데이터 생성: `simulator/quick_generate.py`
- Docker Compose: `infra/docker-compose.yml`

## 문서

- [빠른 시작](./docs/QUICKSTART.md)
- [실행 체크리스트](./docs/QUICK_START_CHECKLIST.md)
- [문제 해결](./docs/TROUBLESHOOTING.md)
- [FastAPI 호환 백엔드](./docs/backend/README.md)
- [시뮬레이터](./docs/simulator/README_DUMMY_DATA.md)
- [프론트엔드](./docs/frontend/README.md)

## Spring Boot 전환 원칙

Spring Boot 프로젝트는 `backend/` 아래에 추가하되, 다음 기능이 대체될 때까지 `backend/fastapi/`를 유지합니다.

- `GET /api/robots`
- `GET /api/robots/{robotId}`
- `GET /api/robots/{robotId}/timeseries`
- `GET /api/mode`
- `GET /health`
- InfluxDB 최신 데이터 및 시계열 조회
- FastAPI 연결 실패 시 시뮬레이션 fallback

React의 `Robot` 타입과 센서 필드 계약은 `frontend/src/types/robot.ts`를 기준으로 유지합니다.
