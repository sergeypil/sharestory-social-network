import React, { useState } from "react";
import PropTypes from "prop-types";

const Pagination = (props) => {
    const [activeEl, setActiveEl] = useState(0);

    const choosePage = (i) => {
        setActiveEl(i);
        window.scrollTo(0, 0);
        props.getPosts(i);
    };

    return (
        <>
            <nav aria-label="Pagination 2">
                <ul className="pagination justify-content-center">
                    <li className={activeEl === 0 ? "page-item disabled pointer" : "page-item pointer"}>
                        <span className="page-link" onClick={() => setActiveEl(prev => choosePage(prev - 1))}>Previous</span>
                    </li>
                    {[...Array(props.totalPages)].map((element, i) => {
                        return (
                            <li className={i === activeEl ? "page-item active pointer" : "page-item pointer"} key={i}>
                                <span className="page-link"
                                    onClick={() => choosePage(i)}>{i}</span></li>
                        );
                    })
                    }
                    <li className={props.totalPages - 1 === activeEl ? "page-item disabled pointer" : "page-item pointer"}>
                        <span className="page-link" onClick={() => setActiveEl(prev => choosePage(prev + 1))}>Next</span>
                    </li>
                </ul>
            </nav>


        </>
    );
};

Pagination.propTypes = {
    totalPages: PropTypes.number,
    getPosts: PropTypes.func
};

export default Pagination;
