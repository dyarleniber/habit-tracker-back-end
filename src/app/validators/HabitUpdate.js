import Joi from 'joi';

export default async (req, res, next) => {
  try {
    const bodySchema = Joi.object({
      name: Joi.string(),
      description: Joi.string(),
    });

    const paramsSchema = Joi.object({
      id: Joi.string().required(),
    });

    await bodySchema.validate(req.body);
    await paramsSchema.validate(req.params);

    return next();
  } catch (err) {
    return res.status(400).json({ error: err.details });
  }
};
