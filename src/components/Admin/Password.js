// Password.js
import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { postChangePassword } from '../../services/apiService';

const Password = (props) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmNewPassword, setConfirmNewPassword] = useState('');

    const handlePasswordChange = async () => {
        if (newPassword !== confirmNewPassword) {
            toast.error("Mật khẩu mới và xác nhận mật khẩu không trùng khớp");
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
                <label>Mật khẩu hiện tại</label>
                <input
                    type="password"
                    className="form-control"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Nhập mật khẩu hiện tại"
                />
            </div>
            <div className="form-group">
                <label>Mật khẩu mới</label>
                <input
                    type="password"
                    className="form-control"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Nhập mật khẩu mới"
                />
            </div>
            <div className="form-group">
                <label>Xác nhận mật khẩu mới</label>
                <input
                    type="password"
                    className="form-control"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    placeholder="Nhập lại mật khẩu mới"
                />
            </div>
            <button className="btn btn-primary mt-3" onClick={handlePasswordChange}>
                Xác nhận thay đổi
            </button>
        </div>
    );
};

export default Password;
