import '../src/bootstrap';

import databaseHelper from '../src/app/helpers/database';

jest.mock('nodemailer');

beforeAll(() => {
  return databaseHelper.connect();
});

beforeEach(() => {
  return databaseHelper.truncate();
});

afterAll(() => {
  return databaseHelper.disconnect();
});
