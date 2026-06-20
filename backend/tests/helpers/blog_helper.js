const Blog = require("../../models/blog");

const initialBlogs = [
  {
    title: "React patterns",
    author: "Michael Chan",
    url: "https://reactpatterns.com/",
    likes: 7,
  },
  {
    title: "Go To Statement Considered Harmful",
    author: "Edsger W. Dijkstra",
    url: "http://www.u.arizona.edu/~rubin/old-classes/453/reading/GoToStatementConsideredHarmful.pdf",
    likes: 12,
  },
];

const nonExistingId = async () => {
  const blog = new Blog({ title: "do not exist " });
  await blog.save();
  await blog.deleteOne();

  return blog._id.toString();
};

const blogInDb = async () => {
  const blogs = await Blog.find({});
  return blogs.map((blog) => blog.toJSON());
};

module.exports = {
  initialBlogs,
  nonExistingId,
  blogInDb,
};
