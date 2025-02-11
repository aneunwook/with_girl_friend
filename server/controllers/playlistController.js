import asyncHandler from "express-async-handler";
import Playlist from "../models/Playlist.js";
import Couple from "../models/couples.js";
import { Op, where } from "sequelize"; // Sequelize에서 OR 조건을 사용하기 위해 Op 연산자 가져오기
import axios from 'axios';
import dotenv from 'dotenv';
import PlaylistSong from "../models/playlistsongModel.js";

dotenv.config();

export const createPlaylist = async (req,res) => {
    try{
        const { name } = req.body;
        const userId = req.user.id;

        // 현재 로그인한 유저가 속한 커플 찾기
        const couple = await Couple.findOne({
            where : {
                [Op.or] :
                [{ user1_id : userId}, { user2_id: userId}]
            },
        })

        if (!couple) {
            return res.status(400).json({ message: "커플 등록이 필요합니다." });
        }

        // 기존에 같은 이름의 플레이리스트가 있는지 확인
        const existingPlaylist = await Playlist.findOne({
            where : { couple_id: couple.id, name},
        })

        if (existingPlaylist) {
            return res.status(400).json({ message: "이미 존재하는 플레이리스트입니다." });
        }

        // 플레이리스트 생성
        const newPlaylist = await Playlist.create({
            name,
            couple_id : couple.id,
        })

        res.status(201).json(newPlaylist);
        } catch (error) {
            console.error("플레이리스트 생성 오류:", error);
            res.status(500).json({ message: "서버 오류 발생" });
        }
}

// 커플 플레이리스트 목록 조회
export const getPlaylists = asyncHandler(async (req, res) => {
    // 로그인한 유저와 연결된 커플 찾기
    const couple = await Couple.findOne({
        where : {
            [Op.or] : [{ user1_id : req.user.id}, {user2_id: req.user.id}],
        },
    });

    if(!couple){
        return res.status(404).json({message: '커플 정보가 없습니다.'});
    }
     // 해당 커플이 만든 플레이리스트 조회
    const playlists = await Playlist.findAll({
        where: { couple_id: couple.id },
        attributes: ["id", "name", "createdAt"], // 필요한 정보만 가져오기
        order: [["createdAt", "DESC"]], // 최신순 정렬
    });

    res.json(playlists);
})

export const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    // 플레이리스트 존재 여부 확인
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: "플레이리스트를 찾을 수 없습니다." });
    }

    // 유저가 해당 커플의 플레이리스트인지 확인
    const couple = await Couple.findOne({
        where : { [Op.or] : [{ user1_id : req.user.id}, { user2_id : req.user.id}]},
    });
    if (!couple || playlist.couple_id !== couple.id) {
        return res.status(403).json({ message: "삭제할 권한이 없습니다." });
    }

    // 플레이리스트 삭제
    await playlist.destroy();
    res.json({ message: "플레이리스트가 삭제되었습니다." });
})

// 스포티파이 API 토큰 가져오기
const getSpotifyAccessToken = async () => {
    const clientId = process.env.SPOTIFY_CLIENT_ID;
    const clientSecret = process.env.SPOTIFY_CLIENT_SECRET;
  
    const response = await axios.post(
      "https://accounts.spotify.com/api/token",
      new URLSearchParams({ grant_type: "client_credentials" }),
      {
        headers: {
          Authorization: `Basic ${Buffer.from(`${clientId}:${clientSecret}`).toString("base64")}`,
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );
  
    return response.data.access_token;
  };

// 곡 검색
export const searchSong = asyncHandler(async (req, res) => {
    const { query } = req.query;

    if(!query){
        return res.status(400).json({ message : '검색어를 입력하세요'});
    }

    const accessToken = await getSpotifyAccessToken();

    try{
        const response = await axios.get(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track&limit=10`,
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      const tracks = response.data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        artist: track.artists.map((artist) => artist.name).join(", "),
        album: track.album.name,
        preview_url: track.preview_url, // 미리 듣기 URL
        image: track.album.images[0]?.url, // 앨범 커버 이미지
      }));

      res.json({ tracks });
    }catch(error){
        console.error("Spotify 검색 오류:", error);
      res.status(500).json({ message: "Spotify 검색 중 오류 발생" });
    }
})

  
  // 플레이리스트에 곡 추가
export const addSongToPlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;
    const { spotifyTrackId } = req.body;
  
    // 플레이리스트 존재 여부 확인
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
      return res.status(404).json({ message: "플레이리스트를 찾을 수 없습니다." });
    }
  
    // Spotify API에 요청해서 곡 정보 가져오기
    const accessToken = await getSpotifyAccessToken();
    const trackResponse = await axios.get(`https://api.spotify.com/v1/tracks/${spotifyTrackId}`, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
  
    const trackData = trackResponse.data;

    const newSong = await PlaylistSong.create({
        playlist_id : playlist.id,
        spotify_track_id: trackData.id,
        track_name: trackData.name,
        artist_name: trackData.artists.map((artist) => artist.name).join(", "),
        album_name: trackData.album.name,
        album_image: trackData.album.images[0]?.url,
        preview_url: trackData.preview_url,
    })

  
    // 곡 정보 응답
    res.json({
      message: "곡이 플레이리스트에 추가되었습니다.",
      track: newSong,
    });
  });

  // 플레이리스트에 있는 곡들 조회
export const getPlaylistSongs = asyncHandler(async (req, res) => {
    const { playlistId } = req.params;

    //플레이리스트 존재 여부 확인
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: "플레이리스트를 찾을 수 없습니다." });
      }

    // 해당 플레이리스트에 속한 곡들 가져오기
    const songs = await PlaylistSong.findAll({
        where : { playlist_id : playlistId},
    })
    res.json({ songs })
})

export const deleteSongFromPlaylist = asyncHandler(async (req, res) => {
    const { playlistId, songId} = req.params;

     // 플레이리스트 존재 여부 확인
    const playlist = await Playlist.findByPk(playlistId);
    if (!playlist) {
        return res.status(404).json({ message: "플레이리스트를 찾을 수 없습니다." });
    }

    // 해당 곡이 존재하는지 확인
    const song = await PlaylistSong.findOne({
        where: { id: songId, playlist_id: playlistId },
    });

    if (!song) {
        return res.status(404).json({ message: "곡을 찾을 수 없습니다." });
    }

    // 곡 삭제
    await song.destroy();

  res.json({ message: "곡이 플레이리스트에서 삭제되었습니다." });
})