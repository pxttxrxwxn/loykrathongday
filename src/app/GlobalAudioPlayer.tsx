"use client";
import { useEffect, useRef } from "react";

export default function GlobalAudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 1;

    const startAudio = () => {
      audio.play().catch(() => {});
      window.removeEventListener("click", startAudio);
      window.removeEventListener("touchstart", startAudio);
    };

    window.addEventListener("click", startAudio);
    window.addEventListener("touchstart", startAudio);

  }, []);

  return <audio ref={audioRef} src="/mp3/Krathong.mp3" />;
}
