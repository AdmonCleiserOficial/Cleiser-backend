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
    });

        text.new(message._id)
        .then(t => {
            message.new(t.text._id)
            .then(m => res.json(m))
            .catch(err => res.send(err));
        })
        .catch(err => res.send(err));
});

router.get('/all', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Message.paginate({
        recepient: req.query.user
    }, {
        page: req.query.page, limit: 15
    }, (err, result) => {
        if (err) res.send(err)
        else res.json(result);
    });
});

router.get('/one', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    Message.findById(req.query.id, (err1, m) => {
        Text.findById(m.texts[m.texts.length - 1], (err2, t) => {
            if (t.by !== req.query.user) Message.findOneAndUpdate({
                _id: m._id
            }, {
                isRead: true
            }, (err3, doc, r) => {
                if (err3) res.json(err3)
                else res.json(doc);
            });
            else res.json(m);
        });
    });
});

router.post('/text', passport.authenticate('jwt', {
    session: false
}), (req, res, next) => {
    const text = new Text({
        actualText: req.body.text,
        by: req.query.author
    });

    Message.findById(req.query.id, (err, m) => {
            text.new(m._id)
            .then(t => {
                    m.new(t.text._id)
                    .then(item => res.json(item))
                    .catch(err => res.send(err));
            })
            .catch(err => res.send(err));
    });
});

module.exports = router;