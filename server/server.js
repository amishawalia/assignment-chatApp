const express = require("express");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const cors = require("cors");
const socketio = require("socket.io");
const cookieParser = require("cookie-parser");
dotenv.config();

const app = express();
const server = require("http").createServer(app);

app.use(cors({ credentials: true, origin: process.env.CLIENT_URL }));
app.use(bodyParser.json({ limit: "50mb" }));
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(express.json());
app.use(cookieParser());

app.use("/api", require("./routes/authRoute"));
app.use("/welcome", require("./routes/welcomeRoute"));
app.use("/inbox", require("./routes/inboxRoute"));
app.use("/search", require("./routes/searchRoute"));

const io = socketio(server, {
  cors: {
    origin: "http://localhost:3000",
    allowedHeaders: ["*"],
    credentials: true,
  },
});

app.set("socketio", io);

const rSocket = require("./controllers/rootSocket")(io);

const PORT = process.env.PORT || 3010;
server.listen(PORT, async (err) => {
  if (err) console.log(err);
  else {
    console.log("Server up and running at", PORT);
    mongoose.connect(
      process.env.DB_URL,
      {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      },
      (err) => {
        if (err) console.log(err);
        else console.log("Connected to DB");
      }
    );
  }
});
