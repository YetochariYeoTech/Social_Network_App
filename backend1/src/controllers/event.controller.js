import Event from '../models/event.model.js';
import User from '../models/user.model.js';

/**
 * @desc Create a new event
 * @route POST /api/events
 * @access Private
 */
export const createEvent = async (req, res) => {
  try {
    const { title, description, startTime, endTime, location } = req.body;
    const creatorId = req.user._id;

    const event = new Event({
      title,
      description,
      startTime,
      endTime,
      location,
      creator: creatorId,
    });

    await event.save();

    res.status(201).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get all events
 * @route GET /api/events
 * @access Public
 */
export const getEvents = async (req, res) => {
  try {
    const events = await Event.find().populate('creator', 'username profilePicture');
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Get a single event by ID
 * @route GET /api/events/:eventId
 * @access Public
 */
export const getEventById = async (req, res) => {
  try {
    const { eventId } = req.params;
    const event = await Event.findById(eventId).populate('creator', 'username profilePicture').populate('attendees', 'username profilePicture');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Update an event
 * @route PUT /api/events/:eventId
 * @access Private
 */
export const updateEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { title, description, startTime, endTime, location } = req.body;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.creator.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    event.title = title || event.title;
    event.description = description || event.description;
    event.startTime = startTime || event.startTime;
    event.endTime = endTime || event.endTime;
    event.location = location || event.location;

    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc Delete an event
 * @route DELETE /api/events/:eventId
 * @access Private
 */
export const deleteEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user is the creator of the event
    if (event.creator.toString() !== userId.toString()) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await event.remove();

    res.status(200).json({ message: 'Event removed' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

/**
 * @desc RSVP to an event
 * @route POST /api/events/:eventId/rsvp
 * @access Private
 */
export const rsvpToEvent = async (req, res) => {
  try {
    const { eventId } = req.params;
    const userId = req.user._id;

    const event = await Event.findById(eventId);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if the user has already RSVP'd
    if (event.attendees.includes(userId)) {
      return res.status(400).json({ message: 'You have already RSVP\'d to this event' });
    }

    event.attendees.push(userId);
    await event.save();

    res.status(200).json(event);
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
