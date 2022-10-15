const express = require('express');

function questionRoutes(QuestionService) {
    const router = express.Router();



    router.get("/", async (req, res) => {
        try {
            const questions = await QuestionService.getQuestions();
            res.status(200).json({
                success: true,
                questions: questions
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });


    router.get("/:id", async (req, res) => {
        try {
            const question = await QuestionService.getQuestionById(req.params.id);

            if (question) {
                res.status(200).json({
                    success: true,
                    question: question
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Question not found"
                });
            }


        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });

    router.delete("/:id", async (req, res) => {
        try {
            const question = await QuestionService.deleteQuestion(req.params.id);

            res.status(200).json({
                success: true,
                question: question
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });


    router.get("/category/:category", async (req, res) => {
        try {
            // console.log("Category param: ", req.params.category)
            const questions = await QuestionService.getQuestionsByCategory(req.params.category);

            if(questions){
                res.status(200).json({
                    success: true,
                    question: questions
                });
            }else{
                res.status(400).json({
                    success: false,
                    message: "Questions not found"
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });


    router.get("/category/:category/game", async (req, res) => {
        try {
            // console.log("Category param: ", req.params.category)
            const questions = await QuestionService.getQuestionsByCategoryForGame(req.params.category, 2);

            if(QuestionService){
                res.status(200).json({
                    success: true,
                    question: questions
                });
            }else{
                res.status(400).json({
                    success: false,
                    message: "Questions not found"
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error
            });
        }

    });



    router.post("/", async (req, res) => {
        try {
            const { question, category, answers } = req.body;
            const questionData = {
                question, category, answers
            }
            const questions = await QuestionService.addQuestion(questionData);
            res.status(200).json({
                success: true,
                questions: questions
            });

        } catch (error) {
            console.log("Error in questions: ", error)
            res.status(500).json({
                success: false,
                message: "Error in question add"
            });
        }

    });

    router.patch("/:id", async (req, res) => {
        try {
            const { question, category, answers } = req.body;
            const questionData = {
                question, category, answers
            }
            const updatedQuestion = await QuestionService.updateQuestion(req.params.id, questionData);
            res.status(200).json({
                success: true,
                question: updatedQuestion
            });

        } catch (error) {
            console.log("Error in questions: ", error)
            res.status(500).json({
                success: false,
                message: "Error in question add"
            });
        }

    });

    return router;
}

module.exports.questionRoutes = questionRoutes;