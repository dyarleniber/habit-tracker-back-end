import Joi from 'joi';

export default async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      email: Joi.string().email(),
      password: Joi.string(),
    });

    await schema.validate(req.body);

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.details });
  }
};
