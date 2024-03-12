const Joi = require('joi');

exports.categoryValidationSchema = {
    body: Joi.object()
        .required()
        .keys({
            categoryName: Joi.string().min(3).max(50).required().messages({
                'string.base': 'Category name must be a string',
                'string.empty': 'Category name cannot be empty',
                'string.min': 'Category name must have at least {3} characters',
                'string.max': 'Category name cannot exceed {20} characters',
                'any.required': 'Category name is required',
            }),
            categoryImage: Joi.string().allow(null, '').optional().messages({
                'string.base': 'Category image must be a string',
                'string.empty': 'Category image cannot be empty',
            }),
        }),
};

exports.updateCategorySchema = {
    body: Joi.object()
        .required()
        .keys({
            categoryName: Joi.string().min(3).max(50).required().messages({
                'string.base': 'Category name must be a string',
                'string.empty': 'Category name cannot be empty',
                'string.min': 'Category name must have at least {3} characters',
                'string.max': 'Category name cannot exceed {50} characters',
                'any.required': 'Category name is required',
            }),
            categoryImage: Joi.string().allow(null, '').optional().messages({
                'string.base': 'Category image must be a string',
                'string.empty': 'Category image cannot be empty',
            }),
        }),
    params: Joi.object()
        .required()
        .keys({
            categoryId: Joi.string().hex().min(24).max(24).required(),
        }),
};
