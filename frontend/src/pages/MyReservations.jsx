import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate,Link } from "react-router-dom";

const MyReservations = () => {
  const navigate = useNavigate();
  const [reservations, setReservations] = useState([]);
  const [message, setMessage] = useState("");

  const token = localStorage.getItem("token");

  useEffect(() => {
    if (!token) return navigate("/login");

    const fetchReservations = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reservations", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setReservations(res.data);
      } catch (err) {
        console.error(err);
        setMessage("Failed to load reservations");
      }
    };

    fetchReservations();
  }, [navigate, token]);

  const handleCancel = async (id) => {
    try {
      await axios.put(
        `http://localhost:5000/api/reservations/${id}/cancel`,
        {},
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      setReservations((prev) =>
        prev.map((r) =>
          r._id === id ? { ...r, status: "cancelled" } : r
        )
      );

      setMessage("Reservation cancelled");
    } catch (err) {
      console.error(err);
      setMessage("Cancellation failed");
    }
  };

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6 text-center">My Reservations</h1>
       <Link
         to="/dashboard"
         className="text-blue-600 hover:underline"
       >
         Back
       </Link>
      {message && (
        <div className="text-center text-blue-600 mb-4">{message}</div>
      )}

      {reservations.length === 0 ? (
        <p className="text-center text-gray-600">No reservations found.</p>
        
      ) : (
        <div className="space-y-4 max-w-3xl mx-auto">
          {reservations.map((res) => (
            <div
              key={res._id}
              className="bg-white p-4 rounded shadow flex flex-col md:flex-row justify-between items-start md:items-center"
            >
              <div>
                <p><strong>Car:</strong> {res.car?.plateNumber} ({res.car?.brand})</p>
                <p><strong>Car Park:</strong> {res.carPark?.name}</p>
                <p><strong>From:</strong> {new Date(res.startTime).toLocaleString()}</p>
                <p><strong>To:</strong> {new Date(res.endTime).toLocaleString()}</p>
                <p>
                  <strong>Status:</strong>{" "}
                  <span
                    className={
                      res.status === "cancelled"
                        ? "text-red-500"
                        : res.status === "completed"
                        ? "text-gray-500"
                        : "text-green-600"
                    }
                  >
                    {res.status}
                  </span>
                </p>
              </div>

              {res.status === "active" && (
                <button
                  onClick={() => handleCancel(res._id)}
                  className="mt-4 md:mt-0 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                >
                  Cancel
                </button>
              )}
               
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyReservations;