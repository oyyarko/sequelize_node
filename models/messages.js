module.exports = (sequelize, DataTypes) => {
  const Messages = sequelize.define(
    "Messages",
    {
      message_id: {
        allowNull: false,
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      senderId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      receiverId: {
        allowNull: false,
        type: DataTypes.UUID,
        references: {
          model: "Users",
          key: "user_id",
        },
      },
      message: { type: DataTypes.TEXT, allowNull: false },
    },
    { timestamps: false }
  );

  Messages.associate = (models) => {
    Messages.belongsTo(models.Users, {
      foreignKey: "senderId",
      as: "sender",
    });
    Messages.belongsTo(models.Users, {
      foreignKey: "receiverId",
      as: "receiver",
    });
  };
  return Messages;
};
