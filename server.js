require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { Sequelize, DataTypes } = require('sequelize');
const db = require('./models');
const userRoute = require("./routes/routes")

const app = express();

const PORT = process.env.PORT;

//cors origin rules
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// to test routes
app.get("/", (req, res) => {
  res.send("Hello");
});

// Sync database and start the server
db.sequelize.sync().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
  });
}).catch(err => {
  console.error('Unable to connect to the database:', err);
});

// configure routes for APIs
app.use("/", userRoute);