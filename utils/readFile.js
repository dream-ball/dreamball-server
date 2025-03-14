const fs = require("fs");

const read_matches = (filename) => {
  if (fs.existsSync(filename)) {
    const data = fs.readFileSync(filename);
    return JSON.parse(data);
  }
  return [];
};

const read_default_contest = () => {
  if (fs.existsSync("default_contest_data.json")) {
    const data = fs.readFileSync("default_contest_data.json");
    return JSON.parse(data);
  }
  return [];
};

module.exports = { read_matches, read_default_contest };
