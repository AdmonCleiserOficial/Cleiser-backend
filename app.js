const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const cors = require('cors');
const passport = require('passport');
const mongoose = require('mongoose');
const config = require('./config/database');
const app = express();
// Connect To Database
//mongoose.connect(config.database); OJo activar esto cualquier cosa


//remote database
let urlMOngo = 'mongodb://cristiantorresf:overcome19@ds215370.mlab.com:15370/cleisser';
let mongoDB= process.env.MONGODB_URI || urlMOngo;
mongoose.connect(mongoDB);
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

// Index Route
app.get('/', (req, res) => {
  res.send('Invalid Endpoint');
});

// Start Server
app.listen(app.get('port'), () => {
  console.log('Server started on port '+app.get('port'));
});
