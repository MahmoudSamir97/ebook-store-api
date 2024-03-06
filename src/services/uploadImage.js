const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.cloudinaryUploadImage = async (file) => {
    try {
        const result = await cloudinary.uploader.upload(file);
        return result;
    } catch (err) {
        return err;
    }
};
exports.cloudinaryRemoveImage = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId);
        return result;
    } catch (err) {
        return err;
    }
};
