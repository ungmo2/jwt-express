/* ENV */
require('dotenv').config();

/*  DEPENDENCIES */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const { isAuthenticated } = require('./middlewares/auth');

const app = express();
const port = process.env.PORT || 5500;

app.use(express.static('public'));
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Node의 native Promise 사용
mongoose.Promise = global.Promise;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, { useMongoClient: true })
  .then(() => console.log('Successfully connected to mongodb'))
  .catch(e => console.error(e));

// index
app.get('/', (req, res) => res.send('Hello JWT'));

// ROUTERS
app.use('/auth', require('./routes/auth'));
app.use('/users', isAuthenticated, require('./routes/users'));

app.listen(port, () => console.log(`Server listening on port ${port}`));
