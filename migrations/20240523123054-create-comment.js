module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Comments", {
      comment_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      comment: {
        type: Sequelize.TEXT,
        allowNull: false,
      },
      post_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Posts",
          key: "post_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
      user_id: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: "Users",
          key: "user_id",
        },
        onUpdate: "CASCADE",
        onDelete: "CASCADE",
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Comments");
  },
};
