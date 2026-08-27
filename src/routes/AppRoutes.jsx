import { Routes, Route, Navigate } from "react-router-dom";

import LoginPage from "../pages/LoginPage";
import TutorialListPage from "../pages/TutorialListPage";
import VideoDetailsPage from "../pages/VideoDetailsPage";

function AppRoutes() {
  return (
    <Routes>

      <Route
        path="/"
        element={<Navigate to="/login" replace />}
      />

      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route
        path="/tutorials"
        element={<TutorialListPage />}
      />

      <Route
        path="/tutorials/:videoId"
        element={<VideoDetailsPage />}
      />

    </Routes>
  );
}

export default AppRoutes;