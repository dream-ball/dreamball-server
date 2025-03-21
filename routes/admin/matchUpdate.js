const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");

// const {validateAdminJWT} = require('../../middleware/auth_admin.js');
const adminAuth = require('../../middleware/adminAuth');
const { db_promise } = require("../../database/db.js");
const { read_default_contest, readData } = require('../../utils/readFile.js')


router.get("/admin/upcomingMatches", adminAuth, (req, res) => {

  const token = req.header('Authorization')?.replace("Bearer ", "");

  // try{
  //   const decoded = validateAdminJWT(token)
  //   console.log(decoded)
  // }catch(error){
  //   console.log(error)
  //   console.log('token verificaiton failed')
  //   return res.status(401).json({'Token' : 'Invalid'});
  // }

  try {
    // const isTrue = validateJWT(token)
    let match_data = readData("./data/upcoming_match_data.json");
    res.json(match_data)
  } catch (error) {
    res.json({ token: 'not valid' });
  }
});

router.post("/admin/updateSelectedMatch/:id",adminAuth, async (req, res) => {
  const matchId = Number(req.params.id);
  let default_contest = read_default_contest();
  if (!default_contest.length) {
    return res.status(404).json({
      status: "Failed",
      data: "Cntest not found"
    })
  }
  let match_data = readData("./data/upcoming_match_data.json").data;
  let m_data = match_data.find((match) => match.match_id === matchId);
  let stringMatchData = JSON.stringify(m_data)
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
    return res.json({ status: "Updated successfully" });
  } catch (error) {
    console.log(error);
    await connection.rollback();
    return res
      .status(500)
      .json({ status: "Error updating matches", error: "Updation Failed" });
  } finally {
    connection.release();
  }
});

module.exports = router;
