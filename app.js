const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const config = require("config");
const app = express();
const userRoute = require("./routes/user.route");
const dbConfig = config.get("dbConfig");
const allowedOrigins = config.get("allowedOrigins");
const helmet = require("helmet");

app.use(helmet());
app.use(
  bodyParser.urlencoded({
    extended: true
  })
);

app.use(bodyParser.json());

mongoose.set("useFindAndModify", false);
mongoose.connect(
  dbConfig.host,
  {
    auth: {
      user: dbConfig.user,
      password: dbConfig.password
    },
    
    useUnifiedTopology: true,
    useCreateIndex: true,
    useNewUrlParser: true
  },
  function(err, client) {
    if (err) {
      console.log(err);
    }
    console.log("MongoDB Connected");
  }
);

mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on("error", console.error.bind(console, "MongoDB connection error:"));

app.use(
  cors({
    origin: function(origin, callback) {
      if (!origin) return callback(null, true);
      if (allowedOrigins.split(",").indexOf(origin) === -1) {
        var msg =
          "The CORS policy for this site does not " +
          "allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    }
  })
);

app.get("/", (req, res) => {
  res.send("Bring it on! Chilli India is running.");
});

app.use("/user", userRoute);
const port = process.env.PORT || 9000;

app.listen(port, () => {
  console.log("Chilli India API up and running " + port);
});