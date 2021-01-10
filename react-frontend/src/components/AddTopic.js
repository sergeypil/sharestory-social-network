import React, { useState } from "react";
import { useForm } from "react-hook-form";

import UserService from "../services/user.service";
import { useHistory } from "react-router-dom";

const AddTopic = () => {
    const { register, handleSubmit, errors } = useForm();

    const [topicName, setTopicName] = useState("");
    const [description, setDescription] = useState("");

    const [loading, setLoading] = useState(false);
    const history = useHistory();

    const onChangeTopicName = (e) => {
        const topicName = e.target.value;
        setTopicName(topicName);
    };

    const onChangeDescription = (e) => {
        const description = e.target.value;
        setDescription(description);
    };

    const onSubmit = () => {
        setLoading(true);
        UserService.addTopic(topicName, description)
            .then(() => {
                history.push("/topics");
                window.location.reload();
            })
            .catch((e) => {
                console.log(e);
            });
    };

    return (
        <div className="container">

            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="form-group">
                    <label htmlFor="topicName">Name of topic</label>
                    <input className="form-control" type="text" name="topicName" onChange={onChangeTopicName}
                        ref={register({ required: true, maxLength: 35 })} />
                </div>
                {errors.topicName && errors.topicName.type === "required" &&
                    <div className="alert alert-danger" role="alert">
                        < span> Name of topic cannot be empty</span>
                    </div>
                }
                {errors.topicName && errors.topicName.type === "maxLength" &&
                    <div className="alert alert-danger" role="alert">
                        < span > Name of topic must not contain more than 35 characters</span>
                    </div>
                }

                <div className="form-group">
                    <label htmlFor="description">Description</label>
                    <textarea className="form-control" type="textarea" name="description" onChange={onChangeDescription}
                        rows="15" ref={register({ required: true, maxLength: 255 })} />
                </div>
                {errors.description && errors.description.type === "required" &&
                    <div className="alert alert-danger" role="alert">
                        < span> Description cannot be empty</span>
                    </div>
                }
                {errors.description && errors.description.type === "maxLength" &&
                    <div className="alert alert-danger" role="alert">
                        < span > Description must not contain more than 255 characters</span>
                    </div>
                }

                <div className="form-group">
                    <input className="btn btn-primary btn-block" type="submit" value="send" disabled={loading} />
                </div>

            </form >
        </div >
    );
};

export default AddTopic;
