import { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { deleteUser } from '../../../services/apiService';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ModalDeleteUser = (props) => {
    const { show, setShow, dataDelete } = props;
    const { t } = useTranslation(); // Khai báo t để dùng cho dịch

    const handleClose = () => setShow(false);

    const handleSubmitDeleteUser = async () => {
        let data = await deleteUser(dataDelete.id);

        if (data && data.EC === 0) {
            toast.success(data.EM);
            handleClose();
            props.setCurrentPage(1);
            await props.fetchListUsersWithPaginate(1);
        } else if (data && data.EC !== 0) {
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
                    <Modal.Title>{t('modalDeleteUser.confirmDeleteTitle')}</Modal.Title> {/* Tiêu đề */}
                </Modal.Header>
                <Modal.Body>
                    {t('modalDeleteUser.confirmDeleteMessage', {
                        email: dataDelete && dataDelete.email ? dataDelete.email : ""
                    })} {/* Nội dung */}
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('modalDeleteUser.cancel')} {/* Nút "Cancel" */}
                    </Button>
                    <Button variant="primary" onClick={handleSubmitDeleteUser}>
                        {t('modalDeleteUser.confirm')} {/* Nút "Confirm" */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalDeleteUser;
