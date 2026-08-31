import "../styles/VideoCard.css";

function VideoCard({ video, onVideoClick }) {
  return (
    <article
      className="video-card"
      onClick={() => onVideoClick(video)}
    >

      <div
        className="video-thumbnail"
        style={
          video.title_image
            ? {
                backgroundImage: `url(${video.title_image})`,
              }
            : undefined
        }
      >

        <div className="video-thumbnail-overlay" />

        <div className="play-button">
          ▶
        </div>

        {video.duration && (
          <div className="video-duration">
            {video.duration}
          </div>
        )}

      </div>

      <div className="video-card-content">

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