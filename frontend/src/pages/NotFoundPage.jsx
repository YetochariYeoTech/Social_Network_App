import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-base-100 dark:bg-base-100 text-center px-4">
      <h1 className="text-6xl md:text-9xl font-bold text-primary">404</h1>
      <h2 className="text-2xl md:text-4xl font-semibold text-base-content mt-4">
        Page Not Found
      </h2>
      <p className="text-md md:text-lg text-base-content dark:text-gray-400 mt-2">
        Sorry, the page you are looking for does not exist.
      </p>
      <Link
        to="/"
        className="mt-8 px-6 py-3 bg-primary text-primary-content font-semibold rounded-lg shadow-md hover:bg-white hover:text-gray-700 transition-colors duration-300"
      >
        Go Back Home
      </Link>
    </div>
  );
};

export default NotFoundPage;
