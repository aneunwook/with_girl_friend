import React, { useState, useEffect } from 'react';
import {
  createAnniversary,
  getAnniversariesByDateRange,
} from '../../service/anniversary/anniversaryService';
import Calendar from '../../components/Calendar.js'
import CalendarDay from '../../components/CalendarDay.js'
import Modal from '../../components/Modal.js'
import '../../assets/styles/Anniversary.css';

const AnniversaryPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [anniversaries, setAnniversaries] = useState([]);
    const [formData, setFormData] = useState({ name: '', description: '' });
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear());
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1);
  
    const fetchAnniversaries = async () => {
      const startDate = `${currentYear}-${String(currentMonth).padStart(2, '0')}-01`;
      const endDate = `${currentYear}-${String(currentMonth).padStart(
        2,
        '0'
      )}-${new Date(currentYear, currentMonth, 0).getDate()}`;
  
      try {
        const data = await getAnniversariesByDateRange(startDate, endDate);
        setAnniversaries(data);
      } catch (err) {
        console.error('Failed to fetch anniversaries', err);
      }
    };
  
    useEffect(() => {
      fetchAnniversaries();
    }, [currentYear, currentMonth]);
  
    const handleSubmit = async (e) => {
      e.preventDefault();
      if (!selectedDate) {
        alert('날짜를 선택해 주세요.');
        return;
      }
  
      try {
        const data = {
          userId: 1,
          name: formData.name,
          description: formData.description,
          anniversaryDate: selectedDate,
        };
  
        await createAnniversary(data);
        setModalVisible(false);
        setFormData({ name: '', description: '' });
        fetchAnniversaries();
      } catch (err) {
        alert('기념일 추가 실패!');
      }
    };
  
    const handlePreviousMonth = () => {
      if (currentMonth === 1) {
        setCurrentMonth(12);
        setCurrentYear((prev) => prev - 1);
      } else {
        setCurrentMonth((prev) => prev - 1);
      }
    };
  
    const handleNextMonth = () => {
      if (currentMonth === 12) {
        setCurrentMonth(1);
        setCurrentYear((prev) => prev + 1);
      } else {
        setCurrentMonth((prev) => prev + 1);
      }
    };
  
    return (
      <>
        <div>
          <h1>기념일 캘린더</h1>
          <div>
            <button onClick={handlePreviousMonth}>이전 달</button>
            <span>
              {currentYear}년 {currentMonth}월
            </span>
            <button onClick={handleNextMonth}>다음 달</button>
          </div>
          <Calendar
            currentYear={currentYear}
            currentMonth={currentMonth}
            anniversaries={anniversaries}
            onDateClick={(date) => {
              setSelectedDate(date);
              setModalVisible(true);
            }}
          />
        </div>
        <Modal
          visible={modalVisible}
          formData={formData}
          onChange={setFormData}
          onSubmit={handleSubmit}
          onClose={() => setModalVisible(false)}
        />
      </>
    );
  };
  
  export default AnniversaryPage;
  