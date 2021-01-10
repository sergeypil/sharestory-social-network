import React from "react";
import { Router, Switch, Route } from "react-router-dom";

import "bootstrap/dist/css/bootstrap.min.css";
import "./App.css";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import About from "./components/About";


import AddPost from "./components/AddPost";
import Post from "./components/Post";
import AddTopic from "./components/AddTopic";
import Topics from "./components/Topics";
import PostsByUser from "./components/PostsByUser";
import CommentsByUser from "./components/CommentsByUser";
import PostsByTopic from "./components/PostsByTopic";
import Navbar from "./components/Navbar";

import { history } from "./helpers/history";

const App = () => {
  return (
    <Router history={history}>
      <div id="app" className="bg-light">
        <Navbar />
        <div className="container bg-color" id="middle-page">
          <Switch>
            <Route exact path={["/", "/home"]} component={Home} />
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <Route exact path="/profile" component={Profile} />
            <Route exact path="/about" component={About} />

            <Route path="/addPost" component={AddPost} />
            <Route path="/posts/:postId" component={Post} />
            <Route path="/addTopic" component={AddTopic} />
            <Route path="/topics" component={Topics} />
            <Route path="/:username/posts" component={PostsByUser} />
            <Route path="/topic/:topicName/posts" component={PostsByTopic} />
            <Route path="/:username/comments" component={CommentsByUser} />
          </Switch>
        </div>
      </div>
    </Router >
  );
};

export default App;
