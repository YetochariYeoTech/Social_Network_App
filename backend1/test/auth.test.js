import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index.js'; // Assuming your app entry point is src/index.js

chai.use(chaiHttp);
const expect = chai.expect;

describe('Auth API', () => {
  it('should register a new user', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .end((err, res) => {
        expect(res).to.have.status(201);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.true;
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should not register a user with existing email', (done) => {
    chai.request(app)
      .post('/api/auth/signup')
      .send({
        fullName: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.false;
        expect(res.body).to.have.property('message').to.equal('Email already exists');
        done();
      });
  });

  it('should login an existing user', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'password123',
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.true;
        expect(res.body).to.have.property('_id');
        done();
      });
  });

  it('should not login with invalid credentials', (done) => {
    chai.request(app)
      .post('/api/auth/login')
      .send({
        email: 'test@example.com',
        password: 'wrongpassword',
      })
      .end((err, res) => {
        expect(res).to.have.status(400);
        expect(res.body).to.be.an('object');
        expect(res.body).to.have.property('success').to.be.false;
        expect(res.body).to.have.property('message').to.equal('Invalid credentials');
        done();
      });
  });
});
