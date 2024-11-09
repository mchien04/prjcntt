import React, { useState } from "react";
import { Button } from "react-bootstrap";
import { Modal } from "react-bootstrap";
import { FcPlus } from "react-icons/fc";
import { postCreateNewUser } from '../../../services/apiService'
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const ModalCreateUser = (props) => {
    const { show, setShow } = props;

    const { t } = useTranslation();

    const handleClose = () => {
        setShow(false);
        setEmail("");
        setPassword("");
        setUsername("");
        setRole("USER");
        setImage("");
        setPreviewImage("");
    }

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("USER");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        }
    }

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleSubmitUser = async () => {
        // validate
        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            toast.error(t('modalCreateUser.invalidEmail'));
            return;
        }

        if (!password) {
            toast.error(t('modalCreateUser.emptyPassword'));
            return;
        }
        //call apis
        let data = await postCreateNewUser(email, password, username, role, image)

        if (data && data.EC === 0) {
            toast.success(data.EM);
            handleClose();
            // await props.fetchUsers();
            props.setCurrentPage(1);
            await props.fetchListUsersWithPaginate(1);
        }

        if (data && data.EC != 0) {
            toast.error(data.EM);
        }
    }

    return (
        <>
            <Modal show={show}
                onHide={handleClose}
                size='xl'
                backdrop="static"
                /* Do Modal không nằm trong <div className="root"/>, nên khai báo để css cho dễ */
                className="modal-add-user"
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('modalCreateUser.addNewUser')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <form className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">{t('modalCreateUser.email')}</label>
                            <input type="email"
                                className="form-control"
                                value={email}
                                onChange={(event) => setEmail(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('modalCreateUser.password')}</label>
                            <input type="password"
                                className="form-control"
                                value={password}
                                onChange={(event) => setPassword(event.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">{t('modalCreateUser.username')}</label>
                            <input type="text"
                                className="form-control"
                                value={username}
                                onChange={(event) => setUsername(event.target.value)}
                            />
                        </div>
                        <div className="col-md-4">
                            <label className="form-label">{t('modalCreateUser.role')}</label>
                            <select className="form-select"
                                value={role}
                                onChange={(event) => setRole(event.target.value)}>
                                <option value="USER">{t('modalCreateUser.userRole')}</option>
                                <option value="ADMIN">{t('modalCreateUser.adminRole')}</option>
                            </select>
                        </div>
                        <div className="col-md-12">
                            <label className="form-label label-upload" htmlFor="labelUpload">
                                <FcPlus />{t('modalCreateUser.uploadImage')}
                            </label>
                            <input type="file"
                                id="labelUpload"
                                hidden
                                onChange={(event) => handleUploadImage(event)}
                            />
                        </div>
                        <div className="col-md-12 img-preview">
                            {previewImage ?
                                <img src={previewImage} />
                                :
                                <span>{t('modalCreateUser.previewImage')}</span>
                            }

                        </div>
                    </form>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={handleClose}>
                        {t('modalCreateUser.close')}
                    </Button>
                    <Button variant="primary" onClick={() => handleSubmitUser()}>
                        {t('modalCreateUser.saveChanges')}
                    </Button>
                </Modal.Footer>

            </Modal >
        </>
    );
}

export default ModalCreateUser