const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
//testing server
router.get('/', function (req, res) {
  res.send('Se ha conectado al servidor satisfactoriamente');
})


// Register creando objeto dentro del backend trayendo el objeto creado en mongo desde
// new user userschema
router.post('/register', (req, res, next) => {
  console.log(req.body)
  const newUser = new User({   
    email: req.body.email,    
    password: req.body.password    
  });

  newUser.save((err) => {
    console.log(err)
    if (err) return res.json({success: false, message: "", error: err})

    console.log("toweb", newUser.toWeb())
    return res.json({success: true, message: "Successfully created new user", user: newUser.toWeb(), token: newUser.getJWT()}) 
  })
    /*
  User.addUser(newUser, (err, user) => {
    if (err) {
      res.json({
        success: false,
        msg: 'Failed to register user'
      });
    } else {
      res.json({
        success: true,
        msg: 'Usuario Registrado',
        a:newUser.password      
    });   
    }
  });
  */
});

router.post('/login', passport.authenticate('local'), (req, res) => {
  res.json({success: true, user: req.user.toWeb(), token: req.user.getJWT()})
})


// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.Email;
  const password = req.body.password;
  console.log('///');
  console.log(username);
  console.log(password);

  User.getUserByUsername(email, (err, user) => {
    if (err) throw err;
    console.log("");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@");
    console.log("");
    console.log("Usuario => "+username);
    if (!user) {
      
      return res.json({
        success: false,
        msg: 'Usuario no Encontrado'
      });
    }

    User.comparePassword(password, user.password, (err, isMatch) => {
      if (err) throw err;
      console.log('')
      if (isMatch) {
        const token = jwt.sign(user.toJSON(), config.secret, {
          expiresIn: 604800 // 1 week
        });

        res.json({
          success: true,
          token: 'JWT ' + token,
          user: {
            id: user._id,
            name: user.name,
            username: user.username,
            email: user.email
            
          }
        });
      } else {
        return res.json({
          success: false,
          msg: 'Wrong password'
        });
      }
    });
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  res.json({
    user: req.user
  });
});

module.exports = router;
