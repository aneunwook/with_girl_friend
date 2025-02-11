import express from 'express';
import {createPlaylist, addSongToPlaylist, getPlaylistSongs, deleteSongFromPlaylist, deletePlaylist, searchSong, getPlaylists} from '../controllers/playlistController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post("/", authMiddleware, createPlaylist); // 플레이리스트 목록 생성
router.get("/", authMiddleware, getPlaylists); // 플레이리스트 목록 조회

router.delete("/:playlistId", authMiddleware, deletePlaylist); // 플레이리스트 삭제

router.get("/search", authMiddleware, searchSong); // Spotify 곡 검색 API


router.post("/:playlistId/songs", authMiddleware, addSongToPlaylist); // 플레이리스트에 곡 추가
router.get("/:playlistId/songs", authMiddleware, getPlaylistSongs); // 플레이리스트의 곡들 조회
router.delete("/:playlistId/songs/:songId", authMiddleware, deleteSongFromPlaylist);



export default router;