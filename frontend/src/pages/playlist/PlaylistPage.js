import React, { useEffect, useState } from "react";
import {getPlaylists, createPlaylist, deletePlaylist} from '../../service/playlist/playlistService.js';
import { useNavigate } from "react-router-dom";
import PlaylistItem from "../../components/PlaylistItem.js";
import PlaylistSongPage from "./PlaylistSongPage.js";

const PlaylistPage = ({handleLogin}) => {
    console.log("📢 handleLogin props:", handleLogin);  // ✅ 콘솔 확인

    const [playlists, setPlayLists] = useState([]);
    const [name, setName] = useState('');
    const navigate = useNavigate(); // 페이지 이동 함수


    useEffect(() => {
        loadPlayList();
    }, []);

    const loadPlayList = async () => {
        try{
            const data = await getPlaylists();
            setPlayLists(data);
        }catch(error){
            console.error("플레이리스트 불러오기 실패", error);
        }
    };

    const handleCreatePlaylist = async () => {
        try{
            const data = await createPlaylist(name);
            setName("");
            loadPlayList();
        }catch(error) {
            console.error("플레이리스트 생성 실패:", error);
        }
    }

    const handleDeletePlaylist = async (playlistId) => {
        try{
            const data = await deletePlaylist(playlistId);
            loadPlayList();
        }catch (error) {
            console.error("플레이리스트 삭제 실패:", error);
        }
    }

    const handleGoToPlaylist = (playlistId) => {
        navigate(`/playlist/${playlistId}`); // 특정 플레이리스트 페이지로 이동
    };

    return (
        <div>
            <h2>🎵 내 플레이리스트 </h2>
            <button onClick={handleLogin}>Spotify 로그인</button>
            <input type="text"
                placeholder="새 플레이리스트 이름"
                value={name}
                onChange={(e) => setName(e.target.value)}
            />

            <button onClick={handleCreatePlaylist}>추가</button>
            <ul>
                {playlists.map((playlist) => (
                    <PlaylistItem
                    key={playlist.id}
                    playlist={playlist}
                    onDelete={handleDeletePlaylist}
                    onClick={() => handleGoToPlaylist(playlist.id)}
                  />
                ))}
            </ul>
        </div>
    )
}

export default PlaylistPage;
