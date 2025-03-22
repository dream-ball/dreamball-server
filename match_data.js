const fs = require('fs');
const { db, db_promise } = require('./database/db.js');
const readData = (fileName) => {
    if (fs.existsSync(fileName)) {
        const data = fs.readFileSync(fileName);
        return JSON.parse(data);
    }
    else {
        return `${fileName} not found`
    }
};
const writeData = (fileName, data) => {
    fs.writeFileSync(fileName, JSON.stringify(data, null, 2));
};
// async function upload_overs() {
//     let overData = await readData('./data/overs_data.json');
//     for (const matchId in overData) {
//         const inningsData = overData[matchId];
//         let last_stored_over = "SELECT * FROM overs WHERE match_id = ? ORDER BY innings DESC, over_number DESC LIMIT 1;";
//         let [last_stored_over_result] = await db_promise.execute(last_stored_over, [matchId]);
//         let last_innings = 1;
//         let last_bowled_over = 1;
//         if (last_stored_over_result.length > 0) {
//             last_innings = last_stored_over_result[0].innings;
//             last_bowled_over = last_stored_over_result[0].over_number;
//         }
//         let new_over_data = {};
//         for (const innings in inningsData) {
//             let data = [];
//             inningsData[innings].forEach(async (overData) => {
//                 let teamInfo = overData.team;
//                 console.log(teamInfo);
//                 if ((parseInt(innings) == last_innings && teamInfo.over >= last_bowled_over) || parseInt(innings) > last_innings) {
//                     data.push(overData);
//                     try {
//                         let [result] = await db_promise.execute(
//                             `INSERT INTO overs (match_id, over_number, bowler, runs, score, wickets, team, innings)
//                             VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
//                             ON DUPLICATE KEY UPDATE 
//                             bowler= VALUES(bowler),
//                             runs = VALUES(runs), 
//                             score = VALUES(score),     
//                             wickets = VALUES(wickets)`,
//                             [
//                                 matchId,
//                                 teamInfo.over,
//                                 teamInfo.bowler,
//                                 teamInfo.runs,
//                                 teamInfo.score,
//                                 teamInfo.wkts,
//                                 teamInfo.team,
//                                 innings
//                             ]
//                         );

//                         let overId = result.insertId;
//                         if (!overId) {
//                             const fetchOverIdQuery = `SELECT id FROM overs WHERE match_id = ? AND over_number = ? AND innings = ?`;
//                             const [overResult] = await db_promise.execute(fetchOverIdQuery, [matchId, teamInfo.over, innings]);

//                             if (overResult.length > 0) {
//                                 overId = overResult[0].id;
//                             } else {
//                                 console.error("Error: Over ID not found for match", matchId, "over", teamInfo.over);
//                                 return;
//                             }
//                         }
//                         for (let index = 0; index < overData.overs.length; index++) {
//                             let outcome = overData.overs[index];
//                             try {
//                                 await db_promise.execute(
//                                     `INSERT INTO deliveries (over_id, ball_number, outcome) 
//                                     VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE outcome=VALUES(outcome)`,
//                                     [overId, index + 1, outcome]
//                                 );
//                             } catch (err) {
//                                 console.error("Error inserting delivery data:", err);
//                             }
//                         }
//                     } catch (err) {
//                         console.error("Error inserting over data:", err);
//                     }
//                 }
//             });
//             new_over_data[innings] = data;
//         }
//     }
// }

async function upload_overs() {
    let overData = await readData('./data/overs_data.json');

    for (const matchId in overData) {
        const inningsData = overData[matchId];
        let last_sotred_over = "SELECT * FROM overs WHERE match_id = ? ORDER BY innings DESC, over_number DESC LIMIT 1;"
        let [last_stored_over_result] = await db_promise.execute(last_sotred_over, [matchId])
        let last_innings = 1;
        let last_bowled_over = 1;

        if (last_stored_over_result.length > 0) {
            last_innings = last_stored_over_result[0].innings;
            last_bowled_over = last_stored_over_result[0].over_number;
        }
        let new_over_data = {}
        for (const innings in inningsData) {
            let data = []
            inningsData[innings].forEach(overData => {
                let teamInfo = overData.team
                if ((parseInt(innings) == last_innings && teamInfo.over >= last_bowled_over) || parseInt(innings) > last_innings) {
                    data.push(overData)
                    db.query(
                        `INSERT INTO overs (match_id, over_number, bowler, runs, score, wickets, team,innings)
                         VALUES (?, ?, ?, ?, ?, ?, ?, ?) 
                         ON DUPLICATE KEY UPDATE 
                         runs = VALUES(runs), 
                         score = VALUES(score),     
                         wickets = VALUES(wickets)`,
                        [
                            matchId,
                            teamInfo.over,
                            teamInfo.bowler,
                            teamInfo.runs,
                            teamInfo.score,
                            teamInfo.wkts,
                            teamInfo.team,
                            innings
                        ],
                        async (err, result) => {
                            if (err) {
                                console.error("Error inserting over data:", err);
                            } else {
                                let overId = result.insertId;
                                if (!overId) {
                                    const fetchOverIdQuery = `SELECT id FROM overs WHERE match_id = ? AND over_number = ? AND innings = ?`;
                                    const [overResult] = await db_promise.execute(fetchOverIdQuery, [matchId, teamInfo.over, innings]);
                                    overId = overResult[0].id
                                }
                                overData.overs.forEach((outcome, index) => {
                                    db.query(
                                        `INSERT INTO deliveries (over_id, ball_number, outcome) VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE outcome=VALUES(outcome)`,
                                        [overId, index + 1, outcome]
                                        , (err, result) => {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                //a code perform any opration aftert the success updations of over details
                                            }

                                        });
                                });
                            }
                        }
                    );
                }
            })
            new_over_data[innings] = data
        }
        // console.log(JSON.stringify(new_over_data));

    }

}
async function getOversData(matchId) {
    try {
        // Fetch all overs and deliveries in one go
        let getOversQuery = `
            SELECT o.id AS over_id, o.innings, o.over_number, o.bowler, 
                   o.runs, o.score, o.wickets, o.team, d.ball_number, d.outcome
            FROM overs o
            LEFT JOIN deliveries d ON o.id = d.over_id
            WHERE o.match_id = ?
            ORDER BY o.innings DESC, o.over_number DESC, d.ball_number ASC
        `;

        let [rows] = await db_promise.execute(getOversQuery, [matchId]);
        if (rows.length === 0) {
            return 0;
        }

        let matchData = {};

        for (const row of rows) {
            const { innings, over_number, over_id, bowler, runs, score, wickets, team, ball_number, outcome } = row;
            if (!matchData[innings]) {
                matchData[innings] = [];
            }
            let lastOver = matchData[innings].find(over => over.over_number === over_number);
            if (!lastOver) {
                lastOver = {
                    over_number,
                    bowler,
                    runs,
                    score,
                    wickets,
                    team,
                    overs: []
                };
                matchData[innings].push(lastOver);
            }
            if (ball_number !== null) {
                lastOver.overs.push(outcome);
            }
        }
        return matchData
    } catch (error) {
        console.error("Error fetching overs data:", error);
        return 0;
    }
}
async function getOverData(matchId, innings, overNumber) {
    try {

        // Query to fetch the specific over and its deliveries
        let getOverQuery = `
            SELECT o.id AS over_id, o.innings, o.over_number, o.bowler, 
                   o.runs, o.score, o.wickets, o.team, d.ball_number, d.outcome
            FROM overs o
            LEFT JOIN deliveries d ON o.id = d.over_id
            WHERE o.match_id = ? AND o.innings = ? AND o.over_number = ?
            ORDER BY d.ball_number ASC
        `;

        let [rows] = await db_promise.execute(getOverQuery, [matchId, innings, overNumber]);
        if (rows.length === 0) {
            return 0;
        }
        let overData = {
            over_id: rows[0].over_id,
            over_number: overNumber,
            bowler: rows[0].bowler,
            runs: rows[0].runs,
            score: rows[0].score,
            wickets: rows[0].wickets,
            team: rows[0].team,
            overs: []
        };
        for (const row of rows) {
            if (row.ball_number !== null) {
                overData.overs.push(row.outcome);
            }
        }
        return overData;
    } catch (error) {
        console.error("Error fetching over data:", error);
        return null;
    }
}
async function match_info(match_id) {
    let data = {}
    let oversData = await getOversData(match_id);
    if (!oversData) {
        oversData = {
            status: "Failed",
            error: "Overs not found"
        }
    }
    const [matchId] = db_promise.execute("SELECT match_id FROM refrence WHERE reference_id=?",[match_id])
    let matchInfo = await readData('./data/live_match_data.json').data
    let matchData = matchInfo.filter(match => match.match_id == matchId)
    if (!matchData.length) {
        matchData = {
            status: "Failed",
            error: "Match details not found"
        }
    }
    // else {
    //     let [team_a_score] = await db_promise.execute(
    //         "SELECT * FROM overs WHERE match_id = ? AND team = ? ORDER BY innings DESC, over_number DESC LIMIT 1",
    //         [match_id, matchData[0].team_a_short]
    //     );

    //     if (team_a_score.length) {
    //         matchData[0].team_a_scores = team_a_score[0].score;

    //         let [overs_count] = await db_promise.execute(
    //             "SELECT COUNT(*) FROM deliveries WHERE over_id = ?",
    //             [team_a_score[0].id]
    //         );

    //         matchData[0].team_a_over = `${team_a_score[0].over_number - 1}.${overs_count[0]['COUNT(*)']}`;
    //     } else {
    //         matchData[0].team_a_scores = "0-0";
    //         matchData[0].team_a_over = "0.0";
    //     }

    //     let [team_b_score] = await db_promise.execute(
    //         "SELECT * FROM overs WHERE match_id = ? AND team = ? ORDER BY innings DESC, over_number DESC LIMIT 1",
    //         [match_id, matchData[0].team_b_short]
    //     );

    //     if (team_b_score.length) {
    //         matchData[0].team_b_scores = team_b_score[0].score;

    //         let [overs_count] = await db_promise.execute(
    //             "SELECT COUNT(*) FROM deliveries WHERE over_id = ?",
    //             [team_b_score[0].id]
    //         );

    //         matchData[0].team_b_over = `${team_b_score[0].over_number - 1}.${overs_count[0]['COUNT(*)']}`;
    //     } else {
    //         matchData[0].team_b_scores = "0-0";
    //         matchData[0].team_b_over = "0.0";
    //     }
    // }
    let [open_over] = await db_promise.execute("SELECT * FROM open_overs WHERE match_id=?", [match_id])
    if (!open_over.length) {
        return 0
    }
    data["oversData"] = [oversData]
    data["matchInfo"] = matchData
    data["openOver"] = open_over
    return data
}
const options = {
    method: 'GET',
    headers: {
        'x-rapidapi-key': '8c2f175bb9msh42d2c4435c1685cp15de67jsnf4fa85f71f8a',//vignesh :8c2f175bb9msh42d2c4435c1685cp15de67jsnf4fa85f71f8a //ama : d8a433c819msh5f6984e6e8d52d2p10084fjsn90afec517a0a //thaya:5beed19ad2mshfedc45ca698b32ep1e1644jsnf4cb628a6065  453326: 7bd5c8ca5amsh8d14f218e111023p1b6fcejsn7a1117337a5f
        'x-rapidapi-host': 'cricket-live-line1.p.rapidapi.com'
    }
};
async function update_live_matches() {
    const url_for_live = 'https://cricket-live-line1.p.rapidapi.com/liveMatches';
    try {
        const live_result = await fetch(url_for_live, options);
        const result = await live_result.json();
        writeData("./data/live_match_data.json", result)
    } catch (error) {
        console.error(error);
    }
}
function update_overs() {
    let live_match_query = "SELECT match_id FROM live_match_data WHERE status='live'"
    db.query(live_match_query, async (err, result) => {
        if (err) {
            console.log(err);
        }
        liveMatchIds = []
        if (!result.length === 0) {
            return
        }
        result.map(match => liveMatchIds.push(match.match_id))
        let overs_data = {}
        const fetchOverData = async () => {
            await Promise.all(
                liveMatchIds.map(async (ids) => {
                    const url_for_overs = `https://cricket-live-line1.p.rapidapi.com/match/${ids}/overHistory`;
                    const over_result = await fetch(url_for_overs, options);
                    const over = await over_result.json();
                    overs_data[ids] = over.data;
                })
            );
            await writeData("./data/overs_data.json", overs_data);
            await upload_overs();
        };
        await fetchOverData();
    })

}

async function run_upload_data() {
    const [matches_data] = await db_promise.execute("SELECT * FROM live_match_data WHERE status='live'")
    if (matches_data.length > 0) {
        await update_overs()
        await update_live_matches()
    }
}

// run_upload_data()
// setInterval(async() => {
//     await run_upload_data()
// }, 10000);

async function update_leaderBoard(match_id) {
    console.log("Updating the loeaderBoard");
    let [overs_to] = await db_promise.execute("SELECT * FROM open_overs WHERE match_id=?", [match_id]);
    console.log("Calculatin Data for over", overs_to[0].over_number - 1);
    if (!overs_to.length) {
        console.log("No overs found for the match.");
        return;
    }
    let overs_data;
    if (overs_to[0].innings == 2 && overs_to[0].over_number == 1) {
        const [last_ball] = await db_promise.execute("SELECT MAX(over_number) FROM `overs` WHERE match_id = ? and innings =1", [match_id])
        overs_data = await getOverData(match_id, overs_to[0].innings - 1, last_ball[0]["MAX(over_number)"]);
    }
    else {

        overs_data = await getOverData(match_id, overs_to[0].innings, (overs_to[0].over_number) - 1);
    }
    console.log("Heres the over Data From api");
    if (!overs_data) {
        console.log("Over details not found");
        return;
    }
    console.log(overs_data);
    let wickets = overs_data.wickets;
    let runs = overs_data.runs;
    let sixes = overs_data.overs.filter(ball => ball === "6").length;
    let four = overs_data.overs.filter(ball => ball === "4").length;
    let dots = overs_data.overs.filter(ball => ball === "0").length;

    let [user_inputs] = await db_promise.execute(
        "SELECT * FROM user_over_data WHERE match_id=? AND over_number=?",
        [match_id, (overs_to[0].over_number) - 1]
    );

    user_inputs.forEach(async (user_data) => {
        let points_gained = 0;

        if (user_data.run != null) {
            if (user_data.run === "1 - 5") {
                runs >= 1 && runs <= 5 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.run === "6 - 10") {
                runs >= 6 && runs <= 10 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.run === "More than 10") {
                runs > 10 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.run === "No Runs") {
                runs === 0 ? points_gained += 1 : points_gained -= 1;
            }
            // console.log(points_gained);
        }

        // Fours Calculation
        if (user_data.four != null) {
            if (user_data.four === "1 - 2") {
                four >= 1 && four <= 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.four === "More than 2") {
                four > 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.four === "No Four") {
                four === 0 ? points_gained += 1 : points_gained -= 1;
            }
            // console.log(points_gained);

        }
        if (user_data.six != null) {
            if (user_data.six === "1 - 2") {
                sixes >= 1 && sixes <= 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.six === "More than 2") {
                sixes > 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.six === "No Sixes") {
                sixes === 0 ? points_gained += 1 : points_gained -= 1;
            }
            // console.log(points_gained);

        }
        if (user_data.wicket != null) {
            if (user_data.wicket === "1") {
                wickets === 1 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.wicket === "2") {
                wickets === 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.wicket === "More than 2") {
                wickets > 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.wicket === "No Wickets") {
                wickets === 0 ? points_gained += 1 : points_gained -= 1;
            }
            // console.log(points_gained);

        }
        if (user_data.dot != null) {
            if (user_data.dot === "1 Dot") {
                dots === 1 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.dot === "2 Dots") {
                dots === 2 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.dot === "3 Dots") {
                dots === 3 ? points_gained += 1 : points_gained -= 1;
            } else if (user_data.dot === "More than 3") {
                dots > 3 ? points_gained += 1 : points_gained -= 1;
            }

            // console.log(points_gained);

        }


        console.log("wickets: " + wickets, "\nruns: " + runs, "\nfour :" + four, "\ndots :" + dots, "\nsixes :" + sixes);
        console.log(user_data);
        console.log("user_id: " + user_data.user_id);
        console.log("points_gained: " + points_gained);
        const [update_points] = await db_promise.execute("UPDATE registered_contest SET points=points + ? WHERE match_id=? AND user_id=?", [points_gained, user_data.match_id, user_data.user_id])

    });
}

// async function update_leaderBoard(match_id) {
//     let [overs_to] = await db_promise.execute("SELECT * FROM open_overs WHERE match_id=?", [match_id]);
//     if (!overs_to.length) {
//         console.log("No overs found for the match.");
//         return;
//     }
//     let overs_data;
//     if (overs_to[0].innings == 2 && overs_to[0].over_number == 1) {
//         const [last_ball] = await db_promise.execute("SELECT MAX(over_number) AS max_over FROM `overs` WHERE match_id = ? AND innings = 1", [match_id]);
//         overs_data = await getOverData(match_id, overs_to[0].innings - 1, last_ball[0].max_over);
//     } else {
//         overs_data = await getOverData(match_id, overs_to[0].innings, overs_to[0].over_number - 1);
//     }

//     if (!overs_data) {
//         console.log("Over details not found");
//         return;
//     }
//     let { wickets, runs, overs } = overs_data;
//     let sixes = overs.filter(ball => ball === "6").length;
//     let four = overs.filter(ball => ball === "4").length;
//     let dots = overs.filter(ball => ball === "0").length;

//     let [user_inputs] = await db_promise.execute(
//         "SELECT * FROM user_over_data WHERE match_id=? AND over_number=?",
//         [match_id, overs_to[0].over_number - 1]
//     );
//     console.log(user_inputs);
//     for (const user_data of user_inputs) {
//         let points_gained = 0;
//         if (user_data.run) {
//             const run_conditions = {
//                 "1 - 5": runs >= 1 && runs <= 5,
//                 "6 - 10": runs >= 6 && runs <= 10,
//                 "More than 10": runs > 10,
//                 "No Runs": runs === 0
//             };
//             points_gained += run_conditions[user_data.run] ? 1 : -1;
//         }

//         // Fours Calculation
//         if (user_data.four) {
//             const four_conditions = {
//                 "1 - 2": four >= 1 && four <= 2,
//                 "More than 2": four > 2,
//                 "No Four": four === 0
//             };
//             points_gained += four_conditions[user_data.four] ? 1 : -1;
//         }

//         // Sixes Calculation
//         if (user_data.six) {
//             const six_conditions = {
//                 "1 - 2": sixes >= 1 && sixes <= 2,
//                 "More than 2": sixes > 2,
//                 "No Sixes": sixes === 0
//             };
//             points_gained += six_conditions[user_data.six] ? 1 : -1;
//         }

//         // Wickets Calculation
//         if (user_data.wicket) {
//             const wicket_conditions = {
//                 "1": wickets === 1,
//                 "2": wickets === 2,
//                 "More than 2": wickets > 2,
//                 "No Wickets": wickets === 0
//             };
//             points_gained += wicket_conditions[user_data.wicket] ? 1 : -1;
//         }

//         // Dots Calculation
//         if (user_data.dot) {
//             const dot_conditions = {
//                 "1 Dot": dots === 1,
//                 "2 Dots": dots === 2,
//                 "3 Dots": dots === 3,
//                 "More than 3": dots > 3
//             };
//             points_gained += dot_conditions[user_data.dot] ? 1 : -1;
//         }

//         // Update Points in Database
//         await db_promise.execute(
//             "UPDATE registered_contest SET points = points + ? WHERE match_id=? AND user_id=?",
//             [points_gained, user_data.match_id, user_data.user_id]
//         );
//     }
// }
async function finals_leaderBoard(match_id) {
    let [overs_to] = await db_promise.execute("SELECT * FROM open_overs WHERE match_id=?", [match_id]);
    console.log(overs_to);
    if (!overs_to.length) {
        console.log("No overs found for the match.");
        return;
    }
    let overs_data = await getOverData(match_id, overs_to[0].innings, overs_to[0].over_number);
    if (!overs_data) {
        console.log("Over details not found");
        return;
    }
    let { wickets, runs, overs } = overs_data;
    let sixes = overs.filter(ball => ball === "6").length;
    let four = overs.filter(ball => ball === "4").length;
    let dots = overs.filter(ball => ball === "0").length;

    let [user_inputs] = await db_promise.execute(
        "SELECT * FROM user_over_data WHERE match_id=? AND over_number=?",
        [match_id, overs_to[0].over_number - 1]
    );

    for (const user_data of user_inputs) {
        let points_gained = 0;

        // Runs Calculation
        if (user_data.run) {
            const run_conditions = {
                "1 - 5": runs >= 1 && runs <= 5,
                "6 - 10": runs >= 6 && runs <= 10,
                "More than 10": runs > 10,
                "No Runs": runs === 0
            };
            points_gained += run_conditions[user_data.run] ? 1 : -1;
        }

        // Fours Calculation
        if (user_data.four) {
            const four_conditions = {
                "1 - 2": four >= 1 && four <= 2,
                "More than 2": four > 2,
                "No Four": four === 0
            };
            points_gained += four_conditions[user_data.four] ? 1 : -1;
        }

        // Sixes Calculation
        if (user_data.six) {
            const six_conditions = {
                "1 - 2": sixes >= 1 && sixes <= 2,
                "More than 2": sixes > 2,
                "No Sixes": sixes === 0
            };
            points_gained += six_conditions[user_data.six] ? 1 : -1;
        }

        // Wickets Calculation
        if (user_data.wicket) {
            const wicket_conditions = {
                "1": wickets === 1,
                "2": wickets === 2,
                "More than 2": wickets > 2,
                "No Wickets": wickets === 0
            };
            points_gained += wicket_conditions[user_data.wicket] ? 1 : -1;
        }

        // Dots Calculation
        if (user_data.dot) {
            const dot_conditions = {
                "1 Dot": dots === 1,
                "2 Dots": dots === 2,
                "3 Dots": dots === 3,
                "More than 3": dots > 3
            };
            points_gained += dot_conditions[user_data.dot] ? 1 : -1;
        }
        await db_promise.execute(
            "UPDATE registered_contest SET points = points + ? WHERE match_id=? AND user_id=?",
            [points_gained, user_data.match_id, user_data.user_id]
        );
    }
    initiate_prize(match_id)
    const [end_open_over] = await db_promise.execute("DELETE FROM open_overs WHERE match_id=?", [match_id])
}
async function prizeOrder(match_query_result) {
    let query_result = match_query_result
    result = query_result
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

    if (result.type == "practice") {
        return ({ data: "Practice contest" })
    }
    return (current_fill)

}
function getPrize(position, prizes_order) {
    if (prizes_order != "Winners will be added soon...!") {

        for (const prize of prizes_order) {
            if (prize.rank.includes(`${position}`)) {
                return prize.winnings;
            }

            const match = prize.rank.match(/# (\d+) - (\d+)/);
            if (match) {
                const [_, start, end] = match.map(Number);
                if (position >= start && position <= end) {
                    return prize.winnings;
                }
            }
        }
    }
    return '0';
}
async function leaderBoard(match_id, contest_id, user_id) {
    let match_query = "SELECT * FROM contest WHERE match_id=? AND contest_id=?";
    let [match_query_result] = await db_promise.execute(match_query, [match_id, contest_id]);
    if (!match_query_result.length) {
        return { error: "Match not found" };
    }
    let players_count = ((match_query_result[0].total_spots) - (match_query_result[0].spots_available));

    if (match_query_result[0].status === "live") {
        let [user_position] = await db_promise.execute(
            `SELECT ranked_data.user_id, ud.user_name,ud.user_profile, ranked_data.points, ranked_data.position
            FROM (
                SELECT user_id, points, 
                RANK() OVER(ORDER BY points DESC) AS position
                FROM registered_contest
                WHERE match_id = ? AND contest_id=?
            ) AS ranked_data
            JOIN user_details ud ON ranked_data.user_id = ud.user_id WHERE ranked_data.user_id = ?;`,
            [match_id, contest_id, user_id]
        );
        if (user_position.length == 0) {
            return { error: "user not found" }
        }
        let [user_query] = await db_promise.execute(
            `SELECT ranked_data.user_id, ud.user_name, ud.user_profile, ranked_data.points, ranked_data.position
            FROM (
                SELECT user_id, points, 
                RANK() OVER(ORDER BY points DESC) AS position
                FROM registered_contest
                WHERE match_id = ? AND contest_id = ?
            ) AS ranked_data
            JOIN user_details ud ON ranked_data.user_id = ud.user_id;
            `,
            [match_id, contest_id]
        );

        if (!user_query.length) {
            return { error: "User not found in contest" };
        }

        let prizeData = await prizeOrder(match_query_result[0]);

        let user_prize = await getPrize(user_position[0].position, prizeData.prizes_order)
        user_position[0].winnings = user_prize

        if (prizeData.data !== "Winners will be added soon...!") {
            let leaderBoard_data = [];
            user_query.map(users => {
                let user_prize = getPrize(users.position, prizeData.prizes_order);
                let data = {
                    "rank": users.position,
                    "user_name": users.user_name,
                    "user_profile": users.user_profile,
                    "points": users.points,
                    "winnings": user_prize
                };
                leaderBoard_data.push(data);
            })
            return { leaderBoard_data, user_position: user_position, players_count };
        }
    } else {
        const [players] = await db_promise.execute(`
            SELECT rc.user_id, ud.user_name ,ud.user_profile
            FROM registered_contest rc
            JOIN user_details ud ON rc.user_id = ud.user_id 
            WHERE match_id=? AND contest_id=? LIMIT 100`,
            [match_id, contest_id]
        );

        return ({ players, players_count });
    }
}
async function initiate_prize(match_id) {
    const connection = await db_promise.getConnection(); // Get a connection for transaction
    try {
        await connection.beginTransaction(); // Start transaction

        let match_query = "SELECT * FROM contest WHERE match_id=? AND status='live'";
        let [match_query_result] = await connection.execute(match_query, [match_id]);

        if (!match_query_result.length) {
            throw new Error("Match not found or no live contests available"); // Prevent unnecessary execution
        }

        for (let match of match_query_result) {
            let [user_query] = await connection.execute(
                `SELECT ranked_data.user_id, ud.user_name, ud.user_profile, ranked_data.points, ranked_data.position
                FROM (
                    SELECT user_id, points, 
                    RANK() OVER(ORDER BY points DESC) AS position
                    FROM registered_contest
                    WHERE match_id = ? AND contest_id = ?
                ) AS ranked_data
                JOIN user_details ud ON ranked_data.user_id = ud.user_id`,
                [match_id, match.contest_id]
            );

            if (!user_query.length) {
                console.warn(`No users found for contest ${match.contest_id}`);
                continue; // Don't throw an error, just skip the contest
            }

            let prizeData = await prizeOrder(match);
            if (prizeData.data !== "Winners will be added soon...!") {
                let updatePromises = [];

                for (let user of user_query) {
                    let user_prize = getPrize(user.position, prizeData.prizes_order);
                    if (user_prize !== 0) {
                        updatePromises.push(
                            connection.execute(
                                "UPDATE user_details SET funds = funds + ? WHERE user_id = ?",
                                [user_prize, user.user_id]
                            )
                        );
                    }
                }

                if (updatePromises.length > 0) {
                    await Promise.all(updatePromises);
                }
            }
        }

        let matchInfo = await readData('./data/live_match_data.json').data
        let matchData = matchInfo.filter(match => match.match_id == match_id)
        if (!matchData.length) {
            matchData = {
                status: "Failed",
                error: "Match details not found while trying to Update end live"
            }
        }

        await connection.execute("UPDATE live_match_data SET status='ended' AND match_info=? WHERE match_id=?", [match_id,JSON.stringify(matchData)]);
        await connection.execute("UPDATE contest SET status='ended' WHERE match_id=? AND status='live'", [match_id]);
        await connection.execute("UPDATE registered_contest SET status='ended' WHERE match_id=?", [match_id])
        await connection.commit();
        return { success: true, message: "Prizes distributed successfully" };

    } catch (error) {
        await connection.rollback(); // Rollback on error
        console.error(`Error in initiate_prize: ${error.message}`);
        return { success: false, error: error.message };
    } finally {
        connection.release(); // ✅ Ensure connection is always released
    }
}
async function upcoming_matches(matchList) {
    let data = readData('./data/upcoming_match_data.json').data;

    if (matchList) {
        let m_data = data.filter(match => matchList.includes(match.match_id));
        return m_data.length ? m_data : 0;
    } else {
        let match_query = "SELECT match_id FROM matches WHERE 1";
        const result = await new Promise((resolve, reject) => {
            db.query(match_query, (error, results) => {
                if (error) reject(error);
                else resolve(results);
            });
        });
        let match_array = result.map(match => match.match_id);
        let m_data = data.filter(match => match_array.includes(match.match_id));
        return m_data.length ? m_data : 0;
    }
}
function groupAndDisplayPrizes(prizeDistribution) {
    /**
     * Group and display prizes in the desired format.
     * @param {Object} prizeDistribution - An object containing the prize distribution for each rank.
     */
    const groupedPrizes = new Map();
    // Group ranks by prize using Map
    for (const [rankStr, prize] of Object.entries(prizeDistribution)) {
        const rank = parseInt(rankStr);

        // Initialize the array for the prize if it doesn't exist
        if (!groupedPrizes.has(prize)) {
            groupedPrizes.set(prize, []);
        }

        groupedPrizes.get(prize).push(rank);
    }

    let generated_prize_table = []
    for (const [prize, ranks] of groupedPrizes.entries()) {
        let data = {}
        ranks.sort((a, b) => a - b); // Ensure ranks are sorted

        if (ranks.length === 1) {
            const rank = ranks[0];
            if (rank === 1) {
                data["rank"] = '🥇 1'
                data["winnings"] = `${prize}`;
            } else if (rank === 2) {
                data["rank"] = '🥈 2'
                data["winnings"] = `${prize}`;
            } else if (rank === 3) {
                data["rank"] = '🥉 3'
                data["winnings"] = `${prize}`;
            } else {
                data["rank"] = `# ${rank}`
                data["winnings"] = `${prize}`;
            }
        } else {
            data["rank"] = `# ${ranks[0]} - ${ranks[ranks.length - 1]}`
            data["winnings"] = `${prize}`
            // console.log(`${ranks[0]}-${ranks[ranks.length - 1]}: ₹${prize}`);
        }
        generated_prize_table.push(data)

    }
    return generated_prize_table
}
function distributePrizes(registeredPlayers, entryFee, platformFeeFilled, platformFeePercentNotFilled, prizeOrder, cnFilled) {
    // Calculate total collection
    const totalCollection = registeredPlayers * entryFee;

    const platformFee = cnFilled
        ? platformFeeFilled
        : Math.round((platformFeePercentNotFilled / 100) * totalCollection);

    const prizePool = totalCollection - platformFee;

    const prizeDistribution = {};
    let remainingPrizePool = prizePool;

    for (const [startRank, endRank, prizeAmount] of prizeOrder) {
        for (let rank = startRank; rank <= endRank; rank++) {
            if (remainingPrizePool >= prizeAmount) {
                prizeDistribution[rank] = prizeAmount;
                remainingPrizePool -= prizeAmount;
            } else {
                if (remainingPrizePool > 0) {
                    prizeDistribution[rank] = remainingPrizePool;
                    remainingPrizePool = 0;
                }
                break;
            }
        }
        if (remainingPrizePool === 0) break;
    }

    return {
        totalCollection,
        platformFee,
        prizePool,
        prizeDistribution
    };
}
function ranking_order(registeredPlayers, entryFee, platformFeeFilled, platformFeePercentNotFilled, prize_table, cnFilled) {
    const result = distributePrizes(registeredPlayers, entryFee, platformFeeFilled, platformFeePercentNotFilled, prize_table, cnFilled);
    return ({ "prizes_order": groupAndDisplayPrizes(result.prizeDistribution), "prize_pool": result.prizePool });
}

module.exports = { match_info, upcoming_matches, ranking_order, getOverData, update_leaderBoard, leaderBoard, finals_leaderBoard, prizeOrder, getPrize };