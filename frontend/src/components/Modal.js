import React from "react";
import '../assets/styles/Anniversary.css';

const Modal = ({ visible, formData, onChange, onSubmit, onClose }) => {
    if (!visible) return null;
  
    return (
      <div className="fullscreen-modal show">
        <h2>기념일 추가</h2>
        <form onSubmit={onSubmit}>
          <div>
            <label>기념일 이름:</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={(e) => onChange({ ...formData, name: e.target.value })}
              required
            />
          </div>
          <div>
            <label>설명:</label>
            <textarea
              name="description"
              value={formData.description}
              onChange={(e) =>
                onChange({ ...formData, description: e.target.value })
              }
            ></textarea>
          </div>
          <button type="submit">추가</button>
          <button type="button" onClick={onClose}>
            닫기
          </button>
        </form>
      </div>
    );
  };
  
  export default Modal;