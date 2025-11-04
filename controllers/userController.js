// controllers/userController.js

// Dummy users array
const dummyUsers = [
  {
    _id: "U001",
    googleid: "googleid-U001",
    name: "Alice Example",
    email: "alice@example.com",
    role: "student"
  },
  {
    _id: "U002",
    googleid: "googleid-U002",
    name: "Bob Example",
    email: "bob@example.com",
    role: "director"
  }
];

// GET all users
exports.getAllUsers = (req, res) => {
  res.json(dummyUsers);
};

// GET current user profile (simulate authenticated user: always Alice)
exports.getMe = (req, res) => {
  res.json(dummyUsers[0]);
};

// GET user by ID
exports.getUserById = (req, res) => {
  const user = dummyUsers.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  res.json(user);
};

// UPDATE user by ID (PUT)
exports.updateUserById = (req, res) => {
  let user = dummyUsers.find(u => u._id === req.params.id);
  if (!user) return res.status(404).json({ error: "User not found" });
  user = { ...user, ...req.body };
  res.json({ message: "User updated!", user });
};

// DELETE user by ID
exports.deleteUserById = (req, res) => {
  const idx = dummyUsers.findIndex(u => u._id === req.params.id);
  if (idx < 0) return res.status(404).json({ error: "User not found" });
  dummyUsers.splice(idx, 1);  // In real code, don't mutate arrays!
  res.json({ message: "User deleted!" });
};
