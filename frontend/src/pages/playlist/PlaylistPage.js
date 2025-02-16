import React, { useEffect, useState, useRef } from 'react';
import {
  getPlaylists,
  createPlaylist,
  deletePlaylist,
} from '../../service/playlist/playlistService.js';
import { useNavigate } from 'react-router-dom';
import PlaylistItem from '../../components/PlaylistItem.js';
import PlaylistSongPage from './PlaylistSongPage.js';
import styles from '../../assets/styles/PlaylistPage.module.css';

const PlaylistPage = ({ handleLogin }) => {
  const [playlists, setPlayLists] = useState([]);
  const [name, setName] = useState('');
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [showCreateBox, setShowCreateBox] = useState(false);
  const inputRef = useRef(null); // ✅ 입력창 포커스 제어

  useEffect(() => {
    loadPlayList();
  }, []);

  const loadPlayList = async () => {
    try {
      const data = await getPlaylists();
      setPlayLists(data);
    } catch (error) {
      console.error('플레이리스트 불러오기 실패', error);
    }
  };

  const handleCreatePlaylist = async () => {
    try {
      const data = await createPlaylist(name);
      setName('');
      loadPlayList();
    } catch (error) {
      console.error('플레이리스트 생성 실패:', error);
    }
  };

  const handleDeletePlaylist = async (playlistId) => {
    try {
      const data = await deletePlaylist(playlistId);
      loadPlayList();
    } catch (error) {
      console.error('플레이리스트 삭제 실패:', error);
    }
  };

  // 입력값을 저장하고 자동 추가하는 함수
  const handleAddPlayList = () => {
    if (name.trim() !== '') {
      handleCreatePlaylist(name);
      setName('');
    }
    setShowCreateBox(false);
  };

  return (
    <div className={styles.playlistContainer}>
      <div className={styles.playlist}>
        <button onClick={handleLogin} className={styles.spotifyLogin}>
          <i className={`fa-brands fa-spotify ${styles.customIcon}`}></i>
          {''} Login
        </button>
        <div className={styles.playlistTitle}>
          <h2>🎵 My Playlist </h2>
          <p
            className={styles.playlistAdd}
            title="Playlist 만들기"
            onClick={() => setShowCreateBox(true)}
          >
            +
          </p>
        </div>

        <ul>
          {playlists.map((playlist) => (
            <PlaylistItem
              key={playlist.id}
              playlist={playlist}
              onDelete={handleDeletePlaylist}
              onClick={() => setSelectedPlaylist(playlist.id)}
            />
          ))}
          {showCreateBox && (
            <div>
              <input
                ref={inputRef}
                type="text"
                className={styles.listName}
                placeholder="새 플레이리스트 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayList()} // ✅ 엔터 누르면 추가
                onBlur={handleAddPlayList} // ✅ 다른 곳 클릭하면 추가
                autoFocus // ✅ 자동 포커스
              />

              <button
                onClick={() => {
                  handleCreatePlaylist();
                  setShowCreateBox(false);
                }}
                className={styles.listAddButton}
              >
                추가
              </button>
            </div>
          )}
        </ul>
      </div>

      <div>
        {selectedPlaylist ? (
          <PlaylistSongPage playlistId={selectedPlaylist} />
        ) : (
          <p>🎵 플레이리스트를 선택해주세요</p>
        )}
      </div>
    </div>
  );
};

export default PlaylistPage;
