import React from "react";
import ReactPaginate from "react-paginate";

const Pagination = ({pageCount, getPage}) => {
  const handlePageClick = (data) => {
    getPage(data.selected +1)
  };

  return (
    <div className="mt-3">
      <ReactPaginate
        breakLabel="..."
        nextLabel="Next"
        onPageChange={handlePageClick}
        pageRangeDisplayed={2}
        marginPagesDisplayed={2}
        pageCount={pageCount}
        previousLabel="Previous"
        containerClassName={"pagination justify-content-center py-3"}
        pageClassName="page-item"
        pageLinkClassName="page-link"
        previousClassName="page-item"
        previousLinkClassName="page-link"
        nextClassName="page-item"
        nextLinkClassName="page-link"
        breakClassName="page-item"
        breakLinkClassName="page-link"
        activeClassName="active"
      />
    </div>
  );
};

export default Pagination;
