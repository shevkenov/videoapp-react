import { useAuth } from "context/auth-context";
import React from "react";
import { useHistory } from "react-router";
import { useSnackbar } from "react-simple-snackbar";
import { addVideo } from "utils/api-client";
import Button from "../styles/Button";
import Wrapper from "../styles/UploadVideoModal";
import { CloseIcon } from "./Icons";
import VideoPlayer from "./VideoPlayer";

function UploadVideoModal({previewVideo, thumbnail, closeModal, url, defaultTitle}) {
  const user = useAuth();
  const history = useHistory();
  const [openSnackbar] = useSnackbar()
  const [tab, setTab] = React.useState("PREVIEW");
  const [title, setTitle] = React.useState(defaultTitle);
  const [description, setDescription] = React.useState("");

  const handleTab = async() => {
    if(tab === "PREVIEW"){
      setTab("FORM");
    }else{
      if(!title.trim() || !description.trim()) return openSnackbar("Please fill in all the fields");

      const video = {
        description,
        title,
        url,
        thumbnail
      }

      await addVideo(video);
      closeModal();
      openSnackbar("Video published!");
      history.push("/channel/" + user.id)
    }
  };

  return (
    <Wrapper>
      <div className="modal-content">
        <div className="modal-header">
          <div className="modal-header-left">
            <CloseIcon onClick={closeModal}/>
            <h3>{url ? 'Video Uploaded!' : "Uploading ....."}</h3>
          </div>
          <div style={{ display: url ? "block" : "none" }}>
            <Button onClick={handleTab}>{tab === "PREVIEW" ? "Next" : "Upload"}</Button>
          </div>
        </div>

        {tab === "PREVIEW" && (
          <div className="tab video-preview">
            <VideoPlayer previewUrl={previewVideo} video={url}/>
          </div>
        )}

        {tab === "FORM" && (
          <div className="tab video-form">
            <h2>Video Details</h2>
            <input type="text" placeholder="Enter your video title" value={title} onChange={(e) => setTitle(e.target.value)}/>
            <textarea placeholder="Tell viewers about your video" value={description} onChange={(e) => setDescription(e.target.value)}/ >
          </div>
        )}
      </div>
    </Wrapper>
  );
}

export default UploadVideoModal;
