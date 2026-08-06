import React, { useEffect, useState } from 'react';
import { ParsedMeal, SchoolInfo } from '../types/neis';
import { fetchMealRange } from '../utils/neisApi';
import { getWeekDates, formatToYMD, formatKoreanDate, isSameDay } from '../utils/dateUtils';
import { Loader2, Calendar, AlertTriangle, Utensils, ChevronRight } from 'lucide-react';

interface WeeklyMealViewProps {
  currentSchool: SchoolInfo;
  selectedDate: Date;
  onSelectDate: (date: Date) => void;
  activeAllergies: number[];
}

export const WeeklyMealView: React.FC<WeeklyMealViewProps> = ({
  currentSchool,
  selectedDate,
  onSelectDate,
  activeAllergies,
}) => {
  const [weeklyMeals, setWeeklyMeals] = useState<Record<string, ParsedMeal[]>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const weekDates = getWeekDates(selectedDate);
  const fromYmd = formatToYMD(weekDates[0]); // Monday
  const toYmd = formatToYMD(weekDates[6]);   // Sunday

  useEffect(() => {
    let isMounted = true;
    async function loadWeek() {
      setIsLoading(true);
      setError(null);
      try {
        const meals = await fetchMealRange(
          currentSchool.ATPT_OFCDC_SC_CODE,
          currentSchool.SD_SCHUL_CODE,
          fromYmd,
          toYmd
        );

        if (!isMounted) return;

        // Group by YMD
        const grouped: Record<string, ParsedMeal[]> = {};
        meals.forEach((m) => {
          if (!grouped[m.dateYmd]) grouped[m.dateYmd] = [];
          grouped[m.dateYmd].push(m);
        });

        setWeeklyMeals(grouped);
      } catch (err: any) {
        if (isMounted) {
          setError(err.message || '주간 급식 정보를 가져오는 중 오류가 발생했습니다.');
        }
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    loadWeek();
    return () => {
      isMounted = false;
    };
  }, [currentSchool.ATPT_OFCDC_SC_CODE, currentSchool.SD_SCHUL_CODE, fromYmd, toYmd]);

  if (isLoading) {
    return (
      <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center space-y-3">
        <Loader2 className="w-8 h-8 animate-spin text-amber-600 mx-auto" />
        <p className="text-sm font-semibold text-slate-700">
          주간 급식표를 불러오는 중입니다...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-2xl border border-rose-200 p-8 text-center space-y-2">
        <p className="text-sm font-semibold text-rose-700">{error}</p>
      </div>
    );
  }

  // Filter out weekend if weekend has no meals
  const activeDays = weekDates.filter((d, idx) => {
    const ymd = formatToYMD(d);
    // Keep mon-fri always, sat-sun if they have meals
    if (idx < 5) return true;
    return !!weeklyMeals[ymd]?.length;
  });

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between px-1">
        <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
          <Calendar className="w-4.5 h-4.5 text-amber-600" />
          <span>이번 주 전체 급식표</span>
        </h3>
        <span className="text-xs text-slate-500 font-medium">
          {formatKoreanDate(weekDates[0])} ~ {formatKoreanDate(weekDates[4])}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-5 gap-3.5">
        {activeDays.map((date) => {
          const ymd = formatToYMD(date);
          const dayMeals = weeklyMeals[ymd] || [];
          const isSelected = isSameDay(date, selectedDate);
          const isToday = isSameDay(date, new Date());

          return (
            <div
              key={ymd}
              onClick={() => onSelectDate(date)}
              className={`bg-white rounded-2xl border transition-all p-4 cursor-pointer flex flex-col justify-between group ${
                isSelected
                  ? 'border-amber-400 ring-2 ring-amber-400/40 shadow-md'
                  : isToday
                  ? 'border-emerald-300 bg-emerald-50/20'
                  : 'border-slate-200/80 hover:border-amber-300 hover:shadow-xs'
              }`}
            >
              <div>
                {/* Date header */}
                <div className="flex items-center justify-between pb-2.5 border-b border-slate-100 mb-3">
                  <div>
                    <span className="text-xs font-bold text-slate-500 block">
                      {formatKoreanDate(date).split(' ')[3]}
                    </span>
                    <span className="text-sm font-extrabold text-slate-900">
                      {date.getMonth() + 1}/{date.getDate()}
                    </span>
                  </div>
                  {isToday && (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200">
                      오늘
                    </span>
                  )}
                </div>

                {/* Meals */}
                {dayMeals.length === 0 ? (
                  <div className="py-6 text-center text-slate-400 space-y-1">
                    <Utensils className="w-5 h-5 mx-auto opacity-40" />
                    <p className="text-xs font-medium">급식 없음</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {dayMeals.map((meal) => {
                      // Check allergen warning
                      const hasWarning = meal.dishes.some((d) =>
                        d.allergies.some((a) => activeAllergies.includes(a))
                      );

                      return (
                        <div key={meal.mealCode} className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="font-bold text-amber-800 bg-amber-50 px-1.5 py-0.2 rounded border border-amber-200">
                              {meal.mealName}
                            </span>
                            {hasWarning && (
                              <span
                                className="text-rose-600 flex items-center font-bold text-[10px]"
                                title="알레르기 주의"
                              >
                                <AlertTriangle className="w-3 h-3 mr-0.5" /> 주의
                              </span>
                            )}
                          </div>
                          <ul className="text-xs text-slate-700 space-y-0.5 pl-1">
                            {meal.dishes.slice(0, 5).map((dish, idx) => (
                              <li key={idx} className="truncate text-[11.5px]">
                                • {dish.name}
                              </li>
                            ))}
                            {meal.dishes.length > 5 && (
                              <li className="text-[10px] text-slate-400 font-medium">
                                외 {meal.dishes.length - 5}개 메뉴
                              </li>
                            )}
                          </ul>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              <div className="pt-3 mt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-amber-700 font-semibold group-hover:underline">
                <span>상세 보기</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
