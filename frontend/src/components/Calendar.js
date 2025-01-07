import React from "react";
import CalendarDay from '../components/CalendarDay.js'
import '../assets/styles/Anniversary.css';


const calendar = ({currentYear, currentMonth, anniversaries, onDateClick}) => {
    const getDaysInMonth = (year, month) => {
        return new Date(year, month, 0).getDate(); // 월의 마지막 날을 반환
      };

    return(
        <div className="calendar">
          {Array.from(
            { length: getDaysInMonth(currentYear, currentMonth) },
            (_, index) => {
              const date = `${currentYear}-${String(currentMonth).padStart(
                2,
                '0'
              )}-${String(index + 1).padStart(2, '0')}`;

              // 날짜에 해당하는 기념일 필터링
              const filteredAnniversaries = anniversaries.filter(
                (anniversary) => anniversary.anniversary_date === date
            );
            return (
                <CalendarDay
                  key={date}
                  date={date}
                  day={index + 1}
                  anniversaries={filteredAnniversaries}
                  onClick={onDateClick}
                />
              );
            }
          )}
        </div>
      );
    };

export default calendar;