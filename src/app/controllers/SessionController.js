class SessionController {
  async index(req, res) {
    res.json({ message: 'Hello World' });
  }
}

export default new SessionController();
