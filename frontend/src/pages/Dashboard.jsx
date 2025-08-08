import React, { useEffect, useState } from 'react';
import { useNavigate , Link} from 'react-router-dom';
import axios from 'axios';

const Dashboard = () => {
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [error, setError] = useState('');
  const [cars, setCars] = useState([]);

const [editingCarId, setEditingCarId] = useState(null);
const [editFormData, setEditFormData] = useState({
  plateNumber: '',
  brand: '',
  color: '',
});

const handleEditChange = (e) => {
  setEditFormData({
    ...editFormData,
    [e.target.name]: e.target.value,
  });
};

const handleEditSubmit = async (e) => {
  e.preventDefault();

  try {
    const token = localStorage.getItem("token");

    await axios.put(
      `http://localhost:5000/api/cars/${editingCarId}`,
      editFormData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    // Refresh car list after update
    const carsRes = await axios.get("http://localhost:5000/api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars(carsRes.data);

    setCarMessage("Car updated successfully!");
    setEditingCarId(null);
    setEditFormData({ plateNumber: '', brand: '', color: '' });
  } catch (err) {
    console.error("Edit failed:", err);
    setCarMessage(err.response?.data?.message || "Update failed");
  }
};

  const [formData, setFormData] = useState({
    plateNumber: '',
    brand: '',
    color: '',
  });
  const [carMessage, setCarMessage] = useState('');

  // Fetch user profile using token

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await axios.get('http://localhost:5000/api/users/profile', {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

      setProfile(res.data);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile. Redirecting...');
        setTimeout(() => {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/login');
        }, 1500);
      }
    };


    fetchProfile();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleCarChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleCarSubmit = async (e) => {
  e.preventDefault();
  setCarMessage("");

  try {
    const token = localStorage.getItem("token");

    await axios.post("http://localhost:5000/api/cars", formData, {
      headers: { Authorization: `Bearer ${token}` },
    });

    setCarMessage("Car added successfully!");
    setFormData({ plateNumber: "", brand: "", color: "" });

    // ✅ Re-fetch car list
    const carsRes = await axios.get("http://localhost:5000/api/cars", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setCars(carsRes.data);

  } catch (err) {
    setCarMessage(err.response?.data?.message || "Failed to add car");
  }
};

useEffect(() => {
  const fetchProfileAndCars = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }
  // Get user profile
      const profileRes = await axios.get("http://localhost:5000/api/users/profile", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProfile(profileRes.data);

      // Get cars
      const carsRes = await axios.get("http://localhost:5000/api/cars", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCars(carsRes.data);

    } catch (err) {
      console.error(err);
      setError("Session expired or network error. Redirecting...");
      setTimeout(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/login");
      }, 1500);
    }
  };

  fetchProfileAndCars();
}, [navigate]);

const handleDeleteCar = async (carId) => {
  try {
    const token = localStorage.getItem("token");

    await axios.delete(`http://localhost:5000/api/cars/${carId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // ✅ Remove car from state
    setCars((prevCars) => prevCars.filter((car) => car._id !== carId));

    setCarMessage("Car deleted successfully.");
  } catch (err) {
    console.error("Failed to delete car:", err);
    setCarMessage(err.response?.data?.message || "Delete failed.");
  }
};

   if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600">
        {error}
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="min-h-screen flex items-center justify-center text-gray-700">
        Loading profile...
      </div>
    );
  }
return (
    <>
    <Link to="/reserve" className="text-blue-500 hover:underline mr-2">
  Make a Reservation
</Link>
<Link
  to="/my-reservations"
  className="text-blue-600 hover:underline mr-2"
>
  View My Reservations
</Link>
<Link to="/add-carpark" className="text-blue-600 hover:underline mr-2">
  Add Car Park
</Link>
<Link to="/carparks" className="text-blue-600 hover:underline mr-2">
  View Car Parks
</Link>
<Link to="/report/reservations" className="text-blue-600 underline mr-2">Reservation Report</Link>
<Link to="/report/payments" className="text-blue-600 underline ml-4">Payment Report</Link>
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Welcome, {profile.fullname}!</h1>
        <p className="mb-4">Email: {profile.email}</p>

        <form onSubmit={handleCarSubmit} className="space-y-4">
          <h2 className="text-xl font-semibold mb-2">Add a Car</h2>

          {carMessage && <p className="text-blue-600">{carMessage}</p>}

          <input
            type="text"
            name="plateNumber"
            value={formData.plateNumber}
            onChange={handleCarChange}
            placeholder="Plate Number"
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="brand"
            value={formData.brand}
            onChange={handleCarChange}
            placeholder="Car Brand"
            required
            className="w-full px-4 py-2 border rounded"
          />

          <input
            type="text"
            name="color"
            value={formData.color}
            onChange={handleCarChange}
            placeholder="Color (optional)"
            className="w-full px-4 py-2 border rounded"
          />

          <button
            type="submit"
            className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
          >
            Add Car
          </button>
        </form>
       <hr/>
        <button
          onClick={handleLogout}
          className="w-full mt-6 bg-red-600 text-white py-2 rounded hover:bg-red-700"
        >
          Logout
        </button>
        <hr/>

        {/* Car list */}
{cars.length > 0 ? (
  <div className="mt-8">
    <h3 className="text-lg font-semibold mb-2">Your Cars</h3>
<ul className="space-y-2">
  {cars.map((car) => (
    <li key={car._id} className="border p-3 rounded bg-gray-50">
  {editingCarId === car._id ? (
    // Edit form
    <form onSubmit={handleEditSubmit} className="space-y-2">
      <input
        type="text"
        name="plateNumber"
        value={editFormData.plateNumber}
        onChange={handleEditChange}
        className="w-full px-2 py-1 border rounded"
        required
      />
      <input
        type="text"
        name="brand"
        value={editFormData.brand}
        onChange={handleEditChange}
        className="w-full px-2 py-1 border rounded"
        required
      />
      <input
        type="text"
        name="color"
        value={editFormData.color}
        onChange={handleEditChange}
        className="w-full px-2 py-1 border rounded"
      />
      <div className="flex gap-2">
        <button
          type="submit"
          className="bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700"
        >
          Save
        </button>
        <button
          type="button"
          onClick={() => setEditingCarId(null)}
          className="bg-gray-400 text-white px-3 py-1 rounded hover:bg-gray-500"
        >
          Cancel
        </button>
      </div>
    </form>
  ) : (
    // Normal view
    <div className="flex justify-between items-start">
      <div>
        <p><strong>Plate:</strong> {car.plateNumber}</p>
        <p><strong>Brand:</strong> {car.brand}</p>
        <p><strong>Color:</strong> {car.color || 'N/A'}</p>
        <p className="text-sm text-gray-500">
          <strong>Added:</strong> {new Date(car.createdAt).toLocaleString()}
        </p>
      </div>
      <div className="flex flex-col gap-2 ml-4">
        <button
          onClick={() => {
            setEditingCarId(car._id);
            setEditFormData({
              plateNumber: car.plateNumber,
              brand: car.brand,
              color: car.color || '',
            });
          }}
          className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600"
        >
          Edit
        </button>
        <button
          onClick={() => handleDeleteCar(car._id)}
          className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  )}
</li>
  ))}
</ul>
  </div>
) : (
  <p className="mt-8 text-gray-500 italic">No cars added yet.</p>
)}
      </div>
    </div>
    </>
  );
};

export default Dashboard;