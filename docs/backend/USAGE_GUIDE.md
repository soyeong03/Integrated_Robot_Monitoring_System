# 🚀 로봇 플릿 모니터링 시스템 - 사용 가이드

## 📋 목차
1. [빠른 시작](#빠른-시작)
2. [더미 데이터 생성](#더미-데이터-생성)
3. [API 서버 실행](#api-서버-실행)
4. [Docker로 실행](#docker로-실행)
5. [문제 해결](#문제-해결)

---

## 🚀 빠른 시작

### 1. 환경 설정

`.env` 파일 생성:
```bash
# 프로젝트 루트에서 실행
# 루트 .env를 사용하거나 셸 환경 변수를 설정하세요
```

`.env` 파일 편집:
```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-influxdb-token-here
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
```

### 2. Python 패키지 설치

```bash
pip install -r backend/fastapi/requirements.txt
```

### 3. 더미 데이터 생성 (선택사항)

**옵션 A: 빠른 생성 (추천)**
```bash
python simulator/quick_generate.py
```
- 24시간 과거 데이터 + 10분 실시간 데이터 자동 생성
- 약 2-3분 소요

**옵션 B: 대화형 생성**
```bash
python simulator/generate_dummy_data.py
```
- 메뉴에서 원하는 옵션 선택
- 커스텀 설정 가능

### 4. API 서버 실행

**옵션 A: InfluxDB 연동 모드**
```bash
python backend/fastapi/main_with_influx.py
```
- InfluxDB에서 실제 데이터 조회
- .env 설정이 올바르면 자동으로 연동

**옵션 B: 시뮬레이션 모드**
```bash
python backend/fastapi/main.py
```
- InfluxDB 없이 랜덤 데이터 생성
- 빠른 테스트용

---

## 📊 더미 데이터 생성

### 기본 사용법

#### 1. 빠른 생성 (추천)
```bash
python simulator/quick_generate.py
```

**생성되는 데이터:**
- 과거 24시간 (3분 간격): ~28,800개 포인트
- 실시간 10분 (3초 간격): ~1,800개 포인트
- 총 9대 로봇 (Robot-arm 3, UGV 3, Drone 3)

#### 2. 대화형 생성
```bash
python simulator/generate_dummy_data.py
```

**메뉴 옵션:**
1. **과거 데이터만 생성**
   - 24시간, 3분 간격 (기본값)
   - 차트 테스트용

2. **실시간 데이터만 생성**
   - 60분, 3초 간격 (기본값)
   - 실시간 업데이트 테스트용

3. **과거 + 실시간**
   - 과거 데이터 생성 후 실시간 데이터 생성
   - 전체 시스템 테스트용 (추천)

4. **커스텀 설정**
   - 시간, 간격 직접 설정
   - 대용량 데이터 생성 시

### 고급 사용 예시

#### 1주일 데이터 생성 (5분 간격)
```bash
python simulator/generate_dummy_data.py
# 메뉴에서 '4' 선택
# 과거 데이터 시간: 168
# 과거 데이터 간격: 300
```

#### 1시간 고밀도 데이터 (1초 간격)
```bash
python simulator/generate_dummy_data.py
# 메뉴에서 '4' 선택
# 과거 데이터 시간: 1
# 과거 데이터 간격: 1
```

#### 백그라운드에서 계속 실행
```bash
# 무한 루프로 실시간 데이터 생성
nohup python -c "
from simulator.generate_dummy_data import RobotDataGenerator
g = RobotDataGenerator()
g.connect()
while True:
    g.generate_realtime_data(duration_minutes=60, interval_seconds=3)
" > dummy_data.log 2>&1 &
```

---

## 🌐 API 서버 실행

### InfluxDB 연동 모드 (추천)

```bash
python backend/fastapi/main_with_influx.py
```

**특징:**
- ✅ InfluxDB에서 실제 데이터 조회
- ✅ 시계열 데이터 API 제공
- ✅ InfluxDB 연결 실패 시 자동으로 시뮬레이션 모드로 전환

**API 엔드포인트:**
- `GET /api/robots` - 모든 로봇 최신 데이터
- `GET /api/robots/{robot_id}` - 특정 로봇 데이터
- `GET /api/robots/{robot_id}/timeseries?hours=24` - 시계열 데이터
- `GET /api/mode` - 현재 동작 모드 확인
- `GET /health` - 헬스 체크

### 시뮬레이션 모드

```bash
python backend/fastapi/main.py
```

**특징:**
- ⚠️  랜덤 데이터 생성 (InfluxDB 불필요)
- ⚠️  매 요청마다 새로운 랜덤 값 반환
- ⚠️  시계열 데이터 미제공

**API 엔드포인트:**
- `GET /api/robots` - 모든 로봇 랜덤 데이터
- `GET /api/robots/{robot_id}` - 특정 로봇 랜덤 데이터
- `GET /health` - 헬스 체크

### API 문서 확인

서버 실행 후:
```
http://localhost:8000/docs
```
- Swagger UI에서 모든 API 테스트 가능

---

## 🐳 Docker로 실행

### 1. InfluxDB 시작

```bash
docker compose -f infra/docker-compose.yml up -d influxdb
```

### 2. InfluxDB 초기 설정

브라우저에서 `http://localhost:8086` 접속:
1. 초기 사용자 생성
2. Organization: `robot-fleet`
3. Bucket: `robot-monitoring`
4. API 토큰 생성 및 복사

### 3. .env 파일 설정

```env
INFLUXDB_URL=http://influxdb:8086
INFLUXDB_TOKEN=<복사한_토큰>
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
```

### 4. 더미 데이터 생성

**로컬에서 실행:**
```bash
# .env에서 INFLUXDB_URL을 http://localhost:8086으로 변경
python simulator/quick_generate.py
```

**Docker 컨테이너에서 실행:**
```bash
python simulator/quick_generate.py
```

### 5. API 서버 시작

```bash
docker compose -f infra/docker-compose.yml up -d backend
```

### 6. 전체 시스템 확인

```bash
docker compose -f infra/docker-compose.yml ps
```

**접속 주소:**
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:8000`
- Backend API Docs: `http://localhost:8000/docs`
- InfluxDB: `http://localhost:8086`

---

## 🔧 문제 해결

### InfluxDB 연결 실패

**증상:**
```
❌ InfluxDB 연결 실패: connection refused
```

**해결:**
1. InfluxDB가 실행 중인지 확인
   ```bash
   docker ps | grep influxdb
   ```

2. URL이 올바른지 확인
   - 로컬: `http://localhost:8086`
   - Docker: `http://influxdb:8086`

3. 토큰이 유효한지 확인
   - InfluxDB UI에서 토큰 재생성

### 인증 실패

**증상:**
```
❌ unauthorized access
```

**해결:**
1. 토큰 권한 확인
   - InfluxDB UI > Load Data > API Tokens
   - 읽기/쓰기 권한 필요

2. Organization/Bucket 이름 확인
   - `.env` 파일의 이름과 InfluxDB 설정 일치 확인

### Bucket이 존재하지 않음

**증상:**
```
❌ bucket "robot-monitoring" not found
```

**해결:**
1. InfluxDB UI에서 Bucket 생성
   - Load Data > Buckets > Create Bucket
   - Name: `robot-monitoring`

2. `.env` 파일의 BUCKET 이름 확인

### 데이터가 보이지 않음

**증상:**
- API 호출 시 빈 배열 반환

**해결:**
1. 더미 데이터 생성 실행
   ```bash
   python simulator/quick_generate.py
   ```

2. InfluxDB UI에서 데이터 확인
   - Explore > Query Builder
   - Measurement 선택 (robot-arm, ugv, drone)

3. 시간 범위 확인
   - 최근 데이터만 조회하므로 생성 시간 확인

### 포트 충돌

**증상:**
```
OSError: [Errno 48] Address already in use
```

**해결:**
1. 실행 중인 프로세스 확인
   ```bash
   lsof -i :8000  # API 서버
   lsof -i :8086  # InfluxDB
   ```

2. 프로세스 종료 또는 포트 변경

### Python 패키지 오류

**증상:**
```
ModuleNotFoundError: No module named 'influxdb_client'
```

**해결:**
```bash
# 프로젝트 루트에서 실행
pip install -r backend/fastapi/requirements.txt
```

---

## 📈 성능 가이드

### 더미 데이터 생성 성능

| 설정 | 데이터 포인트 | 예상 소요 시간 |
|------|--------------|----------------|
| 24시간 (3분 간격) | ~28,800 | 1-2분 |
| 1주일 (5분 간격) | ~181,440 | 5-10분 |
| 1달 (10분 간격) | ~388,800 | 15-30분 |
| 실시간 (3초 간격, 1시간) | ~10,800 | 1시간 (실시간) |

### API 응답 성능

| 엔드포인트 | 평균 응답 시간 |
|-----------|---------------|
| `/api/robots` | < 100ms |
| `/api/robots/{id}` | < 50ms |
| `/api/robots/{id}/timeseries?hours=1` | < 200ms |
| `/api/robots/{id}/timeseries?hours=24` | < 500ms |

### 최적화 팁

1. **배치 크기 조정**
   - `generate_dummy_data.py`에서 `batch_size` 변경
   - 기본: 1000 (권장: 500-2000)

2. **간격 조정**
   - 과거 데이터: 3-5분 간격 권장
   - 실시간 데이터: 3-10초 간격 권장

3. **InfluxDB 설정**
   - 메모리: 최소 512MB, 권장 2GB
   - 디스크: SSD 권장

---

## 📚 추가 자료

- [InfluxDB 공식 문서](https://docs.influxdata.com/)
- [FastAPI 공식 문서](https://fastapi.tiangolo.com/)
- [Flux 쿼리 가이드](https://docs.influxdata.com/flux/)

---

## 💡 유용한 명령어 모음

```bash
# 전체 시스템 시작
docker compose -f infra/docker-compose.yml up -d

# 더미 데이터 빠른 생성
python simulator/quick_generate.py

# API 서버 (InfluxDB 연동)
python backend/fastapi/main_with_influx.py

# API 서버 (시뮬레이션)
python backend/fastapi/main.py

# 로그 확인
docker compose -f infra/docker-compose.yml logs -f backend
docker compose -f infra/docker-compose.yml logs -f influxdb

# 시스템 상태 확인
curl http://localhost:8000/api/mode
curl http://localhost:8000/health

# InfluxDB 데이터 확인 (CLI)
docker exec -it influxdb influx query 'from(bucket:"robot-monitoring") |> range(start:-1h) |> limit(n:10)'

# 전체 시스템 정리
docker compose -f infra/docker-compose.yml down
docker compose -f infra/docker-compose.yml down -v  # 볼륨도 삭제
```
