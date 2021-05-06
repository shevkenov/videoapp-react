import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import { useHistory } from "react-router";
import "@reach/menu-button/styles.css";
import React from "react";
import { signoutUser } from "utils/api-client";
import Avatar from "../styles/Avatar";
import { ChannelIcon, SignoutIcon } from "./Icons";

function UserDropdown({user}) {
  const history = useHistory();
  
  return (
    <Menu>
      <MenuButton>
        <Avatar
          className="pointer"
          src={user.avatar}
          alt={user.username}
        />
      </MenuButton>
      <MenuList>
        <MenuItem onSelect={() => history.push(`/channel/${user.id}`)}>
          <ChannelIcon />
          <span>Your channel</span>
        </MenuItem>
        <MenuItem onSelect={signoutUser}>
          <SignoutIcon />
          <span>Sign out</span>
        </MenuItem>
      </MenuList>
    </Menu>
  );
}

export default UserDropdown;
