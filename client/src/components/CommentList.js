import { useAuth } from "context/auth-context";
import React from "react";
import { Link } from "react-router-dom";
import { formatCreatedAt } from "utils/date";
import DeleteCommentDropdown from './DeleteCommentDropdown';

function CommentList({comments}) {
  const user = useAuth();

  return (
    <>
      {
        comments.length ? comments.map(comment => <Comment key={comment.id} comment={comment} isCommentAuthor={user?.id === comment.userId}/>) : null
      }
    </>
  );
}

function Comment({comment, isCommentAuthor}) {

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
      {isCommentAuthor ? <DeleteCommentDropdown comment={comment}/> : null}
    </div>
  );
}

export default React.memo(CommentList);
