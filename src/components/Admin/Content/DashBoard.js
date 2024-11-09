import './Dashboard.scss';
import { ResponsiveContainer, BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import { getOverview } from '../../../services/apiService';
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

const DashBoard = (props) => {
    const [dataOverview, setDataOverview] = useState([]);
    const [dataChart, setDataChart] = useState([]);
    const { t } = useTranslation();

    useEffect(() => {
        fetchDataOverview();
    }, []);
    const fetchDataOverview = async () => {
        let res = await getOverview();
        if (res && res.EC == 0) {
            setDataOverview(res.DT);
            // process chart data
            let Qz = 0, Qs = 0, As = 0;
            Qz = res?.DT?.others?.countQuiz ?? 0;
            Qs = res?.DT?.others?.countQuestions ?? 0;
            As = res?.DT?.others?.countAnswers ?? 0;

            const data = [
                { name: t('dashboard.quizzes'), "Qz": Qz },
                { name: t('dashboard.questions'), "Qs": Qs },
                { name: t('dashboard.answers'), "As": As },
            ]
            setDataChart(data);
        }
    }

    return (
        <div className="dashboard-container">
            <div className="title">{t('dashboard.analytics')}</div>
            <div className="content">
                <div className='content-left'>
                    <div className='left-child left-child-total-users'>
                        <span className='text-1'>{t('dashboard.totalUsers')}</span>
                        <span className='text-2'>
                            {dataOverview && dataOverview.users && dataOverview.users.total ?
                                <>{dataOverview.users.total}</>
                                :
                                <>0</>
                            }
                        </span>
                    </div>
                    <div className='left-child left-child-total-quizzes'>
                        <span className='text-1'>{t('dashboard.totalQuizzes')}</span>
                        <span className='text-2'>
                            {dataOverview && dataOverview.others && dataOverview.others.countQuiz ?
                                <>{dataOverview.others.countQuiz}</>
                                :
                                <>0</>
                            }
                        </span>
                    </div>
                    <div className='left-child left-child-total-questions'>
                        <span className='text-1'>{t('dashboard.totalQuestions')}</span>
                        <span className='text-2'>
                            {dataOverview && dataOverview.others && dataOverview.others.countQuestions ?
                                <>{dataOverview.others.countQuestions}</>
                                :
                                <>0</>
                            }
                        </span>
                    </div>
                    <div className='left-child left-child-total-answers'>
                        <span className='text-1'>{t('dashboard.totalAnswers')}</span>
                        <span className='text-2'>
                            {dataOverview && dataOverview.others && dataOverview.others.countAnswers ?
                                <>{dataOverview.others.countAnswers}</>
                                :
                                <>0</>
                            }
                        </span>
                    </div>
                </div>
                <div className='content-right'>
                    <ResponsiveContainer width="85%" height="100%">
                        <BarChart data={dataChart}>
                            {/* <CartesianGrid strokeDasharray="3 3" /> */}
                            <XAxis dataKey="name" />
                            {/* <YAxis /> */}
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="Qz" fill="#800080" />
                            <Bar dataKey="Qs" fill="#301934" />
                            <Bar dataKey="As" fill="#F28C28" />
                        </BarChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    )
}

export default DashBoard