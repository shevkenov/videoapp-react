import ErrorMessage from "components/ErrorMessage";
import VideoCard from "components/VideoCard";
import React from "react";
import { useQuery } from "react-query";
import HomeSkeleton from "skeletons/HomeSkeleton";
import { axiosClient } from "utils/api-client";
import Wrapper from "../styles/Home";
import VideoGrid from "../styles/VideoGrid";

function Home() {

  const {data: videos, isLoading, isSuccess, isError, error} = useQuery("Home", () => axiosClient.get("/videos").then(response => response.data.videos));

  if(isLoading) return <HomeSkeleton />
  if(isError) return <ErrorMessage error={error} />


  return (
    <Wrapper>
      <VideoGrid>
        {isSuccess ? videos.map(video => <VideoCard video={video} key={video.id}/>) : null}
      </VideoGrid>
    </Wrapper>
  );
}

export default Home;
