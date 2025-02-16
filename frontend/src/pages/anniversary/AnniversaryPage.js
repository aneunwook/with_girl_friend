import React, { useState, useEffect } from 'react';
import {
  createAnniversary,
  getAnniversariesByDateRange,
  updateAnniversary,
  deleteAnniversary,
} from '../../service/anniversary/anniversaryService';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import 'dayjs/locale/ko';
import Modal from '../../components/Modal.js';
import styles from '../../assets/styles/Anniversary.module.css';

dayjs.extend(relativeTime);
dayjs.locale('ko');

const categories = ['특별한 날', '추억의 날', '소소한 기쁨', '서프라이즈 준비'];

const AnniversaryPage = () => {
  const [events, setEvents] = useState([]); // 캘린더에 표시할 이벤트 목록
  const [selectedEvent, setSelectedEvent] = useState(null); // 선택된 기념일 정보
  const [selectedDate, setSelectedDate] = useState(null); // 사용자가 선택한 날짜
  const [modalVisible, setModalVisible] = useState(false); // 모달 표시 여부
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: categories[0],
  });
  const [filter, setFilter] = useState('전체');

  const calculateDDay = (date) => {
    const today = dayjs();
    const targetDate = dayjs(date);
    const diff = targetDate.diff(today, 'day');

    if (diff === 0) return 'D-Day';
    return `D${diff > 0 ? '-' : '+'}${Math.abs(diff)}`;
  };

  const fetchAnniversaries = async () => {
    try {
      const startDate = new Date(); // 오늘 날짜
      const endDate = new Date(
        startDate.getFullYear() + 10,
        startDate.getMonth(),
        startDate.getDate()
      ); // 10년 후

      const formattedStartDate = startDate.toISOString().split('T')[0];
      const formattedEndDate = endDate.toISOString().split('T')[0];

      console.log(
        '📡 요청할 날짜 범위:',
        formattedStartDate,
        '~',
        formattedEndDate
      );

      const data = await getAnniversariesByDateRange(
        formattedStartDate,
        formattedEndDate
      );

      console.log('📡 서버에서 받아온 데이터:', data);

      if (!data || data.length === 0) {
        console.warn('⚠️ 기념일 데이터 없음! (백엔드 문제 가능성)');
      }

      const formattedEvents = data.map((item) => ({
        id: item.id,
        title: item.name,
        start: item.anniversary_date,
        extendedProps: {
          description: item.description,
          dDay: calculateDDay(item.anniversary_date),
        },
      }));

      console.log('🗓️ 캘린더에 추가할 이벤트:', formattedEvents);

      setEvents(formattedEvents);
    } catch (err) {
      console.error('❌ 기념일 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchAnniversaries();
  }, []);

  const sortedEvents = [...events].sort((a, b) => {
    const aDiff = dayjs(a.start).diff(dayjs(), 'day');
    const bDiff = dayjs(b.start).diff(dayjs(), 'day');
    return aDiff - bDiff;
  });

  // 🎯 날짜 클릭 시 새 기념일 추가 모달 열기
  const handleDateClick = (info) => {
    setSelectedDate(info.dateStr);
    setSelectedEvent(null);
    setFormData({ name: '', description: '' });
    setModalVisible(true);
  };

  // 🎯 기존 기념일 클릭 시 수정/삭제 모달 열기
  const handleEventClick = (info) => {
    setSelectedEvent({
      id: info.event.id,
      name: info.event.title,
      description: info.event.extendedProps.description,
    });
    setFormData({
      name: info.event.title,
      description: info.event.extendedProps.description,
      anniversary_date: info.event.startStr, // 날짜 정보
    });
    setModalVisible(true);
  };

  // 🎯 기념일 추가
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedDate) return alert('날짜를 선택해 주세요');

    try {
      const response = await createAnniversary({
        userId: 1,
        name: formData.name,
        description: formData.description,
        anniversaryDate: selectedDate,
        categories: formData.category,
      });

      console.log('✅ 새로운 기념일:', response);

      setEvents((prevEvents) => [
        ...prevEvents,
        {
          id: response.date.id,
          title: response.date.name,
          start: response.date.anniversary_date,
          extendedProps: {
            description: response.date.description,
            dDay: calculateDDay(response.date.anniversary_date),
          },
        },
      ]);
      setModalVisible(false);
      setFormData({ name: '', description: '', anniversary_date: '' });

      handleCloseModal();
    } catch (err) {
      alert('기념일 추가 실패!');
    }
  };

  // 🎯 기념일 수정
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (!selectedEvent) return;

    try {
      const response = await updateAnniversary(
        selectedEvent.id,
        formData.name,
        formData.description
      );

      console.log('✅ 업데이트된 기념일:', response);

      setEvents(
        events.map((event) =>
          event.id === (response.data?.id || response.id) // 데이터 구조에 따라 유연하게 처리
            ? {
                ...event,
                title: response.data?.name || response.name,
                start:
                  response.data?.anniversary_date || response.anniversary_date,
              }
            : event
        )
      );

      handleCloseModal();
    } catch (err) {
      alert('기념일 수정 실패!');
    }
  };

  const handleDelete = async () => {
    if (!selectedEvent) return;
    if (!window.confirm('정말 삭제하시겠습니까?')) return;

    try {
      await deleteAnniversary(selectedEvent.id);

      setSelectedEvent(null); // ✅ 선택된 기념일 초기화
      setModalVisible(false); // ✅ 모달 닫기

      await fetchAnniversaries(); // ✅ 최신 데이터 다시 불러오기
    } catch (err) {
      alert('기념일 삭제 실패!');
    }
  };

  // 🎯 모달 닫기
  const handleCloseModal = () => {
    setModalVisible(false);
    setSelectedEvent(null);
    setFormData({ name: '', anniversary_date: '', description: '' });
  };

  return (
    <div className={styles.calendarContainer}>
      <div className={styles.calendarHeader}>
        <p className={styles.calendarTitle}>Our Shared Anniversary</p>
        <div className={styles.calendarSubHeader}>
          <p className={styles.calendarSubTitle}>
            Celebrate and save your anniversary
          </p>
        </div>
      </div>

      <div className={styles.fullCalendarInfoContainer}>
        <div className={styles.fullCalendarInfo}>
          <FullCalendar
            className={styles.fcDaygridDayDvents}
            plugins={[dayGridPlugin, interactionPlugin]}
            initialView="dayGridMonth"
            events={events}
            dateClick={handleDateClick}
            eventClick={handleEventClick}
            dayMaxEventRows={2} // 한 날짜에 최대 2개의 이벤트만 표시
            height="auto"
            eventContent={(info) => (
              <div className={styles.customEvent}>
                <strong>{info.event.title}</strong>
              </div>
            )}
          />
        </div>

        <div className={styles.ddayContainer}>
          <div className={styles.ddayInfo}>
            <h2 className={styles.ddayTitle}>D-Day</h2>
            <hr className={styles.line}></hr>
            <div className={styles.ddayList}>
              {sortedEvents.map((event) => (
                <div key={event.id} className={styles.ddayItem}>
                  <strong className={styles.ddayContent}>
                    <span className={styles.ddayTitleName}>{event.title}</span>
                    <span className={styles.ddayDate}>
                      {event.extendedProps.dDay}
                    </span>
                  </strong>
                </div>
              ))}
            </div>
          </div>
        </div>

        {modalVisible && (
          <Modal
            visible={modalVisible}
            formData={formData}
            onChange={setFormData}
            height="500px"
            contentHeight="auto"
            onSubmit={selectedEvent ? handleUpdate : handleSubmit}
            onDelete={selectedEvent ? handleDelete : null}
            onClose={handleCloseModal}
            selectedEvent={selectedEvent} // ✅ 수정된 부분: selectedEvent를 전달
          ></Modal>
        )}
      </div>
    </div>
  );
};

export default AnniversaryPage;

// 💖 1. 중요한 기념일 강조하기 (색상, 스타일 커스텀)
// 💌 3. 기념일 추가 시 특별한 메시지 표시
// 📅 4. 반복되는 기념일 자동 등록
//
