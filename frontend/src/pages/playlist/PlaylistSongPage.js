import React, { useEffect, useState, memo } from 'react';
import { useParams } from 'react-router-dom';
import {
  getPlaylistSongs,
  deleteSongFromPlaylist,
  addSongToPlaylist,
  searchSongs,
} from '../../service/playlist/playlistService.js';
import SpotifyPlayer from './SpotifyPlayer.js';
import axios from 'axios';
import PlaylistPage from './PlaylistPage.js';

const PlaylistSongsPage = ({ playPlaylist, playlistId }) => {
  console.log('✅ PlaylistSongsPage 렌더링됨!');
  console.log('✅ playPlaylist props:', playPlaylist);

  // const { playlistId } = useParams();
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

  useEffect(() => {
    loadSongs();
  }, [playlistId]);

  useEffect(() => {
    console.log('🎵 playPlaylist 함수 변경됨!', playPlaylist);
  }, [playPlaylist]);

  useEffect(() => {
    let isMounted = true; // ✅ 추가

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
          console.log('🔄 Access Token 만료됨, 새로고침...');

          const response = await axios.get(
            `http://localhost:3000/api/auth/refresh?refresh_token=${refreshToken}`
          );
          const newAccessToken = response.data.access_token;

          localStorage.setItem('spotify_access_token', newAccessToken);

          if (isMounted) {
            setToken(newAccessToken); // ✅ 컴포넌트가 마운트된 경우에만 상태 업데이트
          }
        }
      }
    };

    checkTokenExpiration();
    const interval = setInterval(checkTokenExpiration, 1000 * 60 * 55);

    return () => {
      isMounted = false; // ✅ 언마운트 시 루프 방지
      clearInterval(interval);
    };
  }, []); // ✅ 의존성 배열을 비워서 한 번만 실행되게 함.

  const loadSongs = async () => {
    try {
      const data = await getPlaylistSongs(playlistId);
      console.log('🎶 불러온 곡 목록:', data);
      setSongs(data);
    } catch (error) {
      console.error('곡 목록 불러오기 실패:', error);
    }
  };

  const handleSearch = async () => {
    try {
      const results = await searchSongs(query);
      console.log('검색 결과:', results); // 콘솔에서 응답 데이터 확인

      if (!Array.isArray(results)) {
        console.error('검색 결과가 배열이 아님:', results);
        setSearchResults([]); // 만약 배열이 아니면 빈 배열로 설정
        return;
      }

      setSearchResults(results);
    } catch (error) {
      console.error('곡 검색 실패:', error);
      setSongs([]); // 오류 발생 시 빈 배열로 설정
    }
  };

  const handleAddSong = async (spotifyTrackId) => {
    try {
      await addSongToPlaylist(playlistId, spotifyTrackId);
      console.log('곡 추가 성공:', spotifyTrackId);
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

  // ✅ 개별 트랙 재생
  // ✅ 특정 인덱스부터 플레이리스트 재생 함수
  const playFromIndex = async (startIndex) => {
    if (!songs.length) {
      console.warn('🚨 플레이리스트가 비어 있음!');
      return;
    }

    const trackUris = songs.map(convertToSpotifyUri).filter(Boolean); // 모든 트랙 URI 가져오기
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!trackUris[startIndex]) {
      console.error('❌ 해당 인덱스의 트랙이 없음!');
      return;
    }

    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        {
          uris: trackUris, // ✅ 전체 플레이리스트 재생
          offset: { position: startIndex }, // ✅ 사용자가 선택한 곡부터 시작
        },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );
      console.log(
        `✅ ${startIndex + 1}번째 곡부터 플레이리스트 자동 재생 시작!`
      );
    } catch (error) {
      console.error(
        '❌ 플레이리스트 재생 실패:',
        error.response ? error.response.data : error
      );
    }
  };

  // ✅ Spotify URI 변환
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
        console.log('🎵 플레이리스트 재생할 트랙 리스트:', trackUris);
        setUri(trackUris);
      }
    } else {
      console.warn('🚨 플레이리스트가 비어 있음!');
    }
  };

  return (
    <div>
      <h2>🎵 플레이리스트 곡 목록</h2>
      <h3>곡 검색</h3>
      <input
        type="text"
        placeholder="곡 이름 검색"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />
      <button onClick={handleSearch}>검색</button>
      <ul>
        {songs && songs.length > 0 ? (
          songs.map((song) => (
            <li key={song.id}>
              <img
                src={song.album_image}
                alt={song.album}
                width="100"
                height="100"
              />
              {song.track_name} - {song.artist_name}{' '}
              <button
                onClick={() =>
                  playFromIndex(songs.findIndex((s) => s.id === song.id))
                }
              >
                ▶ 여기서부터 재생
              </button>
              <button onClick={() => handleDeleteSong(song.id)}>삭제</button>
            </li>
          ))
        ) : (
          <p>곡이 없습니다.</p>
        )}
        <button onClick={handlePlayPlaylist}>🎶 전체 재생</button>
      </ul>

      <ul>
        {searchResults?.map((track) => (
          <li key={track.id}>
            <img
              src={track.album_image}
              alt={track.album}
              width="100"
              height="100"
            />
            {track.name} - {track.artist} ({track.album}) {''}
            {track.preview_url ? ( // preview_url이 있을 경우만 오디오 태그 표시
              <audio controls>
                <source src={track.preview_url} type="audio/mpeg" />
                브라우저가 오디오 태그를 지원하지 않습니다.
              </audio>
            ) : (
              <span>미리 듣기 없음</span> //  preview_url이 없을 경우
            )}
            <button onClick={() => handleAddSong(track.id)}>추가</button>
          </li>
        ))}
      </ul>
      <button onClick={() => prevTrack && prevTrack()} disabled={!prevTrack}>
        ⏮ 이전
      </button>
      <button
        onClick={() => {
          console.log('▶/⏸ 버튼 클릭됨! 현재 playPause:', typeof playPause);
          if (typeof playPause === 'function') {
            playPause();
          } else {
            console.error('❌ playPause가 함수가 아님!', playPause);
          }
        }}
        disabled={!playPause}
      >
        ▶/⏸ 재생/일시정지
      </button>
      <button onClick={() => nextTrack && nextTrack()} disabled={!nextTrack}>
        ⏭ 다음
      </button>

      {/* SpotifyPlayer 컴포넌트 추가 */}
      <SpotifyPlayer
        token={token}
        uri={uri}
        onPlayPause={setPlayPause}
        onPrevTrack={setPrevTrack}
        onNextTrack={setNextTrack}
      />
    </div>
  );
};
export default memo(PlaylistSongsPage);
