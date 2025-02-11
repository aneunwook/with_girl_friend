import axiosInstance from "../axiosInstance";

// 플레이리스트 목록 조회
export const getPlaylists = async () => {
    const response = await axiosInstance.get('/playlists');
    return response.data;
}

//  플레이리스트 생성
export const createPlaylist = async (name) => {
    const response = await axiosInstance.post('/playlists', {name});
    return response.data;
}

//  플레이리스트 삭제
export const deletePlaylist = async (playlistId) => {
    const response = await axiosInstance.delete(`/playlists/${playlistId}`);
    return response.data;
}

// spotify 곡 검색
export const searchSongs  = async (query) => {
    const response = await axiosInstance.get(`/playlists/search?query=${query}`);
    return response.data.tracks;
}

// 플레이리스트에 곡 추가
export const addSongToPlaylist = async (playlistId, spotifyTrackId) => {
    const response = await axiosInstance.post(`/playlists/${playlistId}/songs`, {spotifyTrackId});
    return response.data;
}

// 플레이리스트의 곡 목록 조회
export const getPlaylistSongs = async (playlistId) => {
    const response = await axiosInstance.get(`/playlists/${playlistId}/songs`);
    return response.data.songs;
};

// 플레이리스트에서 곡 삭제
export const deleteSongFromPlaylist = async (playlistId, songId) => {
    const response = await axiosInstance.delete(`/playlists/${playlistId}/songs/${songId}`);
    return response.data;
};  