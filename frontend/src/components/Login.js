import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { Redirect, useHistory, useLocation } from 'react-router-dom';

import { login } from "../actions/auth";

const Login = () => {
    const { register, handleSubmit, errors } = useForm();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [errorMessage, setErrorMessage] = useState("");
    const { message } = useSelector(state => state.message);
    const { isLoggedIn } = useSelector(state => state.auth);
    const history = useHistory();
    const location = useLocation();

    const dispatch = useDispatch();

    const onChangeUsername = (e) => {
        const username = e.target.value;
        setUsername(username);
    };

    const onChangePassword = (e) => {
        const password = e.target.value;
        setPassword(password);
    };

    const onSubmit = () => {
        setLoading(true);
        dispatch(login(username, password))
            .then(() => {
                history.push("/");
                window.location.reload();
            })
            .catch(() => {
                setLoading(false);
                setErrorMessage("Username and password do not match.");
            });
    };

    if (isLoggedIn) {
        return <Redirect to="/profile" />;
    }

    return (<>
        <div className="p-3">{location.text}</div>
        <div className="col-md-12">
            <div className="card card-container">
                <h3 className="text-center">Log in to your account</h3>
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
                        <input className="form-control" type="text" name="username" onChange={onChangeUsername} ref={register({ required: true })} />
                        {errors.username &&
                            <div className="alert alert-danger" role="alert">
                                {<span>Please enter your username</span>}
                            </div>
                        }
                        <div className="form-group">
                            <label htmlFor="password">Password</label>
                            <input className="form-control" type="password" name="password" onChange={onChangePassword} ref={register({ required: true })} />
                        </div>
                        {errors.password &&
                            <div className="alert alert-danger" role="alert">
                                <span>Please enter your password</span>
                            </div>
                        }
                        {loading && (
                            <span className="spinner-border spinner-border-sm"></span>
                        )}
                        <div >
                            <input className="btn btn-primary btn-block" type="submit" value="Enter" disabled={loading} />
                        </div>
                    </div>
                </form>

                {errorMessage && (
                    <div className="form-group">
                        <div className="alert alert-danger" role="alert">
                            {message + ": "}
                            {errorMessage}
                        </div>
                    </div>
                )}

            </div>
        </div >
    </>
    );
};

export default Login;
