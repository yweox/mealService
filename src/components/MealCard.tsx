import React, { useState } from 'react';
import { ParsedMeal, DishItem } from '../types/neis';
import { ALLERGY_MAP } from '../utils/allergy';
import { Sun, UtensilsCrossed, Moon, Flame, AlertTriangle, ChevronDown, ChevronUp, Info, Copy, Check, Heart } from 'lucide-react';

interface MealCardProps {
  meal: ParsedMeal;
  activeAllergies: number[];
  favoriteDishes: string[];
  onToggleFavorite: (dishName: string) => void;
}

export const MealCard: React.FC<MealCardProps> = ({
  meal,
  activeAllergies,
  favoriteDishes,
  onToggleFavorite,
}) => {
  const [showDetails, setShowDetails] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  // Icon and theme based on meal code
  const getMealMeta = (code: string, name: string) => {
    if (code === '1' || name.includes('조식')) {
      return {
        icon: <Sun className="w-5 h-5 text-amber-500" />,
        badgeBg: 'bg-amber-100 text-amber-800 border-amber-200',
        gradient: 'from-amber-500/10 to-amber-500/0',
        titleColor: 'text-amber-900',
      };
    } else if (code === '3' || name.includes('석식')) {
      return {
        icon: <Moon className="w-5 h-5 text-indigo-500" />,
        badgeBg: 'bg-indigo-100 text-indigo-800 border-indigo-200',
        gradient: 'from-indigo-500/10 to-indigo-500/0',
        titleColor: 'text-indigo-900',
      };
    } else {
      // Default Lunch (중식)
      return {
        icon: <UtensilsCrossed className="w-5 h-5 text-orange-500" />,
        badgeBg: 'bg-orange-100 text-orange-800 border-orange-200',
        gradient: 'from-orange-500/10 to-orange-500/0',
        titleColor: 'text-orange-900',
      };
    }
  };

  const meta = getMealMeta(meal.mealCode, meal.mealName);

  // Check if meal has dishes matching active allergy filters
  const dishesWithAllergies = meal.dishes.map(dish => {
    const matched = dish.allergies.filter(a => activeAllergies.includes(a));
    return {
      ...dish,
      matchedAllergies: matched,
      hasWarning: matched.length > 0,
    };
  });

  const totalWarnings = dishesWithAllergies.filter(d => d.hasWarning).length;

  const handleCopyMenu = () => {
    const dishListText = meal.dishes.map(d => `- ${d.name}`).join('\n');
    const text = `[${meal.schoolName} 급식표]\n🍱 ${meal.mealName} (${meal.calories})\n${dishListText}`;
    
    navigator.clipboard.writeText(text);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden transition-all hover:shadow-md flex flex-col">
      
      {/* Meal Header */}
      <div className={`p-4 sm:p-5 border-b border-slate-100 bg-gradient-to-r ${meta.gradient} flex items-center justify-between`}>
        <div className="flex items-center space-x-2.5">
          <div className="p-2 rounded-xl bg-white shadow-xs border border-slate-100">
            {meta.icon}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className={`text-base font-bold ${meta.titleColor}`}>
                {meal.mealName}
              </h3>
              {meal.calories && (
                <span className="inline-flex items-center text-xs font-semibold px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-700 border border-slate-200">
                  <Flame className="w-3 h-3 text-orange-500 mr-1" />
                  {meal.calories}
                </span>
              )}
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 font-medium">
              메뉴 목록 {meal.dishes.length}가지
            </p>
          </div>
        </div>

        {/* Quick Menu Copy Button */}
        <button
          onClick={handleCopyMenu}
          className="flex items-center space-x-1 px-2.5 py-1.5 rounded-lg text-xs font-medium text-slate-600 bg-white/80 border border-slate-200 hover:bg-slate-50 transition-colors shadow-2xs"
          title="식단 복사"
        >
          {isCopied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700 font-bold">복사됨</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-400" />
              <span>복사</span>
            </>
          )}
        </button>
      </div>

      {/* Allergy Warning Banner if active filters match */}
      {totalWarnings > 0 && (
        <div className="bg-rose-50 px-4 py-2.5 border-b border-rose-100 flex items-center space-x-2 text-xs text-rose-800 font-semibold">
          <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0" />
          <span>선택하신 알레르기 유발 성분이 포함된 메뉴가 {totalWarnings}개 있습니다.</span>
        </div>
      )}

      {/* Dish List */}
      <div className="p-4 sm:p-5 space-y-2.5 flex-1">
        {dishesWithAllergies.map((dish, idx) => {
          const isFav = favoriteDishes.includes(dish.name);

          return (
            <div
              key={`${dish.name}-${idx}`}
              className={`p-3 rounded-xl border transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-2 ${
                dish.hasWarning
                  ? 'bg-rose-50/70 border-rose-200'
                  : 'bg-slate-50/50 border-slate-200/70 hover:bg-slate-50'
              }`}
            >
              <div className="flex items-start space-x-2.5">
                <button
                  onClick={() => onToggleFavorite(dish.name)}
                  className="mt-0.5 text-slate-300 hover:text-rose-500 transition-colors"
                  title={isFav ? '즐겨찾기 해제' : '즐겨찾기 추가'}
                >
                  <Heart className={`w-4 h-4 ${isFav ? 'text-rose-500 fill-rose-500' : ''}`} />
                </button>
                <div>
                  <div className="flex items-center space-x-1.5">
                    <span className={`text-sm font-semibold ${dish.hasWarning ? 'text-rose-950' : 'text-slate-800'}`}>
                      {dish.name}
                    </span>
                    {dish.hasWarning && (
                      <span className="text-[10px] font-bold px-1.5 py-0.2 rounded bg-rose-600 text-white">
                        주의
                      </span>
                    )}
                  </div>

                  {/* Allergy badges */}
                  {dish.allergies.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1.5">
                      {dish.allergies.map(code => {
                        const info = ALLERGY_MAP[code];
                        const isMatch = activeAllergies.includes(code);
                        if (!info) return null;

                        return (
                          <span
                            key={code}
                            className={`inline-flex items-center text-[10px] font-medium px-1.5 py-0.5 rounded-md border ${
                              isMatch
                                ? 'bg-rose-600 text-white border-rose-700 font-bold animate-pulse'
                                : 'bg-white text-slate-600 border-slate-200'
                            }`}
                            title={info.name}
                          >
                            <span className="mr-0.5">{info.icon}</span>
                            <span>{info.name}</span>
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {/* Expandable Details Section (Origin & Nutrition) */}
      {(meal.originInfo.length > 0 || meal.nutritionInfo.length > 0) && (
        <div className="border-t border-slate-100 bg-slate-50/50">
          <button
            onClick={() => setShowDetails(!showDetails)}
            className="w-full px-4 py-2.5 flex items-center justify-between text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
          >
            <div className="flex items-center space-x-1.5">
              <Info className="w-3.5 h-3.5 text-amber-600" />
              <span>원산지 및 영양 정보 보기</span>
            </div>
            {showDetails ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>

          {showDetails && (
            <div className="px-4 pb-4 space-y-4 text-xs border-t border-slate-100 bg-white pt-3 animate-in fade-in duration-150">
              
              {/* Origin info */}
              {meal.originInfo.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5 flex items-center">
                    🌾 식재료 원산지 정보
                  </h4>
                  <div className="flex flex-wrap gap-1.5">
                    {meal.originInfo.map((item, i) => (
                      <span
                        key={i}
                        className="px-2 py-1 bg-slate-100 border border-slate-200 rounded-md text-slate-700 text-[11px]"
                      >
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Nutrition info */}
              {meal.nutritionInfo.length > 0 && (
                <div>
                  <h4 className="font-bold text-slate-800 mb-1.5 flex items-center">
                    📊 영양 성분표
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-1.5">
                    {meal.nutritionInfo.map((item, i) => (
                      <div
                        key={i}
                        className="bg-slate-50 p-2 rounded-lg border border-slate-100 flex items-center justify-between"
                      >
                        <span className="text-slate-500 text-[11px] truncate">{item.name}</span>
                        <span className="font-bold text-slate-800 ml-1">{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          )}
        </div>
      )}

    </div>
  );
};
