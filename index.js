const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
const validateJWT = require('./utils/jwt_users')

// user endpoints
const contest = require("./routes/users/contest");
const live = require("./routes/users/live");
const login = require("./routes/users/login");
const matches = require("./routes/users/matches");
const payments = require("./routes/users/payments");

// admin endpoints

const matchUpdateRoutes = require("./routes/admin/matchUpdate");
const selectedMatchUpdate = require("./routes/admin/selectedMatches");
const compareRoutes = require("./routes/admin/compare");
const liveRoutes = require("./routes/admin/Live");
const panRoutes = require("./routes/admin/pan");
const authenticationRoutes = require("./routes/admin/authentication");
const ballupdate = require('./routes/admin/ballupdate');

const app = express();
const port = 5000;

app.use((req, res, next) => {
  res.setHeader("X-Powered-By", "Node.js");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  next();
});

app.use(cors());
app.use(router);
app.use(express.json());
app.use(bodyParser.json());
app.use(express.urlencoded({ extended: true }));

app.use(live);
app.use(login);
app.use(matches);
app.use(contest);
app.use(payments);
app.use(panRoutes);
app.use(ballupdate)
app.use(liveRoutes);
app.use(compareRoutes);
app.use(matchUpdateRoutes);
app.use(selectedMatchUpdate);
app.use(authenticationRoutes);

app.get("/", (req, res) => {
  console.log("hi");
  res.json({
    status: "success",
    msg: "Hello World",
  });
});

app.get("*", (req, res) => {
  res.status(400).json({ msg: "404 page not found" });
});

app.listen(port, () => {
  console.log(`Server listening on port http://localhost:${port}`);
});
