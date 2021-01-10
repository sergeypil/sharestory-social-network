import React, { useState, useEffect } from "react";
import DisplayPosts from "./DisplayPosts";
import UserService from "../services/user.service";
import { useParams } from "react-router-dom";

const PostsByTopic = () => {
    const [content, setContent] = useState([]);
    const { topicName } = useParams();
    //const [topicName] = useState((match));

    useEffect(() => {
        UserService.getPostsByTopic(topicName)
            .then((response) => {
                setContent(response.data.content);
            })
            .catch((e) => {
                console.log(e);
            });
    }, [topicName]);

    return (
        <>
            <div className="pt-3">
                <span className="ml-2 font-weight-bold h2">{!(Object.keys(content).length === 0 || content.constructor === Object) ?
                    "All posts in category " + topicName :
                    "No posts in category " + topicName
                }
                </span>
            </div>
            <DisplayPosts posts={content} />
        </>
    );
};

export default PostsByTopic;
