import React from "react";
import { addVideoView } from "utils/api-client";
import videojs from 'video.js';
import "video.js/dist/video-js.css";

function VideoPlayer({previewUrl, video}) {
  const videoRef = React.useRef();

  const {id, url, thumbnail} = video;

  React.useEffect(() => {
    const vjsPlayer = videojs(videoRef.current);

    if(id) {
      vjsPlayer.poster(thumbnail);
      vjsPlayer.src(url);

      vjsPlayer.on('ended', () => addVideoView(id))
    }

    if(previewUrl) {
      vjsPlayer.src({type: "video/mp4", src: previewUrl})
    }

    return () => {
      if(vjsPlayer){
        vjsPlayer.dispose();
      }
    }
  }, [previewUrl, id, url, thumbnail])

  return (
    <div data-vjs-player>
      <video
        controls
        ref={videoRef}
        className="video-js vjs-fluid vjs-big-play-centered"
      ></video>
    </div>
  );
}

export default VideoPlayer;
