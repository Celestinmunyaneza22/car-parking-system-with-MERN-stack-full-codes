import React from 'react';
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-white shadow-md p-4 flex flex-wrap gap-4 items-center justify-center sm:justify-start">
      <Link to="/dashboard" className="text-blue-600 hover:text-blue-700 font-semibold">
        Dashboard
      </Link>
      <Link to="/reserve" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        Make Reservation
      </Link>
      <Link to="/my-reservations" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        View My Reservations
      </Link>
      <Link to="/add-carpark" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        Add Car Park
      </Link>
      <Link to="/carparks" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        View Car Parks
      </Link>
      <Link to="/report/reservations" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        Reservation Report
      </Link>
      <Link to="/report/payments" className="text-blue-600 hover:text-green-600 transition-colors duration-200"
>
        Payment Report
      </Link>
    </nav>
  );
};

export default Navbar;