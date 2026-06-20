const User = require("../../models/user");

const initialUsers = [
  {
    username: "user-1",
    name: "user 1",
    password: "123123",
  },
  {
    username: "user-2",
    name: "user 2",
    password: "123123",
  },
];

const userInDb = async () => {
  const users = await User.find({});
  return users.map((blog) => blog.toJSON());
};

module.exports = {
  initialUsers,
  userInDb,
};
