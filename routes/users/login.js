const express = require('express');
const router = express.Router();

const {  generateJWT } = require('../../utils/jwt_users.js')
const { db, db_promise } = require('../../database/db.js');



router.post('/api/login', (req, res) => {

    try {
  
      let { mail_id, password } = req.body
      if (mail_id == "" || password == "") {
        throw new Error("Maild not found");
  
  
      }
      let query = `select * from user_details where mail_id=?`;
      db.query(query, [mail_id], (err, result) => {
        if (err) {
          return res.status(500).json({
            status: "failed",
            msg: "unknown error occured"
          })
        }
  
        if (result.length == 0) {
          res.json({
            status: "Login Failed",
            msg: "Mail id or password is in correct"
          })
          return;
        }
        if (password == result[0].user_token) {
          const jwt_token = generateJWT(result[0].user_id);
          res.json({
            status: "success",
            auth_token: jwt_token
          })
          return;
        }
  
        else {
          res.json({
            status: "Login Failed",
            msg: "Mail id or password is in correct"
          })
          return;
        }
      })
    } catch (err) {
      res.json({
        status: "failed",
        msg: "Enter all the fields"
      })
    }
  
  })
  module.exports = router;
