import React, { useEffect } from 'react';
import { useState } from 'react';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { useDispatch, useSelector } from 'react-redux';
import _ from 'lodash';
import { FcPlus } from 'react-icons/fc';
import { postUpdateProfile, putUpdateUser } from '../../services/apiService';

const UserInfor = (props) => {
    const account = useSelector(state => state.user.account);

    const { t } = useTranslation();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [role, setRole] = useState("USER");
    const [image, setImage] = useState("");
    const [previewImage, setPreviewImage] = useState("");

    useEffect(() => {
        if (account && !_.isEmpty(account)) {
            setEmail(account.email);
            setUsername(account.username);
            setRole(account.role);
            setImage("");
            if (account.image) {
                setPreviewImage(`data:image/jpeg;base64,${account.image}`)
            }
        }
    }, [account])

    const handleUploadImage = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setPreviewImage(URL.createObjectURL(event.target.files[0]));
            setImage(event.target.files[0]);
        } else {

        }
    }
    const handleSubmitProfile = async () => {
        let data = await postUpdateProfile(username, image);

        if (data && data.EC === 0) {
            toast.success(data.EM);
        }

        if (data && data.EC !== 0) {
            toast.error(data.EM);
        }
    }

    return (
        <div className='user-infor-container'>
            <div className="row g-3">
                <div className="col-md-4">
                    <label className="form-label">{t('userInfo.usernameLabel')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div className="col-md-4">
                    <label className="form-label">{t('userInfo.emailLabel')}</label>
                    <input
                        disabled
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>

                <div className="col-md-4">
                    <label className="form-label">
                        {t('userInfo.roleLabel')}
                    </label>
                    <select className="form-select"
                        onChange={(event) => setRole(event.target.value)}
                        value={role}
                        disabled
                    >
                        <option value="USER">{t('userInfo.roleUser')}</option>
                        <option value="ADMIN">{t('userInfo.roleAdmin')}</option>
                    </select>
                </div>

                <div className="col-md-12">
                    <label className="form-label label-upload" htmlFor="labelUpload">
                        <FcPlus />
                        {t('userInfo.uploadImage')}
                    </label>
                    <input
                        type="file"
                        id="labelUpload" hidden
                        onChange={(event) => handleUploadImage(event)}
                    />
                </div>

                <div className="col-md-12 img-preview">
                    {previewImage ?
                        <img src={previewImage} alt="Preview" />
                        :
                        <span>
                            {t('userInfo.previewImage')}
                        </span>
                    }
                </div>
                <div className='mt-3'>
                    <button className="btn btn-primary mt-3" onClick={() => handleSubmitProfile()}>
                        {t('userInfo.updateButton')}
                    </button>
                </div>
            </div>
        </div>
    );
}

export default UserInfor;
