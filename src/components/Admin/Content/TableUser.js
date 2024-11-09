import { useTranslation } from 'react-i18next';

const TableUser = (props) => {
    const { users } = props;

    const { t } = useTranslation();

    return (
        <>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th scope="col">#No.</th>
                        <th scope="col">{t('tableuser.username')}</th>
                        <th scope="col">{t('tableuser.email')}</th>
                        <th scope="col">{t('tableuser.role')}</th>
                        <th scope="col">{t('tableuser.action')}</th>
                    </tr>
                </thead>
                <tbody>
                    {users && users.length > 0 && users.map((item, index) => {
                        return (
                            <tr key={`table-user-${index}`}>
                                <td>{index + 1}</td>
                                <td>{item.username}</td>
                                <td>{item.email}</td>
                                <td>{item.role}</td>
                                <td>
                                    <button className="btn btn-success">{t('tableuser.view')}</button>
                                    <button
                                        className="btn btn-warning mx-3"
                                        onClick={() => props.handleClickBtnUpdate(item)}
                                    >
                                        {t('tableuser.update')}
                                    </button>
                                    <button
                                        className="btn btn-danger"
                                        onClick={() => props.handleClickBtnDelete(item)}
                                    >{t('tableuser.delete')}
                                    </button>
                                </td>
                            </tr>
                        )
                    })
                    }
                    {users && users.length === 0 && <tr>
                        <td colSpan={'4'}>{t('tableuser.noData')}</td>
                    </tr>}
                </tbody>
            </table>
        </>
    )
}

export default TableUser;