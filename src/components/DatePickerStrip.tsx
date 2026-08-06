import React from 'react';
import {
  formatKoreanDateLong,
  formatToInputDate,
  addDays,
  getWeekDates,
  isSameDay,
  KOREAN_WEEKDAYS,
} from '../utils/dateUtils';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, RotateCcw } from 'lucide-react';

interface DatePickerStripProps {
  selectedDate: Date;
  onDateChange: (date: Date) => void;
}

export const DatePickerStrip: React.FC<DatePickerStripProps> = ({
  selectedDate,
  onDateChange,
}) => {
  const today = new Date();
  const weekDates = getWeekDates(selectedDate);

  const handlePrevDay = () => onDateChange(addDays(selectedDate, -1));
  const handleNextDay = () => onDateChange(addDays(selectedDate, 1));
  const handleToday = () => onDateChange(new Date());

  const handleNativeDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.value) {
      const [year, month, day] = e.target.value.split('-').map(Number);
      onDateChange(new Date(year, month - 1, day));
    }
  };

  return (
    <div className="bg-white border border-slate-200/80 rounded-2xl shadow-xs p-4 space-y-3">
      
      {/* Top Controller: Date Display & Navigation */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        
        {/* Date Display */}
        <div className="flex items-center space-x-2">
          <button
            onClick={handlePrevDay}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="이전날"
          >
            <ChevronLeft className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              {formatKoreanDateLong(selectedDate)}
            </h2>
            {isSameDay(selectedDate, today) && (
              <span className="text-xs font-bold px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded-full border border-emerald-200">
                오늘
              </span>
            )}
          </div>

          <button
            onClick={handleNextDay}
            className="p-1.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-100 hover:text-slate-900 transition-colors"
            title="다음날"
          >
            <ChevronRight className="w-5 h-5" />
          </button>
        </div>

        {/* Action Controls: Today & Native Calendar Picker */}
        <div className="flex items-center space-x-2">
          {!isSameDay(selectedDate, today) && (
            <button
              onClick={handleToday}
              className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-700" />
              <span>오늘로 이동</span>
            </button>
          )}

          {/* Native Datepicker Wrapper */}
          <div className="relative">
            <label className="flex items-center space-x-1 px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-100 text-slate-700 hover:bg-slate-200 transition-colors cursor-pointer">
              <CalendarIcon className="w-3.5 h-3.5 text-slate-500" />
              <span>날짜 선택</span>
              <input
                type="date"
                value={formatToInputDate(selectedDate)}
                onChange={handleNativeDateChange}
                className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
              />
            </label>
          </div>
        </div>

      </div>

      {/* Week Day Strip (Mon-Sun) */}
      <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2 border-t border-slate-100">
        {weekDates.map((date, idx) => {
          const isSelected = isSameDay(date, selectedDate);
          const isCurrentToday = isSameDay(date, today);
          const dayOfWeek = date.getDay(); // 0: Sun, 6: Sat
          const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

          return (
            <button
              key={date.toISOString()}
              onClick={() => onDateChange(date)}
              className={`flex flex-col items-center py-2 px-1 rounded-xl transition-all relative ${
                isSelected
                  ? 'bg-amber-500 text-white font-bold shadow-sm shadow-amber-500/30'
                  : isCurrentToday
                  ? 'bg-amber-50 text-amber-900 border border-amber-200 hover:bg-amber-100 font-semibold'
                  : 'hover:bg-slate-100 text-slate-700'
              }`}
            >
              <span
                className={`text-[11px] font-medium ${
                  isSelected
                    ? 'text-amber-100'
                    : isWeekend
                    ? dayOfWeek === 0
                      ? 'text-rose-500'
                      : 'text-blue-500'
                    : 'text-slate-500'
                }`}
              >
                {KOREAN_WEEKDAYS[dayOfWeek]}
              </span>
              <span className="text-sm font-extrabold mt-0.5">
                {date.getDate()}
              </span>
              {isCurrentToday && !isSelected && (
                <span className="w-1.5 h-1.5 rounded-full bg-amber-600 mt-1" />
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
};
