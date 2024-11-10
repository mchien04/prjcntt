import Container from 'react-bootstrap/Container';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { logout } from '../../services/apiService';
import { toast } from 'react-toastify';
import { doLogout } from '../../redux/action/userAction';
import './Header.scss';
import Font, { Text } from 'react-font';
import Language from './Language';  // Giữ nguyên phần này để hỗ trợ chuyển đổi ngôn ngữ
import { SiReactos } from "react-icons/si";
import { useTranslation } from 'react-i18next';  // Import useTranslation từ react-i18next
import { useState } from 'react';
import Profile from './Profile';

const Header = () => {
    const { t } = useTranslation();  // Lấy hàm t() từ useTranslation để sử dụng các chuỗi đa ngôn ngữ
    const isAuthenticated = useSelector(state => state.user.isAuthenticated);
    const account = useSelector(state => state.user.account);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const userRole = account?.role;  // Lấy vai trò của người dùng
    const [isShowModalProfile, setIsShowModalProfile] = useState(false);


    const handleLogOut = async () => {
        let res = await logout(account.email, account.refresh_token);
        if (res && res.EC === 0) {
            // Clear data Redux và điều hướng đến trang đăng nhập
            dispatch(doLogout());
            navigate('/login');
        } else {
            toast.error(res.EM);
        }
    }

    const handleLogin = () => {
        navigate('/login');
    }

    const handleRegister = () => {
        navigate('/register');
    }

    return (
        <>
            <Navbar expand="lg" className="bg-body-tertiary">
                <Container>
                    <SiReactos className='logo' />
                    <NavLink to="/" className='navbar-brand'>
                        <Font family='Rubik Bubbles'>
                            <p className='logo-content'>EasyQuiz</p>
                        </Font>
                    </NavLink>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                        <Nav className="me-auto">
                            <NavLink to="/" className='nav-link'>{t('header.home')}</NavLink>

                            {/* Chỉ hiển thị liên kết "user" khi đã đăng nhập */}
                            {isAuthenticated && (
                                <NavLink to="/users" className='nav-link'>{t('header.user')}</NavLink>
                            )}

                            {/* Hiển thị liên kết "admin" chỉ khi người dùng có vai trò là "ADMIN" */}
                            {userRole === 'ADMIN' && (
                                <NavLink to="/admins" className='nav-link'>{t('header.admin')}</NavLink>
                            )}
                        </Nav>

                        <Nav>
                            {/* Hiển thị nút login và register khi chưa đăng nhập */}
                            {!isAuthenticated ? (
                                <>
                                    <button className='btn-login' onClick={handleLogin}>{t('header.logIn')}</button>
                                    <button className='btn-signup' onClick={handleRegister}>{t('header.signUp')}</button>
                                </>
                            ) : (
                                // Hiển thị phần cài đặt và đăng xuất khi đã đăng nhập
                                <NavDropdown title={t('header.settings')} id="basic-nav-dropdown">
                                    {/* <NavDropdown.Item>{t('header.profile')}</NavDropdown.Item> */}
                                    <NavDropdown.Item onClick={() => setIsShowModalProfile(true)}>{t('header.profile')}</NavDropdown.Item>
                                    <NavDropdown.Item onClick={handleLogOut}>{t('header.logOut')}</NavDropdown.Item>
                                    <NavDropdown.Divider />
                                </NavDropdown>
                            )}
                            <Language />
                        </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
            <Profile
                show={isShowModalProfile}
                setShow={setIsShowModalProfile}
            />
        </>
    );
}

export default Header;
