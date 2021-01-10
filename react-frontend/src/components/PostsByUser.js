import React, { useState, useEffect } from "react";
import DisplayPosts from "./DisplayPosts";
import UserService from "../services/user.service";
import { useParams } from "react-router-dom";

const PostsByUser = () => {
    const [content, setContent] = useState([]);
    const { username } = useParams();

    useEffect(() => {
        UserService.getPostsByUsername(username)
            .then((response) => {
                setContent(response.data.content);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [username]);
    //,[]
    return (
        <>
            {}
            <div className="pb-3">
                <span className="h3">All posts by</span>
                <span className="ml-2 font-weight-bold h2">{content.length > 0 && Object.values(content)[0].username}</span>
            </div>
            <DisplayPosts posts={content} />
        </>
    );
};

export default PostsByUser;
