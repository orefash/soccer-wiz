const express = require('express');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');
const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');

function questionRoutes(QuestionService) {
    const router = express.Router();

    router.get("/",requireAdminJwtAuth, async (req, res) => {
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



    router.delete("/", async (req, res) => {
        try {
            const question = await QuestionService.deleteAllQuestions();

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

            if (questions) {
                res.status(200).json({
                    success: true,
                    question: questions
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Questions not found"
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.get("/game/user/:userId",requireJwtAuth, async (req, res) => {
        try {

            let userId = req.params.userId;
            let category = req.query.category;
            let demo = req.query.demo;

            // console.log(`u: ${userId} :  c:  ${category}  :  d:  ${demo}`)

            // const { demo, category, userId } = req.body;

            if ( !demo || !category || !userId ){ 
                throw new Error("Incomplete Request details")
            }

            if(demo.toLocaleLowerCase() !== 'true' && demo.toLocaleLowerCase() !== 'false' ) {
                throw new Error("Demo field invalid")
            }

            demo = demo === 'true'? true : false;

            // console.log('DemoL : ', demo)

            if (demo && category !== 'demo' ) {
                throw Error("Demo field not set")
            }

            const questionData = {
                demo, category, userId, date: new Date()
            }

            const data = await QuestionService.getQuestionsForGame(questionData);

            if (data) {
                res.status(200).json({
                    success: !data.error,
                    data: data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Questions not found"
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.post("/bulk",requireAdminJwtAuth, async (req, res) => {
        try {
            const { spreadsheetId, category } = req.body;

            if (!spreadsheetId || !category ) {
                throw Error("Incomplete Request details")
            }

            const questionData = {
                spreadsheetId, category
            }
            
            const questions = await QuestionService.addBulkQuestions(questionData);
            res.status(200).json({
                success: true,
                questions: questions
            });

        } catch (error) {
            console.log("Error in questions: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });



    router.post("/",requireAdminJwtAuth, async (req, res) => {
        try {
            const { question, category, answers } = req.body;

            if (!question || !category || !answers) {
                throw Error("Incomplete Request details")
            }

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
                message: error.message
            });
        }

    });



    router.post("/save",requireAdminJwtAuth, async (req, res) => {
        try {
            const { category, gameWeek, questions } = req.body;

            if (!gameWeek || !category || !questions ) {
                throw Error("Incomplete Request details")
            }

            const questionData = {
                gameWeek, category, questions
            }
            const result = await QuestionService.addMultipleQuestions(questionData);
            res.status(200).json({
                success: true,
                questions: result
            });

        } catch (error) {
            console.log("Error in questions save: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });

    router.post("/demo",requireAdminJwtAuth, async (req, res) => {
        try {
            const { question, answers } = req.body;

            if (!question || !answers) {
                throw Error("Incomplete Request details")
            }

            const questionData = {
                question, category: 'demo', gameWeek: 0, answers
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
                message: error.message
            });
        }

    });

    router.patch("/:id", async (req, res) => {
        try {
            const { question, category, answers } = req.body;

            if (!question || !category || !answers) {
                throw Error("Incomplete Request details")
            }

            const questionData = {
                question, category, answers
            }
            const updatedQuestion = await QuestionService.updateQuestion(req.params.id, questionData);
            res.status(200).json({
                success: true,
                question: updatedQuestion
            });

        } catch (error) {
            // console.log("Error in questions: ", error)
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });



    return router;
}

module.exports.questionRoutes = questionRoutes;