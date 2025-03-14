const express = require("express");
const router = express.Router();
const { db, db_promise } = require("../../database/db");
const {read_matches} = require('../../utils/readFile')
const upcomingPath = require('../../utils/filePath');

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

router.post('/admin/extendMatch/:id', async (req,res)=>{

  const matchId = parseInt(req.params.id);
  let {match_time} = req.body
  match_time = extendMinutes(match_time)
  
  
  let match_data = read_matches(upcomingPath).data;
  
  let m_data = match_data.find((match) => match.match_id === matchId);

  
  // const extendQuery = 'UPDATE matches SET match_time=? WHERE match_id=?';

  try{

    // const result = await db_promise.execute(extendQuery,[match_time,matchId]);
    const result = await db_promise.execute("SELECT * FROM matches ;",[matchId]);

    console.log(result);
    console.log(matchId);
    
    
    return res.send(200).status({status : 'completed'})

  }catch(error){
    res.status(500).send({Error : 'Internal server error'})
  }

})


router.post("/admin/makeLive/:id", async (req, res) => {

  const matchId = parseInt(req.params.id);
  const {date_wise,match_time} = req.body;

  try {
    const checkMatchQuery = `SELECT * FROM matches WHERE match_id=?`;

    const ress = await db_promise.execute(checkMatchQuery, [matchId]);

    let match_data = read_matches(upcomingPath).data;

    let m_data = match_data.find((match) => match.match_id === matchId);
    // console.log(m_data)

    m_data = JSON.stringify(m_data);

    if (ress[0].length != 0) {
      const delete_query = `DELETE FROM matches WHERE match_id =?`;
      const updateLiveQuery = `INSERT INTO live_match_data (match_id,match_time,date_wise,match_data) VALUES (?,?,?,?)`;
      const updateLiveStatusRegisteredContest = `UPDATE registered_contest SET status = ? WHERE match_id = ?`;
      const updateLiveStatusContest = `UPDATE contest SET status = ? WHERE match_id = ?`;

      await db_promise.execute(updateLiveStatusRegisteredContest, ["live",matchId,]);
      await db_promise.execute(updateLiveStatusContest, ["live", matchId]);
      await db_promise.execute(updateLiveQuery, [matchId,match_time,date_wise,m_data,]);
      
      let result = await db_promise.execute(delete_query, [matchId]);
      console.log(`Match ${matchId} removed from selected matches`);
      console.log(`Match ${matchId} is Live Now`)

      return res.status(200).send({"status" : 'match is live'})
      
    }
  } catch (error) {
    console.error(`Error removing or updating  match ${matchId}:`, error);
  }
});

module.exports = router;
