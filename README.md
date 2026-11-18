# NIKKE Storyline

## 일본어 페이지

- 한국어 `/nikke-storyline/`, 일본어 `/nikke-storyline/ja/`는 `StorylinePage.astro`와 원본 데이터를 공유합니다.
- `src/i18n/ja.ts`에서 일본어 표시 문구를 관리합니다. HTML을 생성할 때 텍스트와 접근성 문구만 치환하며 카드 ID, 링크, 필터 값, 이미지 경로는 보존합니다. 한국어 출력에는 번역 처리를 적용하지 않습니다.
- 동적으로 바뀌는 필터 요약·이어서 보기·기록 삭제 확인은 `src/i18n/client.ts`를 사용합니다. 언어 간 감상 기록은 기존 `nikke-watched` 저장 키를 공유합니다.
- 새 한국어 문구의 일본어 번역이 없으면 원문을 표시하고 빌드 로그에 `[i18n:ja] 번역 누락`을 출력합니다.
- 일본어판은 별도 canonical URL과 언어별 alternate 링크를 가지며 sitemap에도 포함됩니다. 한국어 원본 데이터와 기존 업데이트 로그는 수정하지 않았습니다.
- 일본어 공식 에피소드명을 확정하지 못한 두 곳은 한국어 원제를 번역하고 `仮訳`을 붙였습니다: OLD TALES의 `되찾아 오길: A` → `取り戻せますように：A`, BOOM THE GHOST의 `떠오르는 [기억]` → `浮かび上がる[記憶]`. 한국어 원제는 번역 사전의 키로 보존합니다.

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

## 썸네일 수집과 원본

- 매일 12:00 KST에 `scripts/sync-wiki-images.mjs`를 실행합니다. 이벤트·사이드 썸네일은 Fandom `Campaign/Storyline`의 `Storyline *.png`를 우선하고, 아직 파일이 없으면 `https://nikke-db.pages.dev/gallery`의 **Album Covers** 목록에서 제목이 일치하는 이미지를 사용합니다. 갤러리의 다른 이미지 종류는 자동 수집하지 않습니다.
- 두 출처에 모두 없는 카드는 사용자가 지정한 임시 이미지를 `src/assets/thumbs/`에 넣고 `scripts/wiki-image-placeholders.json`에 카드 제목을 등록합니다. Album Cover로 교체해도 대기를 유지하며, 위키 Storyline 이미지로 교체한 뒤에만 목록에서 제거합니다. 이미 수집한 같은 앨범 이미지는 다시 받지 않습니다.
- 메인 챕터는 기존 위키 `Album Chapter NN.png`, 이벤트 로고는 기존 `Event` 문서의 `* logo.png`를 사용합니다. 기존 챕터·로고 파일은 덮어쓰지 않습니다.
- `src/thumbnail-sources.json`에는 위키 이외 이미지와 새로 자동 수집한 이미지의 출처·원본 파일명·필요한 크롭 좌표를 기록합니다. 크롭 좌표는 원본 픽셀 기준 `x`, `y`, `size`이며, 카드용 이미지는 같은 영역을 256×256 WebP로 저장합니다.
- 확대 창도 256×256 영역으로 보여 줍니다. 보관된 원본이 있으면 CSS로 표시 영역만 잘라서 우클릭의 이미지 열기·저장은 원본 파일을 사용합니다. 원본은 `public/thumbnail-originals/`에 두고 확대 창을 열 때만 요청합니다. 원본을 보관하지 않은 기존 위키 썸네일은 현재 256×256 파일을 사용합니다.
- 수집 순서 회귀 검증: `node --test scripts/sync-wiki-images.test.mjs`.

### 캐릭터 이미지 기본 방식

니케 캐릭터는 Fandom 캐릭터 페이지의 `이름 MI.png` 반신 원본을 얼굴 중심으로 정사각형 크롭하여 256×256 썸네일로 만듭니다. `이름S.png` 저해상도 아이콘을 확대하는 방식은 사용하지 않습니다. 얼굴·머리 장식 위치에 맞춰 크롭 좌표를 정하고, 투명 배경에는 남색 그라데이션을 받칩니다.

### 현재 이미지 출처

메인 챕터와 일반 이벤트·사이드 이미지는 [Fandom Campaign/Storyline](https://nikke-goddess-of-victory-international.fandom.com/wiki/Campaign/Storyline)의 `Album Chapter NN.png`·`Storyline *.png`를 사용합니다. 이벤트 로고는 [Fandom Event](https://nikke-goddess-of-victory-international.fandom.com/wiki/Event) 문서의 로고 파일을 사용합니다. 아래는 이 기본 출처 외의 이미지를 사용하는 전체 목록입니다. 정확한 CDN URL과 크롭 좌표는 [`src/thumbnail-sources.json`](src/thumbnail-sources.json)에서 관리합니다.

| 이미지 | 실제 원본 출처 | 사용 방식 |
|---|---|---|
| 홍련 | [Scarlet_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Scarlet_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| 라푼젤 | [Rapunzel_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Rapunzel_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| MIRACLE SNOW | [Miracle_Snow_splash_2.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Miracle_Snow_splash_2.jpg) | splash/공식 일러스트 크롭 |
| CHERRY BLOSSOM | [Cherry_Blossom_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Cherry_Blossom_splash_1.jpg) | splash/공식 일러스트 크롭 |
| FIRST AFFECTION | [First_Affection_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:First_Affection_splash_1.jpg) | splash/공식 일러스트 크롭 |
| SCHOOL OF LOCK | [School_of_Lock_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:School_of_Lock_splash_1.jpg) | splash/공식 일러스트 크롭 |
| DAZZLING CUPID | [Dazzling_Cupid_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Dazzling_Cupid_splash_1.jpg) | splash/공식 일러스트 크롭 |
| 에테르 | [Ether_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Ether_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| 나가 | [Naga_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Naga_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| 킬로 | [Kilo_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Kilo_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| COLOR LESS | [Colorless_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Colorless_splash_1.jpg) | splash/공식 일러스트 크롭 |
| FOR REST | [For_Rest_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:For_Rest_splash_1.jpg) | splash/공식 일러스트 크롭 |
| 모리 | [Mori_MI.png](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Mori_MI.png) | 반신 원본에서 얼굴 중심 크롭 |
| BLANK TICKET | [Blank_Ticket_splash_1.jpg](https://nikke-goddess-of-victory-international.fandom.com/wiki/File:Blank_Ticket_splash_1.jpg) | splash/공식 일러스트 크롭 |
| GINGERBREAD HOUSE | [nikke-db 사이드 스토리 장면](https://nikke-db-legacy.pages.dev/images/gallery/side06/EventScene_Side_06_03_1.webp) | 정사각형 장면 이미지 |
| MARIA N | [니케 공식 CDN](https://na-nikke-aws.playerinfinite.com/cms/nrft/feeds/pic/_a1c0db2b7bbd28d6815ea2f44586ca351233e2cd-3840x2160-ori_s_80_50_ori_q_80.webp) | splash/공식 일러스트 크롭 |
| PROJECT MATIS | [nikke-db Album Cover](https://nikke-db-legacy.pages.dev/images/gallery/albums/album_projectmatis_01.png) | 정사각형 앨범 커버 |
| COIN RUSH SHOWDOWN | [nikke-db Album Cover](https://nikke-db-legacy.pages.dev/images/gallery/albums/album_coinrushshowdown_01.png) | 정사각형 앨범 커버 |
| ICE DRAGON SAGA | [nikke-db Album Cover](https://nikke-db-legacy.pages.dev/images/gallery/albums/album_icedragonsaga_01.png) | 정사각형 앨범 커버 |
| TERMINUS TICKET | [nikke-db Album Cover](https://nikke-db-legacy.pages.dev/images/gallery/albums/album_terminusticket_01.png) | 정사각형 앨범 커버 |
| 2X2 LOVE | [nikke-db Album Cover](https://nikke-db-legacy.pages.dev/images/gallery/albums/album_2x2love_01.png) | 정사각형 앨범 커버 |

크롭을 바꿀 때에는 썸네일 파일과 메타데이터 좌표를 함께 갱신하고, 확대 창에서도 같은 부분이 보이는지 확인합니다. 원본의 종횡비나 기존 크롭을 추정하여 기록하지 않습니다.

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
