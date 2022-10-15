

const addQuestion = (Question) => (data) => {
    const newQuestion = new Question(data)

    return newQuestion.save()
}

const deleteQuestion = (Question) => (id) => {
    const question = Question.findByIdAndDelete(id)

    return question;
}


const updateQuestion = (Question) => (id, { question, category, answers }) => {

    const updatedQuestion = Question.findByIdAndUpdate(id, { question, category, answers }, {
        new: true,
    });

    return updatedQuestion
}


const getQuestions = (Question) => () => {
    const questions = Question.find();

    return questions;
}

const getQuestionsByCategory = (Question) => ({ category, queryLimit = 0 }) => {
    const questions = null;

    if (limit > 0)
        questions = Question.find({ category: category }).limit(queryLimit);
    else
        questions = Question.find({ category: category });

    return questions;
}

const getQuestionById = (Question) => (id) => {

    const question = Question.findById(id);

    return question;
}

module.exports = (Question) => {
    return {

        addQuestion: addQuestion(Question),
        deleteQuestion: deleteQuestion(Question),
        updateQuestion: updateQuestion(Question),
        getQuestionById: getQuestionById(Question),
        getQuestions: getQuestions(Question),
        getQuestionsByCategory: getQuestionsByCategory(Question)
        
    }
}