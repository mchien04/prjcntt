// Password.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { postChangePassword } from '../../services/apiService';
import { useTranslation } from 'react-i18next';

const Password = (props) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');
    const { t } = useTranslation();

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error(t('password.errorPasswordMismatch'));
            return;
        }

        let data = await postChangePassword(currentPassword, newPassword);

        if (data && data.EC === 0) {
            toast.success(data.EM);
            setCurrentPassword('');
            setNewPassword('');
            setConfirmNewPassword('');
        }
        if (data && data.EC !== 0) {
            toast.error(data.EM);
        }

    };

    return (
        <div className="password-container">
            <div className="form-group">
                <label>{t('password.currentPasswordLabel')}</label>
                <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder={t('password.currentPasswordPlaceholder')}
                />
            </div>
            <div className="form-group">
                <label>{t('password.newPasswordLabel')}</label>
                <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder={t('password.newPasswordPlaceholder')}
                />
            </div>
            <div className="form-group">
                <label>{t('password.confirmNewPasswordLabel')}</label>
                <input
                    type="password"
                    className="form-control"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder={t('password.confirmNewPasswordPlaceholder')}
                />
            </div>
            <button className="btn btn-primary mt-3" onClick={handlePasswordChange}>
                {t('password.submitButton')}
            </button>
        </div>
    );
};

export default Password;
