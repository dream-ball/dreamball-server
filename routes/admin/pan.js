const express = require("express");
const router = express.Router();
const {db,db_promise} = require("../../database/db")
const multer = require('multer');
const path = require('path');
const fs = require('fs');


// change endpoint name mf
router.post('/api/getPan', (req, res) => {
  const { firstName, middleName, lastName, age, city, state, aadhaarNumber, panNumber, aadhaarFrontImage, aadhaarBackImage, panImage } = req.body;

  //aadhaar_number = parseInt(aadhaar_number)

  if(!firstName && !middleName && !lastName && !age && !city && !aadharNumber && !panNumber && !aadhaarFrontImage && !aadhaarBackImage && !panImage){
  return res.send({Error : 'Missing required fields'});
  }

  let insertQuery = `INSERT INTO user_kyc (first_name, middle_name, last_name, age, city, state, aadhaar_number, pan_number, aadhaar_front_image, aadhaar_back_image, pan_image) 
                     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

  
  db.query(insertQuery, [firstName, middleName, lastName, age, city, state, aadhaarNumber, panNumber, aadhaarFrontImage, aadhaarBackImage, panImage], (error, result) => {
    if (error) {
      console.error("Database Error:", error);
      return res.status(500).send({ error: "Error updating KYC details" });
    }
    res.send({ status: "KYC details uploaded successfully" });
  });
});


  router.get("/api/verify-pan", async (req, res) => {
    const userId = "548dskfh"; // req.body;
  
    const checkQuery = `SELECT * FROM kyc_details WHERE user_id = ?`;
    const updateVerify = `UPDATE kyc_details SET kyc_status = ? WHERE user_id = ?`;
  
    db.query(checkQuery, [userId], async (error, result) => {
      if (error) {
        console.error("Database Error:", error);
        return res.status(500).json({ status: "Connection error" });
      }
  
      if (!result.length) {
        return res.status(404).json({ status: "User not found" });
      }
  
      try {
        const apiResult = await checkPan();
        if (!apiResult) {
          return res.status(500).json({ status: "PAN verification failed" });
        }
  
        const { pan_number, pan_name, dateOfBirth } = apiResult;
        const storedData = result[0];
  
        if (
          pan_name === storedData.pan_name &&
          pan_number === storedData.pan_number &&
          dateOfBirth === storedData.date_of_birth
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
  
  const checkPan = async () => {
    const url = "http://authIndia/api/pan/v1/verify";
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }
      return await response.json();
    } catch (error) {
      console.error("Connection error:", error);
      return null;
    }
  };
  
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
  
      return { Pan: panNumber, Name: name, DateOfBirth: dob };
    } catch (error) {
      console.error("Error extracting PAN:", error);
      return null;
    }
  };
  
  module.exports = router;
  
