const { db_promise } = require("../database/db");

async function generateUser_id() {
  let connection;
  try {
    // Get a connection from the pool
    connection = await db_promise.getConnection();

    // Call the stored procedure
    await connection.execute('CALL GenerateUniqueUserId(@new_user_id)');

    // Retrieve the generated user ID
    const [rows] = await connection.execute('SELECT @new_user_id AS new_user_id');

    // Extract the generated user ID
    const newUserId = rows[0].new_user_id;

    // Return the result
    return { success: true, newUserId };
  } catch (error) {
    console.error('Error generating user ID:', error.message, error.stack);
    return { success: false, message: 'Failed to generate user ID' };
  } finally {
    // Release the connection back to the pool
    if (connection) connection.release();
  }
}

function generateReferralCode(db) {
  return new Promise((resolve, reject) => {
    // First, call the stored procedure to generate the referral code
    db.query("CALL GenerateUniqueReferralCode(@new_code);", (err, results) => {
      if (err) {
        console.error("Error executing stored procedure:", err);
        return reject({ success: false, error: "Internal Server Error" });
      }

      // Second, retrieve the generated referral code
      db.query("SELECT @new_code AS referral_code;", (err, results) => {
        if (err) {
          console.error("Error retrieving referral code:", err);
          return reject({ success: false, error: "Internal Server Error" });
        }
        const referralCode = results[0].referral_code;
        resolve({ success: true, referral_code: referralCode });
      });
    });
  });
}

module.exports = { generateUser_id,generateReferralCode };