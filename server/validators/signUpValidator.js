const joi = require("joi");

module.exports = (signUpDetail) => {
  const schema = joi.object({
    userName: joi.string().min(4).required(),
    email: joi.string().min(4).email().required(),
    password: joi.string().min(8).required(),
    gender: joi.string(),
    phone: joi.string().length(10).required(),
  });
  return schema.validate(signUpDetail);
};
