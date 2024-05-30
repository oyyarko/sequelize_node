const { v4: uuidv4 } = require("uuid");
const bcrypt = require("bcryptjs");

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
        type: DataTypes.TEXT,
        allowNull: true,
      },
      fcmToken: {
        type: DataTypes.STRING,
        allowNull: true,
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      isPrivate: {
        type: DataTypes.BOOLEAN,
        allowNull: false,
        defaultValue: false
      }
    },
    { timestamps: false }
  );

  // Hook to generate UUID before creating Users
  Users.beforeCreate(async (user) => {
    user.user_id = uuidv4();
    user.password = await bcrypt.hash(user.password, 10);
  });

  Users.associate = (models) => {
    Users.hasMany(models.Posts, {
      foreignKey: "posted_by",
      as: "posts",
    });
    Users.hasMany(models.Comments, {
      foreignKey: "user_id",
      as: "comments",
    });
    Users.hasMany(models.Likes, {
      foreignKey: "user_id",
      as: "likes",
    });
    Users.hasMany(models.Followers, {
      foreignKey: "following_id",
      as: "followers",
    });
    Users.hasMany(models.Followers, {
      foreignKey: "follower_id",
      as: "followings",
    });
    Users.hasMany(models.Messages, {
      foreignKey: "senderId",
      as: "sentMessages",
    });
    Users.hasMany(models.Messages, {
      foreignKey: "receiverId",
      as: "receivedMessages",
    });
  };

  return Users;
};
