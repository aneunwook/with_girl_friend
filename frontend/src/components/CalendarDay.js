import React, { useImperativeHandle } from "react";
import '../assets/styles/Anniversary.css';

const CalendarDay = ({date, day, anniversaries, onClick}) => (
    <div onClick={() => onClick(date)} className="calendar-day" >
        {day}일
        {/* 기념일 목록 표시 */}
        <div className="anniversary-list">
            {anniversaries.map((anniversary) => (
                <div key={anniversary.id} className="anniversary-item">
                    <span className="dot"></span>
                    {anniversary.name}
                </div>
            ))}
        </div>
    </div>
)

export default CalendarDay;