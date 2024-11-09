import { useEffect, useState } from 'react';
import Select from 'react-select';
import './QuizQA.scss';
import { FcFullTrash } from "react-icons/fc";
import { FaPlusSquare, FaMinusSquare } from "react-icons/fa";
import { RiImageAddFill } from "react-icons/ri";
import { IoIosCreate } from "react-icons/io";
import { v4 as uuidv4 } from 'uuid';
import _ from 'lodash';
import Lightbox from "react-awesome-lightbox";
import {
    getAllQuizForAdmin,
    getQuizWithQA,
    postUpsertQA
} from "../../../../services/apiService";
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next'; // Import useTranslation

const QuizQA = (props) => {
    const { t } = useTranslation(); // Khai báo t để sử dụng cho dịch

    const initQuestions = [{
        id: uuidv4(),
        description: '',
        imageFile: '',
        imageName: '',
        answers: [
            { id: uuidv4(), description: '', isCorrect: false }
        ]
    }];

    const [questions, setQuestions] = useState(initQuestions);

    const [isPreviewImage, setIsPreviewImage] = useState(false);
    const [dataImagePreview, setDataImagePreview] = useState({
        title: '',
        url: ''
    })

    const [listQuiz, setListQuiz] = useState([]);
    const [selectedQuiz, setSelectedQuiz] = useState({});

    useEffect(() => {
        fetchQuiz();
    }, [])

    const fetchQuiz = async () => {
        let res = await getAllQuizForAdmin();
        if (res && res.EC === 0) {
            let newQuiz = res.DT.map(item => {
                return {
                    value: item.id,
                    label: `${item.id} - ${item.description}`
                }
            })
            setListQuiz(newQuiz);
        }
    }

    useEffect(() => {
        if (selectedQuiz && selectedQuiz.value) {
            fetchQuizWithQA();
        }
    }, [selectedQuiz])

    const urltoFile = (url, filename, mimeType) => {
        return fetch(url)
            .then(res => res.arrayBuffer())
            .then(buf => new File([buf], filename, { type: mimeType }));
    }

    const fetchQuizWithQA = async () => {
        let res = await getQuizWithQA(selectedQuiz.value);
        if (res && res.EC === 0) {
            let newQA = [];
            for (let i = 0; i < res.DT.qa.length; i++) {
                let q = res.DT.qa[i];
                if (q.imageFile) {
                    q.imageName = `Question-${q.id}.png`;
                    q.imageFile =
                        await urltoFile(`data:image/png;base64,${q.imageFile}`, `Question-${q.id}.png`, 'image/png')
                }
                newQA.push(q);
            }
            setQuestions(newQA);
        }
    }

    const handleAddRemoveQuestion = (type, id) => {
        if (type === 'ADD') {
            const newQuestion = {
                id: uuidv4(),
                description: '',
                imageFile: '',
                imageName: '',
                answers: [
                    { id: uuidv4(), description: '', isCorrect: false }
                ]
            };

            setQuestions([...questions, newQuestion]);
        }

        if (type === 'REMOVE') {
            let questionsClone = _.cloneDeep(questions);
            questionsClone = questionsClone.filter(item => item.id !== id);
            setQuestions(questionsClone)
        }
    }

    const handleAddRemoveAnswer = (type, questionId, answerId) => {
        let questionsClone = _.cloneDeep(questions);

        if (type === 'ADD') {
            const newAnswer = {
                id: uuidv4(),
                description: '',
                isCorrect: false
            };

            let index = questionsClone.findIndex(item => item.id === questionId);
            questionsClone[index].answers.push(newAnswer);
            setQuestions(questionsClone);
        }

        if (type === 'REMOVE') {
            let index = questionsClone.findIndex(item => item.id === questionId);
            questionsClone[index].answers = questionsClone[index].answers.filter(item => item.id !== answerId);
            setQuestions(questionsClone);
        }
    }

    const handleOnChange = (type, questionId, value) => {
        if (type === 'QUESTION') {
            let questionsClone = _.cloneDeep(questions);
            let index = questionsClone.findIndex(item => item.id === questionId);
            if (index > -1) {
                questionsClone[index].description = value;
                setQuestions(questionsClone);
            }
        }
    }

    const handleOnChangeFileQuestion = (questionId, event) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1 && event.target && event.target.files && event.target.files[0]) {
            questionsClone[index].imageFile = event.target.files[0];
            questionsClone[index].imageName = event.target.files[0].name;
            setQuestions(questionsClone);
        }
    }

    const handleAnswerQuestion = (type, answerId, questionId, value) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            questionsClone[index].answers
                = questionsClone[index].answers.map(answer => {
                    if (answer.id === answerId) {

                        if (type === 'CHECKBOX') {
                            answer.isCorrect = value;
                        }

                        if (type === 'INPUT') {
                            answer.description = value;
                        }
                    }
                    return answer;
                })

            setQuestions(questionsClone);
        }
    }

    const toBase64 = file => new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
    });

    const handleSubmitQuestionForQuiz = async () => {

        if (_.isEmpty(selectedQuiz)) {
            toast.error(t("quizQA.chooseQuiz"));
            return;
        }

        let isValidAns = true;
        let indexQuestion = 0, indexAnswer = 0;
        for (let i = 0; i < questions.length; i++) {
            indexQuestion = i;
            for (let j = 0; j < questions[i].answers.length; j++) {
                if (!questions[i].answers[j].description) {
                    isValidAns = false;
                    indexAnswer = j;
                    break;
                }
            }
            if (!isValidAns) break;
        }

        if (!isValidAns) {
            toast.error(t("quizQA.emptyAnswer", { answer: indexAnswer + 1, question: indexQuestion + 1 }))
        }

        let isValidQuest = true;
        let indexQuest = 0;
        for (let i = 0; i < questions.length; i++) {
            if (!questions[i].description) {
                isValidQuest = false;
                indexQuest = i;
                break;
            }
        }

        if (!isValidQuest) {
            toast.error(t("quizQA.emptyQuestion", { question: indexQuest + 1 }))
        }

        let questionClone = _.cloneDeep(questions);
        for (let i = 0; i < questionClone.length; i++) {
            if (questionClone[i].imageFile) {
                questionClone[i].imageFile = await toBase64(questionClone[i].imageFile)
            }
        }
        let res = await postUpsertQA({
            quizId: selectedQuiz.value,
            questions: questionClone
        });

        if (res && res.EC === 0) {
            toast.success(res.EM)
            fetchQuiz();
        }
        setQuestions(initQuestions);
    }

    const handlePreviewImage = (questionId) => {
        let questionsClone = _.cloneDeep(questions);
        let index = questionsClone.findIndex(item => item.id === questionId);
        if (index > -1) {
            setDataImagePreview({
                url: URL.createObjectURL(questionsClone[index].imageFile),
                title: questionsClone[index].imageName
            });
            setIsPreviewImage(true);
        }
    }

    return (
        <div className="questions-container">
            <div className="add-new-question">
                <div className='col-6 form-group'>
                    <label className='mb-2'>{t('quizQA.selectQuiz')}:</label>
                    <Select
                        value={selectedQuiz}
                        onChange={setSelectedQuiz}
                        options={listQuiz}
                    />
                </div>
                <div className='mt-3 mb-2'>
                    {t('quizQA.addQuestions')}:
                </div>
                {
                    questions && questions.length > 0
                    && questions.map((question, index) => {
                        return (
                            <div key={question.id} className='q-main mb-4'>
                                <div className='questions-content'>
                                    <div className="form-floating description">
                                        <input
                                            type="type"
                                            className="form-control"
                                            placeholder={t('quizQA.placeholder')}
                                            value={question.description}
                                            onChange={(event) => handleOnChange('QUESTION', question.id, event.target.value)}
                                        />
                                        <label>{t('quizQA.questionDescription', { index: index + 1 })}</label>
                                    </div>
                                    <div className='group-upload'>
                                        <label htmlFor={`${question.id}`}>
                                            <RiImageAddFill className='label-upload' />
                                        </label>
                                        <input
                                            id={`${question.id}`}
                                            onChange={(event) => handleOnChangeFileQuestion(question.id, event)}
                                            type={'file'}
                                            hidden
                                        />
                                        <span style={{ cursor: 'pointer' }}> {question.imageName ?
                                            <span
                                                onClick={() => handlePreviewImage(question.id)}>
                                                {question.imageName}
                                            </span> : t('quizQA.noFileUploaded')}
                                        </span>
                                    </div>
                                    <div className='btn-group'>
                                        <span onClick={() => handleAddRemoveQuestion('ADD', '')}>
                                            <IoIosCreate className='icon-add' />
                                        </span>
                                        {
                                            questions.length > 1 &&
                                            <span onClick={() => handleAddRemoveQuestion('REMOVE', question.id)}>
                                                <FcFullTrash className='icon-trash' />
                                            </span>
                                        }
                                    </div>
                                </div>
                                {question.answers && question.answers.length > 0
                                    && question.answers.map((answer, index) => {
                                        return (
                                            <div key={answer.id} className='answers-content'>
                                                <input
                                                    className="form-check-input isCorrect"
                                                    type="checkbox"
                                                    checked={answer.isCorrect}
                                                    onChange={(event) => handleAnswerQuestion('CHECKBOX', answer.id, question.id, event.target.checked)}
                                                />
                                                <div className="form-floating answer-text">
                                                    <input
                                                        type="type"
                                                        className="form-control"
                                                        placeholder={t('quizQA.answerPlaceholder')}
                                                        value={answer.description}
                                                        onChange={(event) => handleAnswerQuestion('INPUT', answer.id, question.id, event.target.value)}
                                                    />
                                                    <label>{t('quizQA.answer', { index: index + 1 })}</label>
                                                </div>
                                                <div className='btn-group'>
                                                    <span onClick={() => handleAddRemoveAnswer('ADD', question.id)}>
                                                        <FaPlusSquare className='icon-add' />
                                                    </span>
                                                    {
                                                        question.answers.length > 1 &&
                                                        <span onClick={() => handleAddRemoveAnswer('REMOVE', question.id, answer.id)}>
                                                            <FaMinusSquare className='icon-remove' />
                                                        </span>
                                                    }
                                                </div>
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        )
                    })
                }

                {
                    questions && questions.length > 0 &&
                    <div>
                        <button onClick={() => handleSubmitQuestionForQuiz()} className='btn btn-warning'>{t('quizQA.saveQuestions')}</button>
                    </div>
                }

                {isPreviewImage === true &&
                    <Lightbox
                        image={dataImagePreview.url}
                        title={dataImagePreview.title}
                        onClose={() => setIsPreviewImage(false)}
                    >
                    </Lightbox>
                }
            </div>
        </div>
    )
}
export default QuizQA;
