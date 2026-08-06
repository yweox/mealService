import { ParsedMeal, RawNeisMealRow, SchoolInfo } from '../types/neis';
import { parseDishes, parseNutritionInfo, parseOriginInfo } from './allergy';

const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

export interface NeisMealResponse {
  mealServiceDietInfo?: [
    { head?: any[] },
    { row?: RawNeisMealRow[] }
  ];
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

export interface NeisSchoolResponse {
  schoolInfo?: [
    { head?: any[] },
    { row?: SchoolInfo[] }
  ];
  RESULT?: {
    CODE: string;
    MESSAGE: string;
  };
}

/**
 * Fetch meal data for a specific date
 */
export async function fetchMealService(
  officeCode: string,
  schoolCode: string,
  dateYmd: string
): Promise<ParsedMeal[]> {
  const url = new URL(`${NEIS_BASE_URL}/mealServiceDietInfo`);
  url.searchParams.set('type', 'json');
  url.searchParams.set('pIndex', '1');
  url.searchParams.set('pSize', '10');
  url.searchParams.set('ATPT_OFCDC_SC_CODE', officeCode);
  url.searchParams.set('SD_SCHUL_CODE', schoolCode);
  url.searchParams.set('MLSV_YMD', dateYmd);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`NEIS API 요청 실패 (상태: ${res.status})`);
  }

  const data: NeisMealResponse = await res.json();

  if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
    if (data.RESULT.CODE === 'INFO-200') {
      return []; // No meal on this date
    }
    throw new Error(data.RESULT.MESSAGE || '급식 정보를 불러오는 중 오류가 발생했습니다.');
  }

  const rows = data.mealServiceDietInfo?.[1]?.row || [];

  return rows.map(row => ({
    mealCode: row.MMEAL_SC_CODE,
    mealName: row.MMEAL_SC_NM,
    dateYmd: row.MLSV_YMD,
    schoolName: row.SCHUL_NM,
    dishes: parseDishes(row.DDISH_NM),
    calories: row.CAL_INFO || '',
    originInfo: parseOriginInfo(row.ORGN_INFO || ''),
    nutritionInfo: parseNutritionInfo(row.NTR_INFO || ''),
  }));
}

/**
 * Fetch meal data for a date range (e.g. weekly view)
 */
export async function fetchMealRange(
  officeCode: string,
  schoolCode: string,
  fromYmd: string,
  toYmd: string
): Promise<ParsedMeal[]> {
  const url = new URL(`${NEIS_BASE_URL}/mealServiceDietInfo`);
  url.searchParams.set('type', 'json');
  url.searchParams.set('pIndex', '1');
  url.searchParams.set('pSize', '100');
  url.searchParams.set('ATPT_OFCDC_SC_CODE', officeCode);
  url.searchParams.set('SD_SCHUL_CODE', schoolCode);
  url.searchParams.set('MLSV_FROM_YMD', fromYmd);
  url.searchParams.set('MLSV_TO_YMD', toYmd);

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`NEIS API 요청 실패 (상태: ${res.status})`);
  }

  const data: NeisMealResponse = await res.json();

  if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
    if (data.RESULT.CODE === 'INFO-200') {
      return [];
    }
    throw new Error(data.RESULT.MESSAGE || '기간별 급식 정보를 불러오는 중 오류가 발생했습니다.');
  }

  const rows = data.mealServiceDietInfo?.[1]?.row || [];

  return rows.map(row => ({
    mealCode: row.MMEAL_SC_CODE,
    mealName: row.MMEAL_SC_NM,
    dateYmd: row.MLSV_YMD,
    schoolName: row.SCHUL_NM,
    dishes: parseDishes(row.DDISH_NM),
    calories: row.CAL_INFO || '',
    originInfo: parseOriginInfo(row.ORGN_INFO || ''),
    nutritionInfo: parseNutritionInfo(row.NTR_INFO || ''),
  }));
}

/**
 * Search school info by name
 */
export async function searchSchools(schoolName: string): Promise<SchoolInfo[]> {
  if (!schoolName.trim()) return [];

  const url = new URL(`${NEIS_BASE_URL}/schoolInfo`);
  url.searchParams.set('type', 'json');
  url.searchParams.set('pIndex', '1');
  url.searchParams.set('pSize', '30');
  url.searchParams.set('SCHUL_NM', schoolName.trim());

  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`학교 검색 실패 (상태: ${res.status})`);
  }

  const data: NeisSchoolResponse = await res.json();

  if (data.RESULT && data.RESULT.CODE !== 'INFO-000') {
    if (data.RESULT.CODE === 'INFO-200') {
      return [];
    }
    throw new Error(data.RESULT.MESSAGE || '학교 검색 중 오류가 발생했습니다.');
  }

  return data.schoolInfo?.[1]?.row || [];
}
