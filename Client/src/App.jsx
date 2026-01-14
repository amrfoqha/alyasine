import React, { useState } from "react";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import { Routes, Route } from "react-router-dom";
import HomePage from "./pages/HomePage";
import ProtectedRoute from "./context/ProtectedRoute";
import DashboardPage from "./pages/DashboardPage";
import InventoryPage from "./pages/InventoryPage";

// import ProfilePage from "./pages/ProfilePage";
// import SettingsPage from "./pages/SettingsPage";
function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="dashboard" element={<DashboardPage />} />
          <Route path="inventory" element={<InventoryPage />} />
          {/* <Route path="profile" element={<ProfilePage />} />
          <Route path="settings" element={<SettingsPage />} /> */}
        </Route>

        <Route path="/*" element={<p>404 Not Found</p>} />
      </Routes>
    </>
  );
}

export default App;
