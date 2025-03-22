

const express = require("express");
const router = express.Router();
const cors = require("cors");
const bodyParser = require("body-parser");
// user endpoints
const contest = require("./routes/users/contest");
const live = require("./routes/users/live");
const login = require("./routes/users/login");
const matches = require("./routes/users/matches");
const payments = require("./routes/users/payments");
const mails =require("./routes/users/mail")
// admin endpoints

const matchUpdateRoutes = require("./routes/admin/matchUpdate");
const selectedMatchUpdate = require("./routes/admin/selectedMatches");
const compareRoutes = require("./routes/admin/compare");
const liveRoutes = require("./routes/admin/Live");
const panRoutes = require("./routes/admin/pan");
const authenticationRoutes = require("./routes/admin/authentication");
const ballupdate = require('./routes/admin/ballupdate');
const {generateUser_id } = require('./middleware/user_id.js');

const app = express();
const port = 5000;

// app.use((req, res, next) => {
//   res.setHeader("X-Powered-By", "Node.js");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
//   res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
//   res.setHeader(
//     'Content-Security-Policy',
//     "default-src 'self'; connect-src 'self' https://13.127.231.62;"
//   );
//   next();
// });

app.use(cors());
app.use(router);
app.use(bodyParser.json({ limit: "50mb" })); 
app.use(bodyParser.urlencoded({ limit: "50mb", extended: true }));
app.use(live);
app.use(login);
app.use(matches);
app.use(contest);
app.use(payments);
app.use(mails)
app.use(panRoutes);
app.use(ballupdate)
app.use(liveRoutes);
app.use(compareRoutes);
app.use(matchUpdateRoutes);
app.use(selectedMatchUpdate);
app.use(authenticationRoutes);

app.get("/", (req, res) => {
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
