import { useState, useRef } from 'react';
import { BG_IMAGES } from '../constants';

export function useBackground() {
  const [bgImg, setBgImg] = useState(BG_IMAGES[0]);
  const [bgIdx, setBgIdx] = useState(0);
  const fileInputRef = useRef(null);

  function cycleBg() {
    const next = (bgIdx + 1) % BG_IMAGES.length;
    setBgIdx(next);
    setBgImg(BG_IMAGES[next]);
  }

  function handleBgUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    // Revoke the previous object URL to avoid memory leaks
    if (bgImg.startsWith('blob:')) URL.revokeObjectURL(bgImg);
    setBgImg(URL.createObjectURL(file));
  }

  function openFilePicker() {
    fileInputRef.current?.click();
  }

  return { bgImg, cycleBg, handleBgUpload, openFilePicker, fileInputRef };
}
