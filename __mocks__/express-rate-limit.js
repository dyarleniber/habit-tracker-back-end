export default class RateLimitMock {
  constructor() {
    return (req, res, next) => {
      return next();
    };
  }
}
