const express = require("express");
const Stripe = require("stripe");
const path = require("path");

// 🔑 Replace with your Stripe SECRET key from https://dashboard.stripe.com/apikeys
const stripe = Stripe("sk_test_51THLEbCJ6nAArKJnhHXGhcnby7tShRmYiiEhe6qZrSKlriCSzTfGGqIHaSZUPnR2D34Uid0FO4HEoL3h5Glxn3dy00oH51fFXJ");

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname))); // serve your HTML/CSS/JS files

// Create a PaymentIntent
app.post("/create-payment-intent", async (req, res) => {
  try {
    const { amount } = req.body; // amount in agorot (smallest ILS unit)

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount),
      currency: "ils",
    });

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
});
