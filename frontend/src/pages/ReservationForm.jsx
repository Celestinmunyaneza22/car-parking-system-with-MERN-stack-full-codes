import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

const ReservationForm = () => {
  const navigate = useNavigate();

  const [cars, setCars] = useState([]);
  const [carParks, setCarParks] = useState([]);
  const [formData, setFormData] = useState({
    car: "",
    carPark: "",
    startTime: "",
    endTime: "",
  });

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const token = localStorage.getItem("token");

  // Fetch user cars and available car parks
  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchData = async () => {
      try {
        const [carsRes, parksRes] = await Promise.all([
          axios.get("http://localhost:5000/api/cars", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("http://localhost:5000/api/carparks"),
        ]);

        setCars(carsRes.data);
        setCarParks(parksRes.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load form data.");
      }
    };

    fetchData();
  }, [navigate, token]);

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // try {
    //   const res = await axios.post(
    //     "http://localhost:5000/api/reservations",
    //     formData,
    //     {
    //       headers: { Authorization: `Bearer ${token}` },
    //     }
    //   );

    //   setMessage("Reservation created successfully!");
    //   setError("");
    //   setFormData({ car: "", carPark: "", startTime: "", endTime: "" });

    //   // Redirect or show confirmation
    //   setTimeout(() => navigate("/dashboard"), 1500);
    // } catch (err) {
    //   console.error(err);
    //   setError(err.response?.data?.message || "Reservation failed.");
    //   setMessage("");
    // }
    navigate("/payment", { state: formData });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow-md w-full max-w-md"
      >
        <h2 className="text-2xl font-semibold mb-4 text-center">
          Make a Reservation
        </h2>

        {message && <p className="text-green-600">{message}</p>}
        {error && <p className="text-red-600">{error}</p>}

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Car</label>
          <select
            name="car"
            value={formData.car}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose a car --</option>
            {cars.map((car) => (
              <option key={car._id} value={car._id}>
                {car.plateNumber} ({car.brand})
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Select Car Park</label>
          <select
            name="carPark"
            value={formData.carPark}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          >
            <option value="">-- Choose a car park --</option>
            {carParks.map((park) => (
              <option key={park._id} value={park._id}>
                {park.name} – {park.availableSlots} available
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">Start Time</label>
          <input
            type="datetime-local"
            name="startTime"
            value={formData.startTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <div className="mb-4">
          <label className="block font-medium mb-1">End Time</label>
          <input
            type="datetime-local"
            name="endTime"
            value={formData.endTime}
            onChange={handleChange}
            required
            className="w-full border px-3 py-2 rounded"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700"
        >
          Reserve Slot
        </button>
        <Link to="/dashboard" className="text-blue-500 hover:underline">
          <button className="w-full bg-gray-600 text-white py-2 rounded hover:bg-gray-700 mt-2">Back</button>
        </Link>
      </form>
    </div>
  );
};

export default ReservationForm;