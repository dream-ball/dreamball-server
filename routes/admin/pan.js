const express = require("express");
const router = express.Router();
const { validateJWT } = require('../../utils/jwt_users.js')
const { db, db_promise } = require("../../database/db")

router.post('/api/getPan', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    const decoded_token = validateJWT(token);
    const { firstName, middleName, lastName, dob, age, city, state, aadhaarNumber, panNumber, aadhaarFrontImage, aadhaarBackImage, panImage } = req.body;
    if (!firstName || !lastName || !dob || !age || !city || !state || !aadhaarNumber || !panNumber || !aadhaarFrontImage || !aadhaarBackImage || !panImage) {
      return res.status(400).send({ error: 'Missing required fields' });
    }

    // Function to check Base64 image size
    const getBase64Size = (base64String) => {
      let length = base64String.length;
      let padding = (base64String.endsWith("==") ? 2 : base64String.endsWith("=") ? 1 : 0);
      return (length * 3) / 4 - padding;
    };

    // Convert size to KB (1MB = 1024KB)
    const isImageSizeValid = (image) => getBase64Size(image) / 1024 <= 1024;

    if (!isImageSizeValid(aadhaarFrontImage) || !isImageSizeValid(aadhaarBackImage) || !isImageSizeValid(panImage)) {
      return res.status(413).send({ error: "Image size exceeds 1MB limit" });
    }

    // Check for duplicate Aadhaar or PAN
    const checkQuery = `SELECT * FROM user_kyc WHERE aadhaar_number = ? OR pan_number = ?`;

    db.query(checkQuery, [aadhaarNumber, panNumber], (checkError, checkResult) => {
      if (checkError) {
        console.error("Database Error:", checkError.message);
        return res.status(500).send({ error: "Error checking existing records" });
      }

      if (checkResult.length > 0) {
        return res.status(409).send({ error: "Aadhaar or PAN number already submitted" });
      }

      let insertQuery = `INSERT INTO user_kyc 
        (user_id, first_name, middle_name, last_name, dob, age, city, state, aadhaar_number, pan_number, aadhaar_front_image, aadhaar_back_image, pan_image) 
        VALUES 
        (?, UPPER(?), UPPER(?), UPPER(?), ?, ?, UPPER(?), UPPER(?), ?, UPPER(?), ?, ?, ?)`;

      db.query(insertQuery, [decoded_token.userId, firstName, middleName, lastName, dob, age, city, state, aadhaarNumber, panNumber, aadhaarFrontImage, aadhaarBackImage, panImage], (error, result) => {
        if (error) {
          console.error("Database Error:", error.message);
          return res.status(500).send({ error: "Error inserting documents" });
        }
        res.send({ status: "KYC details uploaded successfully" });
      });
    });

  } catch (error) {
    console.log(error);
    return res.status(401).json({ status: "Failed", error: "Invalid or expired token" });
  }
});

router.get('/api/kyc-status', (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');

  try {
    const decoded_token = validateJWT(token);
    const userId = decoded_token.userId;

    // Query to fetch KYC status
    const statusQuery = `SELECT kyc_status FROM user_kyc WHERE user_id = ?`;

    db.query(statusQuery, [userId], (error, results) => {
      if (error) {
        console.error("Database Error:", error.message);
        return res.status(500).send({ error: "Error fetching KYC status" });
      }

      if (results.length === 0) {
        return res.status(404).send({ error: "No KYC record found for this user" });
      }

      res.send({ status: results[0].kyc_status });
    });

  } catch (error) {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
});


router.get("/api/verify-pan", async (req, res) => {
  const userId = "548dskfh"; // req.body;

  const checkQuery = `SELECT * FROM user_kyc WHERE user_id = ?`;
  const updateVerify = `UPDATE user_kyc SET kyc_status = ? WHERE user_id = ?`;

  db.query(checkQuery, [userId], async (error, result) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).json({ status: "Connection error" });
    }

    if (!result.length) {
      return res.status(404).json({ status: "User not found" });
    }

    try {
      const apiResult = await extractPanNumber(result[0].pan_image);
      const { pan_number, pan_name, dateOfBirth } = apiResult;
      const storedData = result[0];
      if (
        (pan_name.includes(storedData.first_name) || pan_name.includes(storedData.lastName)) &&
        pan_number.includes(storedData.pan_number) &&
        dateOfBirth.includes(storedData.dob)
      ) {
        db.query(updateVerify, ["verified", userId], (error) => {
          if (error) {
            console.error("Database Error:", error);
            return res.status(500).json({ status: "Server error" });
          }
          return res.json({ status: "PAN details verified successfully" });
        });
      } else {
        return res.status(400).json({ status: "PAN details do not match" });
      }
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ status: "PAN verification error" });
    }
  });
});
const extractPanNumber = async (ocr) => {
  try {
    const base64String = ocr;
    const url = "https://api.ocr.space/parse/image";
    const formData = new FormData();
    formData.append("language", "eng");
    formData.append("base64image", base64String);
    formData.append("scale", "true");
    formData.append("detectOrientation", "true");

    const options = {
      method: "POST",
      headers: {
        apikey: "K89453529588957",
      },
      body: formData,
    };

    const imageText = await fetch(url, options);
    const data = await imageText.json();
    const text = data.ParsedResults[0].ParsedText;
    const panRegex = /([A-Z]{5}[0-9]{4}[A-Z])/;
    const nameRegex = /(?<=Name\s)([A-Z\s]+)/;
    const dobRegex = /(\d{2}\/\d{2}\/\d{4})/;
    const panNumber = text.match(panRegex)?.[0] || "Not found";
    const name = text.match(nameRegex)?.[0]?.trim() || "Not found";
    const dob = text.match(dobRegex)?.[0] || "Not found";

    return { pan_number: panNumber, pan_name: name, dateOfBirth: dob };
  } catch (error) {
    console.error("Error extracting PAN:", error);
    return null;
  }
};

module.exports = router;

