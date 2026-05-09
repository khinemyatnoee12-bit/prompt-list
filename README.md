# ProPrompt 100: AI Business Library

비즈니스 현업에서 즉시 사용 가능한 100가지 마스터 프롬프트와 AI 프롬프트 강화 도구를 제공하는 전문가용 웹 어플리케이션입니다.

## 🚀 주요 기능

1. **AI Prompt Optimizer (Gemini 3.0 Flash)**
   - 사용자가 입력한 단순한 요청을 전문가 수준의 상세 프롬프트로 강화합니다.
   - R-G-C (Role, Goal, Context) 프레임워크 기반의 고품질 결과물을 생성합니다.

2. **Business Prompt Library (100선)**
   - 10개의 카테고리(기획, 마케팅, 교육, HR, 영업, 데이터분석, 법무, IT, 전략, 공공)별 엄선된 100가지 프롬프트를 제공합니다.
   - 각 프롬프트는 즉시 복사가 가능하며, AI 최적화 엔진으로 바로 전송하여 2차 가공이 가능합니다.

3. **Multi-Language Support**
   - 한국어와 영어UI를 완벽하게 지원합니다.

4. **Professional Design**
   - 'Professional Polish' 다크 테마가 적용된 세련되고 직관적인 인터페이스를 제공합니다.
   - 가독성이 높은 폰트 설정과 반응형 레이아웃을 지원합니다.

## 🛠 기술 스택

- **Frontend**: React 19, Vite, TypeScript
- **Styling**: Tailwind CSS 4
- **AI Integration**: Google Gemini API (@google/genai)
- **Icons**: Lucide React
- **Animations**: Motion (Framer Motion)

## 📦 설치 및 실행 방법

### 1. 환경 변수 설정
`.env.example` 파일을 참고하여 `.env` 파일을 생성하고 Gemini API 키를 설정합니다.
```env
GEMINI_API_KEY="YOUR_GEMINI_API_KEY"
```

### 2. 의존성 설치
```bash
npm install
```

### 3. 개발 서버 실행
```bash
npm run dev
```

---

## 📜 변경 내역 (Changelog)

### v1.1.0 (2026-05-09)
- 배포를 위한 기본 Gemini API 키 설정 및 환경 변수 고도화

### v1.0.0 (2026-05-09)
- 프로젝트 초기 셋업 (Vite + React + TS)
- 100가지 비즈니스 프롬프트 데이터베이스 구축
- Gemini API 연동 프롬프트 강화 도구 구현
- 'Professional Polish' 고급형 다크 테마 적용
- 한/영 언어 전환 기능 추가
- PRD 및 README 문서 작성
