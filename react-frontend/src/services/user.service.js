//import axios from "axios";
import axios from "./interceptor";
import authHeader from "./auth-header";
//import BASE_URL from "./hostname";

const BASE_URL = process.env.REACT_APP_API_BACKEND_URL;
const API_URL_POSTS = `${BASE_URL}/api/posts`;
const API_URL_TOPICS = `${BASE_URL}/api/topic`;
const API_URL_COMMENTS = `${BASE_URL}/api/comments`;
const API_URL_VOTES = `${BASE_URL}/api/votes`;


const getPosts = (pageNumber = 0, pageSize = 5, sortType = "createdDate,desc") => {
  console.log("call api getPosts");
  return axios.get(API_URL_POSTS + "?page=" + pageNumber + "&size=" + pageSize + "&sort=" + sortType, { headers: authHeader() });

};

const getPostsBySearchPostName = (name, pageNumber = 0, pageSize = 3) => {
  if (name) return axios.get(API_URL_POSTS + "?name=" + name + "&page=" + pageNumber + "&size=" + pageSize, { headers: authHeader() });
  return axios.get(API_URL_POSTS + "?page=" + pageNumber + "&size=" + pageSize, { headers: authHeader() });

};

const getPostById = (id) => {
  return axios.get(API_URL_POSTS + "/" + id, { headers: authHeader() });
};
const getPostsByUsername = (username) => {
  return axios.get(API_URL_POSTS + "/by-user/" + username, { headers: authHeader() });
};
const getPostsByTopic = (topic) => {
  return axios.get(API_URL_POSTS + "/by-topic/" + topic, { headers: authHeader() });
};
const getTopics = () => {
  return axios.get(API_URL_TOPICS, { headers: authHeader() });
};

const getTopicById = (id) => {
  return axios.get(API_URL_TOPICS + "/" + id, { headers: authHeader() });
};

const getCommentsByPost = (id) => {
  return axios.get(API_URL_COMMENTS + "/by-post/" + id, { headers: authHeader() });
};

const getCommentsByUser = (username) => {
  return axios.get(API_URL_COMMENTS + "/by-user/" + username, { headers: authHeader() });
};

const addVote = (voteType, postId) => {
  return axios.post(API_URL_VOTES, {
    voteType,
    postId,
  }, { headers: authHeader() });
};

const deletePostById = (postId) => {
  return axios.delete(API_URL_POSTS + "/" + postId, { headers: authHeader() });
};

const deleteCommentById = (commentId) => {
  return axios.delete(API_URL_COMMENTS + "/" + commentId, { headers: authHeader() });
};

const addPost = (postName, description, topicName) => {
  return axios.post(API_URL_POSTS, {
    postName,
    description,
    topicName,
  }, { headers: authHeader() });
};
const addTopic = (name, description) => {
  return axios.post(API_URL_TOPICS, {
    name,
    description,
  }, { headers: authHeader() });
};
const addComment = (postId, text) => {
  return axios.post(API_URL_COMMENTS, {
    postId,
    text
  }, { headers: authHeader() });
};
const updatePost = (postId, postName, description, topicName) => {
  return axios.put(API_URL_POSTS, {
    postId,
    postName,
    description,
    topicName,
  }, { headers: authHeader() });
};

const userService = {
  getPosts,
  getPostsBySearchPostName,
  getPostById,
  getPostsByUsername,
  getPostsByTopic,
  getTopics,
  getTopicById,
  getCommentsByPost,
  getCommentsByUser,
  addVote,
  deletePostById,
  deleteCommentById,
  addPost,
  addTopic,
  addComment,
  updatePost
};

export default userService;