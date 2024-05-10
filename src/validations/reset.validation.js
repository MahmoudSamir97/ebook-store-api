const joi = require('joi');

const resetSchema = {
    body: joi.object({
        oldPassword: joi.string(),
        newPassword: joi
            .string()
            .pattern(new RegExp(/^[A-Z][A-Za-z1-9]{8,}[@#$%^&*]{1,}$/))
            .required()
            .messages({
                'string.pattern.base':
                    'New password must start with uppercase, lowercase and end with a special character ',
                'any.required': 'New password is required.',
            }),
        confirmNewPassword: joi.string().valid(joi.ref('newPassword')).required().messages({
            'any.only': 'Confirmed password must match new password.',
            'any.required': 'Confirmed password is required.',
        }),
    }),
};

module.exports = resetSchema;
