# NIKKE Storyline

## 구조

```
src/
├── data/             # 스토리 데이터 (TypeScript, 타입 안전)
│   ├── types.ts      # Category, Importance, TimelineItem 등 타입
│   ├── timeline.ts   # 38 카드 + dividers + groups
│   ├── intro.ts      # "먼저 알아둘 점" bullets
│   ├── legend.ts     # 4 카테고리 + 중요도 설명
│   ├── notes.ts      # 외부 분기 카드
│   └── bonus.ts      # 호평 이벤트 카드
├── components/       # 재사용 컴포넌트
├── layouts/          # 공통 레이아웃 (head/body/og 메타)
├── pages/index.astro # 페이지 조립
└── styles/global.css # 기존 스타일 그대로 (디자인 토큰 + 컴포넌트 CSS)

public/               # 빌드 시 그대로 복사되는 정적 파일
├── robots.txt
├── sitemap.xml
└── assets/og-thumbnail.jpg
```

## 로컬 실행

```bash
npm install        # 최초 1회
npm run dev        # 개발 서버 → http://localhost:4321/nikke-storyline/
npm run build      # dist/에 정적 빌드
npm run preview    # 빌드 결과 미리보기
```

> `astro.config.mjs`의 `base: '/nikke-storyline'` 때문에 dev 서버에서도 URL이
> `/nikke-storyline/` 경로로 시작합니다 (GitHub Pages 호환).

## 노드 추가/수정

`src/data/timeline.ts`에 객체 하나만 추가하면 됩니다. 순서 번호는 자동 부여.

```ts
{
  type: 'card',
  title: 'NEW STORY',
  category: 'event',
  required: true,
  noDub: true,
  importance: 'high',  // 선택 카드일 때만 의미
  annotations: ['<strong>설명</strong> ...'],
}
```

## 배포
GitHub Actions로 자동화됨
main 브랜치에 push될 때마다 자동 실행:
```
  git push (main으로)
    ↓
   [자동] GitHub Actions 트리거
     1. checkout
     2. npm ci (의존성 설치, package-lock.json 기준)
     3. npm run build (Astro → dist/)
     4. actions/upload-pages-artifact
     5. actions/deploy-pages
    ↓
   [자동] ssissun.github.io/nikke-storyline 에 새 dist/ 반영 (1-2분
   내)
```
