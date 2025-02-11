import React from "react";

const PlaylistItem = ({ playlist, onDelete, onClick}) => {
    return (
        <li onClick={onClick} style={{ cursor: "pointer", padding: "10px", borderBottom: "1px solid #ddd" }}>
            {playlist.name}{" "}
            <button onClick={(e) => { e.stopPropagation(); onDelete(playlist.id); }}>삭제</button>
        </li>       
    )
}

export default PlaylistItem;
