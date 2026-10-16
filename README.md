# NIKKE Storyline

## 구조

```
src/
├── data/             # 스토리 데이터 (TypeScript, 타입 안전)
│   ├── types.ts      # Category, Importance, TimelineItem 등 타입
│   ├── timeline.ts   # 38 카드 + dividers + groups
│   ├── intro.ts      # "먼저 알아둘 점" bullets
│   ├── legend.ts     # 4 카테고리 + 중요도 설명
│   ├── notes.ts      # 스토리라인 밖에서 챙길 스토리 카드
│   ├── bonus.ts      # 호평 이벤트 카드
│   └── meta.ts       # 최종 갱신일 (LAST_UPDATED)
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

## 외부 사이트에서 데이터 사용하기

가이드 데이터를 JSON으로 공개합니다. 사본을 저장해 두는 대신 이 주소를 불러오면
가이드가 업데이트될 때마다 자동으로 최신 내용이 반영됩니다.

```
https://ssissun.github.io/nikke-storyline/data.json
```

- 다른 도메인에서 `fetch`로 바로 불러올 수 있습니다 (CORS 허용).
- 배포 후 최대 10분 안에 새 내용이 반영됩니다 (GitHub Pages 캐시).
- 형태를 바꾸거나 일부만 골라 자유롭게 커스텀해서 쓰셔도 됩니다.

```js
const res = await fetch('https://ssissun.github.io/nikke-storyline/data.json');
const guide = await res.json();
```

| 필드 | 내용 |
|---|---|
| `schemaVersion` | 데이터 형식 버전. 구조가 호환되지 않게 바뀌면 올라갑니다 |
| `source` | 원본 가이드 주소 |
| `lastUpdated` | 가이드 최종 갱신일 (`YYYY-MM-DD`) |
| `buildId` | 배포마다 바뀌는 식별자. 변경 감지용 |
| `intro` | "먼저 알아둘 점" 목록 |
| `legend` | 카테고리 설명 |
| `notes` | 본편 외부에서 챙길 스토리 카드 |
| `timeline` | 감상 순서. `type`이 `card` / `divider` / `optional-events` / `old-tales`인 항목의 배열이며, 화면의 순서 번호는 `divider`를 빼고 1부터 셉니다 |
| `settingStories` | 주요 설정 관련 스토리 묶음 |
| `bonus` | 단독 감상으로 호평인 이벤트 카드 |

각 항목의 정확한 형태는 [`src/data/types.ts`](src/data/types.ts)를 참고하세요.
`annotations`, `description`, `innerNote`, `body`, `bullets`, `intro` 문자열에는
`<em>`, `<strong>` 같은 HTML 태그가 들어 있습니다.

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
