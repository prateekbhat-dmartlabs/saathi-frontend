import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import VideoCard from "../components/VideoCard";
import { getTutorialsByRole } from "../services/tutorialService";

import "../styles/TutorialListPage.css";

function TutorialListPage() {
  const location = useLocation();
  const navigate = useNavigate();

  const role = location.state?.role;

  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [noVideos, setNoVideos] = useState(false);

  // Search state
  const [searchTerm, setSearchTerm] = useState("");

  // Selected application filter
  const [selectedApp, setSelectedApp] = useState("All");

  // Fetch tutorials based on role
  useEffect(() => {
    const loadTutorials = async () => {
      if (!role) {
        setError("Role information is missing.");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError("");
        setNoVideos(false);

        const data = await getTutorialsByRole(role);

        console.log("Tutorial API Response:", data);

        // No videos found for this role
        if (
          data?.message === "No tutorials found for this role" ||
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setVideos([]);
          setNoVideos(true);
          return;
        }

        // Videos found
        setVideos(data);
      } catch (err) {
        const errorMessage =
          err.message || "Failed to fetch tutorials";

        if (
          errorMessage.includes(
            "No tutorials found for this role"
          )
        ) {
          setVideos([]);
          setNoVideos(true);
        } else {
          setError(errorMessage);
        }
      } finally {
        setLoading(false);
      }
    };

    loadTutorials();
  }, [role]);

  // Create unique application list dynamically
  const applications = [
    "All",
    ...new Set(
      videos
        .map((video) => video.app_name)
        .filter(Boolean)
    ),
  ];

  // Apply application filter + search filter
  const filteredVideos = videos.filter((video) => {
    const search = searchTerm.trim().toLowerCase();

    const matchesApplication =
      selectedApp === "All" ||
      video.app_name === selectedApp;

    const matchesSearch =
      video.app_name?.toLowerCase().includes(search) ||
      video.video_title?.toLowerCase().includes(search) ||
      video.video_description?.toLowerCase().includes(search);

    return matchesApplication && matchesSearch;
  });

  // Navigate to selected video
  const handleVideoClick = (video) => {
    navigate(`/tutorials/${video.video_id}`, {
      state: {
        role: role,
        video: video,
      },
    });
  };

  // Go back to previous page
  const handleBack = () => {
    navigate(-1);
  };

  // Missing role
  if (!role) {
    return (
      <main className="tutorial-page">
        <div className="tutorial-container tutorial-status">
          <h1>Role not found</h1>

          <p>
            Please return to login and select your role.
          </p>

          <button onClick={() => navigate("/login")}>
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="tutorial-page">
      <div className="tutorial-container">

        {/* Header */}
        <section className="tutorial-header">
          <div>
            <p className="tutorial-label">
              AVAILABLE TUTORIALS
            </p>

            <h1>
              Tutorials for {role}
            </h1>

            <p className="tutorial-subtitle">
              Select a tutorial to start learning.
            </p>
          </div>

          <span className="role-badge">
            {role}
          </span>
        </section>

        {/* Search and Application Filter */}
        {!loading && !error && !noVideos && (
          <section className="tutorial-controls">

            {/* Search */}
            <div className="search-wrapper">
              <span className="search-icon">⌕</span>

              <input
                type="text"
                placeholder="Search by application, tutorial title or description..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
              />

              {searchTerm && (
                <button
                  className="clear-search"
                  onClick={() => setSearchTerm("")}
                  aria-label="Clear search"
                >
                  ×
                </button>
              )}
            </div>

            {/* Application Filter */}
            <div className="filter-section">
              <p className="filter-label">
                Filter by Application
              </p>

              <div className="application-filter">
                {applications.map((app) => (
                  <button
                    key={app}
                    onClick={() => setSelectedApp(app)}
                    className={`filter-button ${
                      selectedApp === app ? "active" : ""
                    }`}
                  >
                    {app}
                  </button>
                ))}
              </div>
            </div>

          </section>
        )}

        {/* Result Count */}
        {!loading &&
          !error &&
          !noVideos &&
          videos.length > 0 && (
            <div className="result-count">
              Showing{" "}
              <strong>{filteredVideos.length}</strong>{" "}
              of <strong>{videos.length}</strong>{" "}
              tutorials
            </div>
          )}

        {/* Loading */}
        {loading && (
          <div className="tutorial-status">
            Loading tutorials...
          </div>
        )}

        {/* No Videos for Role */}
        {!loading && noVideos && (
          <div className="tutorial-status">
            <h2>No tutorials available</h2>

            <p>
              No active tutorials were found for this role.
            </p>

            <button onClick={handleBack}>
              ← Back
            </button>
          </div>
        )}

        {/* Actual Error */}
        {!loading && error && !noVideos && (
          <div className="tutorial-status error">
            <h2>Unable to load tutorials</h2>

            <p>{error}</p>

            <button onClick={handleBack}>
              ← Back
            </button>
          </div>
        )}

        {/* Video Grid */}
        {!loading &&
          !error &&
          !noVideos &&
          filteredVideos.length > 0 && (
            <section className="video-grid">
              {filteredVideos.map((video) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  onVideoClick={handleVideoClick}
                />
              ))}
            </section>
          )}

        {/* No Search / Filter Results */}
        {!loading &&
          !error &&
          !noVideos &&
          videos.length > 0 &&
          filteredVideos.length === 0 && (
            <div className="tutorial-status">
              <h2>No matching tutorials found</h2>

              <p>
                Try changing your search or selecting a
                different application.
              </p>

              <button
                onClick={() => {
                  setSearchTerm("");
                  setSelectedApp("All");
                }}
              >
                Clear Filters
              </button>
            </div>
          )}

      </div>
    </main>
  );
}

export default TutorialListPage;