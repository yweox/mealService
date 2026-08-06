import { useState, useEffect, useCallback } from 'react';
import { SchoolInfo, DEFAULT_SCHOOL, ParsedMeal } from './types/neis';
import { fetchMealService } from './utils/neisApi';
import { formatToYMD, formatKoreanDate, addDays, parseYMDToDate } from './utils/dateUtils';
import { Header } from './components/Header';
import { DatePickerStrip } from './components/DatePickerStrip';
import { MealCard } from './components/MealCard';
import { SchoolSearchModal } from './components/SchoolSearchModal';
import { AllergyModal } from './components/AllergyModal';
import { WeeklyMealView } from './components/WeeklyMealView';
import { Footer } from './components/Footer';
import {
  Utensils,
  Loader2,
  AlertCircle,
  CalendarDays,
  Sparkles,
  Search,
  CheckCircle2,
  Heart,
  Printer
} from 'lucide-react';

const SCHOOL_STORAGE_KEY = 'neis_selected_school';
const ALLERGY_STORAGE_KEY = 'neis_active_allergies';
const FAV_STORAGE_KEY = 'neis_favorite_dishes';

export default function App() {
  // 1. Initial date setup (defaults to 2026-08-01 matching the prompt's provided URL, or fallback to today)
  const [selectedDate, setSelectedDate] = useState<Date>(() => {
    return parseYMDToDate('20260801');
  });

  // 2. School state
  const [currentSchool, setCurrentSchool] = useState<SchoolInfo>(() => {
    try {
      const saved = localStorage.getItem(SCHOOL_STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.SCHUL_NM === '부산중학교' || parsed.SD_SCHUL_CODE === '7150103') {
          localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(DEFAULT_SCHOOL));
          return DEFAULT_SCHOOL;
        }
        return parsed;
      }
    } catch (e) {
      console.error(e);
    }
    return DEFAULT_SCHOOL;
  });

  // 3. Meals state
  const [meals, setMeals] = useState<ParsedMeal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 4. UI state
  const [viewMode, setViewMode] = useState<'daily' | 'weekly'>('daily');
  const [selectedMealFilter, setSelectedMealFilter] = useState<string>('all'); // 'all', '1', '2', '3'
  const [isSchoolModalOpen, setIsSchoolModalOpen] = useState(false);
  const [isAllergyModalOpen, setIsAllergyModalOpen] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // 5. Personal allergies state
  const [activeAllergies, setActiveAllergies] = useState<number[]>(() => {
    try {
      const saved = localStorage.getItem(ALLERGY_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // 6. Favorite dishes state
  const [favoriteDishes, setFavoriteDishes] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem(FAV_STORAGE_KEY);
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return [];
  });

  // Fetch meals when school or selected date changes
  const loadMealData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    const dateYmd = formatToYMD(selectedDate);

    try {
      const result = await fetchMealService(
        currentSchool.ATPT_OFCDC_SC_CODE,
        currentSchool.SD_SCHUL_CODE,
        dateYmd
      );
      setMeals(result);
    } catch (err: any) {
      setError(err.message || '급식 정보를 불러오는 중 오류가 발생했습니다.');
      setMeals([]);
    } finally {
      setIsLoading(false);
    }
  }, [currentSchool, selectedDate]);

  useEffect(() => {
    loadMealData();
  }, [loadMealData]);

  // Handle school selection
  const handleSelectSchool = (school: SchoolInfo) => {
    setCurrentSchool(school);
    try {
      localStorage.setItem(SCHOOL_STORAGE_KEY, JSON.stringify(school));
    } catch (e) {
      console.error(e);
    }
  };

  // Allergy filter handlers
  const handleToggleAllergy = (code: number) => {
    const updated = activeAllergies.includes(code)
      ? activeAllergies.filter(c => c !== code)
      : [...activeAllergies, code];
    setActiveAllergies(updated);
    try {
      localStorage.setItem(ALLERGY_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleClearAllergies = () => {
    setActiveAllergies([]);
    try {
      localStorage.removeItem(ALLERGY_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  // Favorite dish toggle
  const handleToggleFavorite = (dishName: string) => {
    const updated = favoriteDishes.includes(dishName)
      ? favoriteDishes.filter(d => d !== dishName)
      : [...favoriteDishes, dishName];
    setFavoriteDishes(updated);
    try {
      localStorage.setItem(FAV_STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  // Share menu function
  const handleShare = () => {
    const dateStr = formatKoreanDate(selectedDate);
    let shareText = `[${currentSchool.SCHUL_NM} ${dateStr} 급식 안내]\n`;
    if (meals.length === 0) {
      shareText += '해당 날짜에는 급식 정보가 없습니다.';
    } else {
      meals.forEach(m => {
        shareText += `\n🍱 ${m.mealName} (${m.calories})\n`;
        m.dishes.forEach(d => {
          shareText += `- ${d.name}\n`;
        });
      });
    }

    navigator.clipboard.writeText(shareText);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  // Filtered meals
  const filteredMeals = selectedMealFilter === 'all'
    ? meals
    : meals.filter(m => m.mealCode === selectedMealFilter);

  return (
    <div className="min-h-screen flex flex-col bg-slate-50/60 font-sans text-slate-800 antialiased selection:bg-amber-100 selection:text-amber-900">
      
      {/* Top Sticky Header */}
      <Header
        currentSchool={currentSchool}
        onOpenSchoolSearch={() => setIsSchoolModalOpen(true)}
        onOpenAllergyFilter={() => setIsAllergyModalOpen(true)}
        activeAllergyCount={activeAllergies.length}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        onShare={handleShare}
        isCopied={isCopied}
      />

      {/* Main Content Body */}
      <main className="flex-1 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 space-y-6">
        
        {/* School Banner Card */}
        <div className="bg-gradient-to-r from-amber-600 via-orange-600 to-amber-700 rounded-2xl p-5 text-white shadow-md shadow-orange-600/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-white/20 text-amber-100 backdrop-blur-xs">
                {currentSchool.ATPT_OFCDC_SC_NM}
              </span>
              <span className="text-xs font-semibold text-amber-100/90">
                {currentSchool.SCHUL_KND_SC_NM || '학교'}
              </span>
            </div>
            <h2 className="text-2xl font-extrabold tracking-tight text-white">
              {currentSchool.SCHUL_NM}
            </h2>
            {currentSchool.ORG_RDNMA && (
              <p className="text-xs text-amber-100/80">
                {currentSchool.ORG_RDNMA}
              </p>
            )}
          </div>

          <div className="flex items-center space-x-2 shrink-0">
            <button
              onClick={() => setIsSchoolModalOpen(true)}
              className="px-4 py-2 bg-white text-slate-900 hover:bg-amber-50 rounded-xl text-xs font-bold shadow-xs transition-all flex items-center space-x-1.5"
            >
              <Search className="w-3.5 h-3.5 text-amber-600" />
              <span>다른 학교 검색</span>
            </button>
            <button
              onClick={() => window.print()}
              className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-xl text-xs transition-colors"
              title="식단표 인쇄"
            >
              <Printer className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Date Selector Navigation Bar */}
        <DatePickerStrip
          selectedDate={selectedDate}
          onDateChange={setSelectedDate}
        />

        {/* View Switcher: Daily View vs Weekly View */}
        {viewMode === 'daily' ? (
          <div className="space-y-4">
            
            {/* Meal Filter Tabs (전체 / 조식 / 중식 / 석식) */}
            {meals.length > 0 && (
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-1.5 bg-white p-1 rounded-xl border border-slate-200/80 shadow-2xs">
                  <button
                    onClick={() => setSelectedMealFilter('all')}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                      selectedMealFilter === 'all'
                        ? 'bg-amber-500 text-white shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    전체 식단 ({meals.length})
                  </button>
                  {meals.map((m) => (
                    <button
                      key={m.mealCode}
                      onClick={() => setSelectedMealFilter(m.mealCode)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                        selectedMealFilter === m.mealCode
                          ? 'bg-amber-500 text-white shadow-xs'
                          : 'text-slate-600 hover:text-slate-900'
                      }`}
                    >
                      {m.mealName}
                    </button>
                  ))}
                </div>

                <div className="hidden sm:flex items-center space-x-2 text-xs text-slate-500">
                  <span className="flex items-center space-x-1">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    <span>실시간 나이스 연동</span>
                  </span>
                </div>
              </div>
            )}

            {/* Loading Indicator */}
            {isLoading && (
              <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3 shadow-2xs">
                <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
                <p className="text-sm font-semibold text-slate-700">
                  {formatKoreanDate(selectedDate)} 급식 정보를 조회 중입니다...
                </p>
              </div>
            )}

            {/* Error Message */}
            {error && !isLoading && (
              <div className="bg-rose-50 border border-rose-200 rounded-2xl p-6 text-center space-y-2">
                <AlertCircle className="w-8 h-8 text-rose-600 mx-auto" />
                <h3 className="text-sm font-bold text-rose-900">급식 데이터 조회 오류</h3>
                <p className="text-xs text-rose-700">{error}</p>
                <button
                  onClick={loadMealData}
                  className="mt-2 px-4 py-2 bg-rose-600 text-white font-semibold text-xs rounded-xl shadow-xs hover:bg-rose-700 transition-colors"
                >
                  다시 시도
                </button>
              </div>
            )}

            {/* No Meals Found (e.g., Weekend / Holiday / Vacation) */}
            {!isLoading && !error && meals.length === 0 && (
              <div className="bg-white rounded-2xl border border-slate-200/80 p-10 text-center space-y-4 shadow-2xs">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto border border-amber-100">
                  <Utensils className="w-7 h-7" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-slate-900">
                    등록된 급식 정보가 없습니다
                  </h3>
                  <p className="text-xs text-slate-500 max-w-md mx-auto">
                    {formatKoreanDate(selectedDate)}은 주말, 방학 또는 학교 급식 미운영 일자일 수 있습니다.
                  </p>
                </div>

                <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                  <button
                    onClick={() => {
                      // Move to Monday if weekend, or next day
                      const day = selectedDate.getDay();
                      if (day === 6) setSelectedDate(addDays(selectedDate, 2)); // Sat -> Mon
                      else if (day === 0) setSelectedDate(addDays(selectedDate, 1)); // Sun -> Mon
                      else setSelectedDate(addDays(selectedDate, 1));
                    }}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl transition-colors shadow-xs"
                  >
                    다음 날짜 조회
                  </button>
                  <button
                    onClick={() => setViewMode('weekly')}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-semibold text-xs rounded-xl transition-colors"
                  >
                    주간 식단표 전체 보기
                  </button>
                </div>
              </div>
            )}

            {/* Meals Cards Display Grid */}
            {!isLoading && !error && filteredMeals.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredMeals.map((meal) => (
                  <MealCard
                    key={`${meal.mealCode}-${meal.dateYmd}`}
                    meal={meal}
                    activeAllergies={activeAllergies}
                    favoriteDishes={favoriteDishes}
                    onToggleFavorite={handleToggleFavorite}
                  />
                ))}
              </div>
            )}

          </div>
        ) : (
          /* Weekly View Mode */
          <WeeklyMealView
            currentSchool={currentSchool}
            selectedDate={selectedDate}
            onSelectDate={(d) => {
              setSelectedDate(d);
              setViewMode('daily');
            }}
            activeAllergies={activeAllergies}
          />
        )}

        {/* Favorite Dishes Summary Box */}
        {favoriteDishes.length > 0 && (
          <div className="bg-white rounded-2xl border border-slate-200/80 p-4 space-y-2">
            <div className="flex items-center space-x-2 text-xs font-bold text-slate-800">
              <Heart className="w-4 h-4 text-rose-500 fill-rose-500" />
              <span>내가 즐겨찾는 메뉴 ({favoriteDishes.length}개)</span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {favoriteDishes.map((dish) => (
                <span
                  key={dish}
                  className="inline-flex items-center text-xs bg-rose-50 text-rose-800 border border-rose-200 px-2.5 py-1 rounded-lg"
                >
                  <span className="font-medium mr-1">{dish}</span>
                  <button
                    onClick={() => handleToggleFavorite(dish)}
                    className="text-rose-400 hover:text-rose-600 font-bold ml-1"
                  >
                    ×
                  </button>
                </span>
              ))}
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <Footer />

      {/* Modals */}
      <SchoolSearchModal
        isOpen={isSchoolModalOpen}
        onClose={() => setIsSchoolModalOpen(false)}
        onSelectSchool={handleSelectSchool}
        currentSchool={currentSchool}
      />

      <AllergyModal
        isOpen={isAllergyModalOpen}
        onClose={() => setIsAllergyModalOpen(false)}
        selectedAllergies={activeAllergies}
        onToggleAllergy={handleToggleAllergy}
        onClearAllergies={handleClearAllergies}
      />

    </div>
  );
}
