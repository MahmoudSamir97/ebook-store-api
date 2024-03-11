<<<<<<< HEAD
var Router = require('router');
=======
const express = require('express');
>>>>>>> 4c7430fbda7b66b7d9b4585cc5770f1b87a6ea86
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
const categoryRouter = Router();

categoryRouter.post('/', upload.single('categoryImage'), validation(categoryValidationSchema), addCategory);

categoryRouter.patch('/:categoryId', upload.single('categoryImage'), validation(updateCategorySchema), updateCategory);

categoryRouter.get('/', getAllCategories);

categoryRouter.get('/search', searchCategory);

=======
const categoryRouter = express.Router();

categoryRouter.post('/', upload.single('categoryImage'), validation(categoryValidationSchema), addCategory);

categoryRouter.patch('/:categoryId', upload.single('categoryImage'), validation(updateCategorySchema), updateCategory);

categoryRouter.get('/', getAllCategories);

categoryRouter.get('/search', searchCategory);

>>>>>>> 4c7430fbda7b66b7d9b4585cc5770f1b87a6ea86
categoryRouter.delete('/:categoryId', deleteCategory);

module.exports = categoryRouter;
