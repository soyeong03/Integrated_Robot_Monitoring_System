# 🤖 Robot Fleet Monitoring System

9개의 이기종 로봇(Robot-arm 3개, UGV 3개, Drone 3개)을 실시간으로 모니터링하는 시스템

## 🚀 빠른 시작 (5분)

> 💡 **팁**: 프론트엔드는 백엔드 없이도 시뮬레이션 데이터로 작동합니다!

### 방법 A: 프론트엔드만 실행 (가장 빠름! ⚡)

```bash
# 프로젝트 루트에서 의존성 설치 및 실행
npm --prefix frontend install
npm --prefix frontend run dev
```

브라우저에서 http://localhost:5173 접속 → 완료! 🎉

---

### 방법 B: 백엔드 + 프론트엔드 실행

#### 1️⃣ 백엔드 실행

**Windows:**
```bash
# 프로젝트 루트에서 실행
backend/fastapi/start_server.bat
```

**macOS/Linux:**
```bash
# 프로젝트 루트에서 실행
chmod +x backend/fastapi/start_server.sh
./backend/fastapi/start_server.sh
```

**또는 직접 실행 (시뮬레이션 모드):**
```bash
# 프로젝트 루트에서 실행
pip install fastapi uvicorn
python backend/fastapi/main.py
```

#### 2️⃣ 프론트엔드 실행 (별도 터미널)

```bash
# 프로젝트 루트에서 실행
npm --prefix frontend install
npm --prefix frontend run dev
```

#### 3️⃣ 브라우저 접속

http://localhost:5173

---

## 🎯 문제 해결

백엔드 연결 오류가 발생하나요? → [문제 해결 가이드](../TROUBLESHOOTING.md)

---

## 📊 더미 데이터 생성 (InfluxDB)

InfluxDB에 테스트 데이터를 생성하려면:

```bash
# 프로젝트 루트에서 실행

# 빠른 생성 (24시간 과거 + 10분 실시간)
python simulator/quick_generate.py

# 커스텀 생성 (대화형 메뉴)
python simulator/generate_dummy_data.py
```

자세한 사용법: [더미 데이터 생성 가이드](../simulator/README_DUMMY_DATA.md)

---

## 🏗️ 기술 스택

### Frontend
- **Vite + React + TypeScript**
- **Tailwind CSS** - 스타일링
- **React Router** - 3단계 라우팅
- **Recharts** - 시계열 차트

### Backend
- **FastAPI** - REST API 서버
- **InfluxDB** - 시계열 데이터베이스 (향후 연동)
- **Docker** - 컨테이너화

## 📁 프로젝트 구조

```text
frontend/
├── package.json                 # 프론트엔드 의존성 및 스크립트
├── vite.config.ts               # Vite 설정
└── src/
    ├── App.tsx                  # 메인 애플리케이션
    ├── components/              # React 컴포넌트
│   ├── MainDashboard.tsx       # 메인 대시보드
│   ├── GridViewPage.tsx        # 그리드 뷰
│   ├── RobotDetailPage.tsx     # 로봇 상세 페이지
│   ├── FleetOverview.tsx       # 플릿 오버뷰
│   ├── NotificationCenter.tsx  # 알림 센터
│   └── ...
│   ├── services/
│   └── influxService.ts        # API 통신 서비스
│   ├── types/
│   ├── robot.ts                # 로봇 타입 정의
│   └── notifications.ts        # 알림 타입 정의
│   └── utils/
│   ├── notificationManager.ts  # 알림 관리
│   └── alertRules.ts           # 알림 규칙
```

## 🚀 실행 방법

### 방법 1: Docker Compose (권장)

**백엔드만 Docker로 실행:**

```bash
# 1. 프로젝트 루트에서 Docker Compose로 백엔드 시작
docker compose -f infra/docker-compose.yml up -d

# 3. 백엔드 로그 확인
docker compose -f infra/docker-compose.yml logs -f backend

# 3. 프론트엔드 실행 (별도 터미널, 프로젝트 루트에서)
npm --prefix frontend install
npm --prefix frontend run dev
```

**백엔드 중지:**

```bash
docker compose -f infra/docker-compose.yml down
```

### 방법 2: 로컬 실행

#### 옵션 A: 시뮬레이션 모드 (추천 - 가장 간단)

**백엔드:**
```bash
# 프로젝트 루트에서 실행

# 패키지 설치 (최초 1회)
pip install fastapi uvicorn

# 서버 실행
python backend/fastapi/main.py
```

**프론트엔드 (별도 터미널, 프로젝트 루트에서):**
```bash
# 프로젝트 루트에서 실행
npm --prefix frontend install
npm --prefix frontend run dev
```

> ✅ **장점**: InfluxDB 불필요, 즉시 실행 가능

#### 옵션 B: InfluxDB 연동 모드

**백엔드:**
```bash
# 프로젝트 루트에서 실행

# 가상환경 생성 (권장)
python -m venv venv

# 가상환경 활성화
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 의존성 설치
pip install -r backend/fastapi/requirements.txt

# 서버 실행
python backend/fastapi/main_with_influx.py
```

**프론트엔드 (별도 터미널, 프로젝트 루트에서):**
```bash
# 프로젝트 루트에서 실행
npm --prefix frontend install
npm --prefix frontend run dev
```

> ⚠️ **주의**: InfluxDB가 실행 중이어야 합니다.

## 🌐 접속 URL

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8000
- **API 문서**: http://localhost:8000/docs

## 🧪 API 테스트

```bash
# 모든 로봇 데이터 조회
curl http://localhost:8000/api/robots

# 특정 로봇 조회
curl http://localhost:8000/api/robots/RA001

# 헬스 체크
curl http://localhost:8000/health
```

## 📊 주요 기능

### ✅ 3단계 라우팅 구조
1. **메인 대시보드** - 전체 플릿 오버뷰
2. **그리드 뷰** - 로봇 카드 그리드
3. **로봇 상세 페이지** - 개별 로봇 상세 정보

### ✅ 실시간 모니터링
- **3초 간격 자동 업데이트**
- 센서별 시계열 차트 (Recharts)
- 큰 원형 진행 표시기

### ✅ 고급 필터링 & 검색
- 제조사별 필터링
- 실시간 검색
- 센서별 정렬

### ✅ 지능형 알림 시스템
- 배터리 부족 알림
- 온도 이상 감지
- 통신 장애 경고
- 우선순위 시스템

### ✅ 플릿 관리
- 그룹/플릿 관리
- 집계 대시보드
- 성능 차트

## 🔧 환경 변수

### 프론트엔드 (`.env`)
```env
VITE_API_URL=http://localhost:8000
```

### 백엔드 (`.env` - 선택사항)
```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-data
```

## 📝 로봇 데이터 구조

### Robot-arm (3대)
- ID: RA001, RA002, RA003
- 센서: 온도, 효율, 관절각도(3개), 그리퍼, 토크, 작업속도

### UGV (3대)
- ID: UG001, UG002, UG003
- 센서: 배터리, 온도, 신호, 효율, 거리센서(3방향), 속도, 경로진행률

### Drone (3대)
- ID: DR001, DR002, DR003
- 센서: 배터리, 온도, 신호, 고도, 풍속, 비행시간, GPS, 귀환거리

## 🔮 향후 계획

- [ ] InfluxDB 실제 연동
- [ ] 로봇 데이터 시뮬레이터 개선
- [ ] 히스토리 데이터 조회 API
- [ ] WebSocket 실시간 스트리밍
- [ ] 사용자 인증 시스템
- [ ] 다국어 지원

## 📄 라이선스

개인 프로젝트 - MIT License
