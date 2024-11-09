import { useEffect, useState } from "react";
import { getAllQuizForAdmin } from "../../../../services/apiService";
import ModalDeleteQuiz from "./ModalDeleteQuiz";
import ModalUpdateQuiz from "./ModalUpdateQuiz";
import { useTranslation } from 'react-i18next'; // Import useTranslation

const TableQuiz = (props) => {
    const { t } = useTranslation(); // Khai báo t để sử dụng cho dịch

    const [listQuiz, setListQuiz] = useState([]);

    const [isShowModalUpdate, setIsShowModalUpdate] = useState(false);
    const [isShowModalDelete, setIsShowModalDelete] = useState(false);
    const [dataUpdate, setDataUpdate] = useState({});
    const [dataDelete, setDataDelete] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, []);

    const fetchQuiz = async () => {
        setDataUpdate({});
        setDataDelete({});
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            setListQuiz(res.DT);
        }
    };

    const handleUpdate = (quiz) => {
        setDataUpdate(quiz);
        setIsShowModalUpdate(true);
    };

    const handleDelete = (quiz) => {
        setDataDelete(quiz);
        setIsShowModalDelete(true);
    };

    return (
        <>
            <div>{t('tableQuiz.listQuizzes')}:</div>
            <table className="mt-1 table table-hover table-bordered my-2">
                <thead>
                    <tr>
                        <th scope="col">{t('tableQuiz.id')}</th>
                        <th scope="col">{t('tableQuiz.name')}</th>
                        <th scope="col">{t('tableQuiz.description')}</th>
                        <th scope="col">{t('tableQuiz.type')}</th>
                        <th scope="col">{t('tableQuiz.actions')}</th>
                    </tr>
                </thead>
                <tbody>
                    {listQuiz &&
                        listQuiz.map((item, index) => {
                            return (
                                <tr key={`table-quiz-${index}`}>
                                    <th>{item.id}</th>
                                    <td>{item.name}</td>
                                    <td>{item.description}</td>
                                    <td>{item.difficulty}</td>
                                    <td style={{ display: "flex", gap: "15px" }}>
                                        <button
                                            className="btn btn-outline-info"
                                            onClick={() => handleUpdate(item)}
                                        >
                                            {t('tableQuiz.edit')}
                                        </button>
                                        <button
                                            className="btn btn-outline-danger"
                                            onClick={() => handleDelete(item)}
                                        >
                                            {t('tableQuiz.delete')}
                                        </button>
                                    </td>
                                </tr>
                            );
                        })}
                </tbody>
            </table>
            <ModalUpdateQuiz
                show={isShowModalUpdate}
                setShow={setIsShowModalUpdate}
                dataUpdate={dataUpdate}
                fetchQuiz={fetchQuiz}
                setDataUpdate={setDataUpdate}
            />
            <ModalDeleteQuiz
                show={isShowModalDelete}
                setShow={setIsShowModalDelete}
                dataDelete={dataDelete}
                fetchQuiz={fetchQuiz}
            />
        </>
    );
};

export default TableQuiz;
