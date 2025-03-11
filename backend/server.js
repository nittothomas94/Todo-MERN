const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

app.use(cors());
app.use(express.json());
// db connection
require('./db');
const port = process.env.PORT || 3000;

const routes = require('./routes');
app.use('/api', routes);
app.use('*', (req, res) => {
  return res.status(404).json({ message: 'page Not Found' });
});

app.listen(port, () => {
  console.log('app is running');
});
