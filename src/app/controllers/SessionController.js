class SessionController {
  index(req, res) {
    res.json({ message: 'Hello World' });
  }
}

export default new SessionController();
