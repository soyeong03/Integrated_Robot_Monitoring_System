# InfluxDB 더미 데이터 생성기

9개의 이기종 로봇(Robot-arm 3개, UGV 3개, Drone 3개)에 대한 시계열 데이터를 InfluxDB에 주입하는 스크립트입니다.

## 📋 기능

### 1. 과거 데이터 생성
- 기본: 24시간 분량의 데이터 생성 (3분 간격)
- 각 로봇별로 자연스러운 센서 값 변화 시뮬레이션
- 배터리는 점진적으로 감소, 센서 값은 이전 값 기준으로 랜덤 변화

### 2. 실시간 데이터 생성
- 기본: 60분 동안 실시간 데이터 생성 (3초 간격)
- 실제 운영 환경과 유사한 실시간 데이터 스트림 시뮬레이션
- Ctrl+C로 언제든지 중단 가능

### 3. 로봇별 센서 데이터

#### Robot-arm (3대: RA001, RA002, RA003)
- `temperature`: 온도 (20-80°C)
- `efficiency`: 효율 (70-100%)
- `joint1Angle`, `joint2Angle`, `joint3Angle`: 관절 각도 (-180~180°)
- `gripperState`: 그리퍼 상태 (OPEN/CLOSED)
- `torque`: 토크 (10-100 Nm)
- `workSpeed`: 작업 속도 (0-100%)

#### UGV (3대: UG001, UG002, UG003)
- `battery`: 배터리 (10-100%)
- `temperature`: 온도 (20-60°C)
- `signal`: 신호 강도 (50-100%)
- `efficiency`: 효율 (70-100%)
- `frontDistance`, `leftDistance`, `rightDistance`: 거리 센서 (0-500cm)
- `speed`: 속도 (0-50 km/h)
- `pathProgress`: 경로 진행률 (0-100%)

#### Drone (3대: DR001, DR002, DR003)
- `battery`: 배터리 (10-100%)
- `temperature`: 온도 (-10~50°C)
- `signal`: 신호 강도 (50-100%)
- `altitude`: 고도 (0-500m)
- `windSpeed`: 풍속 (0-30 m/s)
- `flightTime`: 비행 시간 (초)
- `gpsLat`, `gpsLon`: GPS 좌표
- `homeDistance`: 홈까지의 거리 (0-1000m)

## 🚀 사용 방법

### 1. 환경 설정

`.env` 파일에 InfluxDB 설정 추가:

```env
INFLUXDB_URL=http://localhost:8086
INFLUXDB_TOKEN=your-influxdb-token
INFLUXDB_ORG=robot-fleet
INFLUXDB_BUCKET=robot-monitoring
```

### 2. 패키지 설치

```bash
cd backend
pip install -r requirements.txt
```

### 3. 스크립트 실행

```bash
python generate_dummy_data.py
```

### 4. 메뉴 선택

```
📋 메뉴:
  1. 과거 데이터 생성 (24시간, 3분 간격)
  2. 실시간 데이터 생성 (60분, 3초 간격)
  3. 과거 + 실시간 데이터 생성
  4. 커스텀 설정

선택 (1-4):
```

#### 옵션 1: 과거 데이터만 생성
- 24시간 분량의 과거 데이터 생성
- 총 약 28,800개의 데이터 포인트 (9대 × 480개)

#### 옵션 2: 실시간 데이터만 생성
- 60분 동안 3초 간격으로 데이터 생성
- 총 약 10,800개의 데이터 포인트 (9대 × 1,200개)

#### 옵션 3: 과거 + 실시간
- 과거 데이터를 먼저 생성한 후 실시간 데이터 생성
- 차트 테스트에 가장 적합

#### 옵션 4: 커스텀 설정
- 시간, 간격 등을 직접 설정 가능

## 📊 데이터 구조

### InfluxDB 측정값 (Measurement)
- `robot-arm`: Robot-arm 데이터
- `ugv`: UGV 데이터
- `drone`: Drone 데이터

### 태그 (Tags)
- `robot_id`: 로봇 ID (예: RA001)
- `robot_name`: 로봇 이름 (예: Robot-arm 1)
- `group`: 그룹 (예: 생산라인A)
- `manufacturer`: 제조사 (예: ABB)
- `department`: 부서 (예: 생산부문)
- `line`: 라인 (예: 1라인)
- `area`: 구역 (예: 생산라인)
- `floor`: 층 (예: 1층)
- `status`: 상태 (normal/warning/error)

### 필드 (Fields)
- 각 센서 데이터 (위의 "로봇별 센서 데이터" 참조)

## 🔍 InfluxDB 쿼리 예시

### 최근 1시간 데이터 조회
```flux
from(bucket: "robot-monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_measurement"] == "robot-arm")
  |> filter(fn: (r) => r["robot_id"] == "RA001")
```

### 특정 센서의 평균값 계산
```flux
from(bucket: "robot-monitoring")
  |> range(start: -24h)
  |> filter(fn: (r) => r["_measurement"] == "ugv")
  |> filter(fn: (r) => r["_field"] == "battery")
  |> mean()
```

### 상태별 로봇 수 집계
```flux
from(bucket: "robot-monitoring")
  |> range(start: -1h)
  |> filter(fn: (r) => r["_field"] == "temperature")
  |> group(columns: ["status"])
  |> count()
```

## 🎯 상태 결정 로직

### Robot-arm
- **Warning**: 온도 > 70°C 또는 효율 < 75%
- **Error**: 온도 > 75°C 또는 효율 < 70%

### UGV
- **Warning**: 배터리 < 30% 또는 온도 > 50°C
- **Error**: 배터리 < 20% 또는 온도 > 55°C

### Drone
- **Warning**: 배터리 < 30% 또는 신호 < 60%
- **Error**: 배터리 < 20% 또는 신호 < 50%

## 💡 팁

### 1. 대용량 데이터 생성
더 긴 기간의 데이터를 생성하려면:
```bash
python generate_dummy_data.py
# 메뉴에서 '4' 선택 후
# 과거 데이터 시간: 168 (1주일)
# 간격: 300 (5분)
```

### 2. 고빈도 데이터 생성
더 촘촘한 데이터를 생성하려면:
```bash
python generate_dummy_data.py
# 메뉴에서 '4' 선택 후
# 과거 데이터 시간: 1
# 간격: 1 (1초)
```

### 3. 백그라운드 실행
실시간 데이터를 백그라운드에서 계속 생성:
```bash
nohup python generate_dummy_data.py > dummy_data.log 2>&1 &
```

## ⚠️ 주의사항

1. **InfluxDB 용량**: 대용량 데이터 생성 시 디스크 공간 확인
2. **네트워크**: 쓰기 작업이 많으므로 InfluxDB 연결 안정성 확인
3. **성능**: 간격이 너무 짧으면 시스템 부하 발생 가능

## 🐛 문제 해결

### "InfluxDB 연결 실패" 에러
1. InfluxDB가 실행 중인지 확인: `docker ps`
2. `.env` 파일의 `INFLUXDB_URL` 확인
3. `INFLUXDB_TOKEN`이 올바른지 확인

### "인증 실패" 에러
1. InfluxDB UI에서 새 토큰 생성
2. 토큰 권한 확인 (읽기/쓰기 권한 필요)

### "Bucket이 존재하지 않음" 에러
1. InfluxDB UI에서 bucket 생성
2. `.env` 파일의 `INFLUXDB_BUCKET` 이름 확인

## 📈 성능

- **과거 데이터 (24시간, 3분 간격)**: 약 1-2분 소요
- **실시간 데이터 (60분, 3초 간격)**: 60분 소요 (실시간)
- **총 데이터 포인트**: 약 40,000개 (과거 + 실시간)

## 🔗 관련 파일

- `/backend/main.py`: FastAPI 백엔드 서버
- `/backend/requirements.txt`: Python 패키지 목록
- `/backend/.env`: 환경 변수 설정
- `/types/robot.ts`: TypeScript 타입 정의
