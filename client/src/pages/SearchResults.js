// @ts-nocheck
import ChannelInfo from "components/ChannelInfo";
import ErrorMessage from "components/ErrorMessage";
import TrendingCard from "components/TrendingCard";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import ChannelSkeleton from "skeletons/ChannelSkeleton";
import styled from "styled-components";
import { axiosClient } from "utils/api-client";
import NoResults from "../components/NoResults";
import Wrapper from "../styles/Trending";

const StyledChannels = styled.div`
  margin-top: 1rem;
`;

function SearchResults() {
  const {searchQuery} = useParams();

  const {data, isLoading, isError, error, isSuccess} = useQuery(['SearchResult', searchQuery], async() => {
    const users = await axiosClient.get(`/users/search?query=${searchQuery}`).then(res => res.data.users);
    const videos = await axiosClient.get(`/videos/search?query=${searchQuery}`).then(res => res.data.videos);

    return {users, videos}
  });

  if(isLoading) return <ChannelSkeleton />
  if(isError) return <ErrorMessage error={error}/>

  if (isSuccess && !data.users.length && !data.videos.length) {
    return (
      <NoResults
        title="No results found"
        text="Try different keywords or remove search filters"
      />
    );
  }

  return (
    <Wrapper>
      <h2>Search Results</h2>
      <StyledChannels>
        { isSuccess ? data.users.map(channel => <ChannelInfo key={channel.id} channel={channel} />) : null}
      </StyledChannels>
      
      { isSuccess ? data.videos.map(video => <TrendingCard key={video.id} video={video}/>) : null}
    </Wrapper>
  );
}

export default SearchResults;
