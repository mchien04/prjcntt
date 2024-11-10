import React, { useState } from 'react';
import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Tabs, Tab } from 'react-bootstrap';
import UserInfor from './UserInfor';
import Password from './Password';
import History from './History';

const Profile = (props) => {
    const { t } = useTranslation();

    const { show, setShow } = props;

    const handleClose = () => {
        setShow(false)

    };

    return (
        <>

            <Modal
                show={show}
                onHide={handleClose}
                size='xl'
                backdrop="static"
                className='modal-profile'
            >
                <Modal.Header closeButton>
                    <Modal.Title>{t('profile.title')}</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Tabs
                        defaultActiveKey="profile"
                        id="uncontrolled-tab-example"
                        className="mb-3"
                    >
                        <Tab eventKey="profile" title={t('profile.tabs.userInfo')}>
                            <UserInfor />
                        </Tab>
                        <Tab eventKey="password" title={t('profile.tabs.changePassword')}>
                            <Password />
                        </Tab>
                        <Tab eventKey="history" title={t('profile.tabs.history')}>
                            <History />
                        </Tab>
                    </Tabs>
                </Modal.Body>
            </Modal>
        </>
    );
}

export default Profile;