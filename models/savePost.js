module.exports = (sequelize, DataTypes) => {
  const SavedPosts = sequelize.define("SavedPosts", {});
  return SavedPosts;
};
