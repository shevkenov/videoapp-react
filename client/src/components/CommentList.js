import React from "react";
import { Link } from "react-router-dom";
import { formatCreatedAt } from "utils/date";
import DeleteCommentDropdown from './DeleteCommentDropdown';

function CommentList({comments}) {
  return (
    <>
      {
        comments.length ? comments.map(comment => <Comment key={comment.id} comment={comment}/>) : null
      }
    </>
  );
}

function Comment({comment}) {

  return (
    <div className="comment">
      <span>
        <Link to={`/channel/${comment.user.id}`}>
          <img src={comment.user.avatar} alt={comment.user.username} />
        </Link>
      </span>
      <div className="comment-info" style={{ flex: "1 1 0" }}>
        <p className="secondary">
          <span>
            <Link to={`/channel/${comment.user.id}`}>
              <span className="user-channel">{comment.user.username}</span>
            </Link>
          </span>
          <span style={{ marginLeft: "0.6rem" }}>{formatCreatedAt(comment.createdAt)}</span>
        </p>
        <p>{comment.text}</p>
      </div>
      <DeleteCommentDropdown comment={comment}/>
    </div>
  );
}

export default CommentList;
