import { BUILD_ID } from '../buildId';
import { LAST_UPDATED } from '../data/meta';
import { introBullets } from '../data/intro';
import { legendCategories } from '../data/legend';
import { externalNotes } from '../data/notes';
import { timeline } from '../data/timeline';
import { settingStoryGroups } from '../data/settingStories';
import { bonusCards } from '../data/bonus';

// 외부 사이트가 최신 가이드 데이터를 가져다 쓰도록 공개하는 JSON.
// 구조를 깨는 변경을 할 때는 schemaVersion을 올린다. 형식 설명은 README 참고.
export const GET = () =>
  new Response(
    JSON.stringify({
      schemaVersion: 1,
      source: 'https://ssissun.github.io/nikke-storyline/',
      lastUpdated: LAST_UPDATED,
      buildId: BUILD_ID,
      intro: introBullets,
      legend: legendCategories,
      notes: externalNotes,
      timeline,
      settingStories: settingStoryGroups,
      bonus: bonusCards,
    }),
    { headers: { 'Content-Type': 'application/json' } },
  );
