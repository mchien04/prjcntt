import { useState } from 'react';
import './Register.scss';
import { useNavigate } from 'react-router-dom';
import { postRegister } from '../../services/apiService';
import { toast } from 'react-toastify';
import { VscEye, VscEyeClosed } from "react-icons/vsc";
import Language from '../Header/Language';
import { useTranslation, Trans } from 'react-i18next';


const Register = (props) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [username, setUsername] = useState("");
    const [isShowPassword, setIsShowPassword] = useState(false);
    const navigate = useNavigate();

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleRegister = async () => {
        const isValidEmail = validateEmail(email);
        if (!isValidEmail) {
            toast.error(t('register.invalidEmail'));
            return;
        }

        if (!password) {
            toast.error(t('register.invalidPassword'));
            return;
        }

        let data = await postRegister(email, username, password);
        if (data && data.EC === 0) {
            toast.success(data.EM);
            navigate('/login');
        }

        if (data && +data.EC !== 0) {
            toast.error(data.EM);
        }
    };

    return (
        <div className="register-container">
            <div className='header'>
                <span>{t('register.hasAccount')}</span>
                <button onClick={() => navigate('/login')}>{t('register.logIn')}</button>
                <Language />
            </div>
            <div className='title col-4 mx-auto'>
                {t('register.title')}
            </div>
            <div className='welcome col-4 mx-auto'>
                {t('register.welcome')}
            </div>
            <div className='content-form col-4 mx-auto'>
                <div className='form-group'>
                    <label>{t('register.emailLabel')}</label>
                    <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                </div>
                <div className='form-group pass-group'>
                    <label>{t('register.passwordLabel')}</label>
                    <input
                        type={isShowPassword ? "text" : "password"}
                        className="form-control"
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                    />
                    {isShowPassword ?
                        <span className="icons-eye" onClick={() => setIsShowPassword(false)}>
                            <VscEye />
                        </span> :
                        <span className="icons-eye" onClick={() => setIsShowPassword(true)}>
                            <VscEyeClosed />
                        </span>
                    }
                </div>
                <div className='form-group'>
                    <label>{t('register.usernameLabel')}</label>
                    <input
                        type="text"
                        className="form-control"
                        value={username}
                        onChange={(event) => setUsername(event.target.value)}
                    />
                </div>
                <div>
                    <button className='btn-submit' onClick={() => handleRegister()}>
                        {t('register.submitButton')}
                    </button>
                </div>
                <div className='text-center'>
                    <span className="back" onClick={() => navigate('/')}>
                        &#60;&#60; {t('register.backToHomepage')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Register;
