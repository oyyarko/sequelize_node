"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("Messages", {
      message_id: {
        allowNull: false,
        primaryKey: true,
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
      },
      senderId: {
        type: Sequelize.UUID,
      },
      receiverId: {
        type: Sequelize.UUID,
      },
      message: {
        type: Sequelize.STRING,
      },
      time: {
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("Messages");
  },
};
