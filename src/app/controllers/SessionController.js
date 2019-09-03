class SessionController {
  async store(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default new SessionController();
