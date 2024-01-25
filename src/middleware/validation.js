import joi from 'joi';

export const generalFields = {
  email: joi.string().email().required().messages({
    'string.empty': 'email is required',
    'string.email': 'plz enter a valid email',
  }),

  password: joi.string().required().min(3).messages({
    'string.empty': 'password is required',
  }),
  file: joi.object({
    filename: joi.string().required(),
    size: joi.number().positive().required(),
    path: joi.string().required(),
    fieldname: joi.string().required(),
    destination: joi.string().required(),
    mimetype: joi.string().required(),
    encoding: joi.string().required(),
    originalname: joi.string().required(),
    dest: joi.string(),
  }),
};

export const validation = (schema) => {
  return (req, res, next) => {
    const dataMethods = ["body", "query", "params", "headers", "file"];
    const validationArray = []; // عشان اخرن فيها الاخطاء
    dataMethods.forEach((key) => {
      //  console.log(key);
      if (schema[key]) {
        const validationResult = schema[key].validate(req[key], {
          abortEarly: false,
        });
        if (validationResult.error) {
          validationArray.push(validationResult.error.details);
        }
      }
    });
    if (validationArray.length > 0) {
      return res.json({ message: "validation error", validationArray });
    } else {
      next();
    }
  };
};
