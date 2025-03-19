const express = require('express');
const router = express.Router();
const nodemailer = require("nodemailer");
require("dotenv").config();
// Configure Nodemailer with GoDaddy SMTP
const transporter = nodemailer.createTransport({
    host: "smtpout.secureserver.net",
    port: 465,
    secure: true,
    auth: {
        user: process.env.GODADDY_EMAIL,
        pass: process.env.GODADDY_PASSWORD,
    },
});


router.post("/send-email", async (req, res) => {
    // const { to, subject, message } = req.body;

    try {
        const info = await transporter.sendMail({
            from: `"Your Name" <${process.env.GODADDY_EMAIL}>`,
            to: "wvignesh983@gmail.com",
            subject: "Registeration",
            html: "<h1>HELLO</h1>",
        });

        res.json({ success: true, message: "Email sent!", info });
    } catch (error) {
        res.status(500).json({ success: false, message: "Email failed to send", error });
    }
});

module.exports=router