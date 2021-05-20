import React from "react";
import { Link } from "react-router-dom";
import { formatCreatedAt } from "utils/date";
import Avatar from "../styles/Avatar";
import Wrapper from "../styles/VideoCard";
import DeleteVideoDropdown from "./DeleteVideoDropdown";

function VideoCard({ video, showAvatar, noUsername }) {
  return (
    <Wrapper>
      <Link to={`/watch/${video.id}`}>
        <img className="thumb" src={video.thumbnail} alt={video.title} />
      </Link>
      <div className="video-info-container">
        {!showAvatar && (
          <div className="channel-avatar">
            <Avatar
              style={{ marginRight: "0.8rem" }}
              src={video.user.avatar}
              alt={video.user.username}
            />
          </div>
        )}
        <div className="video-info">
          <span>
            <h4 className="truncate">{video.title}</h4>
          </span>
          {!noUsername && (
            <Link to={`/channel/${video.user.id}`}>
              <span>
                <span className="secondary">{video.user.username}</span>
              </span>
            </Link>
          )}
          <p className="secondary leading-4">
            <span>{video.views} views</span> <span>•</span>{" "}
            <span>{formatCreatedAt(video.createdAt)}</span>
          </p>
        </div>
        <DeleteVideoDropdown video={video}/>
      </div>
    </Wrapper>
  );
}

export default VideoCard;
