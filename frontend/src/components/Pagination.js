import React from "react";
import PostCard from "../components/PostCard";
import '../assets/styles/Pagination.css';

const Pagination = ({ posts, currentPage, setCurrentPage, totalPages }) => {

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber); // 페이지 번호 업데이트
        }    
    }

    // 페이지 번호 버튼 렌더링
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

  return (
    <div className="pagination-container">
      {pageNumbers.map((number) => (
        <button
          className={`pagination-btn ${
            currentPage === number ? "active" : ""
          }`}
          key={number}
          onClick={() => handlePageChange(number)}
        >
          {number}
        </button>
      ))}
    </div>
  );
};

export default Pagination;
