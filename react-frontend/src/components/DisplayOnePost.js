import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import "./DisplayOnePost.css";
import UserService from "../services/user.service";

const DisplayOnePost = (props) => {
    const [post, setPost] = useState({ ...props.post });
    const [isHover, setIsHover] = useState("");
    const [menuDotsIsOpened, setMenuDotsIsOpened] = useState(false);
    const [menuDeleteIsOpened, setMenuDeleteIsOpened] = useState(false);
    const [menuUpdateIsOpened, setMenuUpdateIsOpened] = useState(false);
    const [isCurrentUserModerator, setIsCurrentUserModerator] = useState(false);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        setPost(props.post);
    }, [props.post]);

    const handleMouseEnter = (id) => {
        setIsHover(id);
    };
    const handleMouseLeave = () => {
        setIsHover(undefined);
    };
    const handleClikeLikeButton = (upVote, postId) => {
        const vote = upVote ? "DOWNVOTE" : "UPVOTE";
        UserService.addVote(vote, postId).then(
            () => {
                console.log("edit");
                UserService.getPostById(postId).then(
                    (response) => {
                        const post = response.data;
                        setPost(post);
                    }
                );
            });
    };
    const handleClikeDeleteButton = (postId) => {
        UserService.deletePostById(postId).then(
            window.location.reload()
        );
    };

    const handleClikeCommentButton = (postId) => {
        props.openComment(postId);
    };

    useEffect(() => {
        currentUser && setIsCurrentUserModerator(currentUser.roles.includes("ROLE_MODERATOR"));
        currentUser && setIsCurrentUserAdmin(currentUser.roles.includes("ROLE_ADMIN"));
    }, [currentUser]);

    return (
        <div className="relative">
            {menuDeleteIsOpened &&
                <div className="bg-white border absolute confirm-window">
                    <div className="bg-primary rounded p-3 text-center font-weight-bold">
                        Attention!
                    </div>
                    {(currentUser && currentUser.username === post.username) || isCurrentUserAdmin ?
                        <div className="bg-white p-3 text-center">
                            Do you really want to delete post {post.postname} ?
                        <div className="p-3">
                                <div className="bg-danger rounded float-left pointer"
                                    onClick={() => handleClikeDeleteButton(post.id)}>Yes</div>
                                <div className="bg-primary rounded pl-1 pr-1 float-right pointer"
                                    onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>No</div>
                            </div>
                        </div> :
                        <div className="text-center">
                            <div className=" rounded p-1 text-center">Only author of the post or admin can delete it!</div>
                            <div className="border border-dark bg-primary rounded text-center d-inline pl-3 pr-3 pointer"
                                onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>ok
                            </div>
                        </div>}
                </div>}
            {menuUpdateIsOpened &&
                <div className="bg-white border absolute confirm-window">
                    <div className="bg-primary rounded p-3 text-center font-weight-bold">
                        Attention!
                    </div>
                    {(currentUser && currentUser.username === post.username) || isCurrentUserModerator || isCurrentUserAdmin ?
                        <div className="bg-white p-3 text-center">
                            Do you really want to edit post {post.postName} ?
                        <div className="p-3">
                                <Link to={{ pathname: "/AddPost", post: post }}>
                                    <div className="bg-danger text-dark rounded float-left pointer">
                                        Yes</div>
                                </Link>
                                <div className="bg-primary rounded pl-1 pr-1 float-right pointer"
                                    onClick={() => setMenuUpdateIsOpened(!menuUpdateIsOpened)}>No</div>
                            </div>
                        </div> :
                        <div className="text-center">
                            <div className=" rounded p-1 text-center">Only author of the post or moderator can edit it!</div>
                            <div className="border border-dark bg-primary rounded text-center d-inline pl-3 pr-3 pointer"
                                onClick={() => setMenuUpdateIsOpened(!menuUpdateIsOpened)}>ok
                            </div>
                        </div>}
                </div>}
            <div className="">
                <Link to={"/posts/" + post.id}
                    className="ml-1 h4 font-weight-bold text-dark">
                    <span className="">{post.postName}</span>
                </Link>
                {post.edited && <span className="font-italic"> (Edited)</span>}
                <span className="ml-2 font-italic">posted by</span>
                <Link to={"/" + post.username + "/posts"} className="text-dark">
                    <span className="ml-1 font-italic font-weight-bold">{post.username}</span>
                </Link>
                <span className="ml-auto font-italic text-muted mt-0 mr-0"> {post.duration}</span>
                <div className="float-right relative pointer" onClick={() => setMenuDotsIsOpened(!menuDotsIsOpened)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    {menuDotsIsOpened && <div className="absolute menu-dots-location">
                        <div className="border border-white p-3 bg-dark text-white rounded text-center"
                            onClick={() => setMenuUpdateIsOpened(!menuUpdateIsOpened)}>Edit</div>
                        <div className="border border-white p-3 bg-dark text-white rounded text-center"
                            onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>Delete</div>
                    </div>}
                </div>
            </div>
            <div className="ml-2 ">
                <Link to={"/topic/" + post.topicName + "/posts"} className="text-dark">
                    <span className="ml-0  font-italic">{post.topicName}</span>
                </Link>

            </div>
            {
                props.fullText ?
                    <div style={{ textIndent: 9 }} className="bg-color ml-0 p-2 rounded text-indent-9">
                        {post.description}
                    </div> :
                    <div style={{ textIndent: 9 }} className="bg-color ml-0 p-2 rounded text-indent-9" onMouseEnter={() => handleMouseEnter(post.id)}
                        onMouseLeave={handleMouseLeave} >
                        {isHover === post.id ? post.description && post.description.substring(0, 900) + "..."
                            : post.description && post.description.substring(0, 500) + "..."}
                    </div>
            }

            <span className="ml-1 pointer" onClick={() => handleClikeLikeButton(post.upVote, post.id)}>
                {post.upVote ? (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart-fill" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M8 1.314C12.438-3.248 23.534 4.735 8 15-7.534 4.736 3.562-3.248 8 1.314z" />
                </svg>) :
                    (<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="red" className="bi bi-heart" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M8 2.748l-.717-.737C5.6.281 2.514.878 1.4 3.053c-.523 1.023-.641 2.5.314 4.385.92 1.815 2.834 3.989 6.286 6.357 3.452-2.368 5.365-4.542 6.286-6.357.955-1.886.838-3.362.314-4.385C13.486.878 10.4.28 8.717 2.01L8 2.748zM8 15C-7.333 4.868 3.279-3.04 7.824 1.143c.06.055.119.112.176.171a3.12 3.12 0 0 1 .176-.17C12.72-3.042 23.333 4.867 8 15z" />
                    </svg>)
                }
            </span>
            <span className="ml-4 pointer" onClick={() => handleClikeCommentButton(post.id)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="DodgerBlue" className="bi bi-chat-right-dots" viewBox="0 0 16 16">
                    <path fillRule="evenodd" d="M2 1h12a1 1 0 0 1 1 1v11.586l-2-2A2 2 0 0 0 11.586 11H2a1 1 0 0 1-1-1V2a1 1 0 0 1 1-1zm12-1a2 2 0 0 1 2 2v12.793a.5.5 0 0 1-.854.353l-2.853-2.853a1 1 0 0 0-.707-.293H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h12z" />
                    <path d="M5 6a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0zm4 0a1 1 0 1 1-2 0 1 1 0 0 1 2 0z" />
                </svg>
            </span>
            <div>
                <span className="ml-1">{post.voteCount + (post.voteCount === 1 ? " like" : " likes")}</span>
                <span className="ml-1">{post.commentCount + (post.commentCount === 1 ? "  comment" : " comments")}</span>
            </div>
            <hr className="bg-blue"></hr>
        </div >
    );
};

DisplayOnePost.propTypes = {
    post: PropTypes.object,
    fullText: PropTypes.bool,
    openComment: PropTypes.func
};

export default DisplayOnePost;