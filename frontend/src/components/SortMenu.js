import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";

const SortMenu = (props) => {
    const [isSortMenuOpen, setIsSortMenuOpen] = useState(false);
    const [sortTypeOrder, setSortTypeOrder] = useState({ type: "Date", typeDto: "createdDate", order: "desc" });
    const getPosts = props.getPosts;

    const handleSortButton = (type) => {
        if (type === sortTypeOrder.type) {
            sortTypeOrder.order === "asc" ?
                setSortTypeOrder((prev) => ({ ...prev, order: "desc" })) :
                setSortTypeOrder((prev) => ({ ...prev, order: "asc" }));
        }
        else if (type === "Date") {
            setSortTypeOrder({ type: "Date", typeDto: "createdDate", order: "desc" });
        }
        else if (type === "Likes") {
            setSortTypeOrder({ type: "Likes", typeDto: "voteCount", order: "desc" });
        }
    };

    useEffect(() => {
        getPosts(0, `${sortTypeOrder.typeDto},${sortTypeOrder.order}`);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [sortTypeOrder]);

    return (
        <>
            <div className="pt-3 ml-auto">Sort by</div>
            <div className="dropdown pt-2 mr-3 ml-1" onClick={() => setIsSortMenuOpen(!isSortMenuOpen)}>
                <button className="btn btn-dark dropdown-toggle height-33" type="button" id="dropdownMenuButton" style={{ height: "33px", lineHeight: "20px" }}
                    data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    {sortTypeOrder.type}
                </button>
                <div className={`dropdown-menu${isSortMenuOpen ? " show" : ""}`} aria-labelledby="dropdownMenuButton">
                    <span className="dropdown-item text-dark pointer" onClick={() => handleSortButton("Date")}>Date</span>
                    <span className="dropdown-item text-dark pointer" onClick={() => handleSortButton("Likes")}>Likes</span>
                </div>
            </div>
        </>
    );
};

SortMenu.propTypes = {
    getPosts: PropTypes.func,
};

export default SortMenu;