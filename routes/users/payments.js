const express = require('express');
const router = express.Router();
const { validateWebhookSignature } = require('razorpay/dist/utils/razorpay-utils');
const { validateJWT, generateJWT } = require('../../utils/jwt_users.js')
const { db, db_promise } = require('../../database/db.js');
const Razorpay = require('razorpay');
const e = require('express');



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
      if (!currency) {
        return res.status(404).json({
          status: "Failed",
          error: "Please enter a currency name"
        })
      }
      if (!amount) {
        return res.status(404).json({
          status: "Failed",
          error: "Please enter a valid amount"
        })
      }
      if (amount < 30) {
        return res.status(400).json({
          status: "Failed",
          error: "Minimum deposit ₹30"
        })
      }
      if (amount > 5000) {
        return res.status(400).json({
          status: "Failed",
          error: "Maximum limit ₹5000"
        })
      }
      const options = {
        amount: amount * 100,
        currency,
        receipt,
        notes
      };
      const order = await razorpay.orders.create(options);
      try {
        await db_promise.execute(
          "INSERT INTO orders (user_id,order_id, amount, currency, receipt, status) VALUES (?, ?, ?, ?, ? ,?)",
          [decoded_token.userId, order.id, order.amount, order.currency, order.receipt, order.status]
        );
        return res.json(order);

      } catch (dbError) {
        console.error("Database Error:", dbError);
        return res.status(500).json({ status: "failed", error: "Connection error" });
      }

    } catch (error) {
      console.error(error);
      res.status(500).json({
        status: 'failed',
        error: 'error creating order'
      });
    }
  } catch (error) {
    res.status(401).json({
      status: "failed",
      error: "Invalid or expired token"
    })
  }
})
router.post('/api/verify-payment', async (req, res) => {
  const token = req.header('Authorization')?.replace('Bearer ', '');
  const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body;
  const secret = razorpay.key_secret;
  const body = razorpay_order_id + '|' + razorpay_payment_id;

  try {
    const decoded_token = validateJWT(token);
    if (!decoded_token) {
      return res.status(401).json({ status: 'Failed', msg: 'Invalid or expired token' });
    }

    // Validate Razorpay webhook signature
    const isValidSignature = validateWebhookSignature(body, razorpay_signature, secret);
    if (!isValidSignature) {
      return res.status(400).json({ status: 'Failed', msg: 'Payment verification failed: Invalid signature' });
    }


    let [order] = await db_promise.execute("SELECT * FROM orders WHERE user_id=? AND order_id=?", [decoded_token.userId, razorpay_order_id])
    if (!order.length) {
      return res.status(404).json({ status: 'Failed', msg: 'Order not found' });
    }

    if (order[0].status !== 'paid') {
      const query = "UPDATE `user_details` SET `deposits` = `deposits` + ? WHERE `user_id` = ?";
      db.query(query, [(order[0].amount) / 100, decoded_token.userId], async (err, result) => {
        if (err) {
          console.error('Database error:', err);
          return res.status(500).json({ status: 'Failed', msg: 'Payment verification failed: Database error' });
        }

        await db_promise.execute("UPDATE orders SET status='paid' WHERE user_id=? AND order_id=?", [decoded_token.userId, razorpay_order_id])
        return res.json({ status: 'ok', msg: 'Payment verification successful' });
      });
    } else {
      return res.json({ status: 'Success', msg: 'Payment already verified' });
    }
  } catch (error) {
    console.log(error);
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
