import React from "react";
import defaultAvatar from "../assets/default-avatar.png";
import Wrapper from "../styles/CommentList";
import CommentList from "./CommentList";
import { useAuth } from "context/auth-context";
import { addComment } from "utils/api-client";
import { useSnackbar } from 'react-simple-snackbar';

function AddComment({video}) {
  const [comment, setComment] = React.useState('');
  const [openSnackbar] = useSnackbar();
  const user = useAuth();

  const handleAddComment = (event) => {
    if(event.keyCode === 13){
      event.target.blur();
      
      if(!comment) return openSnackbar("Please add comment!");
      
      addComment({comment, video}).then(() => setComment("")).catch(() =>  openSnackbar("Sign in to add comment!"));
    }
  }

  return (
    <Wrapper>
      <h3>{video.commentsCount} comments</h3>

      <div className="add-comment">
        {
          user ? (<img src={user.avatar} alt={user.username} />) : (<img src={defaultAvatar} alt="default avatar" />)
        }
        <textarea placeholder="Add a public comment..." value={comment} onChange={(event) => setComment(event.target.value)} onKeyDown={handleAddComment} rows={1} />
      </div>

      <CommentList comments={video.comments}/>
    </Wrapper>
  );
}

export default AddComment;
