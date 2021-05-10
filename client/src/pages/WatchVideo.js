// @ts-nocheck
import React from "react";
import { useQuery } from 'react-query';
import { useParams } from "react-router";
import { axiosClient, likeVideo, dislikeVideo, toggleSubscribeUser } from "../utils/api-client";

import AddComment from "../components/AddComment";
import { DislikeIcon, LikeIcon } from "../components/Icons";
import NoResults from "../components/NoResults";
import VideoPlayer from "../components/VideoPlayer";
import Button from "../styles/Button";
import Wrapper from "../styles/WatchVideo";
import { formatCreatedAt } from '../utils/date';
import Skeleton from '../skeletons/WatchVideoSkeleton';
import VideoCard from "components/VideoCard";
import useAuthAction from "hooks/use-auth-action";

function WatchVideo() {
  const {videoId} = useParams();
  const handleAuthAction = useAuthAction()
  const { data: video, isLoading: isLoadingVideo } = useQuery(["WatchVideo", videoId], () => axiosClient.get(`/videos/${videoId}`).then(res => res.data.video));
  const { data: next, isLoading: isLoadingNext } = useQuery(["WatchVideo", "Next"], () => axiosClient.get(`/videos`).then(res => res.data.videos));
  
  const handleLikeVideo = () => handleAuthAction(likeVideo,videoId);
  
  const handleDislikeVideo = () => handleAuthAction(dislikeVideo,videoId);

  const handleToggleSubscribe = () => handleAuthAction(toggleSubscribeUser,video.userId);
  
  if (isLoadingVideo || isLoadingNext) return <Skeleton />

  if (!isLoadingVideo && !isLoadingNext && !video) {
    return (
      <NoResults
        title="Page not found"
        text="The page you are looking for is not found or it may have been removed"
      />
    );
  }

  return (
    <Wrapper filledLike={video.isLiked} filledDislike={video.isDisliked}>
      <div className="video-container">
        <div className="video">
          <VideoPlayer video={video}/>
        </div>

        <div className="video-info">
          <h3>{video.title}</h3>

          <div className="video-info-stats">
            <p>
              <span>{video.viewsCount} views</span> <span>•</span>{" "}
              <span>Premiered {formatCreatedAt(video.createdAt)}</span>
            </p>

            <div className="likes-dislikes flex-row">
              <p className="flex-row like">
                <LikeIcon onClick={handleLikeVideo}/> <span>{video.likesCount}</span>
              </p>
              <p className="flex-row dislike" style={{ marginLeft: "1rem" }}>
                <DislikeIcon onClick={handleDislikeVideo} /> <span>{video.dislikesCount}</span>
              </p>
            </div>
          </div>
        </div>

        <div className="channel-info-description">
          <div className="channel-info-flex">
            <div className="channel-info flex-row">
              <img
                className="avatar md"
                src={video.user.avatar}
                alt={video.user.username}
              />
              <div className="channel-info-meta">
                <h4>{video.user.username}</h4>
                <span className="secondary small">
                  {video.subscribersCount} subscribers
                </span>
              </div>
            </div>          
            {!video.isSubscribed && !video.isMine && <Button onClick={handleToggleSubscribe}>Subscribe</Button>}
            {video.isSubscribed && !video.isMine && <Button grey onClick={handleToggleSubscribe}>Subscribed</Button>}
          </div>

          <p>{video.description}</p>
        </div>

        <AddComment video={video}/>
      </div>

      <div className="related-videos">
        <h3 className="up-next">Up Next</h3>
        {
          next.filter(v => v.id !== video.id).slice(0, 10).map(v => <VideoCard key={v.id} showAvatar={true} video={v}/>)
        }
      </div>
    </Wrapper>
  );
}

export default WatchVideo;
