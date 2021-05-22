import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import { useAuth } from "context/auth-context";
import React from "react";
import { useHistory } from "react-router";
import { deleteVideo } from "utils/api-client";
import { DeleteIcon, SettingsIcon } from "./Icons";

function DeleteVideoDropdown({video}) {
  const history = useHistory();
  const user = useAuth();
  const isVideoAuthor = video.userId === user?.id;

  const handleDeleteVideo = () => {
    deleteVideo(video.id);
    history.push("/feed/my_videos");
  }
  
  if (isVideoAuthor) {
    return (
      <div>
        <Menu>
          <MenuButton>
            <SettingsIcon />
          </MenuButton>
          <MenuList>
            <MenuItem onSelect={handleDeleteVideo}>
              <DeleteIcon />
              <span>Delete Video</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    );
  }

  return null;
}

export default DeleteVideoDropdown;
