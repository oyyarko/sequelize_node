module.exports = (sequelize, DataTypes) => {
  const Followers = sequelize.define(
    "Followers",
    {
      follow_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      follower_id: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      following_id: {
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

  Followers.associate = (models) => {
    Followers.belongsTo(models.Users, {
      foreignKey: "follower_id",
      as: "followers",
    });
    Followers.belongsTo(models.Users, {
      foreignKey: "following_id",
      as: "followings",
    });
  };
  return Followers;
};
