import Joi from "joi";

// express-validator
export const signUpValidatinon = {
  body: Joi.object()
    .required()
    .keys({
      userName: Joi.string().min(4).max(10).alphanum().messages({
        "string.min": "Username must contain at least 5 charachters",
      }),
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] }, minDomainSegments: 2 })
        .required()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "please enter your email",
        }),
      password: Joi.string()
        .required()
        .messages({
          "string.min": "password must contain at least 5 charachters",
        }),
      cpass: Joi.string().valid(Joi.ref("password")).messages({
        "any.only": "confirmation password must match password",
      }),
      gender: Joi.string().required(),
    
    }),
};

export const loginValidation = {
  body: Joi.object()
    .required()
    .keys({
      email: Joi.string()
        .email({ tlds: { allow: ["com", "net"] }, minDomainSegments: 2 })
        .required()
        .messages({
          "string.email": "Email format in-valid",
          "any.required": "please enter your email",
        }),
      password: Joi.string().required().min(5).max(10).messages({
        "string.min": "password must contain at least 5 charachters",
      }),
    }),
};
