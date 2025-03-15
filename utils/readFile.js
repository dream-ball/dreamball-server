const fs = require("fs");
const readData = (fileName) => {
    if (fs.existsSync(fileName)) {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    }
    else {
        return `${fileName} not found`
    }
};

const writeData = (fileName, data) => {
  fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
};
const read_default_contest = () => {
  if (fs.existsSync("./data/default_contest_data.json")) {
    const data = fs.readFileSync("./data/default_contest_data.json");
    return JSON.parse(data);
  }
  return [];
};

module.exports = { readData, writeData, read_default_contest };
