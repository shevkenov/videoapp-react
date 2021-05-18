import React from "react";
import { Link } from "react-router-dom";
import Wrapper from "../styles/ChannelTabChannels";

function ChannelTabChannels({ channels }) {
  if (!channels.length) {
    return <p>Not subscribed any channels yet?</p>;
  }
  return (
    <Wrapper>
      {channels
        ? channels.map((channel) => (
            <Link key={channel.id} to={`/channel/${channel.id}`}>
              <div className="channel">
                <img src={channel.avatar} alt={channel.username} />
                <h3>{channel.username}</h3>
                <p className="secondary">
                  {channel.subscribersCount} subscribers
                </p>
              </div>
            </Link>
          ))
        : null}
    </Wrapper>
  );
}

export default ChannelTabChannels;
