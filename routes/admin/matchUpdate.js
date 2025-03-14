const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

const validateJWT = require('../../middleware/jwt_token.js');
const {  db_promise } = require("../../database/db.js");
const upcomingPath = require('../../utils/filePath.js')
const {read_default_contest,read_matches} = require('../../utils/readFile.js')

const msToTime = require("../../utils/calcDelay");
const { log } = require("console");

//import upcomingPath from "../utils/filePath";


router.get("/admin/upcomingMatches", (req, res) => {

  const token = req.header('Authorization');

  try{
    console.log('token verificaiton failed')
    validateJWT(token)
  }catch(error){
    return res.status(401).json({'Token' : 'Invalid'});
  }

  try{
    // const isTrue = validateJWT(token)

    const filePath = path.join(upcomingPath);

    fs.readFile(filePath, "utf8", (err, data) => {
    if (err) {
      console.error("Error reading file:", err);
      return res.status(500).json({ message: "Error reading JSON file" });
    }

    res.json(JSON.parse(data));
  });

  }catch(error){
    res.json({token : 'not valid'});
  }

  
});



router.post("/admin/updateSelectedMatch/:id", async (req, res) => {
    const matchId = Number(req.params.id);
    let default_contest = read_default_contest();
    let match_data = read_matches(upcomingPath).data;
    let m_data = match_data.find((match) => match.match_id === matchId);
    let stringMatchData = JSON.stringify(m_data)
    // console.log(stringMatchData)    
  
    if (!m_data) {
      return res.status(404).json({ status: "Match not found" });
    }
  
    const query = `INSERT INTO matches (match_id, match_time, date_wise,match_data) VALUES (?, ?, ?,?) `;
    const contest_query = `INSERT INTO contest (match_id, contest_id, prize_pool, entry_fee, total_spots, spots_available, platform_fee, platform_filler_fee, type, minimum_players, prize_order, status) 
      VALUES (?, ?, ?, ?, ?, ?, ?,?,?,?,?,?) `;
    const check_query = `SELECT * FROM contest WHERE match_id=?`;
  
    const connection = await db_promise.getConnection();
  
    try {
      await connection.beginTransaction();
  
      const [existingMatch] = await connection.execute(check_query, [matchId]);
  
      if (existingMatch.length) {
        throw new Error("Match already in list");
      }
  
      const liveStatus = "upcoming";
  
      for (const contest_data of default_contest) {
        await connection.execute(contest_query, [
          matchId,
          contest_data.contest_id,
          contest_data.prize_pool,
          contest_data.entry_fee,
          contest_data.total_spots,
          contest_data.total_spots,
          contest_data.platform_fee,
          contest_data.platform_filler_fee,
          contest_data.type,
          contest_data.minimum_players,
          JSON.stringify(contest_data.prize_order),
          liveStatus,
        ]);
      }
  
      await connection.execute(query, [
        m_data.match_id,
        m_data.match_time,
        m_data.date_wise,
        stringMatchData
      ]);
  
      await connection.commit();
  
      // scheduleMatchRemoval(m_data.match_id, m_data.date_wise, m_data.match_time);
  
      return res.json({ status: "Updated successfully" });
    } catch (error) {
      console.log(error)
      await connection.rollback();
      return res
        .status(500)
        .json({ status: "Error updating matches", error: error.message });
    } finally {
      connection.release();
    }
  });


  // const scheduleMatchRemoval = (matchId, dateWise, matchTime) => {
  //   const dateStr = dateWise.split(",")[0];
  //   const matchDatetimeStr = `${matchTime} ${dateStr}`;
  //   const matchDate = new Date(matchDatetimeStr);
  //   const now = new Date();
  
  //   const delay = matchDate.getTime() - now.getTime();
  
   
  //   msToTime(delay);
  
  //   if (delay > 0) {
  //     setTimeout(async () => {
  //       try {

  //         const checkMatchQuery = `SELECT * FROM matches WHERE match_id=?`;

  //         const res = await db_promise.execute(checkMatchQuery,[matchId]);

  //         let match_data = read_matches(upcomingPath).data;
  //         let  m_data = match_data.find((match) => match.match_id === matchId);
  //         m_data = JSON.stringify(m_data);

  //         if(res[0].length != 0){
  
  //         const delete_query = `DELETE FROM matches WHERE match_id =?`;
  //         const updateLiveStatus = `UPDATE contest SET status = ? WHERE match_id = ?`;
  //         const updateLiveStatusRegisteredContest = `UPDATE registered_contest SET status = ? WHERE match_id = ?`;
  //         const updateLiveStatusContest = `UPDATE contest SET status = ? WHERE match_id = ?`;
  
  //         await db_promise.execute(updateLiveStatusRegisteredContest, [
  //           "live",
  //           matchId,
  //         ]);
  //         await db_promise.execute(updateLiveStatusContest, ["live", matchId]);
  //         await db_promise.execute(updateLiveQuery, [
  //           matchId,
  //           matchTime,
  //           dateWise,
  //           m_data
  //         ]);
  //         await db_promise.execute(updateLiveStatus, ["live", matchId]);
  //         let result = await db_promise.execute(delete_query, [matchId]);
  //         console.log(`Match ${matchId} removed from selected matches`);
  //         }

  //       } catch (error) {
  //         console.error(`Error removing or updating  match ${matchId}:`, error);
  //       }
  //     }, delay);
  //   } else {
  //     console.log(
  //       `Match ${matchId} is already live or in the past. No timeout set.`
  //     );
  //   }
  // };
  

//   function msToTime(milliseconds) {
//     const hours = String(Math.floor(milliseconds / (1000 * 60 * 60))).padStart(
//       2,
//       "0"
//     );
//     const minutes = String(
//       Math.floor((milliseconds % (1000 * 60 * 60)) / (1000 * 60))
//     ).padStart(2, "0");
//     const seconds = String(
//       Math.floor((milliseconds % (1000 * 60)) / 1000)
//     ).padStart(2, "0");
  
//     console.log(`${hours}:${minutes}:${seconds}`);
// }


// scheduleMatchRemoval(6789,"27 Feb 2025, Wednesday", "02:12:40 PM");//

module.exports = router;
