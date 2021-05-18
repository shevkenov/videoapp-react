import React from "react";
import { useSnackbar } from "react-simple-snackbar";
import { updateUser } from "utils/api-client";
import { uploadMedia } from "utils/upload-media";
import Button from "../styles/Button";
import Wrapper from "../styles/EditProfileModal";
import { CloseIcon } from "./Icons";

function EditProfileModal({profile, closeModal}) {
  const [avatar, setAvatar] = React.useState(profile.avatar);
  const [cover, setCover] = React.useState(profile.cover);
  const [openSnackBar] = useSnackbar()
  
  const handleSave = async (e) => {
    e.preventDefault();
    const user = {
      username: e.target.elements.username.value,
      about: e.target.elements.about.value,
      avatar,
      cover
    }

    if(!user.username.trim()) return openSnackBar("Username must persist")


    await updateUser(user);
    openSnackBar("Profile updated!");
    closeModal();
  }

  const handleChangeCover = async(e) => {
    const file = e.target.files[0];

    const url = await uploadMedia({
      preset: "xxe4qgrv",
      file,
      type: "image"
    })

    setCover(url);
  } 

  const handleChangeAvatar = async(e) => {
    const file = e.target.files[0];

    const url = await uploadMedia({
      preset: "rgsx3lof",
      file,
      type: "image"
    })

    setAvatar(url);
  }
  
  return (
    <Wrapper>
      <div className="container"></div>
      <div className="edit-profile">
        <form onSubmit={handleSave}>
          <div className="modal-header">
            <h3>
              <CloseIcon onClick={closeModal}/>
              <span>Edit Profile</span>
            </h3>
            <Button type="submit">Save</Button>
          </div>

          <div className="cover-upload-container">
            <label htmlFor="cover-upload">
              <img
                className="pointer"
                width="100%"
                height="200px"
                src={profile.cover}
                alt={profile.username}
              />
            </label>
            <input
              id="cover-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChangeCover}
            />
          </div>

          <div className="avatar-upload-icon">
            <label htmlFor="avatar-upload">
              <img
                src={profile.avatar}
                className="pointer avatar lg"
                alt={profile.username}
              />
            </label>
            <input
              id="avatar-upload"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleChangeAvatar}
            />
          </div>
          <input
            type="text"
            placeholder="Insert username"
            id="username"
          />
          <textarea id="about" placeholder="Tell viewers about your channel"/>
        </form>
      </div>
    </Wrapper>
  );
}

export default EditProfileModal;
