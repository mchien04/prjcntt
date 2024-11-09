import 'react-pro-sidebar/dist/css/styles.css';
import {
    ProSidebar,
    Menu,
    MenuItem,
    SubMenu,
    SidebarHeader,
    SidebarFooter,
    SidebarContent,
} from 'react-pro-sidebar';

import { FaTachometerAlt, FaGem, FaList, FaGithub, FaRegLaughWink, FaHeart, FaReact } from 'react-icons/fa';
import sidebarBg from '../../assets/bg2.jpg';
import { GiCheeseWedge } from "react-icons/gi";
import { MdDashboard } from "react-icons/md";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const SideBar = (props) => {
    const { image, collapsed, toggled, handleToggleSidebar } = props;
    const navigate = useNavigate();
    const { t } = useTranslation();

    return (
        <>
            <ProSidebar
                image={sidebarBg}
                collapsed={collapsed}
                toggled={toggled}
                breakPoint="md"
                onToggle={handleToggleSidebar}
            >
                <SidebarHeader>
                    <div
                        style={{
                            padding: '24px',
                            textTransform: 'uppercase',
                            fontWeight: 'bold',
                            fontSize: 14,
                            letterSpacing: '1px',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                        }}
                    >
                        <FaReact size={'3em'} color={"#4AD5FF"} />
                        <span onClick={() => navigate('/')}> {t('sidebar.menu')}</span>
                    </div>
                </SidebarHeader>

                <SidebarContent>
                    <Menu iconShape="circle">
                        <MenuItem icon={<MdDashboard />}>
                            {t('sidebar.dashboard')}
                            <Link to="/admins" />
                        </MenuItem>
                    </Menu>
                    <Menu iconShape="circle">
                        <SubMenu
                            icon={<FaGem />}
                            title={t('sidebar.features')}
                        >
                            <MenuItem>
                                {t('sidebar.manageUsers')}
                                <Link to="/admins/manage-users" />
                            </MenuItem>
                            <MenuItem>
                                {t('sidebar.manageQuizzes')}
                                <Link to="/admins/manage-quizzes" />
                            </MenuItem>
                            <MenuItem>
                                {t('sidebar.manageQuestions')}
                                <Link to="/admins/manage-questions" />
                            </MenuItem>
                        </SubMenu>

                    </Menu>
                </SidebarContent>

                <SidebarFooter style={{ textAlign: 'center' }}>
                    <div
                        className="sidebar-btn-wrapper"
                        style={{
                            padding: '20px 24px',
                        }}
                    >
                        <a
                            href="https://github.com/lightningflashh"
                            target="_blank"
                            className="sidebar-btn"
                            rel="noopener noreferrer"
                        >
                            <FaGithub />
                            <span style={{ whiteSpace: 'nowrap', textOverflow: 'ellipsis', overflow: 'hidden' }} />
                        </a>
                    </div>
                </SidebarFooter>
            </ProSidebar>
        </>
    )
}

export default SideBar;