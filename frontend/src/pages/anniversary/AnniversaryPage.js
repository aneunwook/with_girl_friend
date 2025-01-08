import React, { useState, useEffect } from 'react';
import {
  createAnniversary,
  getAnniversariesByDateRange,
  updateAnniversary
} from '../../service/anniversary/anniversaryService';
import Calendar from '../../components/Calendar.js'
import CalendarDay from '../../components/CalendarDay.js'
import Modal from '../../components/Modal.js'
import '../../assets/styles/Anniversary.css';

const AnniversaryPage = () => {
    const [selectedDate, setSelectedDate] = useState(null); //사용자가 선택한 날짜
    const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
    const [anniversaries, setAnniversaries] = useState([]); // 현재 표시 중인 기념일 목록
    const [formData, setFormData] = useState({ name: '', description: '' }); // 기념일 입력 데이터
    const [currentYear, setCurrentYear] = useState(new Date().getFullYear()); // 현재 연도
    const [currentMonth, setCurrentMonth] = useState(new Date().getMonth() + 1); // 현재 월
    const [selectedAnniversary, setSelectedAnniversary] = useState(null); // 선택된 기념일 정보
  
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
        fetchAnniversaries();
        setModalVisible(false);
        setFormData({ name: '', description: '' });
      } catch (err) {
        alert('기념일 추가 실패!');
      }
    };

    const handleUpdate = async (id, name, description) => {
      try {
        await updateAnniversary(id, name, description);
        alert('기념일이 수정되었습니다!');
        fetchAnniversaries(); // 수정된 데이터를 다시 가져옵니다
        setModalVisible(false);
        setSelectedAnniversary(null);
      } catch (err) {
        console.error('기념일 수정 실패:', err);
        alert('기념일 수정에 실패했습니다.');
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

    const handleDateClick = (date) => {
      const anniversary = anniversaries.filter(
        (item) => item.anniversary_date === date
      )

       // 날짜를 설정
      setSelectedDate(date);

      if(anniversary.length > 0){
        setSelectedAnniversary(anniversary);
        setFormData({
          name: anniversary[0]?.name || '',
          description: anniversary[0]?.description || '',
        });
        setModalVisible(true);
      }else{
        setSelectedAnniversary([]); // 선택된 기념일 초기화
        setFormData({name: '', description: ''})
        setModalVisible(true);
      }
    }

    const handleAddNew = () => {
      setSelectedAnniversary([]);
      setFormData({name: '', description: ''});
    }
  
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
            onDateClick={handleDateClick}
          />
        </div>
        {modalVisible && (
       <Modal
       visible={modalVisible}
       formData={formData}
       onChange={setFormData}
       onSubmit={(e) => {
         e.preventDefault();
         if (selectedAnniversary.length > 0) {
           // 수정 동작
           const selected = selectedAnniversary[0]; // 배열의 첫 번째 항목
           handleUpdate(selected.id, formData.name, formData.description);
         } else {
           // 추가 동작
           handleSubmit(e);
         }
       }}
       data={selectedAnniversary}
       onSelectAnniversary={(anniversary) => {
         setFormData({ name: anniversary.name, description: anniversary.description });
         setSelectedAnniversary([anniversary]); // 선택된 기념일 저장
       }}
       onAddNew={handleAddNew}
       onClose={() => {
         setModalVisible(false);
         setSelectedAnniversary(null);
         setFormData({ name: '', description: '' }); // 폼 초기화
       }}
     />
        )}
      </>
    );
  };
  
  export default AnniversaryPage;
  