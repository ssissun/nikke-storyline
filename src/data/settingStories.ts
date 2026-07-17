import type { SettingStoryCard } from './types';

/**
 * 메인 흐름에서 지나치기 쉽지만 니케 세계관의 주요 설정을 깊게 다루는 이벤트 모음.
 * 설정 테마별로 묶음.
 */
export const settingStoryGroups: SettingStoryCard[] = [
  {
    setting: '방주의 동력원',
    events: ["BOOM'S DAY", 'D.ARK HERO', 'GOOD WORLD'],
  },
  {
    setting: '퍼펙트',
    events: ['NEW FLAVOR'],
  },
  {
    setting: '저지스 / 시지 패러리스',
    events: ['L.T.K — LICENSE TO KILL', 'KILL THE LORD', 'LORD FOR JUSTICE'],
  },
  {
    setting: '방주 의료기술',
    events: ['FOR REST', 'MEMORIES TELLER'],
  },
];
