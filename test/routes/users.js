const User = require('../../models/user');
let token;

describe('ROUTE: Users', () => {
    describe('POST:', () => {
        beforeEach(done => {
            User.deleteMany({})
            .then(() => User.create({
                email: 'jane@gmail.com',
                password: 'janeth'
            }))
            .then(() => done());
        });
        it('should create a user', done => {
            request.post('/users/register')
            .send({
                email: 'jackson@gmail.com',
                password: 'jackyjacky'
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.include.keys("token", "user");
                done(err);
            });
        });
        it('should generate an auth token', done => {
            request.post('/users/authenticate')
            .send({
                email: 'jane@gmail.com',
                password: 'janeth'
            })
            .expect(200)
            .end((err, res) => {
                expect(res.body).to.include.keys("token");
                console.log(res.body);
                token = res.body.token;
                done(err);
            });
        });
    });
    describe('POST:', () => {
        it('should extract token and return user', done => {
            request.get('/users/login')
            .set('Authorization', `Bearer ${token}`)
            .expect(200)
            .end((err, res) => {
                expect(res.body.success).to.be.true;
                console.log(res.body);
                done(err);
            });
        });
    });
});