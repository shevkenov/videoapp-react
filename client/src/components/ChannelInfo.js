// @ts-nocheck
import React from "react";
import Button from "../styles/Button";
import Wrapper from "../styles/ChannelInfo";
import useAuthAction from "hooks/use-auth-action";
import { toggleSubscribeUser } from "../utils/api-client";
import { Link } from "react-router-dom";

function ChannelInfo({ channel }) {
  const handleAuthAction = useAuthAction();
  const handleToggleSubscribe = () =>
    handleAuthAction(toggleSubscribeUser, channel.id);

  return (
    <Wrapper>
      <Link to={`/channel/${channel.id}`}>
        <span className="avatar-channel">
          <img src={channel.avatar} alt={channel.username} />

          <div className="channel-info-meta">
            <h3>{channel.username}</h3>

            <p className="secondary">
              <span>{channel.subscribersCount} subscribers</span>{" "}
              <span className="to-hide">•</span>{" "}
              <span className="to-hide">{channel.videosCount} videos</span>
            </p>

            <p className="description secondary">{channel.about}</p>
          </div>
        </span>
      </Link>

      {!channel.isSubscribed && !channel.isMe && (
        <Button onClick={handleToggleSubscribe}>Subscribe</Button>
      )}
      {channel.isSubscribed && !channel.isMe && (
        <Button grey onClick={handleToggleSubscribe}>
          Subscribed
        </Button>
      )}
    </Wrapper>
  );
}

export default ChannelInfo;
