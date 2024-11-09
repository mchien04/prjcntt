import React, { useEffect, useState } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { putUpdateUser } from '../../../services/apiService';
import { toast } from 'react-toastify';
import _ from 'lodash';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ModalUpdateUser = (props) => {
    const { show, setShow, dataUpdate } = props;
    const { t } = useTranslation(); // Khai báo t để dùng cho dịch

    const handleClose = () => {
        setShow(false);
        setEmail("");
        setPassword("");
        setUsername("");
        setRole("USER");
        setImage("");
        setPreviewImage("");
        props.resetUpdateData();
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("USER");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (!_.isEmpty(dataUpdate)) {
            // Update state
            setEmail(dataUpdate.email);
            setUsername(dataUpdate.username);
            setRole(dataUpdate.role);
            setImage("");
            if (dataUpdate.image) {
                setPreviewImage(`data:image/jpeg;base64,${dataUpdate.image}`);
            }
        }
    }, [dataUpdate]);

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const handleSubmitUser = async () => {
        let data = await putUpdateUser(dataUpdate.id, username, role, image);

        if (data && data.EC === 0) {
            toast.success(data.EM);
            handleClose();
            await props.fetchListUsersWithPaginate(props.currentPage);
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
                size='xl'
                backdrop="static"
                className="modal-add-user"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('modalUpdateUser.updateUserTitle')}</Modal.Title> {/* Tiêu đề */}
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">{t('modalUpdateUser.emailLabel')}</label> {/* Email Label */}
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                disabled
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('modalUpdateUser.passwordLabel')}</label> {/* Password Label */}
                            <input
                                type="password"
                                className="form-control"
                                value={password}
                                disabled
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('modalUpdateUser.usernameLabel')}</label> {/* Username Label */}
                            <input
                                type="text"
                                className="form-control"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('modalUpdateUser.roleLabel')}</label> {/* Role Label */}
                            <select
                                className="form-select"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}
                            >
                                <option value="USER">{t('modalUpdateUser.roleUser')}</option> {/* User Role */}
                                <option value="ADMIN">{t('modalUpdateUser.roleAdmin')}</option> {/* Admin Role */}
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label label-upload" htmlFor="labelUpload">
                                <FcPlus />{t('modalUpdateUser.uploadImage')} {/* Upload Image */}
                            </label>
                            <input
                                type="file"
                                id="labelUpload"
                                hidden
                                onChange={(event) => handleUploadImage(event)}
                            />
                        </div>
                        <div className="col-md-12 img-preview">
                            {previewImage ?
                                <img src={previewImage} alt="Preview" />
                                :
                                <span>{t('modalUpdateUser.previewImage')}</span>
                            }
                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('modalUpdateUser.close')} {/* Close Button */}
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitUser()}>
                        {t('modalUpdateUser.saveChanges')} {/* Save Changes Button */}
                    </Button>
                </Modal.Footer>
            </Modal>
        </>
    );
}

export default ModalUpdateUser;
