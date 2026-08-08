# Simulator

테스트용 로봇 센서 데이터를 생성하여 InfluxDB에 기록하는 Python 도구입니다.

모든 명령은 프로젝트 루트에서 실행합니다.

```bash
python3 -m pip install -r backend/fastapi/requirements.txt
python3 simulator/quick_generate.py
```

대화형 생성기는 `python3 simulator/generate_dummy_data.py`로 실행합니다. 환경 설정은 프로젝트 루트 `.env` 또는 셸 환경 변수를 사용합니다.

상세 내용은 [더미 데이터 가이드](../docs/simulator/README_DUMMY_DATA.md)를 참고하세요.
