describe('ROUTE: Users', () => {
    const User = require('../../models/user');
    beforeEach(done => {
        User.deleteMany({})
        .then(r => User.create({

        }))
        .catch(err => done(err));
    });
});