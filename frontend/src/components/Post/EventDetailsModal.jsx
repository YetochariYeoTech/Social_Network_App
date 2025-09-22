import React from 'react';
import { useAuthStore } from '../../store/useAuthStore';
import { useEventStore } from '../../store/useEventStore';

function EventDetailsModal({ isOpen, onClose, event }) {
  const { authUser } = useAuthStore();
  const { fetchEvents } = useEventStore();

  if (!isOpen || !event) return null;

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const res = await fetch(`/api/events/${event._id}`, {
          method: 'DELETE',
        });
        if (res.ok) {
          fetchEvents();
          onClose();
        } else {
          console.error('Failed to delete event');
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center">
      <div className="bg-base-100 rounded-lg shadow-xl p-6 w-full max-w-md mx-auto">
        <div className="flex justify-between items-center border-b border-base-300 pb-3">
          <h3 className="font-bold text-lg">{event.title}</h3>
          <button className="btn btn-sm btn-circle btn-ghost" onClick={onClose}>✕</button>
        </div>
        <div className="py-4">
          <p>{event.description}</p>
          <div className="mt-4">
            <p><strong>Date:</strong> {new Date(event.date).toLocaleDateString()}</p>
            <p><strong>Location:</strong> {event.location}</p>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-4">
          {authUser && (authUser.role === 'STAFF' || authUser.role === 'ADMIN') && (
            <button className="btn btn-error" onClick={handleDelete}>Delete</button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EventDetailsModal;
