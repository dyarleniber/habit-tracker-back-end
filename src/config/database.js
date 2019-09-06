export default {
  uri: process.env.DB_URL,
  options: {
    useCreateIndex: true,
    useNewUrlParser: true,
    useFindAndModify: false,
  },
};
