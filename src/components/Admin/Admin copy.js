import SideBar from "./SideBar";
import './Admin.scss';
import { FaBars } from 'react-icons/fa';
import { useState } from "react";
import { Outlet } from "react-router-dom";
import 'react-toastify/dist/ReactToastify.css';
import PerfectScrollbar from 'react-perfect-scrollbar';
import Language from "../Header/Language";
import { NavDropdown } from "react-bootstrap";
import { logout } from "../../services/apiService";
import { toast } from 'react-toastify';
import { doLogout } from '../../redux/action/userAction';
import { useDispatch, useSelector } from 'react-redux';
import { NavLink, useNavigate } from "react-router-dom";
import { useTranslation } from 'react-i18next';

const Admin = (props) => {
    const [collapsed, setCollapsed] = useState(false);

    const isAuthenticated = useSelector(state => state.user.isAuthenticated)
    const account = useSelector(state => state.user.account)
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogOut = async () => {
        let res = await logout(account.email, account.refresh_token);
        if (res && res.EC === 0) {
            //clear data redux
            dispatch(doLogout());
            navigate('/login');
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <>
            <div className="admin-container">
                <div className="admin-sidebar">
                    <SideBar collapsed={collapsed} />
                </div>
                <div className="admin-content">
                    <div className="admin-header">
                        <span onClick={() => setCollapsed(!collapsed)}><FaBars className="left-side" /></span>

                        <div className="right-side">

                            <NavDropdown title={t('admin.settings')} id="basic-nav-dropdown">
                                <NavDropdown.Item onClick={() => setIsShowModalProfile(true)}>{t('admin.profile')}</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleLogOut()}>{t('admin.logout')}</NavDropdown.Item>
                                <NavDropdown.Divider />
                            </NavDropdown>
                            <Language />
                        </div>
                        <Profile
                            show={isShowModalProfile}
                            setShow={setIsShowModalProfile}
                        />
                    </div>
                    <div className="admin-main">
                        <PerfectScrollbar>
                            <Outlet />
                        </PerfectScrollbar>
                    </div>
                </div>
            </div>
        </>
    )
}
export default Admin;