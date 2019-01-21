const express = require('express');
const router = express.Router();
const passport = require('passport');
const jwt = require('jsonwebtoken');
const config = require('../config/database');
const User = require('../models/user');
const Settings = require('../models/settings');
const helpers = require('../config/helpers');
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

  newUser.generateJWToken();

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

router.get('/login', helpers.extractTokenFromRequest, (req, res) => {
  res.status(200).json({success: true, user: req.user.toWeb(), token: req.user.getJWT()});
});


// Authenticate
router.post('/authenticate', (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  //console.log('///');
  //console.log(username);
  //console.log(password);

  /*
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
  });*/

  User.findOne({email: email}, (err, user) => {
    if (user) {
      user.comparePassword(password, (isMatch) => {
        if (!isMatch) res.status(500).json({
          success: false, 
          message: 'Password incorrect'
        })
        else {
          user.generateJWToken();
          user.save();
          res.json(user);
        }
      });
    }
    else {
      res.status(404).json({
        success: false,
        message: 'User not found'
      })
    }
  });
});

// Profile
router.get('/profile', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  User.findById(req.query.id, (err, doc) => {
    if (err) res.send(err);
    else User.populate(doc, {
      path: 'settings'
    }, (err2, populated) => {
      if (err2) res.send(err2);
      else res.json(populated);
    });
  });
});

router.get('/setting', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  Settings.findById(req.query.id, (err, setting) => {
    if (err) res.send(err);
    if(!setting) Settings.create({
        language: req.query.language ? req.query.language : 'en',
        showOffline: req.query.showOffline ? req.query.showOffline : false,
        user: req.query.user
    })
    .then(s => {
      User.findByIdAndUpdate(req.query.user, {
        settings: s._id
      }, (error, doc) => {
        if (error) res.send(error);
        else res.json(doc);
      });
    })
    .catch(error => res.send(error));
    else Settings.findOneAndUpdate({
      _id: req.query.id
    }, {
      language: req.query.language ? req.query.language : setting.language,
      showOffline: req.query.showOffline ? req.query.showOffline : setting.showOffline
    }, (error, doc, response) => {
      if (error) res.send(error);
      else console.log('Updated settings', doc);
    });
  });
});

router.get('/logout', passport.authenticate('jwt', {
  session: false
}), (req, res, next) => {
  User.findById(req.query.id, (err, user) => {
    if (err) res.send(err);
    else user.logout((u) => {
      res.json(u);
    })
    .catch(ue => res.send(ue));
  });
});

module.exports = router;
