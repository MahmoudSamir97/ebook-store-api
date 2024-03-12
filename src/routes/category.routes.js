const express = require('express');
const {
    addCategory,
    updateCategory,
    getAllCategories,
    searchCategory,
    deleteCategory,
} = require('../controllers/category.controller');
const upload = require('../middleware/multer');
const { categoryValidationSchema, updateCategorySchema } = require('../validations/category.validation');
const { validation } = require('../middleware/validation');
const categoryRouter = express.Router();

categoryRouter.post('/', upload.single('categoryImage'), validation(categoryValidationSchema), addCategory);

categoryRouter.patch('/:categoryId', upload.single('categoryImage'), validation(updateCategorySchema), updateCategory);

categoryRouter.get('/', getAllCategories);

categoryRouter.get('/search', searchCategory);

categoryRouter.delete('/:categoryId', deleteCategory);

module.exports = categoryRouter;
