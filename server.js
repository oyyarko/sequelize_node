require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const db = require("./models");
const userRoute = require("./routes/routes");
const { app, server } = require("./socket/socket");

// const app = express();

const PORT = process.env.PORT;

//cors origin rules
app.use(
  cors({
    origin: ["http://localhost:3000", "http://localhost:3001"],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// to test routes
// app.get("/", (req, res) => {
//   res.send("Hello");
// });

// Sync database and start the server
db.sequelize
  .sync()
  .then(() => {
    server.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
  });

// configure routes for APIs
app.use("/", userRoute);
