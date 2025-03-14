const express = require('express');
const router = express.Router();

const { validateJWT, generateJWT } = require('../../utils/jwt_users.js')
const { db, db_promise } = require('../../database/db.js');


router.get('/api/matches', (req, res) => {

    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      const query = "select * from matches ORDER BY s_no";
      db.query(query, (err, result) => {
        if (err) {
          res.status(500).json({ error: "Fetch Failed" })
          return;
        }
        res.json(result)
        return;
      })
  
    }
    catch (error) {
      res.json({
        status: "failed",
        msg: "Invalid or expired token"
      })
      return;
    }
  });
  router.get('/api/match/:id', async (req, res) => {
  
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      let id = req.params.id;
      if (!Number.isInteger(Number(id))) {
        res.status(400).json({ error: "Invalid match ID" });
        return;
      }
      let match_query = "SELECT * FROM matches WHERE match_id=?"
      db.query(match_query, [id], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "Failed",
            msg: "Connection Error"
          })
        }
        if (!result.length) {
          return res.status(400).json({
            status: "Failed",
            msg: "No match data found"
          })
        }
        res.json(JSON.parse(result[0].match_data))
      })
  
  
    }
    catch (error) {
      res.status(400).json({
        status: "failed",
        msg: "Invalid or expired token"
      })
      return;
    }
  })
  
  router.get('/api/my-matches', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    if (!token) {
      return res.status(401).json({ status: "Failed", msg: "No token provided" });
    }
  
    try {
      let decoded_token = validateJWT(token);
      let userId = decoded_token.userId;
  
      let select_query = "SELECT match_id FROM registered_contest WHERE user_id=? and status='upcoming'";
      let live_query = "SELECT match_id FROM registered_contest WHERE user_id=? and status='live'";
  
      let user_upcoming_matches = [];
      let user_live_matches = [];
  
      // Fetch upcoming matches
      db.query(select_query, [userId], async (err, upcoming_result) => {
        if (err) {
          return res.status(500).json({ status: "Failed", error: "Connect Error" });
        }
  
        if (upcoming_result.length) {
          let matchIds = upcoming_result.map(match => match.match_id);
          let get_upcoming_match_query = `SELECT match_data FROM matches WHERE match_id IN (?)`;
  
          db.query(get_upcoming_match_query, [matchIds], (err, result) => {
            if (err) {
              return res.status(500).json({ status: "Failed", error: "Connection Error" });
            }
            user_upcoming_matches = result.map(matches => JSON.parse(matches.match_data));
  
            // Fetch live matches after upcoming matches are retrieved
            db.query(live_query, [userId], (live_err, live_result) => {
              if (live_err) {
                return res.status(500).json({ status: "Failed", error: "Conection Error" });
              }
  
              if (live_result.length) {
                let matchIds = live_result.map(match => match.match_id);
                let get_live_match_query = `SELECT match_data FROM live_match_data WHERE match_id IN (?)`;
  
                db.query(get_live_match_query, [matchIds], (live_match_err, live_match_result) => {
                  if (live_match_err) {
                    return res.status(500).json({ status: "Failed", error: "Conection Error" });
                  }
                  user_live_matches = live_match_result.map(match => JSON.parse(match.match_data));
  
                  return res.json({ upcoming_matches: user_upcoming_matches, live_matches: user_live_matches });
                });
              } else {
                return res.json({ upcoming_matches: user_upcoming_matches, live_matches: [] });
              }
            });
          });
        } else {
          // If no upcoming matches, continue to fetch live matches
          db.query(live_query, [userId], (live_err, live_result) => {
            if (live_err) {
              return res.status(500).json({ status: "Failed", error: "Conection Error" });
            }
  
            if (live_result.length) {
              let matchIds = live_result.map(match => match.match_id);
              let get_live_match_query = `SELECT match_data FROM live_match_data WHERE match_id IN (?)`;
  
              db.query(get_live_match_query, [matchIds], (live_match_err, live_match_result) => {
                if (live_match_err) {
                  return res.status(500).json({ status: "Failed", error: "Conection Error" });
                }
                user_live_matches = live_match_result.map(match => JSON.parse(match.match_data));
  
                return res.json({ upcoming_matches: [], live_matches: user_live_matches });
              });
            } else {
              return res.json({ upcoming_matches: [], live_matches: [] });
            }
          });
        }
      });
  
    } catch (err) {
      return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
    }
  });
  
  module.exports = router;
