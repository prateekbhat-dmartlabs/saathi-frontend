import { useEffect, useRef, useState } from "react";
import {
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";

import { getVideo } from "../services/tutorialService";

import "../styles/videoDetailsPage.css";

function VideoDetailsPage() {
  const { videoId } = useParams();

  const location = useLocation();
  const navigate = useNavigate();

  const videoDetails = location.state?.video;
  const role = location.state?.role;

  const videoRef = useRef(null);

  const [videoUrl, setVideoUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [duration, setDuration] = useState("");

  const [feedback, setFeedback] = useState("");
  const formatDuration = (seconds) => {
  if (!seconds || !Number.isFinite(seconds)) {
    return "00:00";
  }

  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);

  return `${String(minutes).padStart(2, "0")}:${String(
    remainingSeconds
  ).padStart(2, "0")}`;
};
  const formatDate = (date) => {
  if (!date) return "N/A";

  return new Date(date).toLocaleDateString("en-GB");
};

  useEffect(() => {
    if (!videoId || !role) {
      setError("Video information is missing.");
      setLoading(false);
      return;
    }

    let objectUrl = null;

    const loadVideo = async () => {
      try {
        setLoading(true);
        setError("");

        objectUrl = await getVideo(
          videoId,
          role
        );

        setVideoUrl(objectUrl);
      } catch (err) {
        setError(
          err.message || "Failed to load video"
        );
      } finally {
        setLoading(false);
      }
    };

    loadVideo();

    return () => {
      if (objectUrl) {
        URL.revokeObjectURL(objectUrl);
      }
    };
  }, [videoId, role]);

  if (!videoDetails) {
    return (
      <main className="video-details-page">

        <div className="video-details-container">

          <button
            className="details-back-button"
            onClick={() =>
              navigate("/tutorials", {
                state: { role },
              })
            }
          >
            ←
          </button>

          <div className="details-error">
            Video information unavailable
          </div>

        </div>

      </main>
    );
  }

  return (
    <main className="video-details-page">

      <div className="video-details-container">

        {/* VIDEO */}

        <section className="video-player-section">

          {loading && (
            <div className="player-status">
              Loading video...
            </div>
          )}

          {!loading && error && (
            <div className="player-status error">
              {error}
            </div>
          )}

          {!loading &&
            !error &&
            videoUrl && (
              <div className="video-player-wrapper">

                <video
                  ref={videoRef}
                  className="video-player"
                  src={videoUrl}
                  controls
                  playsInline
                  onLoadedMetadata={(e) => {
                    setDuration(formatDuration(e.target.duration));
                  }}
                />

              </div>
            )}

        </section>

        {/* INFORMATION */}

        <section className="video-information">

          <p className="video-details-app">
            {videoDetails.app_name}
          </p>

          <h1>
            {videoDetails.video_title}
          </h1>

          <p className="published-info">
            Published on {formatDate(videoDetails.created_at)}
            <span>|</span>
            {duration} Duration
          </p>

          {/* WHAT YOU WILL LEARN */}

          <div className="learning-box">

            <div className="learning-heading">

              <span className="learning-icon">
                ♧
              </span>

              <span>
                What you’ll learn in this video
              </span>

            </div>

            <ul>

              <li>
                How to identify and flag non
                sellable articles in the system.
              </li>

              <li>
                The step-by-step approval workflow
                for non sellable inventory.
              </li>

              <li>
                Key criteria used to classify an
                article as non sellable.
              </li>

              <li>
                How to document reasons and attach
                supporting evidence for approval.
              </li>

            </ul>

          </div>

          {/* FEEDBACK */}

          <div className="helpful-box">

            <div className="helpful-title">
              Was this video helpful?
            </div>

            <div className="helpful-buttons">

              <button
                className={`helpful-button yes ${
                  feedback === "yes"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setFeedback("yes")
                }
              >
                ♡ &nbsp; Yes
              </button>

              <button
                className={`helpful-button no ${
                  feedback === "no"
                    ? "selected"
                    : ""
                }`}
                onClick={() =>
                  setFeedback("no")
                }
              >
                ♧ &nbsp; No
              </button>

            </div>

          </div>

        </section>

      </div>

    </main>
  );
}

export default VideoDetailsPage;