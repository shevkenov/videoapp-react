import { Menu, MenuButton, MenuItem, MenuList } from "@reach/menu-button";
import "@reach/menu-button/styles.css";
import React from "react";
import { DeleteIcon, SettingsIcon } from "./Icons";
import { deleteComment } from '../utils/api-client';

function DeleteCommentDropdown({comment}) {
  
    return (
      <div>
        <Menu>
          <MenuButton>
            <SettingsIcon />
          </MenuButton>
          <MenuList>
            <MenuItem onSelect={() => deleteComment(comment)}>
              <DeleteIcon/>
              <span>Delete Comment</span>
            </MenuItem>
          </MenuList>
        </Menu>
      </div>
    );

}

export default DeleteCommentDropdown;
