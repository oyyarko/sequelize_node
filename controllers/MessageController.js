require("dotenv").config();
const { Op } = require("sequelize");
const db = require("../models");
const { getReceiverSocketId, io } = require("../socket/socket");
const admin = require("firebase-admin");
// const serviceAccount = require("../config/serviceAccount.json");

// admin.initializeApp({
//   credential: admin.credential.cert(serviceAccount),
// });

module.exports.SendMessage = async (req, res, next) => {
  const { message, receiverId } = req.body;
  try {
    const { id: loggedIn } = req.user; //senderId
    const receiver = await db.Users.findByPk(receiverId);

    if (!receiver) {
      return res.status(400).json({ error: "Receiver not found" });
    }

    const newMessage = await db.Messages.create({
      senderId: loggedIn,
      receiverId,
      message: message,
    });

    const pushMessage = {
      data: {
        title: "New message",
        body: message,
      },
      token: receiver.fcmToken,
    };

    admin
      .messaging()
      .send(pushMessage)
      .then((response) => {
        console.log("Successfully sent message:", response);
      })
      .catch((error) => {
        console.error("Error sending message:", error);
      });

    // SOCKET IO FUNCTIONALITY WILL GO HERE
    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      // io.to(<socket_id>).emit() used to send events to specific client
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }
    res.status(201).json({
      //   message: "Message successfully!",
      success: true,
      ...newMessage.toJSON(),
    });
    next();
  } catch (err) {
    console.log("err :>> ", err);
    res.status(500).json({ message: err, success: false, data: [] });
  }
};

module.exports.GetMessages = async (req, res, next) => {
  const { receiver_id } = req.params;
  try {
    const { id: loggedIn } = req.user;
    const user = await db.Users.findByPk(loggedIn, {
      include: [
        {
          model: db.Messages,
          where: {
            [Op.and]: [{ senderId: loggedIn }, { receiverId: receiver_id }],
          },
          as: "sentMessages",
          required: false,
        },
        {
          model: db.Messages,
          where: {
            [Op.and]: [{ senderId: receiver_id }, { receiverId: loggedIn }],
          },
          as: "receivedMessages",
          required: false,
        },
      ],
      attributes: ["username", "user_id"],
    });

    // const receivedMessages = await db.Users.findByPk(receiver_id, {
    //   include: [
    //     {
    //       model: db.Messages,
    //       where: {
    //         [Op.and]: [{ senderId: receiver_id }, { receiverId: loggedIn }],
    //       },
    //       as: "receivedMessages",
    //       required: false,
    //     },
    //   ],
    //   attributes: ["username", "user_id"],
    // });

    // if (!receivedMessages) {
    //   return res.status(404).json({ error: "User not found" });
    // }

    // const messages = {
    //   sentMessasges,
    //   receivedMessages,
    // };

    if (!user) {
      return { error: "User not found" };
    }

    const allMessages = [
      ...(user.sentMessages || []),
      ...(user.receivedMessages || []),
    ];
    allMessages.sort((a, b) => new Date(a.time) - new Date(b.time));

    res.status(200).json({
      message: "Messages fetched successfully!",
      success: true,
      //   data: { ...messages },
      data: allMessages,
    });

    next();
  } catch (err) {
    console.log("err :>> ", err);
    res.status(500).json({ message: err, success: false, data: [] });
  }
};
