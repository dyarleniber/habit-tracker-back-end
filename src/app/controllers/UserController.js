class UserController {
  async show(req, res) {
    res.json({ message: 'Ok' });
  }

  async store(req, res) {
    res.json({ message: 'Ok' });
  }

  async update(req, res) {
    res.json({ message: 'Ok' });
  }

  async delete(req, res) {
    res.json({ message: 'Ok' });
  }
}

export default new UserController();
