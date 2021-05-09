import React from "react";
import path from 'path';
import { uploadMedia } from "utils/upload-media";
import { UploadIcon } from "./Icons";
import { useSnackbar } from 'react-simple-snackbar';
import UploadVideoModal from "./UploadVideoModal";

function UploadVideo() {
  const [openSnackbar] = useSnackbar();
  const [showModal, setShowModal] = React.useState(false);
  const [thumbnail, setThumbnail] = React.useState('');
  const [previewVideo, setPreviewVideo] = React.useState('');
  const [defaultTitle, setDefaultTitle] = React.useState('');
  const [url, setUrl] = React.useState('');

  const closeModal = () => setShowModal(false)

  const handleUploadFile = async(event) => {
    event.persist('');
    const file = event.target.files[0];
    const title = path.basename(file.name, path.extname(file.name));
    setDefaultTitle(title);
    
    if(file) {
      const fileSize = file.size / 1000000;
      if(fileSize > 50) return openSnackbar("Video file should be less than 50MB");
      
      setShowModal(true);
      const objUrl = URL.createObjectURL(file);
      setPreviewVideo(objUrl);
      const url = await uploadMedia({type: "video", file, preset: "jhpa4ryf"})

      const extension = path.extname(url);
      setThumbnail(url.replace(extension, '.jpeg'))
      setUrl(url);
    }
    
    event.target.value = '';
  }

  return (
    <div>
      <label htmlFor="video-upload">
        <UploadIcon />
      </label>
      <input
        style={{ display: "none" }}
        id="video-upload"
        type="file"
        accept="video/*"
        onChange={handleUploadFile}
      />
      { showModal && 
        <UploadVideoModal 
          previewVideo={previewVideo} 
          thumbnail={thumbnail} 
          closeModal={closeModal} 
          url={url}
          defaultTitle={defaultTitle}
        />
      }
    </div>
  );
}

export default UploadVideo;
