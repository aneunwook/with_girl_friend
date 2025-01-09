const Modal = ({ visible, formData, onChange, onSubmit, data, onSelectAnniversary, onAddNew, onClose, onDelete }) => {
  if (!visible) return null;

   return (
    <div className="fullscreen-modal show">
      <button onClick={onClose}>닫기</button>
      {data && data.length > 0 ? (
        <>
          <h2>기념일 목록</h2>
          <ul>
          {console.log('Data:', data)}
            {data.map((item) => (
              <li key={item.id} >
                <button onClick={() => onSelectAnniversary(item)}>
                  {item.name} ({item.anniversary_date})
                </button>
                <button onClick={() => onDelete(item.id)}>삭제</button>
              </li>
            ))}
          </ul>
          <button onClick={onAddNew}>새 기념일 추가</button>
        </>
      ) : (
        <h2>새로운 기념일 추가</h2>
      )}
      <form onSubmit={onSubmit}>
        <input
          type="text"
          placeholder="기념일 이름"
          value={formData.name || ''} // 항상 값 제공
          onChange={(e) => onChange({ ...formData, name: e.target.value })}
        />
        <textarea
          placeholder="기념일 설명"
          value={formData.description || ''} // 항상 값 제공
          onChange={(e) => onChange({ ...formData, description: e.target.value })}
        />
        <button type="submit">{data && data.length > 0 ? '수정' : '추가'}</button>
      </form>
    </div>
  );
};

export default Modal;