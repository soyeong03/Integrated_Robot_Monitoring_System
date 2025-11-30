# 🤖 Robot Monitoring System

9개의 이기종 로봇(Robot-arm 3개, UGV 3개, Drone 3개)을 실시간으로 모니터링하는 시스템입니다.

> **Figma 디자인**: https://www.figma.com/design/Rd35WutOVXGQpid39d44bh/Robot-Monitoring-System

---

## 🚀 시작하기 (README만 보고 바로 실행!)

### 📋 사전 확인

- [ ] **Node.js 18+** 설치되어 있나요? (`node --version`으로 확인)
- [ ] **Python 3.11+** 설치되어 있나요? (`python --version`으로 확인, 백엔드 실행 시 필요)

> 💡 **프론트엔드만 실행**: Node.js만 있으면 됩니다! 백엔드는 선택사항입니다.

---

### ⚡ 방법 1: 전체 시스템 실행 (권장)

#### Windows 사용자

**터미널 1: 백엔드 실행**
```bash
cd src/backend
run.bat
```
> ✅ 자동으로 패키지 설치 및 서버 실행

**터미널 2: 프론트엔드 실행** (새 터미널 창 열기)
```bash
# 프로젝트 루트에서
npm install
npm run dev
```

**브라우저 접속**
- 프론트엔드: http://localhost:5173
- 백엔드 API 문서: http://localhost:8000/docs

---

#### macOS/Linux 사용자

**터미널 1: 백엔드 실행**
```bash
cd src/backend
chmod +x run.sh
./run.sh
```

**터미널 2: 프론트엔드 실행** (새 터미널 창 열기)
```bash
# 프로젝트 루트에서
npm install
npm run dev
```

**브라우저 접속**
- 프론트엔드: http://localhost:5173
- 백엔드 API 문서: http://localhost:8000/docs

---

### ⚡ 방법 2: 프론트엔드만 실행 (가장 빠름!)

백엔드 없이도 시뮬레이션 데이터로 작동합니다.

```bash
# 프로젝트 루트에서
npm install
npm run dev
```

브라우저에서 **http://localhost:5173** 접속 → 완료! 🎉

---

### ✅ 실행 확인 체크리스트

#### 백엔드가 정상 실행되었는지 확인:
- [ ] 터미널에 `INFO: Uvicorn running on http://0.0.0.0:8000` 메시지 표시
- [ ] 브라우저에서 http://localhost:8000/docs 접속 시 API 문서 표시
- [ ] http://localhost:8000/api/robots 접속 시 JSON 데이터 표시

#### 프론트엔드가 정상 실행되었는지 확인:
- [ ] 터미널에 `Local: http://localhost:5173` 메시지 표시
- [ ] 브라우저에서 http://localhost:5173 접속 시 UI 표시
- [ ] 브라우저 콘솔(F12)에 오류 없음

---

### 🐛 문제가 발생했나요?

#### 백엔드 실행 오류
- **"Python is not installed"** → Python 3.11+ 설치 필요
- **"pydantic-core 빌드 오류"** → `run.bat`가 자동으로 해결합니다. 그래도 안 되면 아래 참고
- **포트 8000 사용 중** → 다른 프로그램이 사용 중입니다. 종료 후 재시도

#### 프론트엔드 실행 오류
- **"npm install 실패"** → 인터넷 연결 확인 또는 `npm cache clean --force` 후 재시도
- **포트 5173 사용 중** → 다른 프로그램이 사용 중입니다. 종료 후 재시도

#### 백엔드 연결 실패
- 프론트엔드는 백엔드 연결 실패 시 **자동으로 시뮬레이션 모드**로 전환됩니다
- UI는 정상적으로 작동하지만, 백엔드 데이터 대신 시뮬레이션 데이터를 사용합니다

> 📖 더 자세한 문제 해결: [문제 해결 가이드](./src/TROUBLESHOOTING.md)

---

## 🎯 주요 기능

### ✅ 3단계 라우팅 구조
1. **메인 대시보드** (`/`) - 전체 플릿 오버뷰 및 통계
2. **그리드 뷰** (`/grid-view`) - 로봇 카드 그리드 및 필터링
3. **로봇 상세 페이지** (`/robot/:id`) - 개별 로봇 상세 정보 및 시계열 차트

### ✅ 실시간 모니터링
- **3초 간격 자동 업데이트** (설정 가능)
- 센서별 시계열 차트 (Recharts)
- 큰 원형 진행 표시기
- 실시간 상태 표시 (normal/warning/error)

### ✅ 고급 필터링 & 검색
- 제조사별 필터링
- 실시간 검색 (로봇 이름/ID)
- 센서별 정렬
- 상태별 필터링

### ✅ 지능형 알림 시스템
- 배터리 부족 알림
- 온도 이상 감지
- 통신 장애 경고
- 우선순위 시스템
- 읽음/미읽음 관리
- 알림 확인(Acknowledge) 기능

### ✅ 플릿 관리
- 그룹/플릿 관리
- 집계 대시보드
- 성능 차트
- 이벤트 로그

---

## 🏗️ 기술 스택

### Frontend
- **Vite** - 빌드 도구
- **React 18** - UI 프레임워크
- **TypeScript** - 타입 안정성
- **React Router** - 클라이언트 사이드 라우팅
- **Tailwind CSS** - 유틸리티 기반 스타일링
- **Radix UI** - 접근성 있는 UI 컴포넌트
- **Recharts** - 시계열 차트 라이브러리
- **Lucide React** - 아이콘

### Backend
- **FastAPI** - 고성능 REST API 서버
- **InfluxDB** - 시계열 데이터베이스
- **Python 3.11+** - 백엔드 언어
- **Docker** - 컨테이너화

---

## 📁 프로젝트 구조

```
Robot Monitoring System/
├── README.md                    # 메인 문서 (이 파일)
├── package.json                 # 프론트엔드 의존성
├── vite.config.ts              # Vite 설정
├── index.html                  # HTML 엔트리 포인트
│
├── src/
│   ├── App.tsx                 # 메인 애플리케이션 컴포넌트
│   ├── main.tsx                # React 엔트리 포인트
│   ├── index.css               # 글로벌 스타일
│   │
│   ├── components/             # React 컴포넌트
│   │   ├── MainDashboard.tsx   # 메인 대시보드
│   │   ├── GridViewPage.tsx    # 그리드 뷰 페이지
│   │   ├── RobotDetailPage.tsx # 로봇 상세 페이지
│   │   ├── FleetOverview.tsx   # 플릿 오버뷰
│   │   ├── NotificationCenter.tsx # 알림 센터
│   │   ├── RobotCard.tsx       # 로봇 카드
│   │   ├── PerformanceCharts.tsx # 성능 차트
│   │   ├── AlertPanel.tsx      # 알림 패널
│   │   ├── EventLog.tsx        # 이벤트 로그
│   │   ├── FilterPanel.tsx     # 필터 패널
│   │   ├── Header.tsx          # 헤더 컴포넌트
│   │   └── ui/                 # 재사용 가능한 UI 컴포넌트
│   │
│   ├── services/
│   │   └── influxService.ts    # API 통신 서비스
│   │
│   ├── types/
│   │   ├── robot.ts            # 로봇 타입 정의
│   │   └── notifications.ts   # 알림 타입 정의
│   │
│   ├── utils/
│   │   ├── notificationManager.ts # 알림 관리
│   │   ├── alertRules.ts       # 알림 규칙
│   │   └── uuid.ts             # UUID 유틸리티
│   │
│   ├── backend/                # 백엔드 서버
│   │   ├── main.py             # FastAPI 서버 (시뮬레이션)
│   │   ├── main_with_influx.py # FastAPI 서버 (InfluxDB 연동)
│   │   ├── run.bat             # Windows 실행 스크립트 (권장)
│   │   ├── run.sh              # Unix 실행 스크립트 (권장)
│   │   ├── start_server.bat    # Windows 시작 스크립트 (고급)
│   │   ├── start_server.sh     # Unix 시작 스크립트 (고급)
│   │   ├── requirements.txt    # Python 의존성 (전체)
│   │   ├── requirements_minimal.txt # 최소 의존성
│   │   ├── generate_dummy_data.py # 더미 데이터 생성기
│   │   ├── quick_generate.py   # 빠른 더미 데이터 생성
│   │   └── README.md           # 백엔드 문서
│   │
│   ├── docker-compose.yml      # Docker Compose 설정
│   ├── README.md               # 프론트엔드 상세 문서
│   ├── QUICKSTART.md           # 빠른 시작 가이드
│   └── TROUBLESHOOTING.md      # 문제 해결 가이드
│
└── build/                      # 빌드 출력 (생성됨)
```

---

## 🌐 접속 URL

- **프론트엔드**: http://localhost:5173
- **백엔드 API**: http://localhost:8000
- **API 문서 (Swagger)**: http://localhost:8000/docs
- **InfluxDB UI**: http://localhost:8086 (Docker 실행 시)

---

## 🔧 고급 실행 방법

### Docker Compose 사용 (선택사항)

**전체 시스템 시작:**
```bash
cd src
docker-compose up -d
```

**프론트엔드 실행 (별도 터미널, 프로젝트 루트에서):**
```bash
npm install
npm run dev
```

**중지:**
```bash
cd src
docker-compose down
```

### InfluxDB 연동 모드 (고급)

실제 InfluxDB 데이터베이스를 사용하려면:

**1. InfluxDB 실행 (Docker)**
```bash
cd src
docker-compose up -d influxdb
```

**2. 백엔드 실행**
```bash
cd src/backend
python main_with_influx.py
```

> ⚠️ **주의**: InfluxDB 설정이 필요합니다. 자세한 내용은 [백엔드 문서](./src/backend/README.md) 참고

---

## 📊 로봇 데이터 구조

### Robot-arm (3대)
- **ID**: RA001, RA002, RA003
- **센서**: 온도, 효율, 관절각도(3개), 그리퍼, 토크, 작업속도

### UGV (3대)
- **ID**: UG001, UG002, UG003
- **센서**: 배터리, 온도, 신호, 효율, 거리센서(3방향), 속도, 경로진행률

### Drone (3대)
- **ID**: DR001, DR002, DR003
- **센서**: 배터리, 온도, 신호, 고도, 풍속, 비행시간, GPS, 귀환거리

---

## 🧪 API 테스트

```bash
# 모든 로봇 데이터 조회
curl http://localhost:8000/api/robots

# 특정 로봇 조회
curl http://localhost:8000/api/robots/RA001

# 시계열 데이터 조회
curl http://localhost:8000/api/robots/RA001/timeseries?hours=24

# 헬스 체크
curl http://localhost:8000/health

# 현재 모드 확인
curl http://localhost:8000/api/mode
```

---

## 📊 더미 데이터 생성 (InfluxDB)

InfluxDB에 테스트 데이터를 생성하려면:

```bash
cd src/backend

# 빠른 생성 (24시간 과거 + 10분 실시간)
python quick_generate.py

# 커스텀 생성 (대화형 메뉴)
python generate_dummy_data.py
```

자세한 사용법: [더미 데이터 생성 가이드](./src/backend/README_DUMMY_DATA.md)

---

## 🔧 환경 변수

### 프론트엔드 (선택사항)
`.env` 파일 생성:
```env
VITE_API_URL=http://localhost:8000
```

### 백엔드 (InfluxDB 사용 시)
`src/backend/.env` 파일 생성:
```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-token-here
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
```

---

## 🐛 자주 발생하는 문제

### 백엔드 패키지 설치 오류 (Windows)

**증상**: `pydantic-core` 빌드 오류, Rust 관련 오류

**해결**: `run.bat`가 자동으로 해결합니다. 그래도 안 되면:
```bash
cd src/backend
pip install --upgrade pip
pip install --only-binary :all: fastapi uvicorn
python main.py
```

### 백엔드 연결 실패

프론트엔드는 백엔드 연결 실패 시 **자동으로 시뮬레이션 모드**로 전환됩니다. UI는 정상적으로 작동합니다!

### 포트 사용 중 오류

**8000번 포트 사용 중**: 다른 프로그램 종료 또는 포트 변경 필요
**5173번 포트 사용 중**: 다른 Vite 서버 종료 필요

> 📖 더 자세한 문제 해결: [문제 해결 가이드](./src/TROUBLESHOOTING.md)

---

## 📚 추가 문서

- [프론트엔드 상세 문서](./src/README.md)
- [백엔드 문서](./src/backend/README.md)
- [빠른 시작 가이드](./src/QUICKSTART.md)
- [문제 해결 가이드](./src/TROUBLESHOOTING.md)
- [백엔드 빠른 시작](./src/backend/빠른시작.md)
- [백엔드 사용 가이드](./src/backend/USAGE_GUIDE.md)

---

## 🔮 향후 계획

- [ ] InfluxDB 실제 연동 완료
- [ ] 로봇 데이터 시뮬레이터 개선
- [ ] 히스토리 데이터 조회 API 확장
- [ ] WebSocket 실시간 스트리밍
- [ ] 사용자 인증 시스템
- [ ] 다국어 지원
- [ ] 다크 모드 지원

---

## 📄 라이선스

개인 프로젝트 - MIT License

---

## 🤝 기여

이슈나 제안사항이 있으시면 GitHub Issues를 통해 알려주세요.

---

**Figma 디자인 원본**: https://www.figma.com/design/Rd35WutOVXGQpid39d44bh/Robot-Monitoring-System