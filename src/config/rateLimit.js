export default {
  windowMs: Number(process.env.RATE_LIMIT_WINDOW_MINUTES) * 60 * 15,
  max: process.env.RATE_LIMIT_MAX_REQUESTS,
};
