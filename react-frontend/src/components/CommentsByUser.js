import React, { useState, useEffect, useCallback } from "react";

import DisplayOneComment from "./DisplayOneComment";
import UserService from "../services/user.service.js";
import { useParams } from "react-router-dom";

const CommentsByUser = () => {
    const [comments, setComments] = useState([]);
    const { username } = useParams();

    const refreshComments = useCallback(() => {
    }, []);

    useEffect(() => {
        username &&
            UserService.getCommentsByUser(username)
                .then((response) => {
                    setComments(response.data);
                })
                .catch((e) => {
                    console.log(e);
                });
    }, [username, refreshComments]);


    return (
        <div className="">
            <div className="pt-3">
                Comments of {username}
            </div>
            {Object.values(comments).map((comment) =>
                <DisplayOneComment comment={comment} key={comment.id} openComment={refreshComments} textAbove={true}></DisplayOneComment>
            )}
        </div >
    );
};

export default CommentsByUser;