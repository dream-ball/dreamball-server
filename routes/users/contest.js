const express = require('express');
const router = express.Router();

const { validateJWT} = require('../../middleware/jwt_token.js')
const { db, db_promise } = require('../../database/db.js');
const { timeLeft } = require("../../scripts/script.js");


router.get('/api/contest/:id', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token);
      let id = req.params.id;
      if (!Number.isInteger(Number(id))) {
        res.status(400).json({ error: "Invalid match ID" });
        return;
      }
      const query = `select * from contest where match_id= ? and status ='upcoming'`;
  
      db.query(query, [id], async (err, result) => {
        if (err) {
          res.status(500).json({ "error": err.message })
          return;
        }
        if (result.length == 0) {
          res.json({
            status: "Failed",
            msg: "No data found"
          });
          return;
        }
        res.json({ contest: result })
      })
    }
    catch (error) {
      if (error.message == "Invalid or expired token") {
        return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
  
      } else {
        return res.status(500).json({ status: "Failed", msg: error.message });
      }
    }
  })


router.post('/api/register/contest/:contest_id', async (req, res) => {
    const { match_id } = req.body;
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const contest_id = req.params.contest_id;
  
    try {
      // Validate JWT
      const decoded_token = validateJWT(token);
      if (!decoded_token || !decoded_token.userId) {
        return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
      }
  
      // Validate input
      if (!Number.isInteger(Number(contest_id)) || !Number.isInteger(Number(match_id))) {
        return res.status(400).json({ error: "Invalid ID" });
      }
  
      // Check if match exists and has not started
  
      const match_status = "SELECT match_time,date_wise FROM matches WHERE match_id = ?";
      const [match] = await db_promise.execute(match_status, [match_id]);
  
      if (!match.length) {
        return res.status(404).json({ status: "Failed", msg: "Match not found" });
      }
      if (timeLeft(match[0].date_wise, match[0].match_time) === "Live" || timeLeft(match[0].date_wise, match[0].match_time) == null) {
        return res.status(400).json({ status: "Failed", msg: "The Match is Live" });
      }
  
      // Check if contest exists
      const contest_check = "SELECT entry_fee FROM contest WHERE match_id = ? AND contest_id = ?";
      const [contest] = await db_promise.execute(contest_check, [match_id, contest_id]);
      if (!contest.length) {
        return res.status(404).json({ status: "Failed", msg: "Contest not found" });
      }
  
      // Check user funds
      const handle_fund = "SELECT funds FROM user_details WHERE user_id = ?";
      const [user] = await db_promise.execute(handle_fund, [decoded_token.userId]);
      if (!user.length) {
        return res.status(404).json({ status: "Failed", msg: "User not found" });
      }
      const entry_fee = contest[0].entry_fee;
      if (user[0].funds < entry_fee) {
        return res.status(400).json({ status: "Failed", msg: "Insufficient Funds" });
      }
  
      // Check if user is already registered
      const check_register = "SELECT * FROM registered_contest WHERE user_id = ? AND match_id = ? AND contest_id = ?";
      const [existingRegistration] = await db_promise.execute(check_register, [decoded_token.userId, match_id, contest_id]);
      if (existingRegistration.length > 0) {
        return res.status(400).json({ status: "Failed", msg: "User Already Registered In The Contest" });
      }
  
      //check wheather the contest is not full
      const spots_check_query = "SELECT spots_available FROM contest WHERE match_id=? AND contest_id=?"
      const [spots_check] = await db_promise.execute(spots_check_query, [match_id, contest_id])
      if (spots_check[0].spots_available == 0) {
        return res.status(400).json({ status: "Failed", msg: "The contest is already full" });
      }
  
  
      // Start transaction
      const connection = await db_promise.getConnection();
  
      try {
        await connection.beginTransaction();
  
        // Deduct funds
        const deductFundsQuery = 'UPDATE user_details SET funds = funds - ? WHERE user_id = ?';
        await connection.execute(deductFundsQuery, [entry_fee, decoded_token.userId]);
  
        // Register user
        const registerContestQuery = `
          INSERT INTO registered_contest (user_id, match_id, contest_id, entry_fee)
          VALUES (?, ?, ?, ?)
        `;
        await connection.execute(registerContestQuery, [decoded_token.userId, match_id, contest_id, entry_fee]);
  
        //Increase Register Count
        const update_count = "UPDATE contest SET spots_available=spots_available-1 WHERE contest_id=? and match_id=?"
        await connection.execute(update_count, [contest_id, match_id]);
  
        // Commit transaction
        await connection.commit();
        return res.status(200).json({ status: "Success", msg: "Join Success" });
  
      } catch (error) {
        // Rollback transaction on error
        await connection.rollback();
        console.error("Transaction error:", error);
        return res.status(500).json({ status: "Failed", msg: "Join Failed" });
  
      } finally {
        // Release connection
        connection.release();
      }
  
    } catch (error) {
      if (error.message == "Invalid or expired token") {
        return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
  
      } else {
  
        return res.status(500).json({ status: "Failed", msg: error.message });
  
      }
    }
  });
  router.get('/api/user/contest/:match_id', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      let match_id = req.params.match_id;
      let query = "SELECT * FROM registered_contest WHERE user_id=? and match_id=?"
      db.query(query, [decoded_token.userId, match_id], (err, result) => {
        if (err) {
          res.status(500).json({
            status: "Failed",
            msg: "DataBase connection error"
          })
  
        }
        if (!result.length) {
          return res.status(200).json({
            status: "success",
            msg: "No contest's joined"
          })
        }
        return res.json(result)
      })
  
    } catch (error) {
      return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
  
    }
  })
  router.get('/api/rankings/:match_id/:contest_id', async (req, res) => {
  
    try {
      let { match_id, contest_id } = req.params;
      let match_query = "SELECT * FROM contest WHERE match_id=? and contest_id=?"
      let match_query_result = await db_promise.execute(match_query, [match_id, contest_id])
      let query_result = match_query_result[0]
      if (!query_result.length) {
        return res.status(400).json({
          status: "Failed",
          msg: "No match data found"
        })
      }
      result = query_result[0]
      let max_prize = JSON.parse(result.prize_order)
      let prize_order = []
      for (const [stage, value] of Object.entries(max_prize)) {
        const [rankPart, prize] = value.split(':');
        let order_temp = []
        if (rankPart.includes('-')) {
          const [startRank, endRank] = rankPart.split('-').map(Number);
          order_temp.push(startRank, endRank, Number(prize))
          prize_order.push(order_temp)
        } else {
          // Handle single rank
          const rank = parseInt(rankPart, 10);
          order_temp.push(rank, rank, Number(prize))
          prize_order.push(order_temp)
        }
      }
  
      let registeredPlayers = result.total_spots - result.spots_available;
      let totalEntry = result.total_spots;
      let entryFee = result.entry_fee
      let platformFeeFilled = result.platform_filler_fee
      let platformFeePercentNotFilled = result.platform_fee
      const cnFilled = registeredPlayers === totalEntry;
      let current_fill;
  
  
      if (registeredPlayers < result.minimum_players) {
        current_fill = {
          data: "Winners will be added soon...!"
        }
      }
      else {
        current_fill = ranking_order(registeredPlayers,
          entryFee,
          platformFeeFilled,
          platformFeePercentNotFilled,
          prize_order,
          cnFilled)
      }
      let max_fill = ranking_order(totalEntry,
        entryFee,
        platformFeeFilled,
        platformFeePercentNotFilled,
        prize_order,
        true)
      if (result.type == "practice") {
        return res.json({ data: "Practice contest" })
      }
      res.json({ max_fill, current_fill })
  
  
    } catch (error) {
      console.log(error);
      return res.status(400).json({
        status: "Failed",
        msg: "Invalid or expired token"
      })
    }
  })

  module.exports = router;