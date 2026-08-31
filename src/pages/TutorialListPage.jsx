import { useEffect, useMemo, useState } from "react";
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

  const [searchTerm, setSearchTerm] = useState("");

  // Selected application
  const [selectedApplication, setSelectedApplication] =
    useState(null);

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

        if (
          data?.message === "No tutorials found for this role" ||
          !Array.isArray(data) ||
          data.length === 0
        ) {
          setVideos([]);
          setNoVideos(true);
          return;
        }

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

  /*
    Create applications from the backend response.

    Example backend data:

    [
      {
        app_name: "Asset Vista",
        video_title: "...",
        video_id: "123"
      },
      {
        app_name: "Asset Vista",
        video_title: "...",
        video_id: "456"
      },
      {
        app_name: "Store PI",
        video_title: "...",
        video_id: "789"
      }
    ]

    This automatically becomes:

    Asset Vista -> 2 Videos
    Store PI    -> 1 Video
  */

  const applications = useMemo(() => {
    const grouped = {};

    videos.forEach((video) => {
      const appName = video.app_name;

      if (!appName) {
        return;
      }

      if (!grouped[appName]) {
        grouped[appName] = [];
      }

      grouped[appName].push(video);
    });

    return Object.entries(grouped).map(
      ([name, appVideos]) => ({
        name,
        videos: appVideos,
      })
    );
  }, [videos]);

  /*
    Search applications on first screen
  */

  const filteredApplications = applications.filter(
    (application) =>
      application.name
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
  );

  /*
    Videos for selected application
  */

  const selectedVideos = selectedApplication
    ? videos.filter(
        (video) =>
          video.app_name === selectedApplication
      )
    : [];

  /*
    Search videos on second screen
  */

  const filteredVideos = selectedVideos.filter(
    (video) => {
      const search = searchTerm
        .trim()
        .toLowerCase();

      return (
        video.video_title
          ?.toLowerCase()
          .includes(search) ||
        video.video_description
          ?.toLowerCase()
          .includes(search)
      );
    }
  );

  /*
    Open video details
  */

  const handleVideoClick = (video) => {
    navigate(`/tutorials/${video.video_id}`, {
      state: {
        role: role,
        video: video,
      },
    });
  };

  /*
    Loading
  */

  if (loading) {
    return (
      <main className="tutorial-page">
        <div className="mobile-app">
          <div className="loading-screen">
            Loading...
          </div>
        </div>
      </main>
    );
  }

  /*
    Missing role
  */

  if (!role) {
    return (
      <main className="tutorial-page">
        <div className="mobile-app">
          <div className="status-screen">
            <h2>Role not found</h2>

            <p>
              Please return to login and select your role.
            </p>

            <button
              onClick={() => navigate("/login")}
            >
              Go to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
    Backend error
  */

  if (error) {
    return (
      <main className="tutorial-page">
        <div className="mobile-app">
          <div className="status-screen">
            <h2>Unable to load tutorials</h2>

            <p>{error}</p>

            <button
              onClick={() => navigate("/login")}
            >
              Back to Login
            </button>
          </div>
        </div>
      </main>
    );
  }

  /*
    No videos
  */

  if (noVideos) {
    return (
      <main className="tutorial-page">
        <div className="mobile-app">
          <div className="status-screen">
            <h2>No tutorials available</h2>

            <p>
              No active tutorials were found for this role.
            </p>
          </div>
        </div>
      </main>
    );
  }

  /*
    ---------------------------------------
    SCREEN 2
    APPLICATION VIDEOS
    ---------------------------------------
  */

  if (selectedApplication) {
    return (
      <main className="tutorial-page">
        <div className="mobile-app">

          <header className="mobile-header">

            <button
              className="back-icon"
              onClick={() => {
                setSelectedApplication(null);
                setSearchTerm("");
              }}
            >
              ←
            </button>

            <span className="header-green-title">
              {selectedApplication}
            </span>

          </header>

          <div className="mobile-search">
            <input
              type="text"
              placeholder="Search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(event.target.value)
              }
            />

            <span className="mobile-search-icon">
              ⌕
            </span>
          </div>

          <section className="mobile-video-list">

            {filteredVideos.map((video) => (
              <VideoCard
                key={video.video_id}
                video={video}
                onVideoClick={handleVideoClick}
              />
            ))}

            {filteredVideos.length === 0 && (
              <div className="empty-search">
                No videos found
              </div>
            )}

          </section>

        </div>
      </main>
    );
  }

  /*
    ---------------------------------------
    SCREEN 1
    MY APPLICATION
    ---------------------------------------
  */

  return (
    <main className="tutorial-page">
      <div className="mobile-app">

        <h1 className="my-application-title">
          My Application
        </h1>

        <div className="mobile-search">
          <input
            type="text"
            placeholder="Search"
            value={searchTerm}
            onChange={(event) =>
              setSearchTerm(event.target.value)
            }
          />

          <span className="mobile-search-icon">
            ⌕
          </span>
        </div>

        <section className="application-list">

          {filteredApplications.map(
            (application) => (
              <button
                className="application-row"
                key={application.name}
                onClick={() => {
                  setSelectedApplication(
                    application.name
                  );

                  setSearchTerm("");
                }}
              >
                <span className="application-name">
                  {application.name}
                </span>

                <span className="application-right">

                  <span className="video-count">
                    {String(
                      application.videos.length
                    ).padStart(2, "0")}{" "}
                    Videos
                  </span>

                  <span className="application-arrow">
                    ›
                  </span>

                </span>
              </button>
            )
          )}

          {filteredApplications.length === 0 && (
            <div className="empty-search">
              No applications found
            </div>
          )}

        </section>

      </div>
    </main>
  );
}

export default TutorialListPage;