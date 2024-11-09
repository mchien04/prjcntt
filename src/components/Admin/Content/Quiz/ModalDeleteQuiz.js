import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { deleteQuizForAdmin } from '../../../../services/apiService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ModalDeleteQuiz = (props) => {
    const { t } = useTranslation(); // Khai báo t để sử dụng cho dịch

    const { show, setShow, dataDelete } = props;

    const handleClose = () => setShow(false);

    const handleSubmitDeleteQuiz = async () => {
        // Call API to delete quiz
        let data = await deleteQuizForAdmin(dataDelete.id);

        if (data && data.EC === 0) {
            toast.success(data.EM);
            handleClose();
            await props.fetchQuiz();
        }

        if (data && data.EC !== 0) {
            toast.error(data.EM);
        }
    }

    return (
        <>
            <Modal
                show={show}
                onHide={handleClose}
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('modalDeleteQuiz.confirmDeleteTitle')}</Modal.Title> {/* Tiêu đề modal */}
                </Modal.Header>
                <Modal.Body>
                    {t('modalDeleteQuiz.confirmDeleteMessage')} {/* Câu hỏi xác nhận */}
                    <b>{dataDelete && dataDelete.name ? dataDelete.name : ""}</b>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('modalDeleteQuiz.cancel')} {/* Nút hủy */}
                    </Button>
                    <Button variant="primary" onClick={() => { handleSubmitDeleteQuiz() }}>
                        {t('modalDeleteQuiz.confirm')} {/* Nút xác nhận */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteQuiz;
