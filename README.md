# NIKKE Storyline

## 일본어 페이지

- 한국어 `/nikke-storyline/`, 일본어 `/nikke-storyline/ja/`는 `StorylinePage.astro`와 원본 데이터를 공유합니다.
- `src/i18n/ja.ts`에서 일본어 표시 문구를 관리합니다. HTML을 생성할 때 텍스트와 접근성 문구만 치환하며 카드 ID, 링크, 필터 값, 이미지 경로는 보존합니다. 한국어 출력에는 번역 처리를 적용하지 않습니다.
- 동적으로 바뀌는 필터 요약·이어서 보기·기록 삭제 확인은 `src/i18n/client.ts`를 사용합니다. 언어 간 감상 기록은 기존 `nikke-watched` 저장 키를 공유합니다.
- 새 한국어 문구의 일본어 번역이 없으면 원문을 표시하고 빌드 로그에 `[i18n:ja] 번역 누락`을 출력합니다.
- 일본어판은 별도 canonical URL과 언어별 alternate 링크를 가지며 sitemap에도 포함됩니다. 한국어 원본 데이터와 기존 업데이트 로그는 수정하지 않았습니다.
- 일본어 에피소드명을 확정하지 못한 두 곳은 한국어 원제를 병기했습니다: OLD TALES의 32장 보스 직전 `되찾아 오길: A`, BOOM THE GHOST의 `떠오르는 [기억]`. 일본판 게임 내 표기와 대조 후 일본어 사전에서 교체합니다.

### 일본어 용어 검토 (2026-11-16)

일본어 자료의 실제 사용과 대조한 표기입니다. UI의 정확한 표기와 커뮤니티의 통칭은 구분합니다.

| 한국어 | 적용한 일본어 | 검토 결과 |
|---|---|---|
| 커맨드센터 | コマンドセンター | 유지. 면담·회상 메뉴를 포함한 시설명 |
| 인연 스토리 / 인연스 | 個別エピソード / 個エピ | 기존 キャラエピソード도 통용되나 분류명과 짧은 배지를 일관되게 정리. 게임 진입 경로는 面談 → 面談日誌 → エピソード |
| 전초기지 | 前哨基地 | 유지 |
| 릴리즈 순서 | RELEASE / リリース順 | 실제 탭을 안내하는 곳은 RELEASE, 일반 설명은 リリース順 |
| 방주 | アーク | 유지 |
| 작전출격 | 作戦へ出撃 | 직역 作戦出撃를 실제 버튼 표기로 수정 |
| 로비 더보기 | ロビーからストーリーラインへ | 기존 その他를 제거. 더보기 버튼의 정확한 일본어명은 미확정이므로 동선으로 설명 |
| 스토리라인 | ストーリーライン | 유지 |
| 회상 | 回想 | 유지 |
| 아카이브 | アーカイブ | 유지 |
| 상담 | 面談 | 유지 |
| 유실물 | 遺失物 | 유지 |
| 이지스 스쿼드 | イージス部隊 | 부대명 イージス는 맞으며 문맥에 맞게 部隊 추가 |
| 돌발 스토리 | 突発イベント | 유지 |
| 엘리베이터 괴담 | エレベーターの怪談 | 유지 |
| 롬(수집 로봇) | 収集ロボット（ロム） | 근거 없는 영문 대문자 ROM 대신 일본어 이름 ロム 사용. 일본어 위키에는 현행 표기에서 이름이 삭제되었다는 기록도 있어 수집 로봇을 앞에 둠 |
| 미미르 부속고등학교 | M.M.R.附属高校 | 유지 |
| 저지스 / 시지 패러리스 | ジャッジス / シージペリラス | 유지 |
| 익스터너 / 인피니티 레일 | エクスターナー / インフィニティレール | 유지 |

대조 자료:

- [게임 화면을 포함한 일본 커뮤니티의 스토리 종류·열람 방법](https://note.com/heartcrayon1000/n/neb2d2f3f5444): RELEASE, 作戦へ出撃, 個別エピソード·個エピ 및 메뉴 경로.
- [Game8 코마ンド센터 안내](https://game8.jp/nikke/500809): コマンドセンター, 前哨基地, 面談, 回想, 遺失物.
- [아카이브 진입 경로](https://ginmy.net/nikke_archive): コマンドセンター → 回想 → アーカイブ.
- [개발사 시나리오팀 인터뷰](https://www.famitsu.com/article/202406/7845): アーク와 前哨基地의 명칭 및 위치 관계.
- [NIKKEpedia 이지스](https://w.atwiki.jp/nikkepedia/pages/50.html), [M.M.R.附属高校](https://w.atwiki.jp/nikkepedia/pages/154.html), [OVER ZONE](https://w.atwiki.jp/nikkepedia/pages/420.html): 부대·학교·수집 로봇 이름.
- [엘리베이터 괴담 관련 일본 기사](https://www.famitsu.com/news/202401/05330201.html): 突発イベント와 エレベーターの怪談.

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
`annotations`, `expandedAnnotations`, `description`, `innerNote`, `body`, `bullets`, `intro` 문자열에는
`<em>`, `<strong>` 같은 HTML 태그가 들어 있습니다.

타임라인 카드의 선택 필드 `expandedAnnotations`는 기본 설명 아래의 ‘참고’를 펼치면 보이는 항목입니다.

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
