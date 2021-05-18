import ErrorMessage from "components/ErrorMessage";
import TrendingCard from "components/TrendingCard";
import { useAuth } from "context/auth-context";
import React from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import HomeSkeleton from "skeletons/HomeSkeleton";
import { axiosClient } from "utils/api-client";
import { ChannelIcon } from "../components/Icons";
import SignUpCard from "../components/SignUpCard";
import Wrapper from "../styles/Trending";

function LikedVideos() {
  const user = useAuth()

  const {data: videos, isLoading, isError, error, isSuccess} = useQuery("LikedVideos", () => axiosClient.get("/users/liked-videos").then(res => res.data.videos), {enabled: user})

  if (!user) {
    return (
      <SignUpCard
        icon={<ChannelIcon />}
        title="Save everything you like"
        description="Videos that you have liked will show up here"
      />
    );
  }

  if(isLoading) return <HomeSkeleton />
  if(isError) return <ErrorMessage error={error}/>

  return (
    <Wrapper>
      <h2>Liked Videos</h2>
      {isSuccess && !videos.length && (
        <p className="secondary">Videos that you have watched will show up here</p>
      )}
      
      {isSuccess ? videos.map(video => 
        <Link key={video.id} to={`/watch/${video.id}`}>
          <TrendingCard video={video} />
        </Link>
      ): null}
    </Wrapper>
  );
}

export default LikedVideos;
