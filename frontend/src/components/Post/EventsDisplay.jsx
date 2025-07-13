import React from "react";
import eventsData from "../../data/events";
import { Avatar } from "@chakra-ui/react";
import { Link } from "react-router-dom";
import { IoMdAddCircle as AddButton } from "react-icons/io";

function EventsDisplay() {
  return (
    <div className="flex flex-col bg-base-200 pl-1 pt-1 pb-1 shadow-md rounded-lg">
      <div className="flex justify-between items-center ">
        <span className="font-bold mb-2">Upcoming Events</span>
        <AddButton
          size={25}
          className="text-neutral hover:cursor-pointer hover:scale-95 hover:text-primary-content transition-all duration-200"
        />
      </div>

      {/* Events list start */}
      <div className="flex flex-col space-y-2 divide-y divide-base-100 max-h-72 overflow-auto">
        {eventsData.map((event) => {
          return (
            // Event layout
            <Link
              to="/"
              className=" p-2 flex gap-2 items-center hover:shadow-md hover:ml-2 hover:bg-base-100 transition-all duration-200"
              key={event._id}
            >
              <Avatar.Root shape="full" size="sm">
                <Avatar.Fallback name={event.creator.fullName} />
                <Avatar.Image src={event.creator.profilePic} />
              </Avatar.Root>
              <div className="flex flex-col">
                <span className="font-semibold">{event.creator.fullName}</span>
                <span className="text-sm">
                  {event.title.length > 20
                    ? `${event.title.slice(0, 20)}...`
                    : event.title}
                </span>
              </div>
            </Link>
          );
        })}
      </div>
      {/* <button className="btn bg-primary">New event</button> */}
    </div>
  );
}

export default EventsDisplay;
