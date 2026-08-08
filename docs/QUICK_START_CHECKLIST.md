# ✅ 빠른 시작 체크리스트

## 📋 설치 전 확인사항

- [ ] Python 3.8+ 설치됨 (`python --version`)
- [ ] Node.js 16+ 설치됨 (`node --version`)
- [ ] Docker 설치됨 (선택사항) (`docker --version`)

---

## 🚀 백엔드 실행 (3분)

### Windows 사용자
```bash
# 프로젝트 루트에서 실행
backend/fastapi/start_server.bat
```

### macOS/Linux 사용자
```bash
# 프로젝트 루트에서 실행
chmod +x backend/fastapi/start_server.sh
./backend/fastapi/start_server.sh
```

### 수동 실행
```bash
# 프로젝트 루트에서 실행
pip install -r backend/fastapi/requirements.txt
python backend/fastapi/main_with_influx.py
```

**✅ 확인:**
- [ ] 터미널에 "🚀 FastAPI 서버 시작 중..." 표시
- [ ] http://localhost:8000 접속 시 JSON 응답

---

## 🌐 프론트엔드 실행 (2분)

```bash
# 프로젝트 루트에서
npm --prefix frontend install
npm --prefix frontend run dev
```

**✅ 확인:**
- [ ] 터미널에 "Local: http://localhost:5173" 표시
- [ ] 브라우저에 대시보드 표시

---

## 🎉 완료 확인

### 브라우저 (http://localhost:5173)
- [ ] 메인 대시보드 표시
- [ ] 로봇 카드 9개 표시 (Robot-arm 3 + UGV 3 + Drone 3)
- [ ] 원형 진행 표시기 동작
- [ ] 3초마다 자동 업데이트 (콘솔 확인)

### 브라우저 콘솔 (F12)
- [ ] "✅ FastAPI에서 9대 로봇 데이터 로드 완료" 메시지
- [ ] 오류 메시지 없음

### API 테스트
```bash
curl http://localhost:8000/api/robots
```
- [ ] JSON 배열 응답 (9개 로봇)

---

## ⚠️ 문제 발생 시

### "FastAPI 연결 실패" 메시지

**원인:** 백엔드 서버가 실행되지 않음

**해결:**
1. 백엔드 터미널 확인
2. 프로젝트 루트에서 `python backend/fastapi/main_with_influx.py` 실행
3. http://localhost:8000 접속 확인

### "시뮬레이션 데이터로 대체" 메시지

**원인:** 정상 동작 (백엔드가 시뮬레이션 모드로 실행 중)

**해결:** 문제 없음! 계속 사용 가능

InfluxDB 실제 데이터를 원하면:
```bash
# 프로젝트 루트에서 실행
python simulator/quick_generate.py
```

### 포트 충돌 오류

**8000 포트:**
```bash
# Windows
netstat -ano | findstr :8000
taskkill /PID <PID> /F

# macOS/Linux
lsof -i :8000
kill -9 <PID>
```

**5173 포트:**
```bash
# 다른 Vite 프로젝트 종료
# 또는 package.json에서 포트 변경
```

---

## 📚 더 알아보기

- **전체 사용법**: [README.md](../README.md)
- **문제 해결**: [TROUBLESHOOTING.md](./TROUBLESHOOTING.md)
- **더미 데이터**: [README_DUMMY_DATA.md](./simulator/README_DUMMY_DATA.md)
- **백엔드 가이드**: [USAGE_GUIDE.md](./backend/USAGE_GUIDE.md)

---

## 🎯 다음 단계

시스템이 정상 동작하면:

1. **기능 탐색**
   - Grid View 클릭하여 그리드 보기 확인
   - 로봇 카드 클릭하여 상세 페이지 확인
   - 알림 센터 확인 (우측 상단 벨 아이콘)

2. **InfluxDB 연동 (선택)**
   - Docker로 InfluxDB 시작: `docker compose -f infra/docker-compose.yml up -d influxdb`
   - 브라우저에서 http://localhost:8086 설정
   - 더미 데이터 생성: `python simulator/quick_generate.py`

3. **커스터마이징**
   - 로봇 수 변경
   - 센서 데이터 커스터마이징
   - UI 테마 변경

---

**소요 시간: 약 5분**

문제가 있으면 [TROUBLESHOOTING.md](./TROUBLESHOOTING.md) 참조!
