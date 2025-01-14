import React from "react";
import PostCard from "../components/PostCard";

const Pagination = ({ posts, currentPage, setCurrentPage, totalPages }) => {

    // 페이지 변경 함수
    const handlePageChange = (pageNumber) => {
        if (pageNumber >= 1 && pageNumber <= totalPages) {
            setCurrentPage(pageNumber); // 페이지 번호 업데이트
        }    
    }

    // 페이지 번호 버튼 렌더링
    const renderPageNumbers = () => {
        console.log("Rendering pages with totalPages:", totalPages); // 디버깅
        const pageNumbers = [];
        for (let i = 1; i <= totalPages; i++) {
            pageNumbers.push(i);
        }

        return pageNumbers.map((number) => (
            <button
                key={number}
                onClick={() => handlePageChange(number)}
                style={{
                    fontWeight: currentPage === number ? "bold" : "normal", // 현재 페이지 강조
                }}
            >
                {number}
            </button>
        ));
    };

    return <div className="pagination"> {renderPageNumbers()} </div> //페이지 번호 버튼 렌더링 

};

export default Pagination;
