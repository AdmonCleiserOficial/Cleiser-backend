const express = require('express');
const router = express.Router();
const passport = require('passport');
const Message = require('../models/message');
const Text = require('../models/text');

router.post('/new', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const message = new Message({
        author: req.query.author,
        recepient: req.query.recepient
    });

    const text = new Text({
        actualText: req.body.text,
        by: req.query.author
    })

    text.new(message._id)
        .then(t => {
            message.new(t.text._id)
            .then(m => res.json(m))
            .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
});

module.exports = router;