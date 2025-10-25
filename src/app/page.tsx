"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../lib/supabaseClient";

interface KrathongInfo {
  idx: number;
  image_path: string;
  created_at: string;
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(1920);
  const [krathongs, setKrathongs] = useState<KrathongInfo[]>([]);
  const [visibleKrathongs, setVisibleKrathongs] = useState<Record<number, boolean>>({});
useEffect(() => {
  krathongs.forEach((k) => {
    const delay = Math.random() * 10; // เหมือนเดิม
    setTimeout(() => {
      setVisibleKrathongs((prev) => ({ ...prev, [k.idx]: true }));
    }, delay * 1000);
  });
}, [krathongs]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      setWidth(window.innerWidth);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchKrathongs = async () => {
      const { data, error } = await supabase
        .from("information")
        .select("*")
        .limit(10)
        .order("created_at", { ascending: false });
      if (error) console.log("Error fetching krathongs:", error);
      else setKrathongs(data as KrathongInfo[]);
    };

    fetchKrathongs();
  }, []);

  const getRandomProps = (waveOptions: number[]) => {
    const waveY = waveOptions[Math.floor(Math.random() * waveOptions.length)];
    const dur = (15 + Math.random() * 5).toFixed(1); // 10-15s
    const delay = (Math.random() * 10).toFixed(1); // 0-1s
    return { waveY, dur, delay };
  };

  const waveLayers = [15, 75, 158]; // บน กลาง ล่าง

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        src={isMobile ? "/videos/background2.mp4" : "/videos/background1.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-cover z-0"
      />

      <div className="absolute bottom-0 w-full flex flex-col items-center justify-end gap-y-10 h-[500px] overflow-visible">
        {waveLayers.map((waveYBase, layerIdx) => (
          <svg
            key={`wave-${layerIdx}`}
            viewBox={`0 0 ${width} 300`}
            className={`absolute w-full h-[400px] top-16 left-0`}
          >
{krathongs.map((k, i) => {
  const { waveY, dur } = getRandomProps([waveLayers[layerIdx]]);
  const visible = visibleKrathongs[k.idx] || false;

  return (
    <image
      key={`${k.idx}-${layerIdx}-${i}`}
      href={k.image_path}
      width="100"
      height="100"
      style={{ opacity: visible ? 1 : 0 }}
    >
      <animateMotion
        dur={`${dur}s`}
        repeatCount="indefinite"
        begin="0s"
        path={`
          M-120 ${waveY} 
          Q ${width * 0.05} ${waveY - 10}, ${width * 0.1} ${waveY + 15}
          T ${width * 0.2} ${waveY}
          T ${width * 0.3} ${waveY + 5}
          T ${width * 0.4} ${waveY}
          T ${width * 0.5} ${waveY + 10}
          T ${width * 0.6} ${waveY}
          T ${width * 0.7} ${waveY + 5}
          T ${width * 0.8} ${waveY}
          T ${width * 0.9} ${waveY + 5}
          T ${width} ${waveY}
        `}
      />
    </image>
  );
})}

          </svg>
        ))}
      </div>
      <Link 
        href="/Create_Krathong" 
        className="absolute bottom-5 z-20 font-[Prompt] font-bold text-[#4557c7] text-[23px] px-10 py-2 bg-white rounded-[50px] shadow-[0_0_25px_10px_rgba(255,255,255,0.6)] transition-shadow duration-300"
      >
        ลอยกระทง
      </Link>
    </div>
  );
}
