import React from "react";

const calculateDDay = (anniversaryDate) => {
    const today = new Date();
    const targetDate = new Date(anniversaryDate);

    const diffTime = targetDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if(diffDays > 0) return `D-${diffDays}`;
    else if(diffDays === 0) return 'D-Day';
    else return `D+${Math.abs(diffDays)}`;
}

const sortAnniversariesByDate = (anniversaries) => {
    return anniversaries.slice().sort((a, b) => {
        const dateA = new Date(a.anniversary_date);
        const dateB = new Date(b.anniversary_date);
        return dateA - dateB;
    })
}

const DDayList = ({ anniversaries }) => {
    const sortedAnniversaries = sortAnniversariesByDate(anniversaries);

    return(
        <div className="dday-list">
            <h2>D-Day 목록</h2>
            <ul>
                {sortedAnniversaries.map((item) => (
                    <li key={item.id}>
                        {item.name} - {calculateDDay(item.anniversary_date)}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default DDayList;