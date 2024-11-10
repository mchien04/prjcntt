import { useEffect, useState } from "react";
import { getHistory } from "../../services/apiService";
import moment from 'moment';

const History = (props) => {
    const [lisHistory, setListHistory] = useState([]);
    useEffect(() => {
        fetchHistory();
    }, []);
    const fetchHistory = async () => {
        let res = await getHistory();
        if (res && res.EC === 0) {
            let newData = res?.DT?.data?.map(item => {
                return {
                    total_correct: item.total_correct,
                    total_questions: item.total_questions,
                    name: item?.quizHistory?.name ?? "",
                    id: item.id,
                    date: moment(item.createAt).utc().format('DD/MM/YYYY hh:mm:ss A')
                }
            })
            if (newData.length > 7) {
                newData = newData.slice(newData.length - 7, newData.length);
            }
            setListHistory(newData);
        }
        console.log(">>> check rs:", res)
    }

    return (
        <div>
            <table className="table table-hover table-bordered">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Quiz Name</th>
                        <th>total Questions</th>
                        <th>total Correct</th>
                        <th>Date</th>
                    </tr>
                </thead>
                <tbody>
                    {lisHistory && lisHistory.length > 0 &&
                        lisHistory.map((item, index) => {
                            return (
                                <tr key={`table-users-${index}`}>
                                    <td>{item.id}</td>
                                    <td>{item.name}</td>
                                    <td>{item.total_questions}</td>
                                    <td>{item.total_correct}</td>
                                    <td>{item.date}</td>
                                </tr>
                            )
                        })
                    }
                    {lisHistory && lisHistory.length === 0 &&
                        <tr>
                            <td colSpan={'4'}>no data</td>
                        </tr>
                    }
                </tbody>
            </table>
        </div>
    );
}

export default History;
