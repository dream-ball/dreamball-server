const express = require('express');
const router = express.Router();
const { validateJWT } = require('../../utils/jwt_users.js')
const { db, db_promise } = require('../../database/db.js');
const { match_info } = require('../../match_data.js');

router.get('/api/live_match/:match_id/info/', async (req, res) => {
  let { match_id } = req.params
  const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
    let decoded_token = validateJWT(token);

    if (!Number.isInteger(Number(match_id))) {
      res.status(400).json({ error: "Invalid match ID" });
      return;
    }
    const [check_user_joined] = await db_promise.execute("SELECT * FROM registered_contest WHERE match_id=? AND user_id=? AND status='live' OR status='cancelled'", [match_id, decoded_token.userId])
    if (!check_user_joined.length) {
      return res.status(404).json({
        status: "Failed",
        msg: "Invalid request"
      })
    }

    let live_check_query = "SELECT * From live_match_data WHERE match_id=?"
    db.query(live_check_query, [match_id], async (live_check_err, live_check_result) => {
      if (live_check_err) {
        res.status(500).json({
          status: "Failed",
          error: 'Connection error'
        })
      }
      if (!live_check_result.length) {
        return res.status(404).json({
          status: "Failed",
          error: 'Macth not found'
        })
      }
      let matchData = await match_info(match_id)
      if (!matchData) {
        return res.status(404).json({
          status: "Failed",
          error: "Details not found"
        })
      }

      return res.json(matchData)

    })
  } catch (err) {
    console.log(err);
    return res.status(401).json({ status: "Failed", error: "Invalid or expired token" });
  }
})
router.get('/api/live_match/:match_id', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  let { match_id } = req.params
  try {
    let decoded_token = validateJWT(token);

    const [check_user_joined] = await db_promise.execute("SELECT * FROM registered_contest WHERE match_id=? AND user_id=? AND status='live' OR status='cancelled'", [match_id, decoded_token.userId])
    if (!check_user_joined.length) {
      return res.status(404).json({
        status: "Failed",
        msg: "Invalid request"
      })
    }

    if (check_user_joined[0].status == "ended") {
      return res.status(302).json({
        status: "Redirection",
        msg: "Match already ended"
      })
    }
    let live_match_fetch = "SELECT * FROM live_match_data WHERE match_id=? AND status='live'"

    db.query(live_match_fetch, [match_id], (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          msg: "Connection error"
        })
      }
      if (!result.length) {
        return res.status(404).json({
          status: "Failed",
          msg: "Match data not found"
        })
      }
      return res.json(result[0])
    })
  } catch (err) {
    return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });

  }
})
router.get('/api/live_match/contest/:match_id', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  let { match_id } = req.params
  try {
    let decoded_token = validateJWT(token);

    let registered_contest_fetch = "SELECT * FROM registered_contest WHERE match_id=? and status='live' OR status='cancelled'";

    db.query(registered_contest_fetch, [match_id], async (err, result) => {
      if (err) {
        return res.status(500).json({
          status: "Failed",
          msg: "Connection error"
        })
      }
      if (!result.length) {
        return res.status(404).json({
          status: "Failed",
          msg: "Match data not found"
        })
      }
      let contest_list = new Set();
      result.map(contest => contest_list.add(contest.contest_id))
      let conetsIds = [...contest_list].join(", ");


      let contest_query = `SELECT * FROM contest WHERE match_id=? and contest_id IN (${conetsIds})`;
      let contest_query_result = await db_promise.execute(contest_query, [match_id])

      return res.json(contest_query_result[0])
    })
  } catch (err) {
    return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });

  }
})

router.post('/api/submit/users/over_data/', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
    let decoded_token = validateJWT(token)
    let { match_id, over_number, innings } = req.body
    if (!match_id || !over_number || !innings) {
      return res.status(400).json({
        status: "Failed",
        error: "Invalid Data Sent"
      })
    }
    const [check_user_joined] = await db_promise.execute("SELECT * FROM registered_contest WHERE match_id=? AND user_id=? AND status='live'", [match_id, decoded_token.userId])
    if (!check_user_joined.length) {
      return res.status(404).json({
        status: "Failed",
        msg: "Invalid request"
      })
    }


    const [check_open_over] = await db_promise.execute('SELECT * FROM open_overs WHERE match_id=? and over_number=? and innings=?', [match_id, over_number, innings])
    if (!check_open_over.length) {
      return res.status(404).json({
        "status": "Failed",
        "msg": "Over is Ongoing"
      })
    }
    const { fours, sixes, runs, wickets, dots } = req.body;
    const validOptions = {
      fours: ['1 - 2', 'More than 2', 'No Four'],
      sixes: ['1 - 2', 'More than 2', 'No Sixes'],
      runs: ['1 - 5', '6 - 10', 'More than 10', 'No Runs'],
      wickets: ['1', '2', 'More than 2', 'No Wickets'],
      dots: ['1 Dot', '2 Dots', '3 Dots', 'More than 3'],
    };

    const isValid = (
      (fours === null || validOptions.fours.includes(fours)) &&
      (sixes === null || validOptions.sixes.includes(sixes)) &&
      (runs === null || validOptions.runs.includes(runs)) &&
      (wickets === null || validOptions.wickets.includes(wickets)) &&
      (dots === null || validOptions.dots.includes(dots))
    );

    if (!isValid) {
      return res.status(400).json({ error: "Invalid options selected. Please check your inputs." });
    }

    const query = `
            INSERT INTO user_over_data (user_id, match_id, innings, over_number, four, six, run, wicket, dot)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    ON DUPLICATE KEY UPDATE
      four = VALUES(four),
      six = VALUES(six),
      run = VALUES(run),
      wicket = VALUES(wicket),
      dot = VALUES(dot);
      
        `;
    const values = [decoded_token.userId, match_id, innings, over_number, fours, sixes, runs, wickets, dots];

    db.query(query, values, (err, result) => {
      if (err) {
        return res.status(500).json({ error: "Connection Error" });
      }
      res.json({ success: true, msg: "Over data saved successfully", data: result });
    });
  }
  catch (err) {
    return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });

  }
});

router.post('/api/user/selected_options/', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const { match_id, over_number, innings } = req.body
  try {
    const decoded_token = validateJWT(token)
    if (!match_id || !over_number || !innings) {
      return res.status(404).json({
        status: "Failed",
        msg: "Invalid data sent"
      })
    }
    const [check] = await db_promise.execute("SELECT * FROM open_overs WHERE match_id=? AND over_number=? and innings=?", [match_id, over_number, innings])
    console.log(check);
    if (!check.length) {
      return res.status(404).json({ status: "Failed", msg: "Invalid request" });
    }
    const [options] = await db_promise.execute("SELECT * FROM user_over_data WHERE user_id=? AND match_id=? AND over_number=? AND innings=?", [decoded_token.userId, match_id, over_number, innings])
    console.log(options);
    res.json(options)
  } catch (error) {
    return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });

  }
})

router.get('/api/live/user/history/:match_id', async (req, res) => {
  const { match_id } = req.params
  const token = req.header('Authorization')?.replace('Bearer ', '');
  try {
    const decoded_token = validateJWT(token)
    if (!match_id) {
      return res.status(404).json({
        status: "Failed",
        msg: "Invalid Match ID"
      })
    }

    const [user_inputs_1] = await db_promise.execute("SELECT * FROM user_over_data WHERE match_id= ? AND user_id=? AND innings =1", [match_id, decoded_token.userId])
    const [user_inputs_2] = await db_promise.execute("SELECT * FROM user_over_data WHERE match_id= ? AND user_id=? AND innings =2", [match_id, decoded_token.userId])
    let user_inputs = {}
    if (!user_inputs_1.length) {
      user_inputs["1"] = []
    }
    else {
      user_inputs["1"] = user_inputs_1
    }
    if (!user_inputs_2.length) {
      user_inputs["2"] = []
    }
    else {
      user_inputs["2"] = user_inputs_2
    }
    res.json([user_inputs])
  } catch (error) {
    return res.status(401).json({ status: "Failed", msg: "Invalid or expired token" });
  }
})
module.exports = router;
