const express = require("express");
const router = express.Router();

const {db, db_promise } = require("../../database/db.js");

router.get('/admin/live/matches', (req, res) => {
    let LiveMatchQuery = "SELECT * FROM live_match_data ORDER BY s_no"
    db.query(LiveMatchQuery, (err, result) => {
      if (err) {
        console.log(err);
        res.status(500).json({ msg: "Connection Failed" })
      }
      res.json(result)
    })
  })
  router.get('/admin/live/over/:match_id/:innings/:over_number', async (req, res) => {
    let { match_id, innings, over_number } = req.params
    let over_data = await getOverData(match_id, innings, over_number)
    res.json(over_data)
  })
  router.post("/admin/live/over/:match_id/update", async (req,
    res) => {
    const { match_id } = req.params;
    const { innings, over_number, bowler, overs, runs, wickets, team } = req.body;
  
    if (!innings || !over_number || !bowler || !overs || !wickets || !runs || !team) {
      return res.status(400).json({ error: "All fields are required" });
    }
    let over_score;
    let over_wickets;
    if (over_number == 1) {
      over_score = runs;
      over_wickets = wickets
    }
    else {
      let last_stored_over = `SELECT over_number, bowler, team, runs, score FROM overs WHERE match_id = ? AND innings = ? AND over_number < ? ORDER BY over_number DESC LIMIT 1`;
      let [last_stored_over_result] = await db_promise.execute(last_stored_over, [match_id, innings, over_number]);
      let [last_over_runs, last_over_wickets] = (last_stored_over_result[0].score).split("-").map(Number)
      over_score = parseInt(last_over_runs) + parseInt(runs)
      over_wickets = parseInt(last_over_wickets) + parseInt(wickets)
    }
  
    try {
      const over_data = await getOverData(match_id, innings, over_number);
  
      let over_id;
  
      if (!over_data) {
        const insertQuery = `
          INSERT INTO overs (match_id, over_number, bowler, runs, score, wickets, team, innings)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const [result] = await db_promise.execute(insertQuery, [
          match_id,
          over_number,
          bowler,
          runs,
          `${over_score}-${over_wickets}`,
          wickets,
          team,
          innings,
        ]);
  
        over_id = result.insertId; // Get the ID of the newly inserted over
        console.log("Over data inserted successfully:", result);
      } else {
        // Update existing over data
        const updateQuery = `
          UPDATE overs
          SET bowler = ?, runs = ?, score = ?, wickets = ?, team = ?
          WHERE match_id = ? AND over_number = ? AND innings = ?
        `;
        const [result] = await db_promise.execute(updateQuery, [
          bowler,
          runs,
          `${over_score}-${over_wickets}`,
          wickets,
          team,
          match_id,
          over_number,
          innings,
        ]);
  
        over_id = over_data.over_id; // Use the existing over ID
        console.log("Over data updated successfully:");
      }
  
      // Insert or update ball-by-ball data (deliveries)
      if (Array.isArray(overs)) {
        await db_promise.execute('DELETE FROM deliveries WHERE over_id=?', [over_id])
  
        for (let index = 0; index < overs.length; index++) {
          const outcome = overs[index];
          try {
  
            await db_promise.execute(
              `INSERT INTO deliveries (over_id, ball_number, outcome) 
               VALUES (?, ?, ?) 
               ON DUPLICATE KEY UPDATE outcome = VALUES(outcome)`,
              [over_id, index + 1, outcome]
            );
          } catch (err) {
            console.error("Error inserting delivery data:", err);
          }
        }
      } else {
        console.error("Invalid overs data:", overs);
      }
  
      return res.status(200).json({ message: "Over data processed successfully" });
    } catch (error) {
      console.error("Error processing over data:", error);
      return res.status(500).json({ error: "Failed to process over data" });
    }
  });
  router.post("/admin/close_over/:match_id", (req, res) => {
    const { match_id } = req.params;
  
    // Corrected SQL query
    let update_query = "UPDATE open_overs SET over_number = over_number + 1 WHERE match_id = ?";
  
    db.query(update_query, [match_id], (err, result) => {
      if (err) {
        console.error("Error updating over number:", err);
        return res.status(500).json({ error: "Internal Server Error" });
      }
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ error: "Match not found" });
      }
  
      res.json({ msg: "Over Updated" });
    });
  })

  module.exports = router;