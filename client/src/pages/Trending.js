import ErrorMessage from "components/ErrorMessage";
import TrendingCard from "components/TrendingCard";
import React from "react";
import { useQuery } from "react-query";
import TrendingSkeleton from "skeletons/TrendingSkeleton";
import { axiosClient } from "utils/api-client";
import Wrapper from "../styles/Trending";

function Trending() {
  const {isLoading, isError, error, isSuccess, data: videos} = useQuery('TrendingVideos', () => axiosClient.get('/videos/trending').then(res => res.data.videos))
  
  if(isLoading) return <TrendingSkeleton />
  if(isError) return <ErrorMessage error={error}/>
  
  return (
    <Wrapper>
      <h2>Trending</h2>

      <div className="trending">
        {isSuccess ? videos.map(v => <TrendingCard video={v} key={v.id} />) : null}
      </div>
    </Wrapper>
  );
}

export default Trending;
