import React, { useEffect, useState } from 'react';
import dayjs from 'dayjs';
import styles from '../assets/styles/LoveDay.module.css';

const LoveDay = ({ user }) => {
  const [time, setTime] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

  useEffect(() => {
    if (!user || !user.startDate) return;

    const startDate = dayjs(user.startDate);

    function calculateTime() {
      const now = dayjs();
      const diffDays = now.diff(startDate, 'day');
      const diffTime = now.diff(startDate, 'second');

      const hours = Math.floor(diffTime / 3600) % 24;
      const minutes = Math.floor(diffTime / 60) % 60;
      const seconds = diffTime % 60;

      setTime({
        days: diffDays + 1,
        hours,
        minutes,
        seconds,
      });
    }

    calculateTime();
    const interval = setInterval(calculateTime, 1000); // 1초마다 실행

    return () => clearInterval(interval);
  }, [user]);

  if (!user) {
    return <h2>로딩 중...</h2>; // ✅ user가 null이면 안전한 UI 반환
  }

  return (
    <div className={styles.loveDay}>
      <div className={styles.howLong}>
        <p className={styles.howLongText}>How long we've been together?</p>
      </div>

      <div className={styles.loveDayInfo}>
        <div className={styles.row}>
          {/* ✅ 숫자 + 텍스트 (한 묶음) */}
          <div className={styles.timeBox}>
            <h3>{user.loveDays}</h3>
            <span>days</span>
          </div>

          {/* ✅ 콜론 */}
          <div className={styles.colonBox}>:</div>

          <div className={styles.timeBox}>
            <h3>{time.hours}</h3>
            <span>hours</span>
          </div>

          <div className={styles.colonBox}>:</div>

          <div className={styles.timeBox}>
            <h3>{time.minutes}</h3>
            <span>minutes</span>
          </div>

          <div className={styles.colonBox}>:</div>

          <div className={styles.timeBox}>
            <h3>{time.seconds}</h3>
            <span>seconds</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoveDay;
