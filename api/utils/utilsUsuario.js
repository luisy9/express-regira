const listAllUsers = async (req, res, Model) => {
  try {
    const allUsers = await Model.findAll();
    res.status(200).json(allUsers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

module.exports = {
  listAllUsers,
};
