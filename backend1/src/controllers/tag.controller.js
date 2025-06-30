
import { Tag } from '../models/tag.model.js';
import Post from '../models/post.model.js';

/**
 * @desc Create a new tag
 * @route POST /api/tags
 * @access Private
 */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    // Check if the tag already exists
    let tag = await Tag.findOne({ name });

    if (tag) {
      return res.status(400).json({ message: 'Tag already exists' });
    }

    tag = new Tag({ name });
    await tag.save();

    res.status(201).json(tag);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get all tags
 * @route GET /api/tags
 * @access Public
 */
export const getTags = async (req, res) => {
  try {
    const tags = await Tag.find();
    res.status(200).json(tags);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get all posts for a tag
 * @route GET /api/tags/:tagName/posts
 * @access Public
 */
export const getPostsByTag = async (req, res) => {
  try {
    const { tagName } = req.params;
    const tag = await Tag.findOne({ name: tagName }).populate('posts');

    if (!tag) {
      return res.status(404).json({ message: 'Tag not found' });
    }

    res.status(200).json(tag.posts);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
