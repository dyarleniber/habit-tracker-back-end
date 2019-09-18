const BruteMock = jest.genMockFromModule('express-brute');

BruteMock.prototype.prevent = (req, res, next) => {
  return next();
};

export default BruteMock;
