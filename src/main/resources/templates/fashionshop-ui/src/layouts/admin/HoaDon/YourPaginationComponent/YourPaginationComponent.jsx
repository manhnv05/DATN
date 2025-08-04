// src/component/MainContent/YourPaginationComponent.jsx
import React from 'react';
import PropTypes from 'prop-types';

const generatePageNumbers = (currentPage, totalPages) => {
    // ... (toàn bộ code của hàm generatePageNumbers đã cung cấp ở trên)
    if (totalPages <= 5) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
    }
    const current = currentPage + 1;
    const pages = new Set();
    pages.add(1);
    pages.add(totalPages);
    if (current > 1) pages.add(current - 1);
    pages.add(current);
    if (current < totalPages) pages.add(current + 1);
    const sortedPages = Array.from(pages).sort((a, b) => a - b);
    const result = [];
    let lastPage = 0;
    for (const page of sortedPages) {
        if (page > lastPage + 1) {
            result.push('...');
        }
        result.push(page);
        lastPage = page;
    }
    return result;
};

function YourPaginationComponent({ currentPage, totalPages, setCurrentPage, pageSize, setPageSize }) {
    if (totalPages === 0) return null; // Không hiển thị gì nếu không có trang nào

    return (
        <nav className="d-flex justify-content-between align-items-center mt-4">
            <div className="d-flex align-items-center">
                <label htmlFor="pageSizeSelect" className="form-label mb-0 me-2">Số mục/trang:</label>
                <select
                    id="pageSizeSelect"
                    className="form-select w-auto"
                    value={pageSize}
                    onChange={(e) => {
                        setPageSize(Number(e.target.value));
                        setCurrentPage(0);
                    }}
                >
                    <option value="5">5</option>
                    <option value="10">10</option>
                    <option value="20">20</option>
                </select>
            </div>

            <ul className="pagination mb-0">
                <li className={`page-item ${currentPage === 0 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => prev - 1)}
                        disabled={currentPage === 0}
                    >
                        Trước
                    </button>
                </li>
                {generatePageNumbers(currentPage, totalPages).map((page, index) =>
                    page === '...' ? (
                        <li key={`ellipsis-${index}`} className="page-item disabled">
                            <span className="page-link">...</span>
                        </li>
                    ) : (
                        <li key={page} className={`page-item ${currentPage === page - 1 ? 'active' : ''}`}>
                            <button
                                className="page-link"
                                onClick={() => setCurrentPage(page - 1)}
                            >
                                {page}
                            </button>
                        </li>
                    )
                )}
                <li className={`page-item ${currentPage >= totalPages - 1 ? 'disabled' : ''}`}>
                    <button
                        className="page-link"
                        onClick={() => setCurrentPage(prev => prev + 1)}
                        disabled={currentPage >= totalPages - 1}
                    >
                        Tiếp
                    </button>
                </li>
            </ul>
        </nav>
    );
}
YourPaginationComponent.propTypes = {
    currentPage: PropTypes.number.isRequired,
    totalPages: PropTypes.number.isRequired,
    setCurrentPage: PropTypes.func.isRequired,
    pageSize: PropTypes.number.isRequired,
    setPageSize: PropTypes.func.isRequired,
};

export default YourPaginationComponent;
