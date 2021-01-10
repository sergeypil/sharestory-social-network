import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import { useSelector } from "react-redux";
import PropTypes from "prop-types";

import "./DisplayPosts.css";
import DisplayOnePost from "./DisplayOnePost";

const DisplayPosts = (props) => {
    const [content, setContent] = useState({ ...props.posts });
    const [notRegistered, setNotRegistered] = useState(false);

    const { user: currentUser } = useSelector((state) => state.auth);

    let history = useHistory();
    useEffect(() => {
        setContent(props.posts);
    }, [props.posts]);

    const openComment = (postId) => {
        history.push({ pathname: `/posts/${postId}`, commentsOpened: true });
        //window.location.reload();
    };

    const handleClikeAppPostButton = () => {
        currentUser ?
            history.push("/addPost")
            : setNotRegistered(true);
    };

    const handleClikeAppTopicButton = () => {
        currentUser ?
            history.push("/addTopic")
            : setNotRegistered(true);
    };

    return (
        <div className="mt-0 pb-2 relative">
            <div className="d-flex pb-1">
                <div className="d-flex bg-dark text-light ml-1 p-2 rounded float-left pointer"
                    onClick={handleClikeAppPostButton}>
                    Add new post
                </div>
                <div className="ml-auto mr-3 bg-dark text-light ml-1 p-2 rounded pointer"
                    onClick={handleClikeAppTopicButton}>
                    Add new topic
                </div>

            </div>
            {
                Object.values(content).map((post) => {
                    return (
                        <DisplayOnePost post={post} fullText={false} openComment={openComment} key={post.id} />

                    );
                })
            }
            <div className="">
                {notRegistered &&
                    <div className="bg-white border absolute not-registered-window">
                        <div className="bg-primary rounded p-3 text-center font-weight-bold">
                            Attention!
                    </div>
                        <div className="text-center">
                            <div className=" rounded p-1 text-center">First sign up or log in!</div>
                            <div className="border border-dark bg-primary rounded text-center d-inline pl-3 pr-3 pointer"
                                onClick={() => setNotRegistered(!notRegistered)}>ok
                        </div>
                        </div>
                    </div>}
            </div>
        </div>

    );
};

DisplayPosts.propTypes = {
    posts: PropTypes.array,
};

export default DisplayPosts;