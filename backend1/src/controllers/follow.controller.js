
import Follow from '../models/follow.model.js';
import User from '../models/user.model.js';

/**
 * @desc Follow a user
 * @route POST /api/follows
 * @access Private
 */
export const followUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const followerId = req.user._id;
    const { followingId } = req.body;

    const userToFollow = await User.findById(followingId).session(session);
    if (!userToFollow) {
      await session.abortTransaction();
      session.endSession();
      return res.status(404).json({ message: 'User not found' });
    }

    if (followerId.toString() === followingId.toString()) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'You cannot follow yourself' });
    }

    const existingFollow = await Follow.findOne({ follower: followerId, following: followingId }).session(session);
    if (existingFollow) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'You are already following this user' });
    }

    const follow = new Follow({
      follower: followerId,
      following: followingId,
    });

    await follow.save({ session });

    // Add follower to the user's followers list
    userToFollow.followers.push(followerId);

    // Check if the followed user is also following the current user (friendship)
    const isFriend = await Follow.findOne({ follower: followingId, following: followerId }).session(session);
    if (isFriend) {
      const currentUser = await User.findById(followerId).session(session);
      currentUser.friends.push(followingId);
      userToFollow.friends.push(followerId);
      await currentUser.save({ session });
    }

    await userToFollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(201).json({ message: 'User followed successfully' });
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Unfollow a user
 * @route DELETE /api/follows/:followingId
 * @access Private
 */
export const unfollowUser = async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  try {
    const followerId = req.user._id;
    const { followingId } = req.params;

    const result = await Follow.deleteOne({ follower: followerId, following: followingId }).session(session);

    if (result.deletedCount === 0) {
      await session.abortTransaction();
      session.endSession();
      return res.status(400).json({ message: 'You are not following this user' });
    }

    const userToUnfollow = await User.findById(followingId).session(session);
    const currentUser = await User.findById(followerId).session(session);

    // Remove follower from the user's followers list
    userToUnfollow.followers.pull(followerId);

    // Remove from friends lists if they were friends
    if (currentUser.friends.includes(followingId)) {
      currentUser.friends.pull(followingId);
      userToUnfollow.friends.pull(followerId);
      await currentUser.save({ session });
    }

    await userToUnfollow.save({ session });

    await session.commitTransaction();
    session.endSession();

    res.status(200).json('User unfollowed successfully');
  } catch (error) {
    await session.abortTransaction();
    session.endSession();
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get a user's followers
 * @route GET /api/follows/:userId/followers
 * @access Public
 */
export const getFollowers = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).populate('followers', 'username profilePicture');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(200).json(user.followers);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get a user's following
 * @route GET /api/follows/:userId/following
 * @access Public
 */
export const getFollowing = async (req, res) => {
  try {
    const { userId } = req.params;
    const following = await Follow.find({ follower: userId }).populate('following', 'username profilePicture');
    res.status(200).json(following.map(follow => follow.following));
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
