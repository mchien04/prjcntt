import ReactPaginate from "react-paginate";
import { useState, useEffect } from "react";
import { useTranslation } from 'react-i18next';

const TableUserPaginate = (props) => {
    const { users, pageCount } = props;
    const { t } = useTranslation();

    // Invoke when user click to request another page.
    const handlePageClick = (event) => {
        props.fetchListUsersWithPaginate(+event.selected + 1);
        props.setCurrentPage(+event.selected + 1);
        console.log(`User requested page number ${event.selected}`);
    };

    return (
        <>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#No.</th>
                        <th scope="col">{t('tableuser.username')}</th>
                        <th scope="col">{t('tableuser.email')}</th>
                        <th scope="col">{t('tableuser.role')}</th>
                        <th scope="col">{t('tableuser.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 && users.map((item, index) => {
                        return (
                            <tr key={`table-user-${index}`}>
                                <td>{index + 1}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>{item.role}</td>
                                <td>
                                    <button className="btn btn-success">{t('tableuser.view')}</button>
                                    <button
                                        className="btn btn-warning mx-3"
                                        onClick={() => props.handleClickBtnUpdate(item)}
                                    >
                                        {t('tableuser.update')}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => props.handleClickBtnDelete(item)}
                                    >
                                        {t('tableuser.delete')}
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                    }
                    {users && users.length === 0 && <tr>
                        <td colSpan={'4'}>{t('tableuser.noData')}</td>
                    </tr>}
                </tbody>
            </table>
            <div className="user-pagination d-flex justify-content-center">
                <ReactPaginate
                    nextLabel="next >"
                    onPageChange={handlePageClick}
                    pageRangeDisplayed={3}
                    marginPagesDisplayed={2}
                    pageCount={pageCount}
                    previousLabel="< previous"
                    pageClassName="page-item"
                    pageLinkClassName="page-link"
                    previousClassName="page-item"
                    previousLinkClassName="page-link"
                    nextClassName="page-item"
                    nextLinkClassName="page-link"
                    breakLabel="..."
                    breakClassName="page-item"
                    breakLinkClassName="page-link"
                    containerClassName="pagination"
                    activeClassName="active"
                    renderOnZeroPageCount={null}
                    forcePage={props.currentPage - 1}
                />
            </div>
        </>
    )
}

export default TableUserPaginate;