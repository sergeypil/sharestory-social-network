import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory } from "react-router-dom";

import { logout } from "../actions/auth";
import { clearMessage } from "../actions/message";

//import { history } from "../helpers/history";

const NavBar = () => {
    const [navCollapsed, setNavCollapsed] = useState(true);

    const history = useHistory();
    //const location = useLocation();
    const { user: currentUser } = useSelector((state) => state.auth);
    const dispatch = useDispatch();

    useEffect(() => {
        history.listen(() => {
            dispatch(clearMessage()); // clear message when changing location
        });
    }, [history, dispatch]);

    const logOut = (currentUser) => {
        dispatch(logout(currentUser));
    };
    const onToggleNav = () => {
        setNavCollapsed(!navCollapsed);
    };

    return (
        <nav className="navbar navbar-expand-lg  navbar-dark bg-dark pl-0 pr-0 ml-0 mr-0">
            <Link to={"/"} className="navbar-brand  pl-0 pr-0 ml-2 mr-0">sharestory</Link>

            <button className="navbar-toggler pl-1 pr-1 ml-0 mr-0" type="button" data-toggle="collapse" data-target="#navbarNavAltMarkup"
                aria-controls="navbarNavAltMarkup" aria-expanded="false" aria-label="Toggle navigation" onClick={onToggleNav}>
                <span className="navbar-toggler-icon"></span>
            </button>

            <div className={(navCollapsed ? "collapse " : "") + "navbar-collapse pl-0 pr-0 ml-3 mr-0"} id="navbarNavAltMarkup">
                <div className="navbar-nav">
                    <Link to={"/"} className="nav-link">
                        Home
                <span className="sr-only">(current)</span>
                    </Link>
                    <Link to={"/topics"} className="nav-link ">
                        Topics
                    </Link>

                    {currentUser && (<>
                        <Link to={"/profile"} className="nav-link">
                            Profile
                        </Link>

                    </>
                    )}
                    <Link to={"/about"} className="nav-link ">
                        About
                    </Link>
                </div>

            </div>
            {currentUser ?
                (<>
                    <Link to={"/profile"} className="nav-link text-secondary  pl-0 pr-0 ml-0 mr-0">
                        {currentUser.username}
                    </Link>

                    <Link to="/login" className="nav-link text-secondary  pl-0 pr-0 ml-1 mr-2" onClick={() => logOut(currentUser)}>
                        Exit
                    </Link>
                </>)
                :
                (<>
                    <Link to={"/login"} className="nav-link text-secondary">
                        Log In
                    </Link>
                    <Link to={"/register"} className="nav-link text-secondary">
                        Sign Up
                    </Link>
                </>)
            }
        </nav>
    );
};

export default NavBar;