import React, { useState } from "react";
import PropTypes from "prop-types";

import "./SearchByPost.css";

const SearchByPost = (props) => {
    const [textSearch, setTextSearch] = useState("");
    const onChangeTextSearch = (e) => {
        const textSearch = e.target.value;
        setTextSearch(textSearch);
    };

    return (
        <>
            <input className="p-1 mt-2 mb-2 ml-1 max-width-35" type="text" value={textSearch}
                placeholder="post name" onChange={onChangeTextSearch} />
            <div className=" bg-dark text-light ml-1 mt-2 p-1 rounded pointer align-start"
                onClick={() => props.search(textSearch)}>Search
                </div>
        </>
    );
};

SearchByPost.propTypes = {
    search: PropTypes.func,
};

export default SearchByPost;