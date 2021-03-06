// @ts-nocheck
import EditProfile from "components/EditProfile";
import ErrorMessage from "components/ErrorMessage";
import { useAuth } from "context/auth-context";
import React from "react";
import { useQuery } from "react-query";
import { useParams } from "react-router";
import ChannelSkeleton from "skeletons/ChannelSkeleton";
import Button from "styles/Button";
import { axiosClient } from "utils/api-client";
import { VidIcon } from "../components/Icons";
import SignUpCard from "../components/SignUpCard";
import Wrapper from "../styles/Channel";
import useAuthAction from "../hooks/use-auth-action";
import { toggleSubscribeUser } from "../utils/api-client";
import ChannelTabVideo from "components/ChannelTabVideo";
import ChannelTabChannels from "components/ChannelTabChannels";
import ChannelTabAbout from "components/ChannelTabAbout";

const activeTabStyle = {
  borderBottom: "2px solid white",
  color: "white",
};

function Channel() {
  const [tab, setTab] = React.useState("VIDEOS");
  const user = useAuth();
  const {channelId} = useParams();
  const handleAuthAction = useAuthAction();

  const isUserLoggedIn = user ? user.id : undefined;
  const userId = channelId || isUserLoggedIn;
  
  const {data: channel, isLoading, isError, error, isSuccess} = useQuery(["Channel", userId], () => axiosClient.get(`/users/${userId}`).then(res => res.data.user), {enabled: userId})

  const handleToggleSubscribe = () => handleAuthAction(toggleSubscribeUser,channel.id);

  if (!user) {
    return (
      <SignUpCard
        icon={<VidIcon />}
        title="Manage your videos"
        description="Sign in to upload and manage your videos, pre-recorded or live"
      />
    );
  }

  if(isLoading) return <ChannelSkeleton />
  if(isError) return <ErrorMessage error={error}/>

  return (
    <Wrapper editProfile={channel.isMe}>
      <div className="cover">
        <img src={channel.cover} alt={channel.cover} />
      </div>

      <div className="header-tabs">
        <div className="header">
          <div className="flex-row">
            <img
              className="avatar lg"
              src={channel.avatar}
              alt={channel.username}
            />
            <div>
              <h3>{channel.username}</h3>
              <span className="secondary">{channel.subscribersCount} subscribers</span>
            </div>
          </div>
        {channel.isMe && <EditProfile profile={channel}/>}

        {!channel.isMe && !channel.isSubscribed && (
          <Button onClick={handleToggleSubscribe}>Subscribe</Button>
        )}

        {!channel.isMe && channel.isSubscribed && (
          <Button grey onClick={handleToggleSubscribe}>Subscribed</Button>
        )}
        </div>


        <div className="tabs">
          <ul className="secondary">
            <li
              style={tab === "VIDEOS" ? activeTabStyle : {}}
              onClick={() => setTab("VIDEOS")}
            >
              Videos
            </li>
            <li
              style={tab === "CHANNELS" ? activeTabStyle : {}}
              onClick={() => setTab("CHANNELS")}
            >
              Channels
            </li>
            <li
              style={tab === "ABOUT" ? activeTabStyle : {}}
              onClick={() => setTab("ABOUT")}
            >
              About
            </li>
          </ul>
        </div>
      </div>

      <div className="tab">
        {tab === 'VIDEOS' && <ChannelTabVideo videos={channel.videos} /> }
        {tab === 'CHANNELS' && <ChannelTabChannels channels={channel.channels}/>}
        {tab === 'ABOUT' && <ChannelTabAbout profile={channel}/>}
      </div>
    </Wrapper>
  );
}

export default Channel;
