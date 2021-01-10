import React, { useState, useEffect, useRef } from "react";

import CommentsByPost from "./CommentsByPost";
import DisplayOnePost from "./DisplayOnePost";

import UserService from "../services/user.service";
import { useLocation, useParams } from "react-router-dom";

const Post = () => {
    const [post, setPost] = useState({});
    const [commentsOpened, setCommentsOpened] = useState(false);
    const [comments, setComments] = useState({});

    const comRef = useRef();
    const topRef = useRef();
    const { postId } = useParams();
    const location = useLocation();

    const openComment = () => {
        UserService.getCommentsByPost(postId)
            .then((response) => {
                setComments(response.data);
                setCommentsOpened(!commentsOpened);
                comRef.current.scrollIntoView();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    const openCommentAfterAddComment = () => {
        UserService.getCommentsByPost(post.id).then(
            (response) => {
                setComments(response.data);
                comRef.current.scrollIntoView();
            }
        );
    };

    useEffect(() => {
        UserService.getPostById(postId)
            .then((response) => {
                setPost(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [comments, postId]);

    useEffect(() => {
        location.commentsOpened && openComment();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [location.commentsOpened]);

    return (
        <div className="pt-3" ref={topRef}>
            <DisplayOnePost post={post} fullText={true} openComment={openComment} />
            <div ref={comRef}>
                {commentsOpened &&
                    <div>
                        <CommentsByPost comments={comments} postId={parseInt(postId, 10)} openComment={openCommentAfterAddComment} />
                    </div>}
            </div>
        </div >

    );
};

export default Post;
