const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Posts = sequelize.define(
    "Posts",
    {
      post_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      title: DataTypes.TEXT,
      content: DataTypes.STRING,
      posted_by: {
        type: DataTypes.UUID,
        allowNull: false,
      },
    },
    { timestamps: false }
  );

  Posts.associate = (models) => {
    Posts.belongsTo(models.Users, {
      foreignKey: "posted_by",
      as: "user",
    });
    Posts.hasMany(models.Comments, {
      foreignKey: "post_id",
      as: "comments",
    });
  };
  return Posts;
};
