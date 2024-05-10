const joi = require('joi');

const signupSchema = {
    body: joi.object({
        firstName: joi.string().required(),
        lastName: joi.string().required(),
        userName: joi
            .string()
            .pattern(new RegExp(/^[A-Z]{1}[A-Za-z]{8,}[0-9@#$%^&*]{2,}$/))
            .required(),
        email: joi
            .string()
            .email({ minDomainSegments: 2, tlds: { allow: ['net', 'com'] } })
            .required(),
        dateOfBirth: joi.string().required(),
        password: joi
            .string()
            .pattern(new RegExp(/^[A-Z][A-Za-z1-9]{8,}[@#$%^&*]{1,}$/))
            .required(),
        repeatedPassword: joi.string().required().valid(joi.ref('password')),
        phoneNumber: joi
            .string()
            .pattern(new RegExp(/^01[0|1|2|5]{1}[0-9]{8}$/))
            .required(),
    }),
};

module.exports = signupSchema;
