import React, { useEffect, useState, memo, useRef } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPlaylistSongs,
  deleteSongFromPlaylist,
  addSongToPlaylist,
  searchSongs,
} from '../../service/playlist/playlistService.js';
import SpotifyPlayer from './SpotifyPlayer.js';
import axios from 'axios';
import styles from '../../assets/styles/PlaylistPage.module.css';

const PlaylistSongsPage = ({ playPlaylist, playlistId }) => {
  const [songs, setSongs] = useState([]);
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [token, setToken] = useState(
    localStorage.getItem('spotify_access_token')
  );
  const [uri, setUri] = useState(null);
  const [playPause, setPlayPause] = useState(null);
  const [prevTrack, setPrevTrack] = useState(null);
  const [nextTrack, setNextTrack] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const searchResultsRef = useRef(null);

  useEffect(() => {
    loadSongs();
  }, [playlistId]);

  useEffect(() => {
    console.log(' playPlaylist 함수 변경됨!', playPlaylist);
  }, [playPlaylist]);

  useEffect(() => {
    let isMounted = true;

    const checkTokenExpiration = async () => {
      const token = localStorage.getItem('spotify_access_token');
      const refreshToken = localStorage.getItem('spotify_refresh_token');

      if (!token) return;

      try {
        await axios.get('https://api.spotify.com/v1/me', {
          headers: { Authorization: `Bearer ${token}` },
        });
      } catch (error) {
        if (error.response && error.response.status === 401) {
          const response = await axios.get(
            `http://localhost:3000/api/auth/refresh?refresh_token=${refreshToken}`
          );
          const newAccessToken = response.data.access_token;

          localStorage.setItem('spotify_access_token', newAccessToken);

          if (isMounted) {
            setToken(newAccessToken);
          }
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 1000 * 60 * 55);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const loadSongs = async () => {
    try {
      const data = await getPlaylistSongs(playlistId);

      setSongs(data);
    } catch (error) {
      console.error('곡 불러오기 실패:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchSongs(query);

      if (!Array.isArray(results)) {
        setSearchResults([]); // 만약 배열이 아니면 빈 배열로 설정
        return;
      }
      setSearchResults(results);
      setShowResults(true); // 검색 결과가 있으면 표시
    } catch (error) {
      setSongs([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  const handleAddSong = async (spotifyTrackId) => {
    try {
      await addSongToPlaylist(playlistId, spotifyTrackId);
      loadSongs();
    } catch (error) {
      console.error('곡 추가 실패:', error);
    }
  };

  const handleDeleteSong = async (songId) => {
    try {
      await deleteSongFromPlaylist(playlistId, songId);
      loadSongs();
    } catch (error) {
      console.error('곡 삭제 실패:', error);
    }
  };

  //  개별 트랙 재생
  // 특정 인덱스부터 플레이리스트 재생 함수
  const playFromIndex = async (startIndex) => {
    if (!songs.length) {
      console.warn('플레이리스트가 비어 있음!');
      return;
    }

    const trackUris = songs.map(convertToSpotifyUri).filter(Boolean); // 모든 트랙 URI 가져오기
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!trackUris[startIndex]) {
      console.error(' 해당 인덱스의 트랙이 없음!');
      return;
    }

    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {
          uris: trackUris, //  전체 플레이리스트 재생
          offset: { position: startIndex }, // 사용자가 선택한 곡부터 시작
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
    } catch (error) {
      console.error(
        ' 플레이리스트 재생 실패:',
        error.response ? error.response.data : error
      );
    }
  };

  // Spotify URI 변환
  const convertToSpotifyUri = (song) => {
    if (song.spotify_uri) return song.spotify_uri.trim();
    if (song.external_url) {
      const match = song.external_url.match(/track\/([a-zA-Z0-9]+)/);
      return match ? `spotify:track:${match[1]}` : null;
    }
    return null;
  };

  const handlePlayPlaylist = () => {
    if (songs.length > 0) {
      const trackUris = songs.map(convertToSpotifyUri).filter(Boolean);

      if (JSON.stringify(trackUris) !== JSON.stringify(uri)) {
        setUri(trackUris);
      }
    } else {
      console.warn('플레이리스트가 비어 있음!');
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        searchResultsRef.current &&
        !searchResultsRef.current.contains(event.target)
      ) {
        setShowResults(false);
      }
    };

    if (showResults) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showResults]);

  const handleTogglePlayPause = () => {
    if (typeof playPause === 'function') {
      playPause(); // Spotify 플레이어의 재생/일시정지 함수 실행
      setIsPlaying((prev) => !prev); // 상태 변경
    } else {
      console.error('playPause가 함수가 아님!', playPause);
    }
  };

  return (
    <div className={styles.songAllContainer}>
      <div className={styles.titleSearchContainer}>
        <h2>🎵 플레이리스트 곡 목록</h2>
        <div className={styles.songSearchContainer}>
          <input
            type="text"
            placeholder="곡 이름 검색"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
          />
          <button onClick={handleSearch}>
            <i
              class={`fa-solid fa-magnifying-glass ${styles.playAllCustom}`}
            ></i>
          </button>
        </div>
        {showResults && (
          <div ref={searchResultsRef} className={styles.songSearchResults}>
            <button onClick={() => setShowResults(false)}>x</button>
            <table>
              <thead>
                <tr>
                  <th>앨범</th>
                  <th>곡명</th>
                  <th>아티스트</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {searchResults.map((track) => (
                  <tr key={track.id}>
                    <td>
                      <img
                        src={track.image}
                        alt={track.album}
                        width="50"
                        height="50"
                      />
                    </td>
                    <td>{track.name}</td>
                    <td>{track.artist}</td>
                    <td>
                      <button onClick={() => handleAddSong(track.id)}>
                        추가
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <button onClick={handlePlayPlaylist} className={styles.playAll}>
        <i
          class={`fa-solid fa-play ${styles.playAllCustom}`}
          title="전체재생"
        ></i>
      </button>
      <div className={styles.Allplaylist}>
        {songs && songs.length > 0 ? (
          <div className={styles.myPlaylist}>
            <table>
              <thead>
                <tr>
                  <th>앨범</th>
                  <th>곡명</th>
                  <th colSpan={2}>아티스트</th>
                </tr>
              </thead>
              <tbody>
                {songs.map((song) => (
                  <tr key={song.id}>
                    <td>
                      <img
                        src={song.album_image}
                        alt={song.album}
                        width="100"
                        height="100"
                      />
                    </td>
                    <td>{song.track_name}</td>
                    <td colSpan={2}>
                      <div className={styles.artistActions}>
                        <span>{song.artist_name}</span>
                        <div className={styles.buttonGroup}>
                          <button
                            onClick={() =>
                              playFromIndex(
                                songs.findIndex((s) => s.id === song.id)
                              )
                            }
                            className={styles.playSongButton}
                          >
                            <i
                              className={`fa-solid fa-play ${styles.playCustom}`}
                              title="재생"
                            ></i>
                          </button>
                          <button
                            onClick={() => handleDeleteSong(song.id)}
                            className={styles.songDeleteButton}
                          >
                            <i
                              className={`fa-solid fa-x ${styles.deleteCustom}`}
                            ></i>
                          </button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <p>곡이 없습니다.</p>
        )}
        <div className={styles.controlSongs}>
          <div className={styles.prevStartNextButton}>
            <button
              onClick={() => prevTrack && prevTrack()}
              disabled={!prevTrack}
              className={styles.prevButton}
            >
              <i class={`fa-solid fa-backward ${styles.playAllCustom}`}></i>
            </button>
            <button
              className={styles.pauseStart}
              onClick={handleTogglePlayPause}
              disabled={!playPause}
            >
              <i
                className={`fa-solid ${isPlaying ? 'fa-play' : 'fa-pause'} ${
                  styles.playAllCustom
                }`}
              ></i>
            </button>
            <button
              onClick={() => nextTrack && nextTrack()}
              disabled={!nextTrack}
              className={styles.nextButton}
            >
              <i class={`fa-solid fa-forward ${styles.playAllCustom}`}></i>
            </button>
          </div>
          <div className={styles.spotifyPlayer}>
            {/* SpotifyPlayer 컴포넌트 추가 */}
            <SpotifyPlayer
              token={token}
              uri={uri}
              onPlayPause={setPlayPause}
              onPrevTrack={setPrevTrack}
              onNextTrack={setNextTrack}
            />
          </div>
        </div>
      </div>
    </div>
  );
};
export default memo(PlaylistSongsPage);
