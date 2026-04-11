import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import VaultPage from "./pages/VaultPage";
import DetectionMapPage from "./pages/DetectionMapPage";
import EvidenceBoardPage from "./pages/EvidenceBoardPage";
import DetectionPage from "./pages/DetectionPage";

export default function App() {
  return (
    <div className="min-h-screen bg-zinc-950 font-[Lexend,sans-serif] text-white">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/vault" element={<VaultPage />} />
        <Route path="/detection-map" element={<DetectionMapPage />} />
        <Route path="/evidence" element={<EvidenceBoardPage />} />
        <Route path="/detection" element={<DetectionPage />} />
      </Routes>
    </div>
  );
}
