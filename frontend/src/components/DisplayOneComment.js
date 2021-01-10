import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import "./DisplayOneComment.css";
import UserService from "../services/user.service";

const DisplayOneComment = (props) => {
    const [comment, setContent] = useState({ ...props.comment });
    const [textAbove, setTextAbove] = useState(false);
    const [menuDotsIsOpened, setMenuDotsIsOpened] = useState(false);
    const [menuDeleteIsOpened, setMenuDeleteIsOpened] = useState(false);
    const [isCurrentUserAdmin, setIsCurrentUserAdmin] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        setContent(props.comment);
    }, [props.comment]);

    useEffect(() => {
        setTextAbove(props.textAbove);
    }, [props.textAbove]);

    const handleClikeDeleteButton = (commentId, postId) => {
        UserService.deleteCommentById(commentId)
            .then(() => {
                props.openComment(postId);
            })
            .catch((e) => {
                console.log(e);
            });
    };
    useEffect(() => {
        currentUser && setIsCurrentUserAdmin(currentUser.roles.includes("ROLE_ADMIN"));
    }, [currentUser]);

    return (
        <div className="relative bg-white pl-3">
            {menuDeleteIsOpened &&
                <div className="bg-white border absolute indent">
                    <div className="bg-primary rounded p-3 text-center font-weight-bold">
                        Attention!
                    </div>
                    {(currentUser && currentUser.username === comment.username) || isCurrentUserAdmin ?
                        <div className="bg-white p-3 text-center">
                            Do you really want to delete comment?
                        <div className="p-3">
                                <div className="bg-danger rounded float-left pointer"
                                    onClick={() => handleClikeDeleteButton(comment.id, comment.postId)}>Yes</div>
                                <div className="bg-primary rounded pl-1 pr-1 float-right pointer"
                                    onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>No</div>
                            </div>
                        </div> :
                        <div className="text-center">
                            <div className=" rounded p-1 text-center">Only author of the comment or admin can delete it!</div>
                            <div className="border border-dark bg-primary rounded text-center d-inline pl-3 pr-3 pointer"
                                onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>ok
                            </div>
                        </div>}
                </div>}

            {textAbove && <div className="pt-3">
                <Link to={"/posts/" + comment.postId}
                    className="ml-auto p-1 bg-secondary rounded text-dark">
                    Comment to
                </Link>
            </div>}
            <div className="d-flex pt-2 bg-weith content-comment" >
                <div className="bg-color rounded" id="width-90" >
                    <div className="text-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" fill="gray" className="bi bi-person-circle" viewBox="0 0 16 16">
                            <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                            <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                            <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                        </svg>
                    </div>
                    <div className="text-center">
                        <div className="ml-0 font-weight-bold">{comment.username}</div>
                        <div className="ml-0 h5 small font-italic bg-color rounded">{comment.createdDate}</div>
                    </div>
                </div>

                <div className="ml-3  align-self-center" >{comment.text}</div>
                <div className="ml-auto mr-3 relative pointer" onClick={() => setMenuDotsIsOpened(!menuDotsIsOpened)}>
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" className="bi bi-three-dots" viewBox="0 0 16 16">
                        <path fillRule="evenodd" d="M3 9.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3zm5 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3z" />
                    </svg>
                    {menuDotsIsOpened && <div className="absolute" id="size-menu-dots">
                        {/* <div className="border border-white p-3 bg-dark text-white rounded text-center"
                            onClick={() => setMenuUpdateIsOpened(!menuUpdateIsOpened)}>Edit</div> */}
                        <div className="border border-white p-3 bg-dark text-white rounded text-center" id="word-break-normal"
                            onClick={() => setMenuDeleteIsOpened(!menuDeleteIsOpened)}>Delete</div>
                    </div>}
                </div>
            </div>
            <hr className=""></hr>
        </div>
    );
};

DisplayOneComment.propTypes = {
    comment: PropTypes.object,
    textAbove: PropTypes.bool,
    openComment: PropTypes.func
};


export default DisplayOneComment;