# 🚀 빠른 시작 가이드

## ⚡ 1분 안에 시작하기

### 📋 사전 요구사항
- Node.js 18+ 설치
- Python 3.11+ 설치 (로컬 실행 시)
- Docker & Docker Compose 설치 (Docker 실행 시)

---

## 🎯 방법 1: Docker Compose (가장 쉬움!)

```bash
# 1️⃣ 백엔드 시작 (한 줄로!)
docker-compose up -d

# 2️⃣ 프론트엔드 시작 (별도 터미널)
npm install
npm run dev

# ✅ 완료! http://localhost:5173 접속
```

### 🛑 중지하기
```bash
docker-compose down
```

---

## 🎯 방법 2: 로컬 실행 (Python 직접 실행)

### 백엔드 (터미널 1)
```bash
cd backend
pip install -r requirements.txt
python main.py
```

### 프론트엔드 (터미널 2)
```bash
npm install
npm run dev
```

### ✅ 완료!
- 프론트엔드: http://localhost:5173
- 백엔드: http://localhost:8000
- API 문서: http://localhost:8000/docs

---

## 🧪 테스트

백엔드가 정상 작동하는지 확인:

```bash
# 터미널에서
curl http://localhost:8000/api/robots

# 또는 브라우저에서
http://localhost:8000/api/robots
```

9대 로봇의 JSON 데이터가 보이면 성공! 🎉

---

## 🐛 문제 해결

### "Failed to fetch" 에러가 나요!

**1단계: 백엔드가 실행 중인지 확인**
```bash
curl http://localhost:8000/health
```

**2단계: 포트가 사용 중인지 확인**
```bash
# Windows
netstat -ano | findstr :8000

# Mac/Linux
lsof -i :8000
```

**3단계: 백엔드 재시작**
```bash
# Docker 사용 시
docker-compose restart backend

# 로컬 실행 시
# Ctrl+C로 중지 후 다시 python main.py
```

### 프론트엔드가 백엔드를 못 찾아요!

**브라우저 콘솔 확인:**
```
🔄 API 요청: http://localhost:8000/api/robots
```

이 메시지가 보이지 않으면:
1. 브라우저 하드 리프레시 (Ctrl+Shift+R)
2. 개발 서버 재시작 (Ctrl+C 후 npm run dev)

### Docker 컨테이너가 시작되지 않아요!

```bash
# 로그 확인
docker-compose logs backend

# 컨테이너 상태 확인
docker-compose ps

# 완전히 재시작
docker-compose down
docker-compose up -d --build
```

---

## 📊 정상 동작 확인

### ✅ 백엔드 정상
터미널에 다음 메시지가 보여야 함:
```
🚀 FastAPI 서버 시작 중...
📡 http://localhost:8000
📚 API 문서: http://localhost:8000/docs
INFO:     Uvicorn running on http://0.0.0.0:8000
```

### ✅ 프론트엔드 정상
브라우저 콘솔에 다음 메시지가 보여야 함:
```
🔄 API 요청: http://localhost:8000/api/robots
✅ FastAPI에서 9대 로봇 데이터 로드 완료
```

---

## 🎨 다음 단계

1. **메인 대시보드** 확인 (/)
2. **그리드 뷰** 이동 (/grid-view)
3. **로봇 카드 클릭**하여 상세 페이지 확인
4. **알림 센터** 열어보기 (우측 상단 벨 아이콘)
5. **필터 & 검색** 테스트

---

## 📞 추가 도움

- API 문서: http://localhost:8000/docs
- README.md 참조
- GitHub Issues 작성
