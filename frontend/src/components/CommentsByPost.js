import React, { useState, useEffect, useRef } from "react";
import PropTypes from "prop-types";
import { useForm } from "react-hook-form";

import DisplayOneComment from "./DisplayOneComment";
import UserService from "../services/user.service";

const CommentsByPost = (props) => {
    const { handleSubmit } = useForm();

    const [comments, setComments] = useState(props.comments);
    const [textComment, setTextComment] = useState("");
    const [postId] = useState(props.postId);
    const [loading, setLoading] = useState(false);

    const textRef = useRef();
    useEffect(() => {
        setComments(props.comments);
    }, [props.comments]);

    const onChangeTextComment = (e) => {
        const textComment = e.target.value;
        setTextComment(textComment);
    };

    const onSubmit = () => {
        setLoading(true);
        UserService.addComment(postId, textComment)
            .then(() => {
                setTextComment("");
                textRef.current.value = "";
                props.openComment(postId);
                setLoading(false);
            })
            .catch((e) => {
                console.log(e);
                setLoading(false);
            });
    };

    return (
        <div className="" >
            <div className="pb-2">
                Comments
            </div>
            {Object.values(comments).map((comment) =>
                <DisplayOneComment comment={comment} openComment={props.openComment} key={comment.id}></DisplayOneComment>
            )}
            <form className="pb-3" onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="textComment">Leave a comment</label>
                    <textarea className="form-control" type="textarea" name="textComment" onChange={onChangeTextComment} ref={textRef} />
                </div>
                {loading && (
                    <span className="spinner-border spinner-border-sm"></span>
                )}
                <div >
                    <input className="btn btn-primary btn-block" type="submit" value="send" disabled={loading} />
                </div>
            </form >
        </div >
    );
};

CommentsByPost.propTypes = {
    comments: PropTypes.array,
    postId: PropTypes.number,
    openComment: PropTypes.func
};

export default CommentsByPost;