export default {
  uri: process.env.NODE_ENV === 'test' ? global.__DB_URL__ : process.env.DB_URL,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  },
};
