# 🤖 로봇 플릿 모니터링 시스템 - 백엔드

Spring Boot 전환 전까지 호환성을 유지하는 FastAPI API 서버입니다. 더미 데이터 생성기는 `simulator/`로 분리되었습니다.

---

## 📁 파일 구조

```text
backend/fastapi/
├── main.py                    # 시뮬레이션 모드 API 서버
├── main_with_influx.py        # InfluxDB 연동 API 서버
├── requirements*.txt          # Python 의존성
├── Dockerfile                 # 호환 API 컨테이너
└── run.*, start_server.*      # OS별 실행 스크립트

simulator/
├── generate_dummy_data.py     # 대화형 데이터 생성기
└── quick_generate.py          # 빠른 데이터 생성기
```

모든 명령은 프로젝트 루트에서 실행하며 환경 설정은 루트 `.env`를 사용합니다.

---

## 🚀 빠른 시작 (5분)

### 1. 환경 설정
```bash
# 루트 .env를 사용하거나 셸 환경 변수를 설정하세요
# .env 파일을 열어 INFLUXDB_TOKEN 수정
```

### 2. 패키지 설치
```bash
pip install -r backend/fastapi/requirements.txt
```

### 3. 더미 데이터 생성
```bash
python simulator/quick_generate.py
```

### 4. API 서버 실행
```bash
python backend/fastapi/main_with_influx.py
```

### 5. 확인
- API: http://localhost:8000
- 문서: http://localhost:8000/docs

> 더 자세한 내용은 [빠른시작.md](./빠른시작.md) 참조

---

## 📚 문서

- **[빠른시작.md](./빠른시작.md)** - 5분 빠른 시작 가이드
- **[USAGE_GUIDE.md](./USAGE_GUIDE.md)** - 전체 시스템 사용 가이드
- **[README_DUMMY_DATA.md](../simulator/README_DUMMY_DATA.md)** - 더미 데이터 생성기 상세 문서

---

## 🎯 주요 기능

### API 서버

#### main_with_influx.py (추천)
- ✅ InfluxDB에서 실제 데이터 조회
- ✅ 시계열 데이터 API 제공
- ✅ InfluxDB 연결 실패 시 자동 시뮬레이션 모드 전환

#### main.py (테스트용)
- ⚠️  랜덤 데이터 생성 (InfluxDB 불필요)
- ⚠️  시계열 데이터 미제공

### 더미 데이터 생성기

#### quick_generate.py (추천)
- 🚀 한 번에 과거 + 실시간 데이터 생성
- 🚀 기본 설정으로 바로 실행

#### generate_dummy_data.py (고급)
- 🔧 대화형 메뉴로 커스텀 설정
- 🔧 과거/실시간 데이터 개별 생성

---

## 🌐 API 엔드포인트

### InfluxDB 연동 모드 (main_with_influx.py)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/robots` | 모든 로봇 최신 데이터 |
| GET | `/api/robots/{robot_id}` | 특정 로봇 데이터 |
| GET | `/api/robots/{robot_id}/timeseries?hours=24` | 시계열 데이터 |
| GET | `/api/mode` | 현재 동작 모드 |
| GET | `/health` | 헬스 체크 |

### 시뮬레이션 모드 (main.py)

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/robots` | 랜덤 로봇 데이터 |
| GET | `/api/robots/{robot_id}` | 특정 로봇 랜덤 데이터 |
| GET | `/health` | 헬스 체크 |

---

## 📊 더미 데이터 구조

### 9개 로봇

| 타입 | 수량 | ID 범위 | 예시 센서 |
|------|------|---------|----------|
| Robot-arm | 3 | RA001-RA003 | temperature, efficiency, joint angles, torque |
| UGV | 3 | UG001-UG003 | battery, distance sensors, speed, path progress |
| Drone | 3 | DR001-DR003 | battery, altitude, GPS, wind speed |

### 메타데이터

각 로봇은 다음 정보를 포함:
- `id`: 로봇 ID
- `name`: 로봇 이름
- `type`: 로봇 타입
- `status`: 상태 (normal/warning/error)
- `group`: 그룹
- `manufacturer`: 제조사
- `department`: 부서
- `line`: 라인
- `area`: 구역
- `floor`: 층

---

## 🐳 Docker 실행

### docker compose -f infra/docker-compose.yml 사용

```bash
# 전체 시스템 시작
docker compose -f infra/docker-compose.yml up -d

# 더미 데이터 생성 (컨테이너에서)
python simulator/quick_generate.py

# 로그 확인
docker compose -f infra/docker-compose.yml logs -f backend
```

### 개별 빌드

```bash
# 이미지 빌드
docker build -t robot-backend .

# 컨테이너 실행
docker run -p 8000:8000 --env-file .env robot-backend
```

---

## 🔧 환경 변수

`.env` 파일 예시:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token-here
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
API_HOST=0.0.0.0
API_PORT=8000
```

---

## 📈 성능

### 더미 데이터 생성

| 설정 | 데이터량 | 소요 시간 |
|------|---------|-----------|
| 24시간 (3분 간격) | ~28,800개 | 1-2분 |
| 1주일 (5분 간격) | ~181,440개 | 5-10분 |
| 실시간 (3초, 1시간) | ~10,800개 | 1시간 (실시간) |

### API 응답

| 엔드포인트 | 평균 응답 시간 |
|-----------|----------------|
| `/api/robots` | < 100ms |
| `/api/robots/{id}/timeseries?hours=1` | < 200ms |
| `/api/robots/{id}/timeseries?hours=24` | < 500ms |

---

## 🐛 문제 해결

### InfluxDB 연결 실패
```bash
# InfluxDB 실행 확인
docker ps | grep influxdb

# 시작
docker compose -f infra/docker-compose.yml up -d influxdb
```

### 토큰 인증 실패
1. InfluxDB UI에서 새 토큰 생성
2. `.env` 업데이트
3. 서버 재시작

### 데이터가 없음
```bash
python simulator/quick_generate.py
```

더 자세한 문제 해결은 [USAGE_GUIDE.md](./USAGE_GUIDE.md) 참조

---

## 💡 유용한 명령어

```bash
# API 서버 실행 (InfluxDB 연동)
python backend/fastapi/main_with_influx.py

# API 서버 실행 (시뮬레이션)
python backend/fastapi/main.py

# 더미 데이터 빠른 생성
python simulator/quick_generate.py

# 더미 데이터 커스텀 생성
python simulator/generate_dummy_data.py

# API 테스트
curl http://localhost:8000/api/robots
curl http://localhost:8000/api/robots/RA001
curl http://localhost:8000/api/mode

# Docker로 실행
docker compose -f infra/docker-compose.yml up -d
docker compose -f infra/docker-compose.yml logs -f backend
```

---

## 📦 의존성

```
fastapi==0.104.1
uvicorn[standard]==0.24.0
pydantic==2.5.0
python-dotenv==1.0.0
influxdb-client==1.38.0
```

---

## 🤝 개발 워크플로우

### 1. 로컬 개발
```bash
# 1. InfluxDB 시작
docker compose -f infra/docker-compose.yml up -d influxdb

# 2. 더미 데이터 생성
python simulator/quick_generate.py

# 3. API 서버 실행 (auto-reload)
python backend/fastapi/main_with_influx.py
```

### 2. 테스트
```bash
# API 테스트
curl http://localhost:8000/api/robots | jq

# 모드 확인
curl http://localhost:8000/api/mode | jq
```

### 3. 프로덕션 배포
```bash
# Docker Compose로 전체 시스템 배포
docker compose -f infra/docker-compose.yml up -d
```

---

## 📝 라이선스

이 프로젝트는 개인 프로젝트입니다.

---

## 📞 문의

문제가 있거나 질문이 있으면 이슈를 생성해주세요.

---

**프로젝트 루트로 돌아가기:** [README.md](../../README.md)
