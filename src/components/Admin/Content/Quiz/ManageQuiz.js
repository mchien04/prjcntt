import { useState } from 'react';
import './ManageQuiz.scss';
import Select from 'react-select';
import { postCreateNewQuiz } from '../../../../services/apiService';
import { toast } from 'react-toastify';
import TableQuiz from './TableQuiz';
import Accordion from 'react-bootstrap/Accordion';
import QuizQA from './QuizQA';
import AssignQuiz from './AssignQuiz';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const ManageQuiz = (props) => {
    const { t } = useTranslation(); // Khai báo t để sử dụng cho dịch

    const options = [
        { value: 'EASY', label: t('manageQuiz.easy') },
        { value: 'MEDIUM', label: t('manageQuiz.medium') },
        { value: 'HARD', label: t('manageQuiz.hard') },
    ];

    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [type, setType] = useState('EASY');
    const [image, setImage] = useState(null);

    const handleChangeFile = (event) => {
        if (event.target && event.target.files && event.target.files[0]) {
            setImage(event.target.files[0]);
        }
    }

    const handleSubmitQuiz = async () => {
        // validate
        if (!name || !description) {
            toast.error(t('manageQuiz.nameDescriptionRequired')); // Sử dụng chuỗi dịch
            return;
        }
        let res = await postCreateNewQuiz(description, name, type?.value, image);
        if (res && res.EC === 0) {
            toast.success(res.EM);
            setName('');
            setDescription('');
            setImage(null); // Muốn clear tên file phải tự customize
        } else {
            toast.error(res.EM);
        }
    }

    return (
        <div className="quiz-container">
            <Accordion defaultActiveKey="0">
                <Accordion.Item eventKey="0">
                    <Accordion.Header>{t('manageQuiz.manageQuizzes')}</Accordion.Header> {/* Tiêu đề */}
                    <Accordion.Body>
                        <div className="add-new">
                            <fieldset className="border rounded-3 p-3">
                                <legend className="float-none w-auto px-3">{t('manageQuiz.addNewQuiz')}</legend> {/* Thêm Quiz mới */}
                                <div className="form-floating mb-3">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('manageQuiz.quizNamePlaceholder')}
                                        value={name}
                                        onChange={(event) => setName(event.target.value)}
                                    />
                                    <label>{t('manageQuiz.name')}</label> {/* Tên Quiz */}
                                </div>
                                <div className="form-floating">
                                    <input
                                        type="text"
                                        className="form-control"
                                        placeholder={t('manageQuiz.quizDescriptionPlaceholder')}
                                        value={description}
                                        onChange={(event) => setDescription(event.target.value)}
                                    />
                                    <label>{t('manageQuiz.description')}</label> {/* Mô tả Quiz */}
                                </div>
                                <div className='my-3'>
                                    <Select
                                        value={type}
                                        defaultValue={type}
                                        onChange={setType}
                                        options={options}
                                        placeholder={t('manageQuiz.quizTypePlaceholder')}
                                    />
                                </div>
                                <div className='more-actions form-group'>
                                    <label className='mb-1'>{t('manageQuiz.uploadImageLabel')}</label> {/* Nút Upload hình ảnh */}
                                    <input
                                        type="file"
                                        className='form-control'
                                        onChange={(event) => handleChangeFile(event)}
                                    />
                                </div>

                                <div className='mt-3'>
                                    <button
                                        onClick={() => handleSubmitQuiz()}
                                        className='btn btn-success'>
                                        {t('manageQuiz.save')} {/* Nút lưu */}
                                    </button>
                                </div>

                            </fieldset>
                        </div>
                        <div className="list-detail">
                            <TableQuiz />
                        </div>
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="1">
                    <Accordion.Header>{t('manageQuiz.updateQuizTitle')}</Accordion.Header> {/* Cập nhật câu hỏi */}
                    <Accordion.Body>
                        <QuizQA />
                    </Accordion.Body>
                </Accordion.Item>
                <Accordion.Item eventKey="2">
                    <Accordion.Header>{t('manageQuiz.assignQuizTitle')}</Accordion.Header> {/* Gán quiz cho người dùng */}
                    <Accordion.Body>
                        <AssignQuiz />
                    </Accordion.Body>
                </Accordion.Item>
            </Accordion>
        </div>
    )
}

export default ManageQuiz;
