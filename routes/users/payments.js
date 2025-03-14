const express = require('express');
const router = express.Router();

const { validateJWT, generateJWT } = require('../../middleware/jwt_token.js')
const { db, db_promise } = require('../../database/db.js');
const Razorpay = require('razorpay');



const razorpay = new Razorpay({
  key_id: 'rzp_test_GO24k5LqGpRyRK',
  key_secret: 'McNBNXvoWbX8llkHd3EggW4S',
});


router.post('/api/add-cash', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      let exp_time = decoded_token.exp - Math.floor(Date.now() / 1000)
      if (exp_time <= 300) {
        throw new Error("The token is about to end");
      }
      try {
        const { amount, currency, receipt, notes } = req.body;
        const options = {
          amount: amount * 100, // Convert amount to paise
          currency,
          receipt,
          notes
        };
        const order = await razorpay.orders.create(options);
        // Read current orders, add new order, and write back to the file
        const orders = readData();
        orders.push({
          order_id: order.id,
          amount: order.amount,
          currency: order.currency,
          receipt: order.receipt,
          status: 'created'
        });
        writeData(orders);
        res.json(order); // Send order details to frontend, including order ID
      } catch (error) {
        console.error(error);
        res.status(500).json({
          status: 'failed',
          msg: 'error creating order'
        });
      }
    } catch (error) {
      res.json({
        status: "failed",
        msg: "Invalid or expired token"
      })
    }
  })
  router.post('/api/verify-payment', async (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
    const secret = razorpay.key_secret;
    const body = razorpay_order_id + '|' + razorpay_payment_id;
  
    try {
      // Validate JWT token
      const decoded_token = validateJWT(token);
      if (!decoded_token) {
        return res.status(401).json({ status: 'Failed', msg: 'Unauthorized' });
      }
  
      // Validate Razorpay webhook signature
      const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
      if (!isValidSignature) {
        return res.status(400).json({ status: 'Failed', msg: 'Payment verification failed: Invalid signature' });
      }
  
      // Update the order with payment details
      const orders = readData();
      const order = orders.find(o => o.order_id === razorpay_order_id);
      if (!order) {
        return res.status(404).json({ status: 'Failed', msg: 'Order not found' });
      }
  
      if (order.status !== 'paid') {
        order.status = 'paid';
        order.payment_id = razorpay_payment_id;
        writeData(orders);
  
        // Update user funds in the database
        const query = "UPDATE `user_details` SET `funds` = `funds` + ? WHERE `user_id` = ?";
        db.query(query, [(order.amount) / 100, decoded_token.userId], (err, result) => {
          if (err) {
            console.error('Database error:', err);
            return res.status(500).json({ status: 'Failed', msg: 'Payment verification failed: Database error' });
          }
  
          return res.json({ status: 'Success', msg: 'Payment verification successful' });
        });
      } else {
        return res.json({ status: 'Success', msg: 'Payment already verified' });
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      res.status(500).json({ status: 'Failed', msg: 'Error verifying payment' });
    }
  });
  router.get('/api/user/funds', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
  
    try {
      const decoded_token = validateJWT(token)
      query = "SELECT funds FROM user_details WHERE user_id=?";
      db.query(query, [decoded_token.userId], (err, result) => {
  
        res.json(result[0])
      })
  
    }
    catch (error) {
      res.json({
        status: "failed",
        msg: "Invalid or expired token"
      })
    }
  });

  router.get('/api/user', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      res.json({
        status: "success",
        msg: "user alive"
      })
  
    } catch (error) {
      res.json({
        status: "failed",
        msg: "Invalid or expired token"
      })
  
    }
  })
  
  router.post('/api/rotate-token', (req, res) => {
    const token = req.header('Authorization')?.replace('Bearer ', '');
    try {
      const decoded_token = validateJWT(token)
      let jwt_token = token
      let exp_time = decoded_token.exp - Math.floor(Date.now() / 1000)
      if (exp_time <= 300) {
        jwt_token = generateJWT(decoded_token.userId);
      }
      res.json({
        status: "success",
        auth_token: jwt_token
      })
      return;
    } catch (error) {
      res.json({
        status: "failed",
        msg: "Invalid or expired token"
      })
    }
  })
  module.exports = router;
