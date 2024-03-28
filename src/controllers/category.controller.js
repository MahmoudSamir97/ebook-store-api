const categoryModel = require('../models/category.model');
const { uploadToCloudinary, removeFromCloudinary } = require('../services/cloudinary');
const dataurl = require('dataurl');

exports.addCategory = async (req, res) => {
    try {
        // Check if category with the same name already exists
        const existingCategory = await categoryModel.findOne({ categoryName: req.body.categoryName });

        if (existingCategory) {
            return res.status(400).json({
                status: 'ERROR',
                message: 'Category with the same name already exists',
            });
        }

        // Continue with the category creation process
        if (!req.file) {
            return res.status(400).json({ status: 'ERROR', message: 'Image must be provided' });
        }

        const dataUrlString = dataurl.format({
            data: req.file.buffer,
            mimetype: req.file.mimetype,
        });

        const result = await uploadToCloudinary(dataUrlString, 'category');

        const newCategory = new categoryModel({
            categoryName: req.body.categoryName,
            categoryImage: result.secure_url,
        });

        await newCategory.save();

        res.status(201).json({ status: 'SUCCESS', data: { message: 'Category created successfully', newCategory } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.updateCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const { categoryName } = req.body;
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: 'ERROR', data: { message: 'Category not found' } });
        }
        // Check if a new image file is provided
        if (req.file) {
            const result = await uploadToCloudinary(req.file.path);
            category.categoryImage = result.secure_url;
        }
        category.categoryName = categoryName;
        await category.save();
        res.status(200).json({ status: 'SUCCESS', data: { category } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const query = req.query;
        const limit = parseInt(query.limit) || 10; // Default limit is 10 categories per page
        const page = parseInt(query.page) || 1; // Default page is 1
        const skip = (page - 1) * limit;

        const allCategories = await categoryModel.find().limit(limit).skip(skip);

        const totalCount = await categoryModel.countDocuments(); // Get total count of categories

        res.status(200).json({ status: 'SUCCESS', data: { allCategories, totalCount } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.searchCategory = async (req, res) => {
    try {
        const { categoryName } = req.query;

        if (!categoryName) {
            return res.status(400).json({ status: 'ERROR', message: 'Category name is required for search' });
        }

        const searchResults = await categoryModel.find({
            categoryName: { $regex: new RegExp(categoryName, 'i') },
        });

        res.status(200).json({ status: 'SUCCESS', data: { searchResults } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.deleteCategory = async (req, res) => {
    try {
        const categoryId = req.params.categoryId;
        const category = await categoryModel.findById(categoryId);
        if (!category) {
            return res.status(404).json({ status: 'ERROR', data: { message: 'Category not found' } });
        }
        // Remove the category image from Cloudinary
        const deleteResult = await removeFromCloudinary(category.categoryImage);
        // Delete the category from the database
        await categoryModel.findByIdAndDelete(categoryId);
        res.status(200).json({ status: 'SUCCESS', data: null });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};
