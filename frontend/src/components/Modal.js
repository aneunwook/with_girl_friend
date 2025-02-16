import React from 'react';
import styles from '../assets/styles/Anniversary.module.css';

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
    <div className={`${styles.modalContainer} ${visible ? styles.show : ''}`}>
      <button className={styles.closeButton} onClick={onClose}>
        ×
      </button>
      <h2 className={styles.modalTitle}>
        {selectedEvent ? '기념일 수정' : '새로운 기념일 추가'}
      </h2>

      <form onSubmit={onSubmit} className={styles.modalForm}>
        {/* 기념일 이름 입력 */}
        <input
          type="text"
          className={styles.anniversaryName}
          placeholder="기념일 이름"
          value={formData.name || ''}
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
          required
        />

        {/* 기념일 설명 입력 */}
        <input
          type="text"
          className={styles.anniversaryDescription}
          placeholder="기념일 설명"
          value={formData.description || ''}
          onChange={(e) =>
            onChange({ ...formData, description: e.target.value })
          }
        />

        {/* 버튼 그룹 */}
        <div className={styles.buttonGroup}>
          <button
            className={`${styles.editButton} ${styles.btnFloat}`}
            type="submit"
          >
            {selectedEvent ? '수정' : '추가'}
          </button>
          {selectedEvent && (
            <button
              className={`${styles.deleteButton} ${styles.btnFloat}`}
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
