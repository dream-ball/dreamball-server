const express = require("express");
const router = express.Router();
const { db, db_promise } = require("../../database/db");
const { readData, writeFile } = require('../../utils/readFile')


function extendMinutes(timeStr) {
  return timeStr.replace(/:(\d{2})/, (match, minute) => {
    let newMinute = parseInt(minute) + 10;
    if (newMinute >= 60) {
      newMinute -= 60; // Wrap around minutes
    }
    return `:${String(newMinute).padStart(2, '0')}`;
  });
}

router.get("/admin/getSelectedMatch", (req, res) => {
  let query = `SELECT * FROM matches ORDER BY s_no`;

  db.query(query, (err, result) => {
    if (err) {
      console.error("Error getting data:", err);
      return res.status(500).json({
        status: "error",
        message: "Failed to retrieve matches",
        error: err,
      });
    }
    res.json(result);
  });
});

router.post("/admin/removeSelectedMatch/:id", async (req, res) => {
  const matchid = req.params.id;
  let deleteQuery = `DELETE FROM matches WHERE match_id=?`;
  let deleteContestQuery = `DELETE FROM contest WHERE match_id=?`;

  const connection = await db_promise.getConnection();
  try {
    await connection.beginTransaction();
    await connection.execute(deleteQuery, [matchid]);
    await connection.execute(deleteContestQuery, [matchid]);

    await connection.commit();
    return res.json({ status: "Updated successfully" });
  } catch (error) {
    return res.json({ status: "Failed to delete match and contest" });
  }
});

router.post('/admin/extendMatch/:id', async (req, res) => {
  const matchId = parseInt(req.params.id);
  console.log(matchId);
  const checkMatchQuery = `SELECT * FROM matches WHERE match_id=?`;
  const [ress] = await db_promise.execute(checkMatchQuery, [matchId]);
  console.log(ress);
  match_time = extendMinutes(ress[0].match_time)
  
  let match_data = ress[0].match_data;

  // let m_data = match_data.find((match) => match.match_id === matchId);


  // const extendQuery = 'UPDATE matches SET match_time=? WHERE match_id=?';

  try {

    // const result = await db_promise.execute(extendQuery,[match_time,matchId]);
    const result = await db_promise.execute("SELECT * FROM matches ;", [matchId]);

    console.log(result);
    console.log(matchId);
    return res.status(200).send({ status: 'completed' })
  } catch (error) {
    res.status(500).send({ Error: 'Internal server error' })
  }

})

router.post("/admin/makeLive/:id", async (req, res) => {
  const matchId = parseInt(req.params.id);
  const connection = await db_promise.getConnection();

  try {
    await connection.beginTransaction(); // Start Transaction

    const checkMatchQuery = `SELECT * FROM matches WHERE match_id=?`;
    const [ress] = await connection.execute(checkMatchQuery, [matchId]);

    if (ress.length === 0) {
      await connection.rollback(); // Rollback if match not found
      return res.status(404).json({ status: "Match not found" });
    }

    const { date_wise, match_time, match_data: m_data } = ress[0];

    const delete_query = `DELETE FROM matches WHERE match_id =?`;
    const updateLiveQuery = `INSERT INTO live_match_data (match_id, match_time, date_wise, match_data) VALUES (?, ?, ?, ?)`;
    const updateLiveStatusRegisteredContest = `UPDATE registered_contest SET status = ? WHERE match_id = ?`;
    const updateLiveStatusContest = `UPDATE contest SET status = ? WHERE match_id = ?`;
    const openOverQuery = `INSERT INTO open_overs (match_id, innings, over_number) VALUES (?, ?, ?)`;

    await connection.execute(updateLiveStatusRegisteredContest, ["live", matchId]);
    await connection.execute(updateLiveStatusContest, ["live", matchId]);
    await connection.execute(updateLiveQuery, [matchId, match_time, date_wise,m_data]);
    await connection.execute(openOverQuery, [matchId, 1, 1]);

    await connection.execute(delete_query, [matchId]);

    await connection.commit(); // Commit transaction if all queries succeed

    console.log(`Match ${matchId} removed from selected matches`);
    console.log(`Match ${matchId} is Live Now`);

    return res.status(200).json({ status: "Match is live" });

  } catch (error) {
    await connection.rollback(); // Rollback on error
    console.error(`Error making match ${matchId} live:`, error);
    return res.status(500).json({ status: "Error making match live", error: error.message });

  } finally {
    connection.release(); // Release connection
  }
});


module.exports = router;
