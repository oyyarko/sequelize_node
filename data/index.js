
const User = require('../models/user');
const Post = require('../models/post');

const createSampleData = async () => {
  const user = await User.create({ name: 'John Doe' });
  await Post.create({ title: 'My First Post', content: 'This is my first post!', user_id: user.id });

  console.log('Sample data created!');
};

createSampleData();