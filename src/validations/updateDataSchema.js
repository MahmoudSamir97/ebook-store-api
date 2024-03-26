const joi = require('joi');

const updateDataSchema = {
    body: joi.object({
        firstName: joi.string(),
        lastName: joi.string(),
        userName: joi
            .string()
            .pattern(new RegExp(/^[A-Z]{1}[A-Za-z]{8,}[0-9@#$%^&*]{2,}$/))
            .messages({
                'string.pattern.base':
                    'user name must start with uppercase,at leat 8 alphabet characters  and end with two special character ',
            }),
        email: joi.string().email({ minDomainSegments: 2, tlds: { allow: ['net', 'com'] } }),
        phoneNumber: joi
            .string()
            .pattern(new RegExp(/^01[0|1|2|5]{1}[0-9]{8}$/))
            .messages({
                'string.pattern.base': 'Please enter a valid egyptian phone number ',
            }),
        image: joi.object().keys({
            url: joi.string(),
            public_id: joi.string(),
        }),
        isDeleted: joi.boolean(),
    }),
};

module.exports = updateDataSchema;
