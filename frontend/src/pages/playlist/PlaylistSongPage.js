import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom"
import {getPlaylistSongs, deleteSongFromPlaylist, addSongToPlaylist, searchSongs} from '../../service/playlist/playlistService.js';
import SpotifyPlayer from "./SpotifyPlayer.js";
import axios from "axios";

const PlaylistSongsPage = () => {
    const { playlistId } = useParams();
    const [songs, setSongs] = useState([]);
    const [query, setQuery] = useState('');
    const [searchResults, setSearchResults] = useState([]);
    const [token, setToken] = useState(localStorage.getItem("spotify_access_token"));
    const [uri, setUri] = useState(null);
    const [playPause, setPlayPause] = useState(null);
    const [prevTrack, setPrevTrack] = useState(null);
    const [nextTrack, setNextTrack] = useState(null);

    useEffect(() => {
        loadSongs();
      }, []);

      useEffect(() => {
        const checkTokenExpiration = async () => {
          const token = localStorage.getItem("spotify_access_token");
          const refreshToken = localStorage.getItem("spotify_refresh_token");
      
          if (!token) return;
      
          try {
            await axios.get("https://api.spotify.com/v1/me", {
              headers: { Authorization: `Bearer ${token}` },
            });
          } catch (error) {
            if (error.response && error.response.status === 401) {
              console.log("🔄 Access Token 만료됨, 새로고침...");
      
              const response = await axios.get(
                `http://localhost:5000/api/auth/refresh?refresh_token=${refreshToken}`
              );
              const newAccessToken = response.data.access_token;
      
              localStorage.setItem("spotify_access_token", newAccessToken);
              setToken(newAccessToken);
            }
          }
        };
      
        checkTokenExpiration();
        const interval = setInterval(checkTokenExpiration, 1000 * 60 * 55); // 55분마다 체크
      
        return () => clearInterval(interval);
      }, []);
      
      const CLIENT_ID = "7ba200b021fc4af9b605f684d5be25e7";
      const REDIRECT_URI = "http://localhost:5000/api/auth/callback"; // 백엔드 OAuth 콜백 URL
      const SCOPES = [
        "user-read-private",
        "user-read-email",
        "user-read-playback-state",
        "user-modify-playback-state",
        "streaming", // 음악 스트리밍을 위해 필요
      ];

      const handleLogin = () => {
        localStorage.removeItem('spotify_access_token'); // 기존 토큰 삭제
        localStorage.removeItem("spotify_refresh_token");
        localStorage.setItem('redirectTo', '/playlist'); // 로그인 후 이동할 경로 저장

        const authUrl = `https://accounts.spotify.com/authorize?` +
          `client_id=${CLIENT_ID}` +
          `&response_type=code` +
          `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
          `&scope=${encodeURIComponent(SCOPES.join(" "))}` +
          `&show_dialog=true`;
      
        window.location.href = authUrl; // Spotify 로그인 페이지로 이동
      };

    const loadSongs = async () => {
        try{
            const data = await getPlaylistSongs(playlistId);
            console.log("🎶 불러온 곡 목록:", data); // 여기서 확인!

            setSongs(data);
        }catch (error) {
            console.error("곡 목록 불러오기 실패:", error);
        }
    }

    const handleSearch = async () => {
        try{
            const results = await searchSongs(query);
            console.log("검색 결과:", results); // 콘솔에서 응답 데이터 확인

            if (!Array.isArray(results)) {
                console.error("검색 결과가 배열이 아님:", results);
                setSearchResults([]); // 만약 배열이 아니면 빈 배열로 설정
                return;
            }

            setSearchResults(results);
        }catch (error) {
            console.error("곡 검색 실패:", error);
            setSongs([]); // 오류 발생 시 빈 배열로 설정
        }
    }

    const handleAddSong = async (spotifyTrackId) => {
        try{
            await addSongToPlaylist(playlistId, spotifyTrackId);
            console.log("곡 추가 성공:", spotifyTrackId);
            loadSongs();
        }catch (error) {
            console.error("곡 추가 실패:", error);
        }
    }

    const handleDeleteSong = async (songId) =>{
        try{
            await deleteSongFromPlaylist(playlistId, songId);
            loadSongs(); 
        }catch (error) {
            console.error("곡 삭제 실패:", error);
        }
    }

    const convertToSpotifyUri = (song) => {
        if (song.spotify_uri) {
            return song.spotify_uri; // 이미 존재하면 그대로 사용
        }
        if (song.external_url) {
            return "spotify:track:" + song.external_url.split("/track/")[1].split("?")[0];
        }
        return null; // 변환할 수 없으면 null 반환
    };
    

    return (
        <div>
            <h2>🎵 플레이리스트 곡 목록</h2>
            <ul>
                {songs && songs.length > 0 ? (
                    songs.map((song) => (
                        <li key={song.id}>
                            <img src={song.album_image} alt={song.album} width="100" height="100" />
                            {song.track_name} - {song.artist_name}{" "}
                            <button onClick={() => {console.log("🎵 재생할 URI:",convertToSpotifyUri(song)); setUri(convertToSpotifyUri(song))}} >▶ 재생</button>
                            <button onClick={() => handleDeleteSong(song.id)}>삭제</button>
                        </li>
                    ))
                ) : (
                    <p>곡이 없습니다.</p>
                )}
            </ul>

            <h3>곡 검색</h3>
            <input type="text" placeholder="곡 이름 검색" value={query} onChange={(e) => setQuery(e.target.value)}/>
            <button onClick={handleSearch}>검색</button>

            <ul>
                {searchResults?.map((track) => (
                    <li key={track.id}>
                        <img src={track.album_image} alt={track.album} width="100" height="100" />
                        {track.name} - {track.artist} ({track.album}) {""}
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
            <button onClick={() => prevTrack && prevTrack()} disabled={!prevTrack}>⏮ 이전</button>
            <button onClick={() => {
    console.log("▶/⏸ 버튼 클릭됨! 현재 playPause:", typeof playPause);
    if (typeof playPause === "function") {
        playPause();
    } else {
        console.error("❌ playPause가 함수가 아님!", playPause);
    }
}} disabled={!playPause}>
    ▶/⏸ 재생/일시정지
</button>
                <button onClick={() => nextTrack && nextTrack()} disabled={!nextTrack}>⏭ 다음</button>

            <button onClick={handleLogin}>Spotify 로그인</button>
             {/* SpotifyPlayer 컴포넌트 추가 */}
             <SpotifyPlayer 
                token={token} 
                uri={uri} 
                onPlayPause={setPlayPause} 
                onPrevTrack={setPrevTrack} 
                onNextTrack={setNextTrack} 
            />
        </div>
    )
}

export default PlaylistSongsPage;
