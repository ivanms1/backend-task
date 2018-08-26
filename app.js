require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const passport = require('passport');
const logger = require('morgan');

const users = require('./routes/users')

const app = express();
const port = process.env.PORT || 3001;

app.use(bodyParser.json());
if(process.env.NODE_ENV !== 'test') app.use(logger('tiny'));

// Connect DB
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })
.then(() => console.log('Connected to DB'))
.catch(err => console.log(err));

// Initialize passport
app.use(passport.initialize());

require('./passport')(passport);

// Users route
app.use('/users', users)

app.listen(port, () => console.log(`Listening on port ${port}`));

module.exports = app;