const joi = require("joi");

module.exports = (loginDetail) => {
  const schema = joi.object({
    userName: joi.string().min(4).required(),
    password: joi.string().min(8).required(),
  });
  return schema.validate(loginDetail);
};
