
import { Group } from '../models/group.model.js';
import User from '../models/user.model.js';

/**
 * @desc Create a new group
 * @route POST /api/groups
 * @access Private
 */
export const createGroup = async (req, res) => {
  try {
    const { name, description } = req.body;
    const creatorId = req.user._id;

    const group = new Group({
      name,
      description,
      creator: creatorId,
      admins: [creatorId],
      members: [creatorId],
    });

    await group.save();

    res.status(201).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get all groups
 * @route GET /api/groups
 * @access Public
 */
export const getGroups = async (req, res) => {
  try {
    const groups = await Group.find().populate('creator', 'username profilePicture').populate('members', 'username profilePicture');
    res.status(200).json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get a single group by ID
 * @route GET /api/groups/:groupId
 * @access Public
 */
export const getGroupById = async (req, res) => {
  try {
    const { groupId } = req.params;
    const group = await Group.findById(groupId).populate('creator', 'username profilePicture').populate('members', 'username profilePicture').populate('admins', 'username profilePicture');

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Update a group
 * @route PUT /api/groups/:groupId
 * @access Private
 */
export const updateGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { name, description } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an admin of the group
    if (!group.admins.includes(userId)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    group.name = name || group.name;
    group.description = description || group.description;

    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Delete a group
 * @route DELETE /api/groups/:groupId
 * @access Private
 */
export const deleteGroup = async (req, res) => {
  try {
    const { groupId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is the creator of the group
    if (group.creator.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await group.remove();

    res.status(200).json('Group removed');
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Add a member to a group
 * @route POST /api/groups/:groupId/members
 * @access Private
 */
export const addMember = async (req, res) => {
  try {
    const { groupId } = req.params;
    const { userId } = req.body;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an admin of the group
    if (!group.admins.includes(adminId)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if the user to add exists
    const userToAdd = await User.findById(userId);
    if (!userToAdd) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if the user is already a member
    if (group.members.includes(userId)) {
      return res.status(400).json({ message: 'User is already a member of this group' });
    }

    group.members.push(userId);
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Remove a member from a group
 * @route DELETE /api/groups/:groupId/members/:memberId
 * @access Private
 */
export const removeMember = async (req, res) => {
  try {
    const { groupId, memberId } = req.params;
    const adminId = req.user._id;

    const group = await Group.findById(groupId);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    // Check if the user is an admin of the group
    if (!group.admins.includes(adminId)) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    // Check if the user to remove is a member
    if (!group.members.includes(memberId)) {
      return res.status(400).json({ message: 'User is not a member of this group' });
    }

    group.members = group.members.filter(member => member.toString() !== memberId.toString());
    await group.save();

    res.status(200).json(group);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
