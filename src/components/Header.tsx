import React from 'react';
import { SchoolInfo } from '../types/neis';
import { Utensils, Search, ShieldAlert, Calendar, LayoutGrid, Share2, Check } from 'lucide-react';

interface HeaderProps {
  currentSchool: SchoolInfo;
  onOpenSchoolSearch: () => void;
  onOpenAllergyFilter: () => void;
  activeAllergyCount: number;
  viewMode: 'daily' | 'weekly';
  onViewModeChange: (mode: 'daily' | 'weekly') => void;
  onShare: () => void;
  isCopied: boolean;
}

export const Header: React.FC<HeaderProps> = ({
  currentSchool,
  onOpenSchoolSearch,
  onOpenAllergyFilter,
  activeAllergyCount,
  viewMode,
  onViewModeChange,
  onShare,
  isCopied,
}) => {
  return (
    <header className="sticky top-0 z-30 backdrop-blur-md bg-white/90 border-b border-amber-100/60 shadow-xs">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3.5">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          
          {/* Logo & School Name Trigger */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center text-white shadow-md shadow-orange-500/20">
                <Utensils className="w-5.5 h-5.5" />
              </div>
              <div>
                <div className="flex items-center space-x-2">
                  <h1 className="text-lg font-bold text-slate-900 tracking-tight">오늘의 급식</h1>
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-orange-100 text-orange-700 border border-orange-200">
                    NEIS 나이스 연동
                  </span>
                </div>
                <button
                  onClick={onOpenSchoolSearch}
                  className="group flex items-center space-x-1.5 text-xs text-slate-600 hover:text-amber-700 font-medium transition-colors mt-0.5"
                  title="학교 변경하기"
                >
                  <span className="truncate max-w-[200px] sm:max-w-[280px] font-semibold text-slate-800 group-hover:underline">
                    {currentSchool.SCHUL_NM}
                  </span>
                  <span className="text-[11px] text-slate-500 bg-slate-100 px-1.5 py-0.2 rounded group-hover:bg-amber-100 group-hover:text-amber-800">
                    {currentSchool.ATPT_OFCDC_SC_NM.replace('광역시교육청', '').replace('특별자치시교육청', '').replace('특별자치도교육청', '').replace('도교육청', '').replace('교육청', '')}
                  </span>
                  <Search className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600" />
                </button>
              </div>
            </div>

            {/* Mobile Share Button */}
            <div className="flex sm:hidden items-center space-x-2">
              <button
                onClick={onShare}
                className="p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
                title="식단표 공유"
              >
                {isCopied ? <Check className="w-5 h-5 text-emerald-600" /> : <Share2 className="w-5 h-5" />}
              </button>
            </div>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center justify-between sm:justify-end space-x-2 pt-2 sm:pt-0 border-t sm:border-0 border-slate-100">
            
            {/* View Mode Switcher */}
            <div className="bg-slate-100 p-1 rounded-xl flex items-center text-xs font-medium text-slate-600">
              <button
                onClick={() => onViewModeChange('daily')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'daily'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                <span>일별 상세</span>
              </button>
              <button
                onClick={() => onViewModeChange('weekly')}
                className={`flex items-center space-x-1 px-3 py-1.5 rounded-lg transition-all ${
                  viewMode === 'weekly'
                    ? 'bg-white text-slate-900 font-semibold shadow-xs'
                    : 'hover:text-slate-900'
                }`}
              >
                <LayoutGrid className="w-3.5 h-3.5" />
                <span>주간 식단표</span>
              </button>
            </div>

            {/* Allergy Filter Button */}
            <button
              onClick={onOpenAllergyFilter}
              className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                activeAllergyCount > 0
                  ? 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100'
                  : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              <ShieldAlert className={`w-3.5 h-3.5 ${activeAllergyCount > 0 ? 'text-rose-600' : 'text-slate-500'}`} />
              <span>알레르기</span>
              {activeAllergyCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-rose-600 text-white text-[10px] flex items-center justify-center font-bold">
                  {activeAllergyCount}
                </span>
              )}
            </button>

            {/* Desktop Share Button */}
            <button
              onClick={onShare}
              className="hidden sm:flex items-center space-x-1.5 px-3 py-1.5 rounded-xl bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors"
            >
              {isCopied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-700">복사 완료</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5 text-slate-500" />
                  <span>식단 공유</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>
    </header>
  );
};
