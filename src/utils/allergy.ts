import { DishItem } from '../types/neis';

export interface AllergyInfo {
  code: number;
  name: string;
  icon: string;
}

export const ALLERGY_MAP: Record<number, AllergyInfo> = {
  1: { code: 1, name: '난류(계란)', icon: '🥚' },
  2: { code: 2, name: '우유', icon: '🥛' },
  3: { code: 3, name: '메밀', icon: '🌾' },
  4: { code: 4, name: '땅콩', icon: '🥜' },
  5: { code: 5, name: '대두(콩)', icon: '🫘' },
  6: { code: 6, name: '밀', icon: '🍞' },
  7: { code: 7, name: '고등어', icon: '🐟' },
  8: { code: 8, name: '게', icon: '🦀' },
  9: { code: 9, name: '새우', icon: '🦐' },
  10: { code: 10, name: '돼지고기', icon: '🐖' },
  11: { code: 11, name: '복숭아', icon: '🍑' },
  12: { code: 12, name: '토마토', icon: '🍅' },
  13: { code: 13, name: '아황산류', icon: '🧪' },
  14: { code: 14, name: '호두', icon: '🌰' },
  15: { code: 15, name: '닭고기', icon: '🐓' },
  16: { code: 16, name: '쇠고기', icon: '🐂' },
  17: { code: 17, name: '오징어', icon: '🦑' },
  18: { code: 18, name: '조개류', icon: '🦪' },
  19: { code: 19, name: '잣', icon: '🌲' },
};

export const ALLERGY_LIST: AllergyInfo[] = Object.values(ALLERGY_MAP);

/**
 * Parses raw dish string from NEIS API (e.g. "쇠고기미역국 (5.6.16)<br/>돼지갈비찜 (5.6.10.13)")
 */
export function parseDishes(rawDdishNm: string): DishItem[] {
  if (!rawDdishNm) return [];

  // Replace <br/> or <br> or \n with newline, then split
  const lines = rawDdishNm
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(line => line.trim())
    .filter(Boolean);

  return lines.map(line => {
    // Match pattern like "해물파전 (1.5.6.9.13.17.18)" or "배추김치 9.13" or "치즈돈까스(1.2.5.6.10)"
    const match = line.match(/^(.*?)\s*(?:\(?([\d.]+)\)?)?$/);

    let name = line;
    let allergies: number[] = [];

    if (match) {
      name = match[1].trim();
      if (match[2]) {
        const codesStr = match[2];
        allergies = codesStr
          .split('.')
          .map(c => parseInt(c, 10))
          .filter(n => !isNaN(n) && ALLERGY_MAP[n]);
      }
    }

    // Secondary cleanup if name still contains trailing allergy numbers or symbols
    name = name.replace(/\(\s*[\d.]*\s*\)$/, '').trim();

    return {
      raw: line,
      name: name || line,
      allergies,
    };
  });
}

/**
 * Format ORGN_INFO raw text into array of clean string tags
 */
export function parseOriginInfo(rawOrgn: string): string[] {
  if (!rawOrgn) return [];
  return rawOrgn
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);
}

/**
 * Format NTR_INFO raw text into name/value list
 */
export function parseNutritionInfo(rawNtr: string): { name: string; value: string }[] {
  if (!rawNtr) return [];
  const lines = rawNtr
    .replace(/<br\s*\/?>/gi, '\n')
    .split('\n')
    .map(item => item.trim())
    .filter(Boolean);

  return lines.map(line => {
    const parts = line.split(':');
    if (parts.length >= 2) {
      return {
        name: parts[0].trim(),
        value: parts.slice(1).join(':').trim(),
      };
    }
    return { name: line, value: '' };
  });
}
