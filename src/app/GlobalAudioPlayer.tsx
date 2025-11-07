"use client";
import { useEffect, useRef } from "react";

export default function GlobalAudioPlayer() {
  const ref = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    const audio = ref.current;
    if (!audio) return;

    audio.loop = true;
    audio.volume = 0.7;
    audio.muted = true; // ✅ เริ่มแบบ muted เพื่อผ่าน Autoplay Policy
    audio.play().catch(() => {});

    const enable = () => {
      audio.muted = false; // ✅ เปิดเสียงหลังผู้ใช้แตะครั้งแรก
      audio.play().catch(() => {});
      window.removeEventListener("click", enable);
      window.removeEventListener("touchstart", enable);
    };

    window.addEventListener("click", enable);
    window.addEventListener("touchstart", enable);
  }, []);

  return <audio ref={ref} src="/mp3/Krathong.mp3" preload="auto" />;
}
