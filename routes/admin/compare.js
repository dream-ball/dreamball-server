const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
// const { validateJWT } = require('../../middleware/jwt_token.js')

const { readData, writeData } = require("../../utils/readFile");
const adminAuth = require('../../middleware/adminAuth');

router.get("/admin/compare",adminAuth, (req, res) => {
  try {

    const oldMatch = readData("./data/upcoming_match_data.json");
    const newMatch = readData("./data/newData.json");
    return res.json({
      oldMatchData: oldMatch,
      newMatchData: newMatch,
    });
  } catch (error) {
    return res.send({ 'Authentication': 'Expried or Invalid' })
  }

});

router.get("/admin/compareUpdate",adminAuth, (req, res) => {

  
  const newMatch = readData('./data/newData.json')
  writeData('./data/upcoming_match_data.json',newMatch)

  res.json({
    message: "successfully updated!",
  });

});

router.get('/admin/removeOldMatch/:id',adminAuth, (req, res) => {

  const matchId = Number(req.params.id);

  let file_data = readData("./data/upcoming_match_data.json")
  let matches = file_data.data;

  file_data["data"] = matches.filter(match => match.match_id !== matchId);

  fs.writeFile(upcomingPath, JSON.stringify(file_data), (err) => {
    if (err) {
      console.error("Error writing to data.json:", err);
      return res.status(500).json({ message: "Error writing to data.json" });
    }

    res.json({
      message: "data.json successfully updatede"
    });
  });

})

router.get("/admin/forceRefresh/",adminAuth , (req, res) => {
  const options = {
    method: "GET",
    headers: {
      "x-rapidapi-key": "8c2f175bb9msh42d2c4435c1685cp15de67jsnf4fa85f71f8a",
      "x-rapidapi-host": "cricket-live-line1.p.rapidapi.com",
    },
  };

  const apiUrl = "https://cricket-live-line1.p.rapidapi.com/upcomingMatches";

  const fetchMatches = async () => {
    try {
      const response = await fetch(apiUrl, options);
      const matchData = await response.json();

      if (!matchData || Object.keys(matchData).length === 0) {
        return res.status(400).json({ message: "Invalid JSON data" });
      }
      writeData('./data/newData.json',matchData)
    } catch (e) {
      console.log("Error fetching", e);
    }

    res.json({ status: "force refreshed" });
  };

  fetchMatches();
});

module.exports = router;