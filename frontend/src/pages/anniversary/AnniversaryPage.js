import React, { useState, useEffect } from "react";
import { createAnniversary, getAnniversariesByDateRange } from "../../service/anniversary/anniversaryService";
import '../../assets/styles/Anniversary.css';

const AnniversaryPage = () => {
    const [selectedDate, setSelectedDate] = useState(null);
    const [modalVisible, setModalVisible] = useState(false);
    const [anniversaries, setAnniversaries] = useState([]);
    const [formData, setFormData] = useState({
        name: "",
        description: "",
    });

    // 기념일 데이터 가져오기
    const fetchAnniversaries = async () => {
        const today = new Date();
        const startDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-01`;
        const endDate = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-31`;

        try {
            const data = await getAnniversariesByDateRange(startDate, endDate);
            setAnniversaries(data);
        } catch (err) {
            console.error("Failed to fetch anniversaries", err);
        }
    };

    // 컴포넌트 로드 시 기념일 데이터 가져오기
    useEffect(() => {
        fetchAnniversaries();
    }, []);

    // 날짜 클릭 핸들러
    const handleDateClick = (date) => {
        setSelectedDate(date);
        setModalVisible(true);
    };

    // 폼 제출 핸들러
    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            alert("날짜를 선택해 주세요.");
            return;
        }

        try {
            const data = {
                userId: 1, // 임시 사용자 ID
                name: formData.name,
                description: formData.description,
                anniversaryDate: selectedDate,
            };
            await createAnniversary(data);
            alert("기념일이 성공적으로 추가되었습니다!");
            setModalVisible(false);// 모달 닫기
            setFormData({ name: "", description: "" }); // 폼 데이터 초기화
            fetchAnniversaries(); // 새로 추가된 데이터 반영
        } catch (err) {
            alert("기념일 추가 실패!");
        }
    };

    return (
        <div>
            <h1>기념일 캘린더</h1>
            <div className="calendar">
                {Array.from({ length: 31 }, (_, index) => {
                    const date = `${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, "0")}-${String(
                        index + 1
                    ).padStart(2, "0")}`;
                    return (
                        <div key={index} onClick={() => handleDateClick(date)}>
                            {date}
                        </div>
                    );
                })}
            </div>

            {/* 모달 창 */}
            <div>
        {/* <button onClick={() => setModalVisible(true)}>기념일 추가</button> */}
        {modalVisible && (
            <div className={`fullscreen-modal ${modalVisible ? "show" : ""}`}>
                <h2>기념일 추가</h2>
                <form onSubmit={handleSubmit}>
                    <div>
                        <label>기념일 이름:</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                    </div>
                    <div>
                        <label>설명:</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        ></textarea>
                    </div>
                    <button type="submit">추가</button>
                    <button type="button" onClick={() => setModalVisible(false)}>
                        닫기
                    </button>
                </form>
            </div>
        )}
        </div>


            {/* 이달의 기념일 */}
            <div>
                <h2>이달의 기념일</h2>
                <ul>
        {anniversaries && anniversaries.length > 0 ? (
            anniversaries.map((anniversary) => (
                <li key={anniversary.id}>
                    {anniversary.anniversary_date} - {anniversary.name}
                </li>
            ))
        ) : (
            <li>기념일이 없습니다.</li>
        )}
    </ul>
            </div>
        </div>
    );
};

export default AnniversaryPage;
