import "../styles/VideoCard.css";

function VideoCard({ video, onVideoClick }) {
  return (
    <article
      className="video-card"
      onClick={() => onVideoClick(video)}
    >

      <div className="video-thumbnail">

        <div className="play-button">
          ▶
        </div>

      </div>


      <div className="video-card-content">

        <p className="video-app-name">
          {video.app_name}
        </p>

        <h2 className="video-title">
          {video.video_title}
        </h2>

        <p className="video-description">
          {video.video_description}
        </p>

      </div>

    </article>
  );
}

export default VideoCard;