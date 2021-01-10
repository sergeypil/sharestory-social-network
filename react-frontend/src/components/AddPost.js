import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";

import UserService from "../services/user.service";
import { useHistory, useLocation } from "react-router-dom";

const AddPost = () => {
    const { register, handleSubmit, errors } = useForm();

    const location = useLocation();
    const history = useHistory();


    const [postName, setPostName] = useState("");
    const [description, setDescription] = useState("");
    const [topicName, setTopicName] = useState("");

    const [content, setContent] = useState("");
    const [loading, setLoading] = useState(false);

    const [postFromProps] = useState(location.post);
    const [errorMessage, setErrorMessage] = useState(false);


    useEffect(() => {
        content && setTopicName(Object.values(content)[0].name);
    }, [content]);

    useEffect(() => {
        UserService.getTopics()
            .then((response) => {
                response.data.length !== 0 ? setContent(response.data) :
                    setErrorMessage(true);
            })
            .catch((e) => {
                console.log(e);
            });
    }, []);

    const onChangePostName = (e) => {
        const postName = e.target.value;
        setPostName(postName);
    };

    const onChangeDescription = (e) => {
        const description = e.target.value;
        setDescription(description);
    };

    const onChangeTopicName = (e) => {
        const topicName = e.target.value;
        setTopicName(topicName);
    };

    const onSubmit = () => {
        setLoading(true);
        postFromProps ?
            UserService.updatePost(postFromProps.id, postName || postFromProps.postName, description || postFromProps.description,
                topicName || postFromProps.topicName).then(() => {
                    history.push("/");
                    window.location.reload();
                })
            :
            UserService.addPost(postName, description, topicName).then(() => {
                history.push("/");
                window.location.reload();
            });
    };

    return (
        <div className="container h-100 w-auto pb-3 ">
            {content && <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group ">
                    <label htmlFor="postName">Name of post</label>
                    <input className="form-control" type="text" name="postName" autoFocus defaultValue={postFromProps && postFromProps.postName}
                        onChange={onChangePostName} ref={register({ required: true, maxLength: 35 })} />
                </div>
                {errors.postName && errors.postName.type === "required" &&
                    <div className="alert alert-danger" role="alert">
                        < span> Name of post cannot be empty</span>
                    </div>
                }
                {errors.username && errors.username.type === "maxLength" &&
                    <div className="alert alert-danger" role="alert">
                        < span > Name of post must not contain more than 35 characters</span>
                    </div>
                }

                <div className="form-group">
                    <label htmlFor="topicName">Name of topic</label>
                    <select defaultValue={postFromProps && postFromProps.topicName}
                        name="topicName" onChange={onChangeTopicName}>
                        {content.map((topic) => {
                            return (
                                <option value={topic.name}
                                    key={topic.id}>{topic.name}</option>);
                        }
                        )}

                    </select>
                </div>

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control h-100" type="textarea" name="description"
                        defaultValue={postFromProps && postFromProps.description} onChange={onChangeDescription}
                        rows="15" ref={register({ required: true })} />
                </div>

                {errors.description && errors.description.type === "required" &&
                    <div className="alert alert-danger" role="alert">
                        < span> Description cannot be empty</span>
                    </div>
                }

                <div >
                    <input className="btn btn-primary btn-block" type="submit" value="send" disabled={loading} />
                </div>
            </form >}
            {errorMessage &&
                <div>
                    <div className="alert alert-danger" role="alert">
                        Please add topic at first.
                    </div>
                </div>
            }
        </div >

    );
};

export default AddPost;
