import React, { useState, useEffect } from 'react';
import { SchoolInfo, EDUCATION_OFFICES, DEFAULT_SCHOOL } from '../types/neis';
import { searchSchools } from '../utils/neisApi';
import { Search, X, MapPin, Building2, Check, Clock, Sparkles, Loader2 } from 'lucide-react';

interface SchoolSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectSchool: (school: SchoolInfo) => void;
  currentSchool: SchoolInfo;
}

const RECENT_SCHOOLS_KEY = 'neis_recent_schools';

export const SchoolSearchModal: React.FC<SchoolSearchModalProps> = ({
  isOpen,
  onClose,
  onSelectSchool,
  currentSchool,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOffice, setSelectedOffice] = useState<string>('');
  const [searchResults, setSearchResults] = useState<SchoolInfo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [recentSchools, setRecentSchools] = useState<SchoolInfo[]>([]);

  // Load recent schools on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(RECENT_SCHOOLS_KEY);
      if (saved) {
        setRecentSchools(JSON.parse(saved));
      }
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleSearch = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;

    setIsLoading(true);
    setError(null);
    try {
      const results = await searchSchools(searchTerm.trim());
      
      // Filter by education office if selected
      const filtered = selectedOffice
        ? results.filter(s => s.ATPT_OFCDC_SC_CODE === selectedOffice)
        : results;

      setSearchResults(filtered);
      if (filtered.length === 0) {
        setError('검색 결과가 없습니다. 학교명을 확인 후 다시 입력해주세요.');
      }
    } catch (err: any) {
      setError(err.message || '학교 정보를 가져오지 못했습니다.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSelect = (school: SchoolInfo) => {
    // Save to recent
    const updated = [
      school,
      ...recentSchools.filter(s => s.SD_SCHUL_CODE !== school.SD_SCHUL_CODE),
    ].slice(0, 5);

    setRecentSchools(updated);
    try {
      localStorage.setItem(RECENT_SCHOOLS_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }

    onSelectSchool(school);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/70">
          <div className="flex items-center space-x-2">
            <Building2 className="w-5 h-5 text-amber-600" />
            <h2 className="text-base font-bold text-slate-900">전국 학교 검색</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar & Filters */}
        <div className="p-5 space-y-3 bg-white border-b border-slate-100">
          <form onSubmit={handleSearch} className="flex gap-2">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="학교명 입력 (예: 남일고, 부산남일고, 서울고)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500 transition-all"
                autoFocus
              />
            </div>
            <button
              type="submit"
              disabled={isLoading || !searchTerm.trim()}
              className="px-4 py-2.5 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white font-medium text-sm rounded-xl transition-colors flex items-center space-x-1 shadow-xs"
            >
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <span>검색</span>}
            </button>
          </form>

          {/* Education Office Filter */}
          <div className="flex items-center space-x-2">
            <span className="text-xs text-slate-500 font-medium whitespace-nowrap">지역 선택:</span>
            <select
              value={selectedOffice}
              onChange={(e) => setSelectedOffice(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 text-slate-700 py-1.5 px-2.5 rounded-lg focus:outline-none focus:border-amber-500 font-medium"
            >
              <option value="">전국 전체</option>
              {EDUCATION_OFFICES.map((office) => (
                <option key={office.code} value={office.code}>
                  {office.region} ({office.name.replace('교육청', '')})
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          
          {/* Default Preset Alert for Sample URL School */}
          <div className="bg-amber-50 border border-amber-200/80 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
              <div>
                <p className="text-xs font-semibold text-amber-900">기본 제공 학교 (요청하신 급식 URL)</p>
                <p className="text-[11px] text-amber-700">{DEFAULT_SCHOOL.SCHUL_NM} ({DEFAULT_SCHOOL.ATPT_OFCDC_SC_NM})</p>
              </div>
            </div>
            <button
              onClick={() => handleSelect(DEFAULT_SCHOOL)}
              className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white text-xs font-semibold rounded-lg transition-colors shadow-xs"
            >
              선택
            </button>
          </div>

          {/* Loading state */}
          {isLoading && (
            <div className="py-8 text-center text-slate-500 space-y-2">
              <Loader2 className="w-6 h-6 animate-spin text-amber-600 mx-auto" />
              <p className="text-xs">전국 나이스 학교 정보를 검색 중입니다...</p>
            </div>
          )}

          {/* Error / Empty state */}
          {error && !isLoading && (
            <div className="py-6 text-center text-slate-500">
              <p className="text-xs text-rose-600 font-medium">{error}</p>
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && !isLoading && (
            <div className="space-y-2">
              <p className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                검색 결과 ({searchResults.length}건)
              </p>
              <div className="space-y-1.5">
                {searchResults.map((school) => {
                  const isSelected = school.SD_SCHUL_CODE === currentSchool.SD_SCHUL_CODE;
                  return (
                    <button
                      key={`${school.ATPT_OFCDC_SC_CODE}-${school.SD_SCHUL_CODE}`}
                      onClick={() => handleSelect(school)}
                      className={`w-full text-left p-3 rounded-xl border transition-all flex items-center justify-between group ${
                        isSelected
                          ? 'bg-amber-50/80 border-amber-300 ring-1 ring-amber-300'
                          : 'bg-white border-slate-200 hover:border-amber-300 hover:bg-slate-50/80'
                      }`}
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="font-bold text-sm text-slate-900 group-hover:text-amber-700">
                            {school.SCHUL_NM}
                          </span>
                          <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 text-slate-600 font-medium">
                            {school.SCHUL_KND_SC_NM || '학교'}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 mt-1 text-xs text-slate-500">
                          <span className="text-amber-700 font-medium">{school.ATPT_OFCDC_SC_NM}</span>
                          {school.ORG_RDNMA && (
                            <span className="truncate max-w-[240px] flex items-center">
                              <MapPin className="w-3 h-3 text-slate-400 inline mr-0.5" />
                              {school.ORG_RDNMA}
                            </span>
                          )}
                        </div>
                      </div>
                      {isSelected && (
                        <span className="flex items-center text-xs font-semibold text-amber-700 bg-amber-100 px-2 py-1 rounded-lg">
                          <Check className="w-3.5 h-3.5 mr-1" /> 선택됨
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Recent Schools */}
          {searchResults.length === 0 && !isLoading && recentSchools.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center space-x-1.5 text-xs font-bold text-slate-500 uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5 text-slate-400" />
                <span>최근 검색한 학교</span>
              </div>
              <div className="space-y-1.5">
                {recentSchools.map((school) => (
                  <button
                    key={`recent-${school.SD_SCHUL_CODE}`}
                    onClick={() => handleSelect(school)}
                    className="w-full text-left p-2.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-amber-50/50 hover:border-amber-200 transition-all flex items-center justify-between"
                  >
                    <div>
                      <p className="text-xs font-bold text-slate-800">{school.SCHUL_NM}</p>
                      <p className="text-[11px] text-slate-500">{school.ATPT_OFCDC_SC_NM}</p>
                    </div>
                    <span className="text-[11px] text-amber-600 font-medium">선택</span>
                  </button>
                ))}
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
