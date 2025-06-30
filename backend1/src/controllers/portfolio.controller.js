
import Portfolio from '../models/portfolio.model.js';
import User from '../models/user.model.js';

/**
 * @desc Get a user's portfolio
 * @route GET /api/portfolios/:userId
 * @access Public
 */
export const getPortfolio = async (req, res) => {
  try {
    const { userId } = req.params;
    const portfolio = await Portfolio.findOne({ user: userId }).populate('user', 'username profilePicture');

    if (!portfolio) {
      return res.status(404).json({ message: 'Portfolio not found' });
    }

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Create or update a user's portfolio
 * @route PUT /api/portfolios
 * @access Private
 */
export const upsertPortfolio = async (req, res) => {
  try {
    const userId = req.user._id;
    const portfolioData = req.body;

    const portfolio = await Portfolio.findOneAndUpdate(
      { user: userId },
      { ...portfolioData, user: userId },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(portfolio);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
