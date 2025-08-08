import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SignupPage from "./pages/SignupPage";
import LoginPage from "./pages/LoginPage";
import Dashboard from "./pages/Dashboard";
import PrivateRoute from "./PrivateRoute"; // we'll create this
import ReservationForm from "./pages/ReservationForm";
import MyReservations from "./pages/MyReservations";
import AddCarPark from "./pages/AddCarPark";
import CarParkList from "./pages/CarParkList";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        } />
      <Route path="/reserve" element={<ReservationForm />} />
      <Route path="/my-reservations" element={<MyReservations />} />
      <Route path="/add-carpark" element={<AddCarPark />} />
      <Route path="/carparks" element={<CarParkList />} />
      </Routes>
    </Router>
  );
}

export default App;
