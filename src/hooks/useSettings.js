import { useState, useRef, useEffect } from 'react';
import { BG_IMAGES } from '../constants';

// Ambient music tracks (royalty-free, streamed from Pixabay CDN)
export const MUSIC_TRACKS = [
  { id: 'lofi',    label: 'Lo-fi Chill',     url: 'https://cdn.pixabay.com/audio/2022/05/27/audio_1808fbf07a.mp3' },
  { id: 'jazz',    label: 'Late Night Jazz',  url: 'https://cdn.pixabay.com/audio/2022/03/15/audio_8cb3c1c98c.mp3' },
  { id: 'rain',    label: 'Rain & Focus',     url: 'https://cdn.pixabay.com/audio/2022/06/07/audio_b9e9acec20.mp3' },
  { id: 'forest',  label: 'Forest Ambient',   url: 'https://cdn.pixabay.com/audio/2022/06/25/audio_950f622b20.mp3' },
];

export function useSettings() {
  // ── Background ───────────────────────────────────────────────────────────
  const [bgImg,  setBgImg]  = useState(BG_IMAGES[0]);
  const [bgIdx,  setBgIdx]  = useState(0);
  const fileInputRef = useRef(null);

  function cycleBg() {
    const next = (bgIdx + 1) % BG_IMAGES.length;
    setBgIdx(next);
    setBgImg(BG_IMAGES[next]);
  }

  function handleBgUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    if (bgImg.startsWith('blob:')) URL.revokeObjectURL(bgImg);
    setBgImg(URL.createObjectURL(file));
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  // ── Day / Night mode ─────────────────────────────────────────────────────
  const [isDayMode, setIsDayMode] = useState(false);

  function toggleDayNight() {
    setIsDayMode((v) => !v);
  }

  // ── Music ─────────────────────────────────────────────────────────────────
  const audioRef  = useRef(null);
  const [isPlaying,    setIsPlaying]    = useState(false);
  const [trackIdx,     setTrackIdx]     = useState(0);
  const [volume,       setVolume]       = useState(0.4);
  const [musicReady,   setMusicReady]   = useState(false);

  // Initialise Audio element once
  useEffect(() => {
    const audio = new Audio();
    audio.loop   = true;
    audio.volume = volume;
    audio.src    = MUSIC_TRACKS[0].url;
    audio.addEventListener('canplaythrough', () => setMusicReady(true), { once: true });
    audioRef.current = audio;

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Sync volume changes to the audio element
  useEffect(() => {
    if (audioRef.current) audioRef.current.volume = volume;
  }, [volume]);

  function toggleMusic() {
    const audio = audioRef.current;
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch(() => {});
      setIsPlaying(true);
    }
  }

  function selectTrack(idx) {
    const audio = audioRef.current;
    if (!audio) return;
    setTrackIdx(idx);
    setMusicReady(false);
    const wasPlaying = isPlaying;
    audio.pause();
    audio.src = MUSIC_TRACKS[idx].url;
    audio.load();
    audio.addEventListener('canplaythrough', () => {
      setMusicReady(true);
      if (wasPlaying) audio.play().catch(() => {});
    }, { once: true });
  }

  return {
    // bg
    bgImg, cycleBg, handleBgUpload, openFilePicker, fileInputRef,
    // day/night
    isDayMode, toggleDayNight,
    // music
    isPlaying, toggleMusic, trackIdx, selectTrack,
    volume, setVolume, musicReady,
  };
}
