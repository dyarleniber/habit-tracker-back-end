class SessionController {
  async index(req, res) {
    res.json({ message: 'Hello World' });
  }

  async store(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default new SessionController();
