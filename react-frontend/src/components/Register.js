import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";


import { signup } from "../actions/auth";

const Register = () => {
    const { register, handleSubmit, errors } = useForm();

    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const { message } = useSelector(state => state.message);
    const dispatch = useDispatch();
    const history = useHistory();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangeEmail = (e) => {
        const email = e.target.value;
        setEmail(email);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onSubmit = () => {
        setLoading(true);
        dispatch(signup(username, email, password))
            .then(() => {
                history.push({
                    pathname: "/login", text: "Registration successful. We have sent an email with a confirmation link to your email address. " +
                        "In order to confirm your email, please click the confirmation link. " +
                        "If you do not receive a confirmation email, please check your spam folder."
                });
            })
            .catch(() => {
                setLoading(false);
            });
    };

    return (
        <div className="col-md-12">
            <div className="card card-container">
                <h3 className="text-center">Create your account</h3>
                <div className="d-flex justify-content-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="64" height="64" fill="gray" className="bi bi-person-circle" viewBox="0 0 16 16">
                        <path d="M13.468 12.37C12.758 11.226 11.195 10 8 10s-4.757 1.225-5.468 2.37A6.987 6.987 0 0 0 8 15a6.987 6.987 0 0 0 5.468-2.63z" />
                        <path fillRule="evenodd" d="M8 9a3 3 0 1 0 0-6 3 3 0 0 0 0 6z" />
                        <path fillRule="evenodd" d="M8 1a7 7 0 1 0 0 14A7 7 0 0 0 8 1zM0 8a8 8 0 1 1 16 0A8 8 0 0 1 0 8z" />
                    </svg>
                </div>

                <form onSubmit={handleSubmit(onSubmit)}>
                    <div className="form-group">
                        <label htmlFor="username">Username</label>
                        <input className="form-control" type="text" name="username" onChange={onChangeUsername}
                            ref={register({ required: true, maxLength: 20 })} />
                    </div>

                    {errors.username && errors.username.type === "required" &&
                        <div className="alert alert-danger" role="alert">
                            < span> Username cannot be empty</span>
                        </div>
                    }
                    {errors.username && errors.username.type === "maxLength" &&
                        <div className="alert alert-danger" role="alert">
                            < span > Username must not contain more than 20 characters</span>
                        </div>
                    }

                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input className="form-control" type="email" name="email" onChange={onChangeEmail}
                            ref={register({
                                required: "required",
                                pattern: {
                                    value: /^(([^<>()[\],;:\s@]+(\.[^<>()[\],;:\s@]+)*)|(.+))@(([^<>()[\],;:\s@]+\.)+[^<>()[\],;:\s@]{2,})$/i,
                                    ///^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i
                                }
                            })} />
                    </div>

                    {errors.email && errors.email.type === "required" &&
                        <div className="alert alert-danger" role="alert">
                            <span>Email cannot be empty</span>
                        </div>
                    }
                    {errors.email && errors.email.type === "pattern" &&
                        <div className="alert alert-danger" role="alert">
                            <span>Entered value does not match email format</span>
                        </div>
                    }

                    <div className="form-group">
                        <label htmlFor="password">Password</label>
                        <input className="form-control" type="password" name="password" onChange={onChangePassword}
                            ref={register({ required: true, minLength: 3, maxLength: 255 })} />
                    </div>

                    {errors.password && errors.password.type === "required" &&
                        <div className="alert alert-danger" role="alert">
                            <span>Password cannot be empty</span>
                        </div>
                    }
                    {errors.password && errors.password.type === "minLength" &&
                        <div className="alert alert-danger" role="alert">
                            < span > Password must have at least 3 characters</span>
                        </div>
                    }
                    {loading && (
                        <span className="spinner-border spinner-border-sm"></span>
                    )}
                    <div >
                        <input className="btn btn-primary btn-block" type="submit" value="Create account" disabled={loading} />
                    </div>
                </form >
                {message && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message}
                        </div>
                    </div>
                )}
            </div >
        </div >
    );
};

export default Register;
