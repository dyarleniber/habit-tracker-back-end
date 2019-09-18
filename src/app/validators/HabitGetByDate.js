import { isValid } from 'date-fns';

export default async (req, res, next) => {
  const date = new Date(Number(req.params.date));

  if (!isValid(date)) {
    return res.status(400).json({ error: 'Invalid date' });
  }

  return next();
};
