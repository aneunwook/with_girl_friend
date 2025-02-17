import React from 'react';
import styles from '../assets/styles/PlaylistPage.module.css';

const PlaylistItem = ({ playlist, onDelete, onClick }) => {
  return (
    <li onClick={onClick} className={styles.playlists}>
      {playlist.name}{' '}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onDelete(playlist.id);
        }}
        className={styles.playlistDelete}
      >
        <i className={`fa-solid fa-x ${styles.customIcon}`}></i>
      </button>
    </li>
  );
};

export default PlaylistItem;
