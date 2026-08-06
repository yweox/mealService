import React from 'react';
import { Building2, Info } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 py-10 border-t border-slate-800 mt-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Building2 className="w-5 h-5 text-amber-500" />
              <h3 className="text-base font-bold text-white">전국 학교 급식 정보 알리미</h3>
            </div>
            <p className="text-xs text-slate-400">
              교육부 나이스(NEIS) 교육정보 개방포털 표준 API 데이터를 기반으로 실시간 제공됩니다.
            </p>
          </div>

          <div className="flex items-center space-x-3 text-xs">
            <span className="px-3 py-1 bg-slate-800 text-amber-400 rounded-lg border border-slate-700 font-semibold">
              Vercel Deployment Ready
            </span>
            <span className="px-3 py-1 bg-slate-800 text-slate-300 rounded-lg border border-slate-700 font-semibold">
              Vite + React 19 + Tailwind
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-400">
          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200 flex items-center space-x-1">
              <Info className="w-3.5 h-3.5 text-amber-400" />
              <span>알레르기 유발 정보 안내</span>
            </h4>
            <p className="leading-relaxed text-[11px]">
              식단표에 표기된 알레르기 번호: 1.난류, 2.우유, 3.메밀, 4.땅콩, 5.대두, 6.밀, 7.고등어, 8.게, 9.새우, 10.돼지고기, 11.복숭아, 12.토마토, 13.아황산류, 14.호두, 15.닭고기, 16.쇠고기, 17.오징어, 18.조개류, 19.잣
            </p>
          </div>

          <div className="bg-slate-800/60 p-4 rounded-xl border border-slate-800 space-y-1.5">
            <h4 className="font-bold text-slate-200">데이터 출처 및 안내사항</h4>
            <p className="leading-relaxed text-[11px]">
              학교 사정(재료 수급 및 일정 변경)에 따라 실제 식단 및 원산지 정보가 사전 고지 없이 다소 변경될 수 있습니다. 심각한 알레르기 질환이 있는 경우 학교 급식실에 최종 확인해 주세요.
            </p>
          </div>
        </div>

        <div className="pt-2 text-center text-[11px] text-slate-500">
          © {new Date().getFullYear()} NEIS School Meal Diet Info Service. All rights reserved.
        </div>

      </div>
    </footer>
  );
};
