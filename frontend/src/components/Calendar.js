import React from 'react';
import CalendarDay from '../components/CalendarDay.js';
import '../assets/styles/Anniversary.css';

const Calendar = ({
  currentYear,
  currentMonth,
  anniversaries,
  onDateClick,
}) => {
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate(); // 1월은 0부터 시작
  };

  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay(); // 월의 첫날 요일 (0: 일요일 ~ 6: 토요일)
  };

  const daysInMonth = getDaysInMonth(currentYear, currentMonth - 1); // 현재 달의 일수
  const firstDay = getFirstDayOfMonth(currentYear, currentMonth - 1); // 첫날 요일

  const calendarDays = [];

  // 시작 요일에 따른 빈 칸 추가
  for (let i = 0; i < firstDay; i++) {
    calendarDays.push(null);
  }

  // 날짜 추가
  for (let day = 1; day <= daysInMonth; day++) {
    calendarDays.push(day);
  }

  return (
    <div className="calendar">
      {/* 요일 표시 */}
      <div className="weekdays">
        {['일', '월', '화', '수', '목', '금', '토'].map((day) => (
          <div key={day} className="weekday">
            {day}
          </div>
        ))}
      </div>

      {/* 날짜 표시 */}
      <div className="days">
        {calendarDays.map((day, index) => {
          const date = day
            ? `${currentYear}-${String(currentMonth).padStart(2, '0')}-${String(
                day
              ).padStart(2, '0')}`
            : null;

          const filteredAnniversaries = anniversaries.filter(
            (anniversary) => anniversary.anniversary_date === date
          );

          return (
            <CalendarDay
              date={date}
              day={day}
              anniversaries={filteredAnniversaries}
              onClick={onDateClick}
            />
          );
        })}
      </div>
    </div>
  );
};

export default Calendar;
