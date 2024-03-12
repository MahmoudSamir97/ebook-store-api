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
<<<<<<< HEAD
=======

>>>>>>> 7d494209cb14f32cfedbd3e69c91e65a756e3036
const categoryRouter = express.Router();

categoryRouter.post('/', upload.single('categoryImage'), validation(categoryValidationSchema), addCategory);

categoryRouter.patch('/:categoryId', upload.single('categoryImage'), validation(updateCategorySchema), updateCategory);

categoryRouter.get('/', getAllCategories);

categoryRouter.get('/search', searchCategory);

categoryRouter.delete('/:categoryId', deleteCategory);

module.exports = categoryRouter;
