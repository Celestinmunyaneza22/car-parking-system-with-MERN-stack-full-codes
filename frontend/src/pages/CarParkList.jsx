import React, { useEffect, useState } from "react";
import {Link} from "react-router-dom"
import axios from "axios";

const CarParkList = () => {
  const [carParks, setCarParks] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCarParks = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/carparks");
        setCarParks(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load car parks");
      }
    };

    fetchCarParks();
  }, []);

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold text-center mb-6">Available Car Parks</h1>

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {carParks.length === 0 ? (
        <p className="text-center text-gray-600">No car parks found.</p>
      ) : (
        <div className="overflow-x-auto max-w-4xl mx-auto">
          <table className="w-full border border-gray-300 bg-white shadow-md">
            <thead className="bg-gray-200">
              <tr>
                <th className="py-2 px-4 border">Name</th>
                <th className="py-2 px-4 border">Location</th>
                <th className="py-2 px-4 border">Total Slots</th>
                <th className="py-2 px-4 border">Available Slots</th>
              </tr>
            </thead>
            <tbody>
              {carParks.map((park) => (
                <tr key={park._id} className="text-center">
                  <td className="py-2 px-4 border">{park.name}</td>
                  <td className="py-2 px-4 border">{park.location || "-"}</td>
                  <td className="py-2 px-4 border">{park.totalSlots}</td>
                  <td className="py-2 px-4 border">{park.availableSlots}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <Link to="/dashboard" className="text-blue-500 hover:underline">
          <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2">Back</button>
        </Link>
        </div>
      )}
    </div>
  );
};

export default CarParkList;