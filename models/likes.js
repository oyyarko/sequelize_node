module.exports = (sequelize, DataTypes) => {
  const Likes = sequelize.define(
    "Likes",
    {
      like_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      post_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Posts",
          key: "post_id",
        },
      },
      user_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
    },
    { timestamps: false }
  );

  Likes.associate = (models) => {
    Likes.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
    Likes.belongsTo(models.Posts, {
      foreignKey: "post_id",
      as: "post",
    });
  };

  return Likes;
};
