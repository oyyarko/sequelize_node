const { v4: uuidv4 } = require("uuid");

module.exports = (sequelize, DataTypes) => {
  const Users = sequelize.define(
    "Users",
    {
      user_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
      },
      bio: {
        type: DataTypes.TEXT,
      },
      profilePicture: {
        type: DataTypes.STRING,
        allowNull: true,
      },
    },
    { timestamps: false }
  );

  // Hook to generate UUID before creating Users
  Users.beforeCreate((user) => {
    user.user_id = uuidv4();
  });

  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      foreignKey: "posted_by",
      as: "posts",
    });
  };

  return Users;
};
