import Joi from 'joi';

export default async (req, res, next) => {
  try {
    const schema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
      page: Joi.number(),
    });

    await schema.validate(req.query);

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.details });
  }
};
