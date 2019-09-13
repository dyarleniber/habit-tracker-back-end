import Joi from 'joi';

export default async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string().required(),
      email: Joi.string()
        .email()
        .required(),
      password: Joi.string().required(),
    });

    await schema.validate(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.details });
  }
};
