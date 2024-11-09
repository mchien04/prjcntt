import React, { useState, useEffect } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { FcPlus } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { putUpdateQuizForAdmin } from '../../../../services/apiService';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ModalUpdateQuiz = (props) => {
    const { t } = useTranslation(); // Khai báo t để sử dụng cho dịch

    const { show, setShow, dataUpdate, setDataUpdate } = props;

    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [type, setType] = useState("");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (!_.isEmpty(dataUpdate)) {
            // Update state
            setDescription(dataUpdate.description);
            setName(dataUpdate.name);
            setType(dataUpdate.difficulty);
            setImage("");
            if (dataUpdate.image) {
                setPreviewImage(`data:image/jpeg;base64,${dataUpdate.image}`);
            }
        }
    }, [props.dataUpdate]);

    const handleClose = () => {
        setShow(false);
        setName("");
        setDescription("");
        setType("");
        setImage("");
        setPreviewImage("");
        setDataUpdate({});
    };

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const handSubmitUpdateQuiz = async () => {
        // Validate
        if (!name) {
            toast.error(t('modalUpdateQuiz.invalidName')); // Dịch chuỗi lỗi
            return;
        }

        if (!description) {
            toast.error(t('modalUpdateQuiz.invalidDescription')); // Dịch chuỗi lỗi
            return;
        }

        let data = await putUpdateQuizForAdmin(dataUpdate.id, name, description, type, image);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            await props.fetchQuiz();
            handleClose();
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
                size="xl"
                backdrop="static"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('modalUpdateQuiz.updateQuizTitle')}</Modal.Title> {/* Tiêu đề modal */}
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">{t('modalUpdateQuiz.name')}</label> {/* Tên Quiz */}
                            <input
                                type="text"
                                className="form-control"
                                value={name}
                                onChange={(event) => setName(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('modalUpdateQuiz.description')}</label> {/* Mô tả Quiz */}
                            <input
                                type="text"
                                className="form-control"
                                value={description}
                                onChange={(event) => setDescription(event.target.value)}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">{t('modalUpdateQuiz.difficulty')}</label> {/* Độ khó Quiz */}
                            <select className="form-select"
                                onChange={(event) => setType(event.target.value)}
                                value={type}
                            >
                                <option value="EASY">{t('modalUpdateQuiz.easy')}</option>
                                <option value="MEDIUM">{t('modalUpdateQuiz.medium')}</option>
                                <option value="HARD">{t('modalUpdateQuiz.hard')}</option>
                            </select>
                        </div>

                        <div className='col-md-12'>
                            <label className="form-label label-upload" htmlFor='labelUpload'>
                                <FcPlus /> {t('modalUpdateQuiz.uploadImage')} {/* Upload Image */}
                            </label>
                            <input
                                type="file"
                                id="labelUpload" hidden
                                onChange={(event) => handleUploadImage(event)}
                            />
                        </div>

                        <div className='col-md-12 img-preview'>
                            {previewImage ?
                                <img src={previewImage} alt="Preview" />
                                :
                                <span>{t('modalUpdateQuiz.previewImage')}</span>
                            }
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('modalUpdateQuiz.close')} {/* Đóng modal */}
                    </Button>
                    <Button variant="primary" onClick={() => handSubmitUpdateQuiz()}>
                        {t('modalUpdateQuiz.save')} {/* Lưu thay đổi */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpdateQuiz;
