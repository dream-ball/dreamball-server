const express = require("express");
const router = express.Router();
const { db, db_promise } = require("../../database/db");
const adminAuth = require("../../middleware/adminAuth");

router.get("/admin/getLiveMatches", adminAuth, (req, res) => {

  let getLiveQuery = "SELECT * FROM live_match_data WHERE status='live'";
  db.query(getLiveQuery, (error, result) => {
    if (error) {
      return res
        .status(500)
        .json({ status: "failed", message: "connection error" });
    }

    return res.json(result);
  });
});


// router.post('/admin/abortLiveMatch/:id',adminAuth, async (req, res) => {
//   const matchId = parseInt(req.params.id);
//   const {match_time,date_wise,match_data} = req.body;

//   try {
//     const insertMatchQuery = `INSERT INTO matches (match_id,match_time,date_wise,match_data) VALUES (?,?,?,?)`;
//     const deleteLiveMatchData = `DELETE FROM live_match_data WHERE match_id = ?`;
//     const revertLiveStatusRegisteredContest = `UPDATE registered_contest SET status = ? WHERE match_id = ?`;
//     const revertLiveStatusContest = `UPDATE contest SET status = ? WHERE match_id = ?`;
//     console.log(`Reverting match ${matchId} to previous state`);
//     await db_promise.execute(insertMatchQuery, [matchId,match_time,date_wise,match_data]);
//     await db_promise.execute(deleteLiveMatchData, [matchId]);
//     await db_promise.execute(revertLiveStatusRegisteredContest, ["upcoming",matchId]);
//     await db_promise.execute(revertLiveStatusContest, ["upcoming", matchId]);
//     console.log(`Match ${matchId} added back to selected matches`);
//     console.log(`Match ${matchId} is no longer live`);

//     res.status(200).send({status: 'Match reverted successfully!'});
//   } catch (error) {
//     console.log('Error ', error);
//     res.status(500).send({status: 'Internal server error'});
//   }
// });

router.get('/admin/cancelMatch/:matchId', async (req, res) => {
  let { matchId } = req.params;
  try {
    const deleteLiveMatchData = `UPDATE live_match_data SET status='ended' WHERE match_id = ?`;
    const revertLiveStatusRegisteredContest = `UPDATE registered_contest SET status = 'ended' WHERE match_id = ?`;
    const revertLiveStatusContest = `UPDATE contest SET status ='ended' WHERE match_id = ?`;
    console.log(`Initiating refund for match ${matchId}...`);

    // Fetch users who joined the contest
    const [users] = await db_promise.execute(
      "SELECT user_id, entry_fee FROM registered_contest WHERE match_id=? AND status='live'",
      [matchId]
    );
    for (const user of users) {
      await db_promise.execute(
        "UPDATE user_details SET deposits = deposits + ? WHERE user_id = ?",
        [user.entry_fee, user.user_id]
      );
    }

    console.log(`Canceling match ${matchId}...`);
    await db_promise.execute(deleteLiveMatchData, [matchId]);
    await db_promise.execute(revertLiveStatusRegisteredContest, [matchId]);
    await db_promise.execute(revertLiveStatusContest, [matchId]);

    res.status(200).send({ status: 'Match cancelled successfully!' });
  } catch (error) {
    console.error('Error cancelling match:', error.message);
    res.status(500).send({ status: 'Internal server error' });
  }
});

module.exports = router;


router.get('/admin/initiateRefund', adminAuth, (req, res) => {

  res.send({ status: 'initiate refund' })
})

module.exports = router;
