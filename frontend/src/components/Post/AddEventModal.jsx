import React, { useState } from 'react';
import { useEventStore } from '../../store/useEventStore';
import { Loader } from 'lucide-react';

const AddEventModal = ({ isOpen, onClose }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [location, setLocation] = useState('');
  const [error, setError] = useState('');

  const { createEvent, isCreatingEvent } = useEventStore();

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !startTime || !endTime || !location) {
      setError('All fields are required');
      return;
    }
    if (startTime && endTime && new Date(startTime) >= new Date(endTime)) {
      setError('Start time must be before end time');
      return;
    }
    setError('');

    const success = await createEvent({ title, description, startTime, endTime, location });

    if (success) {
      setTitle('');
      setDescription('');
      setStartTime('');
      setEndTime('');
      setLocation('');
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-base-100 rounded-lg shadow-lg p-6 w-full max-w-md mx-4">
        {isCreatingEvent ? (
          <div className="flex justify-center">
            <Loader className="size-10 animate-spin" />
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-primary">Create Event</h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="title" className="block text-sm font-medium text-base-content">Title</label>
                <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
              </div>
              <div className="mb-4">
                <label htmlFor="description" className="block text-sm font-medium text-base-content">Description</label>
                <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} rows="3" className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required></textarea>
              </div>
              <div className="mb-4">
                <label htmlFor="startTime" className="block text-sm font-medium text-base-content">Start Time</label>
                <input type="datetime-local" id="startTime" value={startTime} onChange={(e) => setStartTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
              </div>
              <div className="mb-4">
                <label htmlFor="endTime" className="block text-sm font-medium text-base-content">End Time</label>
                <input type="datetime-local" id="endTime" value={endTime} onChange={(e) => setEndTime(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
              </div>
              {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
              <div className="mb-4">
                <label htmlFor="location" className="block text-sm font-medium text-base-content">Location</label>
                <input type="text" id="location" value={location} onChange={(e) => setLocation(e.target.value)} className="mt-1 block w-full px-3 py-2 bg-base-200 border border-base-300 rounded-md shadow-sm focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" required />
              </div>
              <div className="flex justify-end space-x-4">
                <button type="button" onClick={onClose} className="btn btn-ghost">Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={isCreatingEvent}>
                  {isCreatingEvent ? 'Creating...' : 'Create'}
                </button>
              </div>
            </form>
          </>
        )}
      </div>
    </div>
  );
};

export default AddEventModal;
