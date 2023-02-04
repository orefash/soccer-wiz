const express = require('express');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');
const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');

function questionRoutes(QuestionService) {
    const router = express.Router();

    router.get("/", requireAdminJwtAuth, async (req, res) => {
        try {
            let category = req.query.category;
            let gameWeek = req.query.gameWeek;
            let filters = {}

            if (gameWeek) filters.gameWeek = gameWeek;
            if (category) filters.category = category;

            const questions = await QuestionService.getQuestions(filters);
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



    router.get("/games/category/:category", async (req, res) => {
        try {
            let category = req.params.category;

            if (!category) throw new Error('No Category Input');

            const data = await QuestionService.getGameWeekQuestionData(category);

            if (data) {
                res.status(200).json({
                    success: true,
                    data: data
                });
            } else {
                res.status(400).json({
                    success: false,
                    message: "Invalid Details"
                });
            }

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }

    });


    router.get("/game/user/:userId/gameweek/:gameWeek", requireJwtAuth, async (req, res) => {
        try {

            let userId = req.params.userId;
            let gameWeek = req.params.gameWeek;
            let category = req.query.category;

            // console.log(`u: ${userId} :  c:  ${category}  :  d:  ${demo}`)

            // const { demo, category, userId } = req.body;

            if (!category || !userId || !gameWeek) {
                throw new Error("Incomplete Request details")
            }

            const questionData = {
                category, userId, date: new Date(), gameWeek
            }

            const data = await QuestionService.getQuestionsForGame(questionData);

            if (data) {
                data.timeLimit = 12
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


    router.post("/bulk", requireAdminJwtAuth, async (req, res) => {
        try {
            const { spreadsheetId, category } = req.body;

            if (!spreadsheetId || !category) {
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



    router.post("/", requireAdminJwtAuth, async (req, res) => {
        try {

            const questions = await QuestionService.addQuestion(req.body);
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



    router.post("/save", requireAdminJwtAuth, async (req, res) => {
        try {

            const result = await QuestionService.addMultipleQuestions(req.body);
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

    // router.post("/demo",requireAdminJwtAuth, async (req, res) => {
    //     try {
    //         const { question, answers } = req.body;

    //         if (!question || !answers) {
    //             throw Error("Incomplete Request details")
    //         }

    //         const questionData = {
    //             question, category: 'demo', gameWeek: 0, answers
    //         }
    //         const questions = await QuestionService.addQuestion(questionData);
    //         res.status(200).json({
    //             success: true,
    //             questions: questions
    //         });

    //     } catch (error) {
    //         console.log("Error in questions: ", error)
    //         res.status(500).json({
    //             success: false,
    //             message: error.message
    //         });
    //     }

    // });

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