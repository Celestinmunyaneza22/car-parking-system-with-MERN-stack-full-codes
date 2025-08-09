import React, { useEffect, useState } from "react";
import axios from "axios";
import jsPDF from "jspdf";

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

  const handleDownloadPDF = () => {
    const doc = new jsPDF();

    doc.setFontSize(16);
    doc.text("Reservation Summary Report", 20, 20);

    doc.setFontSize(12);
    doc.text(`Total Reservations: ${data.total}`, 20, 40);
    doc.text(`Active Reservations: ${data.active}`, 20, 50);
    doc.text(`Completed Reservations: ${data.completed}`, 20, 60);
    doc.text(`Cancelled Reservations: ${data.cancelled}`, 20, 70);

    doc.save("reservation-report.pdf");
  };

  if (!data) return <p className="p-4">Loading reservation report...</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Reservation Report</h2>
      <ul className="space-y-2 mb-4">
        <li>Total Reservations: {data.total}</li>
        <li>Active Reservations: {data.active}</li>
        <li>Completed Reservations: {data.completed}</li>
        <li>Cancelled Reservations: {data.cancelled}</li>
      </ul>

      <button
        onClick={handleDownloadPDF}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition-colors duration-200"
      >
        Download PDF
      </button>
    </div>
  );
};

export default ReservationReport;