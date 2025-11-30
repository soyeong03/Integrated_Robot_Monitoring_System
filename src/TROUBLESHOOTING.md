# 🔧 문제 해결 가이드

## ❌ FastAPI 연결 실패 오류

### 증상

```
❌ FastAPI 연결 실패: TypeError: Failed to fetch
⚠️ 시뮬레이션 데이터로 대체합니다.
```

### 원인

프론트엔드가 백엔드 API 서버(`http://localhost:8000`)에 연결할 수 없습니다.

### 해결 방법

#### 1️⃣ 백엔드 서버가 실행 중인지 확인

**Windows:**

```bash
cd backend
start_server.bat
```

**macOS/Linux:**

```bash
cd backend
chmod +x start_server.sh
./start_server.sh
```

**또는 직접 실행:**

```bash
cd backend
python main_with_influx.py
```

#### 2️⃣ 서버 실행 확인

브라우저에서 다음 URL에 접속하여 서버가 응답하는지 확인:

- http://localhost:8000
- http://localhost:8000/api/robots

정상 응답 예시:

```json
{
  "message": "Robot Fleet Monitoring API",
  "version": "2.0.0",
  "status": "running",
  "influxdb_enabled": true,
  "mode": "InfluxDB"
}
```

#### 3️⃣ CORS 문제 확인

브라우저 개발자 도구(F12) → Console에서 CORS 오류 확인:

```
Access to fetch at 'http://localhost:8000/api/robots' from origin 'http://localhost:5173' has been blocked by CORS policy
```

**해결:** 백엔드 서버 재시작 (CORS 설정이 이미 포함되어 있음)

#### 4️⃣ 포트 충돌 확인

8000번 포트가 이미 사용 중일 수 있습니다.

**확인 (Windows):**

```bash
netstat -ano | findstr :8000
```

**확인 (macOS/Linux):**

```bash
lsof -i :8000
```

**해결:** 다른 프로세스 종료 또는 포트 변경

---

## ⚠️ 시뮬레이션 데이터만 표시됨

### 증상

- 프론트엔드는 동작하지만 매번 랜덤한 데이터가 표시됨
- 브라우저 콘솔에 "시뮬레이션 데이터로 대체합니다" 메시지

### 해결 방법

1. **백엔드 서버 실행 확인** (위의 1️⃣ 참조)

2. **InfluxDB 연결 확인**

   ```bash
   # 브라우저에서 확인
   http://localhost:8000/api/mode
   ```

   **정상:**

   ```json
   {
     "mode": "InfluxDB",
     "influxdb_enabled": true,
     "influxdb_url": "http://localhost:8086"
   }
   ```

   **문제:**

   ```json
   {
     "mode": "Simulation",
     "influxdb_enabled": false
   }
   ```

3. **InfluxDB 데이터 생성**
   ```bash
   cd backend
   python quick_generate.py
   ```

---

## 🔌 InfluxDB 연결 실패

### 증상

```
❌ InfluxDB 연결 실패: connection refused
⚠️ 시뮬레이션 모드로 전환됩니다
```

### 해결 방법

#### 1️⃣ InfluxDB 실행 확인

**Docker Compose 사용:**

```bash
docker-compose up -d influxdb
docker ps | grep influxdb
```

**로컬 InfluxDB:**

```bash
# 서비스 상태 확인
curl http://localhost:8086/health
```

#### 2️⃣ .env 파일 설정 확인

```bash
cd backend
cat .env
```

필수 설정:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-actual-token-here
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
```

#### 3️⃣ InfluxDB 토큰 생성

1. 브라우저에서 http://localhost:8086 접속
2. Load Data → API Tokens → Generate API Token
3. "Read/Write Token" 선택
4. Bucket: `robot-monitoring` 선택
5. 생성된 토큰 복사 → `.env` 파일에 붙여넣기

#### 4️⃣ InfluxDB Bucket 생성

1. InfluxDB UI → Load Data → Buckets
2. Create Bucket
3. Name: `robot-monitoring`
4. Retention: 30 days (또는 원하는 기간)

---

## 📦 Python 패키지 오류

### 증상

```
ModuleNotFoundError: No module named 'fastapi'
ModuleNotFoundError: No module named 'influxdb_client'
```

### 해결 방법

```bash
cd backend
pip install -r requirements.txt
```

**가상 환경 사용 (권장):**

```bash
cd backend

# 가상 환경 생성
python -m venv venv

# 활성화 (Windows)
venv\Scripts\activate

# 활성화 (macOS/Linux)
source venv/bin/activate

# 패키지 설치
pip install -r requirements.txt
```

---

## 🐳 Docker 관련 문제

### Docker Compose 실행 오류

**증상:**

```
ERROR: Cannot start service backend: ...
```

**해결:**

```bash
# Docker 컨테이너 정리
docker-compose down

# 이미지 다시 빌드
docker-compose build --no-cache

# 재시작
docker-compose up -d
```

### InfluxDB 초기화 문제

**증상:**

- InfluxDB가 시작되지 않음
- 데이터가 저장되지 않음

**해결:**

```bash
# InfluxDB 볼륨 삭제 및 재생성
docker-compose down -v
docker-compose up -d influxdb

# 초기 설정 다시 수행
# 브라우저: http://localhost:8086
```

---

## 🌐 프론트엔드 관련 문제

### Vite 개발 서버가 시작되지 않음

**증상:**

```
Error: Cannot find module ...
```

**해결:**

```bash
# 의존성 재설치
rm -rf node_modules package-lock.json
npm install

# 개발 서버 시작
npm run dev
```

### 빌드 오류

**증상:**

```
Error: Build failed
```

**해결:**

```bash
# TypeScript 타입 체크
npm run type-check

# 캐시 삭제 후 재빌드
rm -rf build .vite
npm run build
```

---

## 🔍 데이터가 표시되지 않음

### 백엔드는 정상이지만 데이터가 없음

#### 확인 사항

1. **InfluxDB에 데이터가 있는지 확인**

   ```bash
   # InfluxDB UI → Data Explorer
   # 또는 CLI로 확인
   docker exec -it influxdb influx query \
     'from(bucket:"robot-monitoring") |> range(start:-1h) |> limit(n:10)'
   ```

2. **더미 데이터 생성**

   ```bash
   cd backend
   python quick_generate.py
   ```

3. **API 응답 확인**
   ```bash
   curl http://localhost:8000/api/robots | jq
   ```

---

## 💻 환경별 문제

### Windows

#### PowerShell 실행 정책 오류

```
cannot be loaded because running scripts is disabled
```

**해결:**

```powershell
Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
```

#### 한글 깨짐

```bash
chcp 65001
```

### macOS

#### Python 버전 문제

```bash
# Python 3 확인
python3 --version

# Python 3 사용
python3 -m pip install -r requirements.txt
python3 main_with_influx.py
```

### Linux

#### 권한 문제

```bash
chmod +x backend/start_server.sh
```

---

## 🚨 긴급 해결 방법

### 모든 것이 실패할 때

1. **시뮬레이션 모드로 실행**

   ```bash
   cd backend
   python main.py
   ```

   - InfluxDB 없이 랜덤 데이터로 동작
   - 빠른 테스트용

2. **전체 시스템 초기화**

   ```bash
   # Docker 완전 정리
   docker-compose down -v
   docker system prune -a

   # 프로젝트 재설정
   cd backend
   rm -rf venv .env
   cp .env.example .env

   # 처음부터 다시 시작
   python -m venv venv
   source venv/bin/activate  # Windows: venv\Scripts\activate
   pip install -r requirements.txt
   ```

3. **프론트엔드만 실행 (백엔드 없이)**
   - 프론트엔드는 API 연결 실패 시 자동으로 시뮬레이션 데이터 사용
   - 백엔드 없이도 UI 테스트 가능

---

## 📞 추가 도움이 필요한 경우

1. **로그 확인**

   ```bash
   # 백엔드 로그
   docker-compose logs -f backend

   # InfluxDB 로그
   docker-compose logs -f influxdb

   # 브라우저 개발자 도구
   F12 → Console 탭
   ```

2. **시스템 정보 수집**
   - OS 버전
   - Python 버전: `python --version`
   - Node.js 버전: `node --version`
   - Docker 버전: `docker --version`

3. **관련 문서**
   - [빠른시작.md](/backend/빠른시작.md)
   - [USAGE_GUIDE.md](/backend/USAGE_GUIDE.md)
   - [README_DUMMY_DATA.md](/backend/README_DUMMY_DATA.md)

---

## ✅ 정상 동작 체크리스트

- [ ] InfluxDB 실행 중 (`docker ps` 또는 `http://localhost:8086`)
- [ ] 백엔드 서버 실행 중 (`http://localhost:8000`)
- [ ] `.env` 파일 설정 완료
- [ ] 더미 데이터 생성 완료
- [ ] API 모드 확인: `http://localhost:8000/api/mode`
- [ ] API 데이터 확인: `http://localhost:8000/api/robots`
- [ ] 프론트엔드 실행 중 (`http://localhost:5173`)
- [ ] 브라우저 콘솔에 "FastAPI에서 N대 로봇 데이터 로드 완료" 표시

모든 항목이 체크되면 시스템이 정상 동작합니다! 🎉