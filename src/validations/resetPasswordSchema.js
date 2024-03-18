const joi = require('joi');

const resetSchema = {
    body: joi.object({
        newPassword: joi
            .string()
            .pattern(new RegExp(/^[A-Z][A-Za-z1-9]{8,}[@#$%^&*]{1,}$/))
            .required(),
        confirmNewPassword: joi.string().required().valid(joi.ref('newPassword')),
    }),
};

module.exports = resetSchema;
