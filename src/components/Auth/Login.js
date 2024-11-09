import { useState } from 'react';
import './Login.scss';
import { useNavigate } from 'react-router-dom';
import { postLogin } from '../../services/apiService';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { doLogin } from '../../redux/action/userAction';
import { CgSpinner } from "react-icons/cg";
import Language from '../Header/Language';
import { useTranslation, Trans } from 'react-i18next';

const Login = (props) => {
    const { t } = useTranslation();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [isLoading, setIsLoading] = useState(false);

    const validateEmail = (email) => {
        return String(email)
            .toLowerCase()
            .match(
                /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|.(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
            );
    };

    const handleLogin = async () => {
        const isValidEmail = validateEmail(email);

        if (!isValidEmail) {
            toast.error(t('login.invalidEmail'));
            return;
        }

        if (!password) {
            toast.error(t('login.emptyPassword'));
            return;
        }
        setIsLoading(true);

        let response = await postLogin(email, password);

        if (response && response.EC === 0) {
            dispatch(doLogin(response));
            toast.success(response.EM);
            setIsLoading(false);
            navigate('/');
        }

        if (response && +response.EC !== 0) {
            toast.error(response.EM);
            setIsLoading(false);
        }

    };

    const handleKeyDown = (event) => {
        if (event && event.key === 'Enter') {
            handleLogin();
        }
    };

    return (
        <div className="login-container">
            <div className='header'>
                <span>{t('login.noAccount')}</span>
                <button onClick={() => navigate('/register')}>{t('login.signUp')}</button>
                <Language />
            </div>
            <div className='title col-4 mx-auto'>
                {t('login.title')}
            </div>
            <div className='welcome col-4 mx-auto'>
                {t('login.welcome')}
            </div>
            <div className='content col-4 mx-auto'>
                <div className='form-group'>
                    <label>{t('login.emailLabel')}</label>
                    <input
                        type='email'
                        className='form-control'
                        value={email}
                        onChange={(event) => setEmail(event.target.value)}
                    />
                    <label>{t('login.passwordLabel')}</label>
                    <input
                        type='password'
                        className='form-control'
                        value={password}
                        onChange={(event) => setPassword(event.target.value)}
                        onKeyDown={(event) => handleKeyDown(event)}
                    />
                </div>
                <span className='forgot-password'>{t('login.forgotPassword')}</span>
                <div>
                    <button
                        className='btn-submit'
                        onClick={() => handleLogin()}
                        disabled={isLoading}
                    >
                        {isLoading && <CgSpinner className='loader-icon' />}
                        <span> {t('login.loginButton')}</span>
                    </button>
                </div>
                <div className='text-center'>
                    <span className="back" onClick={() => navigate('/')}>
                        &#60;&#60; {t('login.backToHomepage')}
                    </span>
                </div>
            </div>
        </div>
    );
};

export default Login;
