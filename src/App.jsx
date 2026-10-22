import { Routes, Route } from "react-router-dom";
import PlayerGamePage from "./pages/PlayerGamePage.jsx";
import AdminDashboardPage from "./pages/AdminDashboardPage.jsx";

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<PlayerGamePage />} />
      <Route path="/admin" element={<AdminDashboardPage />} />
    </Routes>
  );
}
