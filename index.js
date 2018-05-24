require('dotenv').config()
const express = require('express');
const bodyParser = require('body-parser');
const morgan = require('morgan');
const cors = require('cors');
const app = express();

app.use(morgan('tiny'));
app.use(bodyParser.urlencoded({extended: false}));

app.post('/charge', (req, res) => {
  const stripe = require("stripe")(process.env.KEY);
  const token = req.body.stripeToken;
  const amount = req.body.amount * 100
  const charge = stripe.charges.create({
    amount: amount ,
    currency: 'usd',
    description: 'One ice cream',
    source: token,
    statement_descriptor: 'Custom descriptor'
  }).then(charge => {
    res.send(`
      <h1>Sucessful Transaction</h1>
      <p>You paid $${amount/100}.00</p>
    `)
  }).catch(err => {
    res.send(`
      <h1>Charge did not go through</h1>
      <p>Error Message : ${err}</p>
    `)
  })
});

app.use((req, res, next) => {
  res.status(404);
  const error = new Error('Not Found. 🔍');
  next(error);
});

app.use((error, req, res, next) => {
  res.status(res.statusCode || 500);
  res.json({message: error.message, error: error.stack});
});

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Listening on ${port}`);
});
