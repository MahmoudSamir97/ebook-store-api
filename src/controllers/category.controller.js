const categoryModel = require('../models/category.model');
const { cloudinaryUploadImage } = require('../services/uploadImage');
const { cloudinaryRemoveImage } = require('../services/uploadImage');

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

        const result = await cloudinaryUploadImage(req.file.path);

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

        let updateFields = { categoryName };

        // Check if a new image file is provided
        if (req.file) {
            const result = await cloudinaryUploadImage(req.file.path);
            updateFields.categoryImage = result.secure_url;
        }

        const updatedCategory = await categoryModel.findOneAndUpdate(
            { _id: categoryId },
            { $set: updateFields },
            { new: true }
        );

        res.status(200).json({ status: 'SUCCESS', data: { updatedCategory } });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};

exports.getAllCategories = async (req, res) => {
    try {
        const allCategories = await categoryModel.find();
        res.status(200).json({ status: 'SUCCESS', data: { allCategories } });
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
        const deleteResult = await cloudinaryRemoveImage(category.categoryImage);

        console.log('Cloudinary delete result:', deleteResult);

        // Delete the category from the database
        await categoryModel.findOneAndDelete({ _id: categoryId });

        res.status(200).json({ status: 'SUCCESS', data: null });
    } catch (error) {
        res.status(500).json({ status: 'ERROR', message: error.message, data: null });
    }
};
