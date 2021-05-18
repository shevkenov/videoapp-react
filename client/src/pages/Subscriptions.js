// @ts-nocheck
import React from "react";
import { SubIcon } from "../components/Icons";
import SignUpCard from "../components/SignUpCard";
import Wrapper from "../styles/Home";
import VideoGrid from "../styles/VideoGrid";
import ErrorMessage from "../components/ErrorMessage";
import ChannelSuggestions from '../components/ChannelSuggestions';
import { axiosClient } from "utils/api-client";
import HomeSkeleton from "skeletons/HomeSkeleton";
import { useQuery } from "react-query";
import { useAuth } from "context/auth-context";
import VideoCard from "components/VideoCard";

function Subscriptions() {
  const user = useAuth();
  
  const {data: feed, isLoading, isError, error, isSuccess} = useQuery("Subscriptions", () => axiosClient.get('/users/subscriptions').then(res => res.data.feed), {
    enabled: user
  })

  if (!user) {
    return (
      <SignUpCard
        icon={<SubIcon />}
        title="Don't miss new videos"
        description="Sign in to see updates from your favorite YouTube channels"
      />
    );
  }

  if(isLoading) return <HomeSkeleton />
  if(isError) return <ErrorMessage error={error}/>
  if(!isLoading && !feed?.length) return <ChannelSuggestions />


  return (
    <Wrapper>
      <div style={{ marginTop: "1.5rem" }}></div>

      <VideoGrid>
        {isSuccess ? feed.map(video => <VideoCard video={video} key={video.id}/>) : null}
      </VideoGrid>
    </Wrapper>
  );
}

export default Subscriptions;
