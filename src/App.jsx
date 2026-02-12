import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Layout from "./Layout";
import CECGridLanding from "./pages/LandingPage";
import HallVisualizer from "./pages/RoomVisualizer";
import ViewHall from "./pages/ViewHall";
import CustomizeSeating from "./pages/CustomizeSeating";
import IntroAnimation from "./components/IntroAnimation";

import { DataProvider } from "./context/DataContext";

export default function App() {
  const [loading, setLoading] = useState(true);

  return (
    <DataProvider>
      {loading && <IntroAnimation onComplete={() => setLoading(false)} />}
      <div className={loading ? "hidden" : ""}>
        <BrowserRouter>
          <Routes>
            {/* LOGIN PAGE (NO SIDEBAR) */}
            <Route path="/" element={<Login />} />

            {/* APP WITH SIDEBAR */}
            <Route path="/app/*" element={<Layout />} />
            <Route path="/halls/view/:id" element={<ViewHall />} />

            {/* STANDALONE PAGES */}
            <Route path="/customize/:examId" element={<CustomizeSeating />} />
          </Routes>
        </BrowserRouter>
      </div>
    </DataProvider>
  );
}
