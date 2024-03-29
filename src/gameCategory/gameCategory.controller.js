"use strict";
const express = require('express');
const requireJwtAuth = require('../middleware/requireUserJwtAuth');

const requireAdminJwtAuth = require('../middleware/requireAdminJwtAuth');

function categoryRoutes(gameCategoryService) {
    const router = express.Router();

    router.post('/', requireAdminJwtAuth, async (req, res) => {

        try {
            const { category, isActive, description } = req.body;

            if (!category || !description) {
                throw Error("Incomplete Request details")
            }

            let data = {
                category, isActive, description
            }

            const categoryData = await gameCategoryService.saveCategory(data);

            res.status(200).json({
                success: true,
                category: categoryData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });


    router.patch('/:id', requireAdminJwtAuth, async (req, res) => {

        try {
            const { category, isActive, description } = req.body;

            const id = req.params.id;

            let data = {
                category, isActive, description
            }

            const categoryData = await gameCategoryService.updateCategory(id, data);

            res.status(200).json({
                success: true,
                category: categoryData
            });


        } catch (err) {
            // return next(err);
            // console.log("reg erro: ", err)
            res.json({ success: false, message: err.message });
        }
    });



    router.get('/', requireAdminJwtAuth, async (req, res) => {

        try {
            const categories = await gameCategoryService.getCategories();
            res.status(200).json({
                success: true,
                categories: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.delete('/', requireAdminJwtAuth, async (req, res) => {

        try {
            const categories = await gameCategoryService.deleteAllCategories();
            res.status(200).json({
                success: true,
                categories: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.delete('/:id', requireAdminJwtAuth, async (req, res) => {

        try {
            let categoryId = req.params.id;
            const categories = await gameCategoryService.deleteCategory(categoryId);
            res.status(200).json({
                success: true,
                categories: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });

    router.get('/active',requireJwtAuth, async (req, res) => {

        try {
            const categories = await gameCategoryService.getCategories(0);
            res.status(200).json({
                success: true,
                categories: categories
            });

        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message
            });
        }
    });


    return router;
}

module.exports.categoryRoutes = categoryRoutes