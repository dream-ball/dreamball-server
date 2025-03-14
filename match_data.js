const fs = require('fs');
const {db,db_promise} = require('./database/db.js')
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
async function upload_overs() {
    console.time("Execution Time");
    let overData = await readData('overs_data.json');

    for (const matchId in overData) {
        const inningsData = overData[matchId];
        let last_stored_over = "SELECT * FROM overs WHERE match_id = ? ORDER BY innings DESC, over_number DESC LIMIT 1;";
        let [last_stored_over_result] = await db_promise.execute(last_stored_over, [matchId]);
        let last_innings = 1;
        let last_bowled_over = 1;

        if (last_stored_over_result.length > 0) {
            last_innings = last_stored_over_result[0].innings;
            last_bowled_over = last_stored_over_result[0].over_number;
        }

        let new_over_data = {};
        for (const innings in inningsData) {
            let data = [];
            inningsData[innings].forEach(async (overData) => {
                let teamInfo = overData.team;
                if ((parseInt(innings) == last_innings && teamInfo.over >= last_bowled_over) || parseInt(innings) > last_innings) {
                    data.push(overData);
                    try {
                        let [result] = await db_promise.execute(
                            `INSERT INTO overs (match_id, over_number, bowler, runs, score, wickets, team, innings)
                            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?) 
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
                            ]
                        );

                        let overId = result.insertId;
                        if (!overId) {
                            const fetchOverIdQuery = `SELECT id FROM overs WHERE match_id = ? AND over_number = ? AND innings = ?`;
                            const [overResult] = await db_promise.execute(fetchOverIdQuery, [matchId, teamInfo.over, innings]);

                            if (overResult.length > 0) {
                                overId = overResult[0].id;
                            } else {
                                console.error("Error: Over ID not found for match", matchId, "over", teamInfo.over);
                                return;
                            }
                        }
                        for (let index = 0; index < overData.overs.length; index++) {
                            let outcome = overData.overs[index];
                            try {
                                await db_promise.execute(
                                    `INSERT INTO deliveries (over_id, ball_number, outcome) 
                                    VALUES (?, ?, ?) ON DUPLICATE KEY UPDATE outcome=VALUES(outcome)`,
                                    [overId, index + 1, outcome]
                                );
                            } catch (err) {
                                console.error("Error inserting delivery data:", err);
                            }
                        }
                    } catch (err) {
                        console.error("Error inserting over data:", err);
                    }
                }
            });
            new_over_data[innings] = data;
        }
    }
    console.timeEnd("Execution Time");
}
//upload_overs()
async function getOversData(matchId) {
    try {

        // Fetch all overs and deliveries in one go
        let getOversQuery = `
            SELECT o.id AS over_id, o.innings, o.over_number, o.bowler, 
                   o.runs, o.score, o.wickets, o.team, d.ball_number, d.outcome
            FROM overs o
            LEFT JOIN deliveries d ON o.id = d.over_id
            WHERE o.match_id = ?
            ORDER BY o.innings ASC, o.over_number ASC, d.ball_number ASC
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

            // Find existing over entry or create a new one
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

            // Add delivery if it exists
            if (ball_number !== null) {
                lastOver.overs.push(outcome);
            }
        }

        return matchData;
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
    let matchInfo = await readData('live_match_data.json').data
    let matchData = matchInfo.filter(match => match.match_id == match_id)
    if (!matchData.length) {
        matchData = {
            status: "Failed",
            error: "Match details not found"
        }
        return 0
    }
    let [team_a_score] = await db_promise.execute(
        "SELECT * FROM overs WHERE match_id = ? AND team = ? ORDER BY innings DESC, over_number DESC LIMIT 1",
        [match_id, matchData[0].team_a_short]
    );

    if (team_a_score.length) {
        matchData[0].team_a_scores = team_a_score[0].score;

        let [overs_count] = await db_promise.execute(
            "SELECT COUNT(*) FROM deliveries WHERE over_id = ?",
            [team_a_score[0].id]
        );

        matchData[0].team_a_over = `${team_a_score[0].over_number-1}.${overs_count[0]['COUNT(*)']}`;
    } else {
        matchData[0].team_a_scores = "0-0";
        matchData[0].team_a_over = "0.0";
    }

    let [team_b_score] = await db_promise.execute(
        "SELECT * FROM overs WHERE match_id = ? AND team = ? ORDER BY innings DESC, over_number DESC LIMIT 1",
        [match_id, matchData[0].team_b_short]
    );

    if (team_b_score.length) {
        matchData[0].team_b_scores = team_b_score[0].score;

        let [overs_count] = await db_promise.execute(
            "SELECT COUNT(*) FROM deliveries WHERE over_id = ?",
            [team_b_score[0].id]
        );

        matchData[0].team_b_over = `${team_b_score[0].over_number-1}.${overs_count[0]['COUNT(*)']}`;
    } else {
        matchData[0].team_b_scores = "0-0";
        matchData[0].team_b_over = "0.0";
    }
    let [open_over] =await db_promise.execute("SELECT * FROM open_overs WHERE match_id=?",[match_id])
    if(!open_over.length){
        return 0
    }
    data["oversData"] = [oversData]
    data["matchInfo"] = matchData
    data["openOver"]= open_over
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
        writeData("live_match_data.json", result)
    } catch (error) {
        console.error(error);
    }
}
// update_live_matches()
function update_overs() {
    let live_match_query = "SELECT match_id FROM live_match_data"
    db.query(live_match_query, async (err, result) => {
        if (err) {
            console.log(err);
        }
        liveMatchIds = []
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
            writeData("overs_data.json", overs_data);
        };
        await fetchOverData();
    })
    console.timeEnd("Time");
}
async function upcoming_matches(matchList) {
    let data = readData('upcoming_match_data.json').data;

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
    return (groupAndDisplayPrizes(result.prizeDistribution));
}

module.exports = { match_info, upcoming_matches, ranking_order, getOverData };