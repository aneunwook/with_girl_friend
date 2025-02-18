import { useEffect, useState, useCallback, useRef, useMemo } from 'react';
import axios from 'axios'; // Spotify API 요청을 위해 필요
import styles from '../../assets/styles/PlaylistPage.module.css';

const loadSpotifySDK = () => {
  return new Promise((resolve, reject) => {
    if (window.Spotify) {
      console.log('✅ 기존 SDK가 이미 로드됨!');
      resolve(window.Spotify);
      return;
    }

    console.log('🔄 Spotify SDK 로딩 시작...');
    const scriptExists = document.querySelector(
      'script[src="https://sdk.scdn.co/spotify-player.js"]'
    );
    if (scriptExists) {
      console.log('⚠️ Spotify SDK 스크립트가 이미 추가됨.');
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://sdk.scdn.co/spotify-player.js';
    script.async = true;
    script.onload = () => {
      if (window.Spotify) {
        console.log('✅ Spotify SDK 로드 완료!');
        resolve(window.Spotify);
      } else {
        reject('❌ Spotify SDK 로딩 실패');
      }
    };
    script.onerror = (error) => reject(error);
    document.body.appendChild(script);
  });
};

const SpotifyPlayer = ({
  token,
  uri,
  onPlayPause,
  onPrevTrack,
  onNextTrack,
}) => {
  const [player, setPlayer] = useState(null);
  const [deviceId, setDeviceId] = useState(null);
  const prevUriRef = useRef(null); // ✅ prevUri를 useRef로 변경
  const deviceIdRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    window.onSpotifyWebPlaybackSDKReady = () => {
      console.log('🎵 Spotify Web Playback SDK가 준비되었습니다.');

      if (player) {
        console.log(' 기존 플레이어가 존재함. 새로 만들지 않음.');
        return;
      }

      const newPlayer = new window.Spotify.Player({
        name: 'My Spotify Player',
        getOAuthToken: (cb) => {
          const accessToken = localStorage.getItem('spotify_access_token');
          if (!accessToken) {
            console.error('Access Token 없음!');
            return;
          }
          cb(accessToken);
        },
        volume: 0.5,
      });

      newPlayer.addListener('ready', ({ device_id }) => {
        console.log('✅ 플레이어 준비 완료! Device ID:', device_id);
        setDeviceId(device_id); // 🌟 device_id 저장
        transferPlaybackToWebPlayer(device_id); // 웹 플레이어로 전환 실행!
      });

      newPlayer.addListener('not_ready', ({ device_id }) => {
        console.log('🚨 플레이어가 준비되지 않음! Device ID:', device_id);
      });

      newPlayer.connect().then((success) => {
        if (success) {
          console.log('✅ Spotify 플레이어 연결 성공!');
          setPlayer(newPlayer);
        } else {
          console.error('❌ Spotify 플레이어 연결 실패');
        }
      });
    };

    // 🔥 Spotify SDK 로드 실행
    loadSpotifySDK().catch((error) => {
      console.error('🚨 SDK 로드 중 오류 발생:', error);
    });
  }, []);

  // 웹 플레이어를 Spotify 활성 기기로 전환하는 함수**
  const transferPlaybackToWebPlayer = async (deviceId) => {
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!accessToken) {
      console.error('❌ Access Token 없음!');
      return;
    }

    console.log('📢 웹 플레이어 전환 시작! 현재 Device ID:', deviceId);

    try {
      await axios.put(
        'https://api.spotify.com/v1/me/player',
        { device_ids: [deviceId], play: true }, // 자동으로 플레이어 변경 + 재생 시도
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );

      console.log('✅ 웹 플레이어로 전환 성공!');
    } catch (error) {
      console.error('❌ 웹 플레이어 전환 실패:', error);
    }
  };

  useEffect(() => {
    if (deviceId) {
      deviceIdRef.current = deviceId;
    }
  }, [deviceId]);

  const playPlaylist = useCallback(async (trackUris, startIndex = 0) => {
    console.log('🎶 playPlaylist 실행됨!', trackUris, startIndex);

    if (!deviceIdRef.current) {
      console.error('❌ Device ID가 없음!');
      return;
    }

    if (!Array.isArray(trackUris) || trackUris.length === 0) {
      console.error('❌ 유효한 트랙 리스트가 없습니다!');
      return;
    }

    console.log(
      `🎵 playPlaylist 실행! uris: ${trackUris}, startIndex: ${startIndex}`
    );

    try {
      const accessToken = localStorage.getItem('spotify_access_token');

      await axios.put(
        'https://api.spotify.com/v1/me/player/play',
        { uris: trackUris, offset: { position: startIndex } },
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json',
          },
        }
      );

      console.log(`✅ 곡 재생 요청 성공! (🎵 ${startIndex}번째 곡부터 재생)`);
    } catch (error) {
      console.error(
        '❌ 곡 재생 실패:',
        error.response ? error.response.data : error
      );
    }
  }, []); // 🔥 빈 배열 `[]` -> `playPlaylist`가 한 번만 생성됨!

  const getActiveSpotifyDevice = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');

    if (!accessToken) {
      console.error('❌ Access Token 없음!');
      return;
    }

    try {
      const response = await axios.get(
        'https://api.spotify.com/v1/me/player/devices',
        {
          headers: { Authorization: `Bearer ${accessToken}` },
        }
      );

      console.log('🎧 현재 활성 기기 목록:', response.data.devices);
    } catch (error) {
      console.error('❌ Spotify 기기 목록 가져오기 실패:', error);
    }
  };

  // 🎵 추가: 플레이어 컨트롤 함수 정의
  const playPause = async () => {
    if (!player) {
      console.error('❌ 플레이어가 없습니다!');
      return;
    }

    console.log('🔄 현재 플레이어 상태 가져오는 중...');

    try {
      let state = await player.getCurrentState();
      console.log('🎧 플레이어 상태:', state);

      if (!state) {
        console.warn(
          '⚠️ 현재 활성화된 Spotify 기기가 없음! 웹 플레이어로 전환 시도...'
        );
        await transferPlaybackToWebPlayer(player._options.id);

        setTimeout(async () => {
          state = await player.getCurrentState();
          console.log('📢 웹 플레이어 전환 후 상태:', state);

          if (!state) {
            console.error(
              '❌ 여전히 활성화된 기기가 없음! Spotify 앱을 실행하세요.'
            );
            alert('Spotify 앱을 실행하고 웹 플레이어를 활성화하세요!');
            return;
          }

          console.log('✅ 웹 플레이어 전환 성공! 다시 재생 시도...');
          await player.resume();
          const newState = await player.getCurrentState();
          setIsPlaying(!newState?.paused);
        }, 2000);

        return;
      }

      if (state.paused) {
        console.log('▶ 재생 시도...');
        await player.resume();
        console.log('✅ 재생 명령 보냄!');
      } else {
        console.log('⏸ 일시정지 시도...');
        await player.pause();
        console.log('✅ 일시정지 성공!');
      }

      setTimeout(async () => {
        const updatedState = await player.getCurrentState();
        console.log('🔄 (setTimeout) 업데이트된 상태:', updatedState);
        if (updatedState) {
          setIsPlaying(!updatedState.paused);
        } else {
          console.warn('⚠️ 상태 확인 실패');
        }
      }, 500);
    } catch (error) {
      console.error('❌ 재생/일시정지 실패:', error);
    }
  };

  const nextTrack = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');

    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/next',
        {},
        { headers: { Authorization: `Bearer ${accessToken}` } }
      );
      console.log('✅ 다음 곡으로 이동!');
    } catch (error) {
      console.error(
        '❌ 다음 곡 이동 실패!',
        error.response?.status,
        error.response?.data,
        error
      );
    }
  };

  const prevTrack = async () => {
    const accessToken = localStorage.getItem('spotify_access_token');

    try {
      await axios.post(
        'https://api.spotify.com/v1/me/player/previous',
        {},
        { headers: { Authorization: ` Bearer ${accessToken}` } }
      );
      console.log('✅ 이전 곡으로 이동!');
    } catch (error) {
      console.error('❌ 이전 곡 이동 실패!', error);
    }
  };

  // 부모 컴포넌트에서 컨트롤 가능하도록 전달
  useEffect(() => {
    getActiveSpotifyDevice();
  }, []);

  useEffect(() => {
    if (!player) return;

    console.log('🎵 플레이어 컨트롤 등록 시작!');

    if (onPlayPause) onPlayPause(() => playPause);
    if (onNextTrack) onNextTrack(() => nextTrack);
    if (onPrevTrack) onPrevTrack(() => prevTrack);

    console.log('🎵 플레이어 컨트롤 등록 완료!');
  }, [player]);

  useEffect(() => {
    console.log('🔍 현재 uri:', uri);
    console.log('🔍 이전 uri:', prevUriRef.current);

    if (!uri || !deviceId) return;

    if (prevUriRef.current === uri) {
      console.log('⚠️ 이전과 동일한 URI, 재생 안 함!');
      return;
    }

    console.log('🎵 useEffect 실행! 새로운 URI 재생:', uri);
    prevUriRef.current = uri;

    const uris = Array.isArray(uri) ? uri : [uri];
    playPlaylist(uris);
  }, [uri]);

  return (
    <div className={styles.webPlayerContainer}>
      <h2 className={styles.webPlayer}>Spotify Web Player</h2>
      {player ? (
        <p className={styles.webPlayerlistening}>
          🎵 플레이어가 실행 중입니다!
        </p>
      ) : (
        <p className={styles.webPlayerloading}>⏳ 플레이어 로딩 중...</p>
      )}
    </div>
  );
};

export default SpotifyPlayer;
