// @ts-nocheck
import React from "react";
import Button from "../styles/Button";
import Wrapper from "../styles/EditProfile";
import EditProfileModal from "./EditProfileModal";

function EditProfile({ profile }) {
  const [showProfileModal, setShowProfileModal] = React.useState(false);
  
  const closeModal = () => setShowProfileModal(false);

  return (
    <>
      <Wrapper>
        <div>
          <Button grey onClick={() => setShowProfileModal(true)}>Edit Profile</Button>
        </div>
      </Wrapper>
      {
        showProfileModal ? <EditProfileModal profile={profile} closeModal={closeModal} /> : null
      }
    </>
  );
}
export default EditProfile;
