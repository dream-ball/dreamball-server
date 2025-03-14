const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const { validateJWT } = require('../../middleware/jwt_token.js')

const {read_matches,read_matches_new } = require("../../utils/readFile");
const upcomingPath = require('../../utils/filePath');
const { log } = require("console");


router.get("/admin/compare", (req, res) => {
  
  const token = req.body;

  try{
    validateJWT(token)
  const newDataPath = path.join(__dirname,'newData.json')

  const oldMatch = read_matches(upcomingPath);
  const newMatch =read_matches(newDataPath);
  }catch(error){
    return res.send({'Authentication' : 'Expried or Invalid'})
  }
  


  res.json({
    oldMatchData: oldMatch,
    newMatchData: newMatch,
  });
});

router.get("/admin/compareUpdate", (req, res) => {
    const newFilePath = path.join(__dirname, "newData.json");
    const oldFilePath = upcomingPath;

  
    // Read the new data from newData.json
    fs.readFile(newFilePath, "utf8", (err, newData) => {
      if (err) {
        console.error("Error reading newData.json:", err);
        return res.status(500).json({ message: "Error reading newData.json" });
      }
  
      // Overwrite data.json with newData.json content
      fs.writeFile(oldFilePath, newData, (err) => {
        if (err) {
          console.error("Error writing to data.json:", err);
          return res.status(500).json({ message: "Error writing to data.json" });
        }
  
        res.json({
          message: "data.json successfully updated!",
          data: JSON.parse(newData),
        });
      });
    });
  });

  router.get('/admin/removeOldMatch/:id',(req,res)=>{

    const matchId = Number(req.params.id);

    let  file_data=read_matches(upcomingPath)
    let  matches = file_data.data;

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

  router.get("/admin/forceRefresh/", (req, res) => {
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
  
        const filePath = path.join(__dirname, "newData.json");
  
        fs.writeFile(filePath, JSON.stringify(matchData, null, 2), (err) => {
          if (err) {
            console.error("Error writing file:", err);
            return res.status(500).json({ message: "Error writing JSON file" });
          }
        });
      } catch (e) {
        console.log("Error fetching", e);
      }
  
      res.json({ status: "force refreshed" });
    };
  
    fetchMatches();
  });
  
module.exports = router;