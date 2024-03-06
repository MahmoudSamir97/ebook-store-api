const mongoose = require('mongoose');

const categorySchema = new mongoose.Schema({
    categoryName: {
        type: String,
    },
    categoryImage: {
        type: String,
    }
}, { timestamps: true });

const categoryModel = mongoose.model('Category' ,categorySchema);

module.exports = categoryModel;
