module.exports = (sequelize, DataTypes) => {
  const Comments = sequelize.define(
    "Comments",
    {
      comment_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      comment: { type: DataTypes.TEXT, allowNull: false },
      post_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Posts",
          key: "post_id",
        },
      },
      user_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      parent_id: {
        type: DataTypes.UUID,
        allowNull: true,
      },
    },
    { timestamps: false }
  );

  Comments.associate = (models) => {
    Comments.belongsTo(models.Users, {
      foreignKey: "user_id",
      as: "user",
    });
    Comments.belongsTo(models.Posts, {
      foreignKey: "post_id",
      as: "post",
    });
    Comments.belongsTo(models.Comments, {
      foreignKey: "parent_id",
      as: "parent",
    });
    Comments.hasMany(models.Comments, {
      foreignKey: "parent_id",
      as: "replies",
    });
  };
  return Comments;
};
