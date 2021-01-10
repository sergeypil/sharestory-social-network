import React from "react";
import { Redirect } from 'react-router-dom';
import { useSelector } from "react-redux";

import { Link } from "react-router-dom";

const Profile = () => {
  const { user: currentUser } = useSelector((state) => state.auth);

  if (!currentUser) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container p-3 bg-color">

      <h3>Profile</h3>
      <p>
        <span className="font-weight-bold">Username:</span>
        <span> {currentUser.username}</span>
        <span className="font-italic">
          {currentUser.emailConfirmed ? " (Email address is confirmed)" : " (Email address is not confirmed)"}
        </span>
      </p>
      <p>
        <strong>Token:</strong> {currentUser.authenticationToken.substring(0, 20)} ...{" "}
        {currentUser.authenticationToken.substr(currentUser.authenticationToken.length - 20)}
      </p>
      {/* <p>
        <strong>Expired:</strong> {(new Date(1000 * currentUser.expiresAt)).toString()}
      </p> */}
      <strong>User roles:</strong>
      <ul>
        {currentUser.roles &&
          currentUser.roles.map((role, index) => <li key={index}>{role}</li>)}
      </ul>
      <div>
        <Link to={"/" + currentUser.username + "/posts"} className="text-dark">
          <div className="p-3 h3 bg-primary rounded font-weight-bold">Click here to see list of your posts</div>
        </Link>
      </div>
      <div>
        <Link to={"/" + currentUser.username + "/comments"} className="text-dark">
          <div className="p-3 h3 bg-secondary rounded font-weight-bold">Click here to see list of your comments</div>
        </Link>
      </div>
    </div>
  );
};

export default Profile;
