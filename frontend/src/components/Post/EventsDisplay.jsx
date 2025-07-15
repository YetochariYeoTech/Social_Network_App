import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Avatar } from "@chakra-ui/react";
import { IoMdAddCircle as AddButton } from "react-icons/io";
import { Loader } from "lucide-react";
import AddEventModal from "./AddEventModal";
import { useEventStore } from "../../store/useEventStore";

function EventsDisplay() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    events,
    isFetchingEvents,
    fetchEvents,
    listenForEvents,
    cleanupListener,
  } = useEventStore();

  useEffect(() => {
    fetchEvents();
    listenForEvents();

    return () => {
      cleanupListener();
    };
  }, [fetchEvents, listenForEvents, cleanupListener]);

  const handleOpenModal = () => setIsModalOpen(true);
  const handleCloseModal = () => setIsModalOpen(false);

  return (
    <div className="flex flex-col bg-base-200 pl-1 pt-1 pb-1 shadow-md rounded-lg">
      <div className="flex justify-between items-center ">
        <span className="font-bold mb-2">Upcoming Events</span>
        <AddButton
          size={25}
          className="text-primary hover:cursor-pointer hover:scale-95 hover:text-base-content transition-all duration-200"
          onClick={handleOpenModal}
        />
      </div>

      {isFetchingEvents ? (
        <div className="flex justify-center">
          <Loader className="size-10 animate-spin" />
        </div>
      ) : (
        <div className="flex flex-col space-y-2 divide-y divide-base-100 max-h-72 overflow-auto">
          {events.length > 0 ? (
            events.map((event) => (
              <Link
                to={`/events/${event._id}`}
                className=" p-2 flex gap-2 items-center hover:shadow-md hover:ml-2 hover:bg-base-100 transition-all duration-200"
                key={event._id}
              >
                <Avatar.Root shape="full" size="sm">
                  <Avatar.Fallback name={event.creator.fullName} />
                  <Avatar.Image
                    src={event.creator.profilePic}
                    h="full"
                    w="full"
                  />
                </Avatar.Root>
                <div className="flex flex-col">
                  <span className="font-semibold">
                    {event.creator.fullName}
                  </span>
                  <span className="text-sm">
                    {event.title.length > 20
                      ? `${event.title.slice(0, 20)}...`
                      : event.title}
                  </span>
                </div>
              </Link>
            ))
          ) : (
            <p className="text-center text-gray-500">No upcoming events.</p>
          )}
        </div>
      )}
      <AddEventModal isOpen={isModalOpen} onClose={handleCloseModal} />
    </div>
  );
}

export default EventsDisplay;
