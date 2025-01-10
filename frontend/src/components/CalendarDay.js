import React from "react";
import '../assets/styles/Anniversary.css';

const CalendarDay = ({ date, day, anniversaries, onDateClick, onAnniversaryClick }) => (
    <div className="calendar-day" onClick={() => onDateClick(date)}>
      <span>{day}</span>
      {/* 기념일 목록 표시 */}
      <div className="anniversary-list">
      {anniversaries.map((anniversary) => (
        <button
          key={anniversary.id}
          className="anniversary-item"
          onClick={(e) => {
            e.stopPropagation(); // 날짜 영역 클릭 이벤트 방지
            onAnniversaryClick(anniversary);
          }}
        >
          {anniversary.name}
        </button>
      ))}
    </div>
    </div>
  );
  
  export default CalendarDay;
  