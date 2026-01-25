import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./Layout";
import CECGridLanding from "./pages/LandingPage";
import HallVisualizer from "./pages/RoomVisualizer";
import ViewHall from "./pages/ViewHall";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* LOGIN PAGE (NO SIDEBAR) */}
        <Route path="/" element={<Login/>} />

        {/* APP WITH SIDEBAR */}
        <Route path="/app/*" element={<Layout />} />
        <Route path="/halls/view/:id" element={<ViewHall/>} />
      </Routes>
    </BrowserRouter>
  );
}
