import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Sidebar from "./components/Sidebar";
import SeatingArrangements from "./pages/SeatingArrangements";
import CreateSA from "./pages/CreateSA";
import HallManagement from "./pages/HallManagement";
import Notifications from "./pages/Notifications";

const Layout = () => {
  return (
    <div className="flex">
      <Sidebar />

      <main className="ml-80 w-full">
        <Routes>
          {/* DEFAULT PAGE */}
          <Route path="/" element={<Navigate to="seating-arrangements" />} />

          <Route
            path="seating-arrangements"
            element={<SeatingArrangements />}
          />
          <Route path="create-sa" element={<CreateSA />} />
          <Route path="hall-management" element={<HallManagement />} />
          <Route path="notifications" element={<Notifications />} />
        </Routes>
      </main>
    </div>
  );
};

export default Layout;
