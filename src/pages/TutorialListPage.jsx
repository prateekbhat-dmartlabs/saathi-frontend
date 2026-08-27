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

        if (!data || data.length === 0) {
          setVideos([]);
          setNoVideos(true);
          return;
        }

        setVideos(data);
      } catch (err) {
        const errorMessage = err.message || "Failed to fetch tutorials";

        // Backend returns this when no videos exist for the role
        if (
          errorMessage === "No Video found for the specific role"
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

  const handleVideoClick = (video) => {
    navigate(`/tutorials/${video.video_id}`, {
      state: {
        role: role,
        video: video,
      },
    });
  };

  const handleBack = () => {
    navigate(-1);
  };

  if (!role) {
    return (
      <main className="tutorial-page">
        <div className="tutorial-container tutorial-status">
          <h1>Role not found</h1>

          <p>Please return to login and select your role.</p>

          <button
            onClick={() => navigate("/login")}
          >
            Go to Login
          </button>
        </div>
      </main>
    );
  }

  return (
    <main className="tutorial-page">
      <div className="tutorial-container">

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

        {/* Loading */}
        {loading && (
          <div className="tutorial-status">
            Loading tutorials...
          </div>
        )}

        {/* No Videos */}
        {!loading && noVideos && (
          <div className="tutorial-status">
            <h2>No tutorials available</h2>

            <p>
              No active tutorials were found for this role.
            </p>

            <button
              onClick={handleBack}
            >
              ← Back
            </button>
          </div>
        )}

        {/* Actual Error */}
        {!loading && error && !noVideos && (
          <div className="tutorial-status error">
            <h2>Unable to load tutorials</h2>

            <p>{error}</p>

            <button
              onClick={handleBack}
            >
              ← Back
            </button>
          </div>
        )}

        {/* Videos */}
        {!loading &&
          !error &&
          !noVideos &&
          videos.length > 0 && (
            <section className="video-grid">
              {videos.map((video) => (
                <VideoCard
                  key={video.video_id}
                  video={video}
                  onVideoClick={handleVideoClick}
                />
              ))}
            </section>
          )}

      </div>
    </main>
  );
}

export default TutorialListPage;