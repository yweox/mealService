export interface SchoolInfo {
  ATPT_OFCDC_SC_CODE: string; // 시도교육청코드
  ATPT_OFCDC_SC_NM: string;   // 시도교육청명
  SD_SCHUL_CODE: string;      // 표준학교코드
  SCHUL_NM: string;           // 학교명
  ENG_SCHUL_NM?: string;      // 영문학교명
  SCHUL_KND_SC_NM?: string;   // 학교종류명 (초등학교, 중학교, 고등학교 등)
  LCTN_SC_NM?: string;        // 소재지명
  JU_ORG_NM?: string;         // 관할조직명
  ORG_RDNMA?: string;         // 도로명주소
}

export interface RawNeisMealRow {
  ATPT_OFCDC_SC_CODE: string;
  ATPT_OFCDC_SC_NM: string;
  SD_SCHUL_CODE: string;
  SCHUL_NM: string;
  MMEAL_SC_CODE: string; // 1: 조식, 2: 중식, 3: 석식
  MMEAL_SC_NM: string;   // 조식 / 중식 / 석식
  MLSV_YMD: string;      // YYYYMMDD
  MLSV_FND_YMD?: string;
  DDISH_NM: string;      // 요리명 (HTML태그 포함 e.g. <br/>)
  ORGN_INFO?: string;    // 원산지정보
  CAL_INFO?: string;     // 칼로리정보 (e.g. "724.5 Kcal")
  NTR_INFO?: string;     // 영양정보
  MLSV_FROM_YMD?: string;
  MLSV_TO_YMD?: string;
}

export interface DishItem {
  raw: string;
  name: string;
  allergies: number[];
}

export interface ParsedMeal {
  mealCode: string; // "1", "2", "3"
  mealName: string; // "조식", "중식", "석식"
  dateYmd: string;  // "20260801"
  schoolName: string;
  dishes: DishItem[];
  calories: string;
  originInfo: string[];
  nutritionInfo: { name: string; value: string }[];
}

export interface EducationOffice {
  code: string;
  name: string;
  region: string;
}

export const EDUCATION_OFFICES: EducationOffice[] = [
  { code: 'B10', name: '서울특별시교육청', region: '서울' },
  { code: 'C10', name: '부산광역시교육청', region: '부산' },
  { code: 'D10', name: '대구광역시교육청', region: '대구' },
  { code: 'E10', name: '인천광역시교육청', region: '인천' },
  { code: 'F10', name: '광주광역시교육청', region: '광주' },
  { code: 'G10', name: '대전광역시교육청', region: '대전' },
  { code: 'H10', name: '울산광역시교육청', region: '울산' },
  { code: 'I10', name: '세종특별자치시교육청', region: '세종' },
  { code: 'J10', name: '경기도교육청', region: '경기' },
  { code: 'K10', name: '강원특별자치도교육청', region: '강원' },
  { code: 'M10', name: '충청북도교육청', region: '충북' },
  { code: 'N10', name: '충청남도교육청', region: '충남' },
  { code: 'P10', name: '전북특별자치도교육청', region: '전북' },
  { code: 'Q10', name: '전라남도교육청', region: '전남' },
  { code: 'R10', name: '경상북도교육청', region: '경북' },
  { code: 'S10', name: '경상남도교육청', region: '경남' },
  { code: 'T10', name: '제주특별자치도교육청', region: '제주' },
];

// Default fallback school (Busan Namil High School)
export const DEFAULT_SCHOOL: SchoolInfo = {
  ATPT_OFCDC_SC_CODE: 'C10',
  ATPT_OFCDC_SC_NM: '부산광역시교육청',
  SD_SCHUL_CODE: '7150103',
  SCHUL_NM: '부산남일고등학교',
  SCHUL_KND_SC_NM: '고등학교',
  LCTN_SC_NM: '부산광역시',
  ORG_RDNMA: '부산광역시 수영구 망미배산로48번길 85-23'
};
