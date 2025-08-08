import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";

const PaymentPage = () => {
  const { state } = useLocation(); // from ReservationForm
  const navigate = useNavigate();
  const token = localStorage.getItem("token");

  const [price, setPrice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/reserve");
      return;
    }

    const { startTime, endTime } = state;
    const start = new Date(startTime);
    const end = new Date(endTime);
    const hours = Math.ceil((end - start) / (1000 * 60 * 60));
    setPrice((hours * 2.5).toFixed(2)); // match backend rate
    setLoading(false);
  }, [state, navigate]);

  const handlePay = async () => {
    setPaying(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/reservations",
        state,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTimeout(() => {
        navigate("/my-reservations");
      }, 1500);
    } catch (err) {
      console.error(err);
      alert("Payment or reservation failed.");
    }
  };

  if (loading) return <div className="p-6 text-center">Loading...</div>;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
      <div className="bg-white p-6 rounded shadow-md w-full max-w-md text-center">
        <h2 className="text-2xl font-bold mb-4">Payment Summary</h2>
        <p className="mb-2">Car: {state.car}</p>
        <p className="mb-2">Car Park: {state.carPark}</p>
        <p className="mb-2">
          From: {new Date(state.startTime).toLocaleString()}
        </p>
        <p className="mb-2">
          To: {new Date(state.endTime).toLocaleString()}
        </p>
        <p className="text-xl font-semibold mb-6">Amount: ${price}</p>

        <button
          onClick={handlePay}
          disabled={paying}
          className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700"
        >
          {paying ? "Processing..." : "Pay Now"}
        </button>
      </div>
    </div>
  );
};

export default PaymentPage;