import { useEffect, useState } from "react";

const Modal = ({ visible, formData, onChange, onSubmit, data, onSelectAnniversary, onAddNew, onClose, onDelete }) => {
  const[showClass, setShowClass] = useState(false);

  useEffect(() => {
    if (visible) {
      // 모달을 보이게 만들고 애니메이션 적용
      setTimeout(() => setShowClass(true)); // 약간의 지연 후 애니메이션 시작
    } else {
      // 모달 숨기기 전에 애니메이션 제거
      setShowClass(false);
    }
  }, [visible]);
  
  if (!visible) return null;

   return (
    <div className={`fullscreen-modal ${showClass ? 'show' : ''}`}>
      <button className="close-button" onClick={onClose}>×</button>
      {data && data.length > 0 ? (
        <>
          <ul>
            {data.map((item) => (
              <div key={item.id} >
                <button onClick={() => onDelete(item.id)}>삭제</button>
              </div>
            ))}
          </ul>
          <button className="edit-button btnFloat" onClick={onSubmit}>수정</button>
          <button className="add-button btnFloat" onClick={onAddNew}>새 기념일 추가</button>
        </>
      ) : (
        <h2>새로운 기념일 추가</h2>
      )}
      <form onSubmit={onSubmit}>
        <input className="anniversaryName"
          type="text"
          placeholder="기념일 이름"
          value={formData.name || ''} // 항상 값 제공
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
        <input className="anniversaryDescription"
          placeholder="기념일 설명"
          value={formData.description || ''} // 항상 값 제공
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
        />
        {!(data && data.length > 0) && (
        <button 
          type="submit" 
          className="add-button btnFloat">
          새 기념일 추가
        </button>
      )}
      </form>
    </div>
  );
};

export default Modal;