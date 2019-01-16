const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');

const ENV_VARS = require('./env_vars')

const app = express();

// connect to database
mongoose.connect(ENV_VARS.mongodb_uri);
mongoose.Promise = global.Promise;

// On Connection
mongoose.connection.on('connected', () => {
  console.log('Conectado a la base de datos => '+'cristian');
});

// On Error
mongoose.connection.on('error', (err) => {
  console.log('Database error: '+err);
});

const users = require('./routes/users');
const messages = require('./routes/messages');

// Port Number
app.set('port',process.env.PORT || 3000);


// CORS Middleware
app.use(cors());

// Set Static Folder
app.use(express.static(path.join(__dirname, 'public')));

// Body Parser Middleware
app.use(bodyParser.json());

// Passport Middleware
app.use(passport.initialize());
app.use(passport.session());
require('./config/passport')(passport);

app.use('/users', users);
app.use('/messages', messages);

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(app.get('port'), () => {
  console.log('Server started on port '+app.get('port'));
});
