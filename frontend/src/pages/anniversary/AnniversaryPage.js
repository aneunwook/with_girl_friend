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
import '../../assets/styles/Anniversary.css';

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

  // 🎯 백엔드에서 기념일 목록 가져오기
  const fetchAnniversaries = async () => {
    try {
      const startDate = new Date();
      const endDate = new Date(
        startDate.getFullYear(),
        startDate.getMonth() + 1,
        0
      );
      const data = await getAnniversariesByDateRange(
        startDate.toISOString().split('T')[0],
        endDate.toISOString().split('T')[0]
      );

      console.log('📡 가져온 기념일 데이터:', data);

      // 데이터를 FullCalendar에서 사용할 형식으로 변환
      const formattedEvents = data.map((item) => ({
        id: item.id,
        title: item.name,
        start: item.anniversary_date,
        extendedProps: {
          description: item.description,
          dDay: calculateDDay(item.anniversary_date), // D-Day 값 추가
        },
      }));

      setEvents(formattedEvents);
    } catch (err) {
      console.error('기념일 불러오기 실패:', err);
    }
  };

  useEffect(() => {
    fetchAnniversaries();
  }, []);

  const filteredEvents =
    filter === '전체'
      ? events
      : events.filter((event) => event.category === filter);
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

      setEvents([
        ...events,
        {
          id: response.date.id,
          title: response.date.name,
          start: response.date.anniversary_date,
          extendedProps: {
            description: response.date.description,
            category: response.date.category, // ✅ 카테고리 추가
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
  const handleUpdate = async () => {
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
    <div className="calendar-container">
      <h1>🎉 기념일 캘린더</h1>
      <div className="filter-section">
        <h3>필터</h3>
        <select onChange={(e) => setFilter(e.target.value)} value={filter}>
          <option value="전체">전체</option>
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
      </div>
      <FullCalendar
        className="fc-daygrid-day-events"
        plugins={[dayGridPlugin, interactionPlugin]}
        initialView="dayGridMonth"
        events={events}
        dateClick={handleDateClick}
        eventClick={handleEventClick}
        dayMaxEventRows={2} // 한 날짜에 최대 2개의 이벤트만 표시
        height="auto"
        eventContent={(info) => (
          <div className="custom-event">
            <strong>
              {info.event.title} ({info.event.extendedProps.dDay})
            </strong>
          </div>
        )}
      />

      <div className="dday-container">
        <h2>D-Day 목록</h2>
        <ul>
          {sortedEvents.map((event) => (
            <li key={event.id}>
              <strong>{event.extendedProps.dDay}</strong> - {event.title}
            </li>
          ))}
        </ul>

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
