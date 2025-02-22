import React from 'react';
import { Link } from 'react-router-dom';

const Pnf = () => {
  return (
    <div className="flex items-center justify-center h-screen bg-gray-200">
      <div className="text-center">
        <h1 className="text-7xl font-bold text-red-500 mb-6">404</h1>
        <p className="text-2xl text-gray-700 mb-6">Oops! Page Not Found</p>
        <Link to="/" className="inline-block bg-blue-500 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-600">Go back to Home</Link>
      </div>
    </div>
  );
}

export default Pnf;
