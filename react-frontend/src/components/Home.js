import React, { useState } from "react";

import DisplayPosts from "./DisplayPosts";
import SearchByPost from "./SearchByPost";
import SortMenu from "./SortMenu";
import Pagination from "./Pagination";

import UserService from "../services/user.service";

const Home = () => {
  const [content, setContent] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const pageSize = 5;

  const getPosts = (pageNumber, sortType) => {
    UserService.getPosts(pageNumber, pageSize, sortType)
      .then(response => {
        setContent(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch(e => {
        console.log(e);
      });
  };
  const search = (name) => {
    UserService.getPostsBySearchPostName(name)
      .then((response) => {
        setContent(response.data.content);
        setTotalPages(response.data.totalPages);
      })
      .catch((e) => {
        console.log(e);
      });
  };

  return (
    <>
      <div className="d-flex">
        <SearchByPost search={search} />
        <SortMenu getPosts={getPosts} />
      </div>
      <DisplayPosts posts={content} />
      <Pagination totalPages={totalPages} getPosts={getPosts} />
    </>
  );
};

export default Home;
