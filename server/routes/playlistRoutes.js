import express from 'express';
import {createPlaylist, addSongToPlaylist, getPlaylistSongs, deleteSongFromPlaylist, deletePlaylist} from '../controllers/playlistController.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.get("/", authMiddleware, createPlaylist); // 플레이리스트 목록 조회
router.delete("/:playlistId", authMiddleware, deletePlaylist);

router.post("/:playlistId/songs", authMiddleware, addSongToPlaylist); // 플레이리스트에 곡 추가
router.get("/:playlistId/songs", authMiddleware, getPlaylistSongs); // 플레이리스트의 곡들 조회
router.delete("/:playlistId/songs/:songId", authMiddleware, deleteSongFromPlaylist);



export default router;