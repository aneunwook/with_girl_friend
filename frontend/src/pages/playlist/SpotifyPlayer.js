import { useEffect, useState, useRef } from "react";

const SpotifyPlayer = ({ token }) => {
  const [deviceId, setDeviceId] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const playerRef = useRef(null);

  useEffect(() => {
    if (playerRef.current) return; // 기존에 생성된 player가 있으면 중복 생성 방지

    console.log("🔄 SpotifyPlayer 컴포넌트 실행됨!");

    // ✅ onSpotifyWebPlaybackSDKReady가 없으면 정의
    if (!window.onSpotifyWebPlaybackSDKReady) {
      console.log("🚨 onSpotifyWebPlaybackSDKReady가 없음! 강제 생성...");
      window.onSpotifyWebPlaybackSDKReady = () => {
        console.log("✅ onSpotifyWebPlaybackSDKReady 실행됨!");
        initializePlayer();
      };
    }

    // ✅ 플레이어 초기화 함수
    const initializePlayer = () => {
      if (!window.Spotify) {
        console.error("🚨 Spotify SDK가 아직 로드되지 않음");
        return;
      }

      const playerInstance = new window.Spotify.Player({
        name: "My Web Player",
        getOAuthToken: (cb) => cb(token),
        volume: 0.5,
      });

      playerRef.current = playerInstance;

      playerInstance.addListener("ready", ({ device_id }) => {
        console.log("✅ Spotify Web Player 준비 완료! ID:", device_id);
        setDeviceId(device_id);
      });

      playerInstance.addListener("player_state_changed", (state) => {
        if (!state) return;
        setIsPlaying(!state.paused);
      });

      playerInstance.connect().then((success) => {
        if (success) console.log("🎵 Spotify Web Player가 연결되었습니다!");
        else console.error("🚨 Spotify Web Player 연결 실패");
      });
    };

    // ✅ SDK가 이미 로드된 경우 초기화 실행
    if (window.Spotify) {
      initializePlayer();
    }
  }, [token]);

  return (
    <div>
      <h2>Spotify Web Player</h2>
      <p>{isPlaying ? "재생 중" : "일시 정지 중"}</p>
    </div>
  );
};

export default SpotifyPlayer;
