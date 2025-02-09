import React from 'react';
import '../assets/styles/Anniversary.css';

const Modal = ({
  visible,
  formData,
  onChange,
  onSubmit,
  onDelete,
  onClose,
  selectedEvent,
}) => {
  if (!visible) return null;

  return (
    <div className={`fullscreen-modal ${visible ? 'show' : ''}`}>
      {' '}
      {/* 기존 modal 스타일 유지 */}
      <button className="close-button" onClick={onClose}>
        ×
      </button>
      <h2>{selectedEvent ? '기념일 수정' : '새로운 기념일 추가'}</h2>
      <form onSubmit={onSubmit}>
        <input
          type="text"
          className="anniversaryName"
          placeholder="기념일 이름"
          value={formData.name || ''}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />

        <input
          type="text"
          className="anniversaryDescription"
          placeholder="기념일 설명"
          value={formData.description || ''}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
        />
        <div className="button-group">
          <button className="edit-button btnFloat" type="submit">
            {selectedEvent ? '수정' : '추가'}
          </button>
          {selectedEvent && (
            <button
              className="delete-button btnFloat"
              type="button"
              onClick={onDelete}
            >
              삭제
            </button>
          )}
        </div>
      </form>
    </div>
  );
};

export default Modal;
