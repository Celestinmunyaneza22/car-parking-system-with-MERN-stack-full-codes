import React, { useEffect, useState } from "react";
import axios from "axios";

const ReservationReport = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      const res = await axios.get("http://localhost:5000/api/reports/reservations-summary", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setData(res.data);
    };

    fetchReport();
  }, [token]);

  if (!data) return <p className="p-4">Loading reservation report...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Reservation Report</h2>
      <ul className="space-y-2">
        <li>Total Reservations: {data.total}</li>
        <li>Active Reservations: {data.active}</li>
        <li>Completed Reservations: {data.completed}</li>
        <li>Cancelled Reservations: {data.cancelled}</li>
      </ul>
    </div>
  );
};

export default ReservationReport;