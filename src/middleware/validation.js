let sides = ['body', 'params', 'query'];
exports.validation = (schema) => {
    return (req, res, next) => {
        let errors = [];
        sides.forEach((ele) => {
            if (schema[ele]) {
                let checkValidation = schema[ele].validate(req[ele], {
                    abortEarly: false,
                });
                if (checkValidation && checkValidation.error) {
                    errors.push(checkValidation.error.details);
                }
            }
        });
        if (errors.length) {
            res.status(400).json({
                message: errors[0][0].message,
                err: errors,
            });
        } else {
            next();
        }
    };
};
