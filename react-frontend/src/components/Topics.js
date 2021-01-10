import React, { useState, useEffect } from "react";

import { Link } from "react-router-dom";
import { useSelector } from "react-redux";

import UserService from "../services/user.service";

const Topics = () => {
    const [content, setContent] = useState([]);
    const [isHover, setIsHover] = useState("");

    const { user: currentUser } = useSelector((state) => state.auth);

    useEffect(() => {
        UserService.getTopics()
            .then((response) => {
                setContent(response.data);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);
    const handleMouseEnter = (id) => {
        setIsHover(id);
    };
    const handleMouseLeave = () => {
        setIsHover(undefined);
    };

    return (
        <div className="pt-3" >
            { currentUser && <div className="d-flex">
                <div>
                    <Link to={"/addPost"} className="bg-dark text-light ml-1 p-2 rounded">
                        Add new post
                    </Link>
                </div>
                <div className="ml-auto mr-3">
                    <Link to={"/addTopic"} className="bg-dark text-light ml-5 p-2 rounded">
                        Add new topic
                    </Link>
                </div>
            </div>}
            {
                Object.values(content).map((topic) => {
                    return (
                        <div className="mt-2" key={topic.id}>

                            <Link to={"/topic/" + topic.name + "/posts"}
                                className="ml-0 font-weight-bold text-dark">
                                <span className="" onMouseEnter={() => handleMouseEnter(topic.id)}
                                    onMouseLeave={handleMouseLeave} >{topic.name}</span>
                            </Link>
                            <span className="ml-2 font-italic">Number of posts in topic - {topic.numberOfPosts}</span>
                            { isHover === topic.id && <div className="p-3 rounded bg-secondary">{topic.description}</div>}
                            <hr className="bg-blue"></hr>
                        </div>
                    );
                })
            }
        </div >

    );
};

export default Topics;
