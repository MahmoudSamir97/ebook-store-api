const validate = (schema) => {
    return function (req, res, next) {
        const foundedError = schema.validate(req.body, { abortEarly: false });
        if (foundedError && foundedError.error) {
            res.status(400).json({
                status: 'fail',
                error: foundedError.error.details,
            });
        } else {
            next();
        }
    };
};

module.exports = validate;
