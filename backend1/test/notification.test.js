import chai from 'chai';
import chaiHttp from 'chai-http';
import app from '../src/index.js'; // Assuming your express app is exported from index.js
import User from '../src/models/user.model.js';
import Notification from '../src/models/notification.model.js';
import mongoose from 'mongoose';

const { expect } = chai;
chai.use(chaiHttp);

describe('Notifications', () => {
  let user;
  let token;

  before(async () => {
    // Connect to a test database
    await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });

    // Create a test user
    user = new User({
      email: 'testuser@example.com',
      fullName: 'Test User',
      password: 'password123',
    });
    await user.save();

    // Create some unread notifications
    const notification1 = new Notification({ recipient: user._id, sender: user._id, type: 'LIKE', target: new mongoose.Types.ObjectId(), targetModel: 'POST' });
    const notification2 = new Notification({ recipient: user._id, sender: user._id, type: 'COMMENT', target: new mongoose.Types.ObjectId(), targetModel: 'POST' });
    await notification1.save();
    await notification2.save();

    user.unreadNotifications.push(notification1._id, notification2._id);
    await user.save();

    // Login to get a token
    const res = await chai.request(app)
      .post('/api/auth/login')
      .send({ email: 'testuser@example.com', password: 'password123' });
    token = res.body.token;
  });

  after(async () => {
    // Clean up the database
    await User.deleteMany({});
    await Notification.deleteMany({});
    await mongoose.connection.close();
  });

  describe('DELETE /api/notifications/cleanup', () => {
    it('should merge unread notifications and clear the unread list', async () => {
      const res = await chai.request(app)
        .delete('/api/notifications/cleanup')
        .set('Authorization', `Bearer ${token}`);

      expect(res).to.have.status(200);
      expect(res.body.message).to.equal('Unread notifications cleared successfully');

      const updatedUser = await User.findById(user._id);
      expect(updatedUser.unreadNotifications).to.have.lengthOf(0);
      expect(updatedUser.notifications).to.have.lengthOf(2);
    });
  });
});
