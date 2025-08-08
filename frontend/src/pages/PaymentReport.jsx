// import React, { useEffect, useState } from "react";
// import axios from "axios";

// const PaymentReport = () => {
//   const [data, setData] = useState(null);
//   const token = localStorage.getItem("token");

//   useEffect(() => {
//     const fetchReport = async () => {
//       try {
//         const res = await axios.get("http://localhost:5000/api/reports/payments-summary", {
//           headers: { Authorization: `Bearer ${token}` },
//         });
//         setData(res.data);
//       } catch (error) {
//         console.error("Failed to fetch payment report:", error);
//       }
//     };

//     if (token) {
//       fetchReport();
//     }
//   }, [token]);

//   if (!data) {
//     return <p className="p-4">Loading payment report...</p>;
//   }

//   const totalRevenue = typeof data.totalRevenue === "number" ? data.totalRevenue : 0;
//   const monthlyRevenue = data.monthly ?? {};

//   return (
//     <div className="p-6">
//       {/* Print Button */}
//       <div className="mb-4 print:hidden">
//         <button
//           onClick={() => window.print()}
//           className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Print Report
//         </button>
//       </div>

//       {/* Report Content */}
//       <h2 className="text-2xl font-semibold mb-4">Payment Report</h2>
//       <p className="mb-4 text-lg font-medium">
//         Total Revenue: ${totalRevenue.toFixed(2)}
//       </p>

//       <h3 className="text-lg font-semibold mb-2">Monthly Revenue:</h3>
//       <ul className="space-y-1">
//         {Object.entries(monthlyRevenue).map(([month, value]) => (
//           <li key={month}>
//             {month}: ${typeof value === "number" ? value.toFixed(2) : "0.00"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default PaymentReport;

import React, { useEffect, useState } from "react";
import axios from "axios";

const PaymentReport = () => {
  const [data, setData] = useState(null);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchReport = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/reports/payments-summary", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setData(res.data);
      } catch (error) {
        console.error("Failed to fetch payment report:", error);
      }
    };

    if (token) {
      fetchReport();
    }
  }, [token]);

  // Print only the report section
  const handlePrint = () => {
    const content = document.getElementById("print-section").innerHTML;
    const printWindow = window.open("", "", "height=600,width=800");
    printWindow.document.write(`
      <html>
        <head>
          <title>Payment Report</title>
          <style>
            body {
              font-family: sans-serif;
              padding: 20px;
              color: #000;
            }
            h2 {
              margin-top: 0;
            }
            ul {
              list-style: none;
              padding-left: 0;
            }
          </style>
        </head>
        <body>
          ${content}
        </body>
      </html>
    `);
    printWindow.document.close();
    printWindow.focus();
    printWindow.print();
    printWindow.close();
  };

  if (!data) {
    return <p className="p-4">Loading payment report...</p>;
  }

  const totalRevenue = typeof data.totalRevenue === "number" ? data.totalRevenue : 0;
  const monthlyRevenue = data.monthly ?? {};

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* Print Button */}
      <div className="mb-4 print:hidden">
        <button
          onClick={handlePrint}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Print Report
        </button>
      </div>

      {/* Printable Section */}
      <div
        id="print-section"
        className="bg-white p-6 rounded shadow-md print:shadow-none print:border-none print:p-0"
      >
        <h2 className="text-2xl font-semibold mb-4">Payment Report</h2>
        <p className="mb-4 text-lg font-medium">
          Total Revenue: ${totalRevenue.toFixed(2)}
        </p>

        <h3 className="text-lg font-semibold mb-2">Monthly Revenue:</h3>
        <ul className="space-y-1">
          {Object.entries(monthlyRevenue).map(([month, value]) => (
            <li key={month}>
              {month}: ${typeof value === "number" ? value.toFixed(2) : "0.00"}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default PaymentReport;