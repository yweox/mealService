import React from 'react';
import { ALLERGY_LIST } from '../utils/allergy';
import { ShieldAlert, X, Check, RotateCcw } from 'lucide-react';

interface AllergyModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAllergies: number[];
  onToggleAllergy: (code: number) => void;
  onClearAllergies: () => void;
}

export const AllergyModal: React.FC<AllergyModalProps> = ({
  isOpen,
  onClose,
  selectedAllergies,
  onToggleAllergy,
  onClearAllergies,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between bg-rose-50/70">
          <div className="flex items-center space-x-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            <h2 className="text-base font-bold text-slate-900">맞춤 알레르기 설정</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Subtitle description */}
        <div className="p-4 bg-white border-b border-slate-100 flex items-center justify-between text-xs text-slate-600">
          <p>
            본인 또는 자녀가 해당되는 알레르기 항목을 체크하시면 식단표에서 해당 성분을 <span className="text-rose-600 font-bold">강조 표시</span>해 드립니다.
          </p>
          {selectedAllergies.length > 0 && (
            <button
              onClick={onClearAllergies}
              className="flex items-center space-x-1 text-slate-500 hover:text-slate-800 font-medium whitespace-nowrap ml-2"
            >
              <RotateCcw className="w-3 h-3" />
              <span>초기화</span>
            </button>
          )}
        </div>

        {/* Grid of 19 Allergens */}
        <div className="p-5 overflow-y-auto grid grid-cols-2 sm:grid-cols-3 gap-2 flex-1">
          {ALLERGY_LIST.map((item) => {
            const isChecked = selectedAllergies.includes(item.code);
            return (
              <button
                key={item.code}
                onClick={() => onToggleAllergy(item.code)}
                className={`p-3 rounded-xl border transition-all text-left flex items-center justify-between ${
                  isChecked
                    ? 'bg-rose-50 border-rose-300 ring-1 ring-rose-300 shadow-2xs'
                    : 'bg-slate-50/60 border-slate-200 hover:bg-slate-100'
                }`}
              >
                <div className="flex items-center space-x-2">
                  <span className="text-lg">{item.icon}</span>
                  <div>
                    <span className="text-xs font-bold text-slate-800 block">
                      {item.name}
                    </span>
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.code}번
                    </span>
                  </div>
                </div>
                <div
                  className={`w-5 h-5 rounded-md flex items-center justify-center transition-colors ${
                    isChecked
                      ? 'bg-rose-600 text-white'
                      : 'border border-slate-300 bg-white'
                  }`}
                >
                  {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                </div>
              </button>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-100 flex items-center justify-between">
          <span className="text-xs font-semibold text-slate-600">
            총 <strong className="text-rose-600 font-bold">{selectedAllergies.length}개</strong> 항목 선택됨
          </span>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-xs rounded-xl shadow-xs transition-colors"
          >
            확인 및 저장
          </button>
        </div>

      </div>
    </div>
  );
};
