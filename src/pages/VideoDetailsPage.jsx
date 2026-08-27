import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";

import { getVideo } from "../services/tutorialService";

import "../styles/VideoDetailsPage.css";

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

        objectUrl = await getVideo(videoId, role);

        setVideoUrl(objectUrl);
      } catch (err) {
        setError(err.message);
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


  const handleFullscreen = async () => {
    if (!videoRef.current) {
      return;
    }

    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      } else {
        await videoRef.current.requestFullscreen();
      }
    } catch (err) {
      console.error(
        "Fullscreen failed:",
        err
      );
    }
  };


  if (!videoDetails) {
    return (
      <main className="video-details-page">

        <div className="video-details-container">

          <h1>Video information unavailable</h1>

          <button
            onClick={() => navigate("/tutorials")}
          >
            Back to Tutorials
          </button>

        </div>

      </main>
    );
  }


  return (
    <main className="video-details-page">

      <div className="video-details-container">

        <button
  className="back-button"
  onClick={() => navigate(-1)}
>
  ← Back to Tutorials
</button>


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


          {!loading && !error && videoUrl && (
            <div className="video-player-wrapper">

              <video
                ref={videoRef}
                className="video-player"
                src={videoUrl}
                controls
                playsInline
              />

              <button
                className="fullscreen-button"
                onClick={handleFullscreen}
              >
                {/* ⛶ Fullscreen */}
              </button>

            </div>
          )}

        </section>


        <section className="video-information">

          <p className="video-details-app">
            {videoDetails.app_name}
          </p>

          <h1>
            {videoDetails.video_title}
          </h1>

          <p className="video-details-description">
            {videoDetails.video_description}
          </p>

        </section>

      </div>

    </main>
  );
}

export default VideoDetailsPage;