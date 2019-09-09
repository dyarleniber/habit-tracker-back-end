const nodemailerMock = jest.genMockFromModule('nodemailer');

const transportMock = {
  use: jest.fn(),
  sendMail: jest.fn(),
};

nodemailerMock.createTransport.mockReturnValue(transportMock);

export default nodemailerMock;

export { transportMock };
