"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "../../lib/supabaseClient";

interface KrathongInfo {
  idx: number;
  image_path: string;
  created_at: string;
}

export default function Home() {
  const [isMobile, setIsMobile] = useState(false);
  const [width, setWidth] = useState(1920);
  const [krathongs, setKrathongs] = useState<KrathongInfo[]>([]);

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
   {/* const interval = setInterval(fetchKrathongs, 20000);
    return () => clearInterval(interval);*/} 
  }, []);

  const getRandomProps = (waveOptions: number[]) => {
    const waveY = waveOptions[Math.floor(Math.random() * waveOptions.length)];
    const dur = (15 + Math.random() * 5).toFixed(1);
    return { waveY, dur };
  };

  const waveLayers = [15, 75, 158];

  const activeLayers = Math.min(krathongs.length, 10);

  const selectedKrathongs: KrathongInfo[] = [];
  if (krathongs.length > 0) {
    const pool = [...krathongs];
    for (let i = 0; i < activeLayers; i++) {
      const randomIdx = Math.floor(Math.random() * pool.length);
      selectedKrathongs.push(pool.splice(randomIdx, 1)[0]);
    }
  }

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen overflow-hidden">
      <video
        src={isMobile ? "/videos/background2.mp4" : "/videos/background1.mp4"}
        autoPlay
        loop
        muted
        playsInline
        className="absolute top-0 left-0 w-full h-full object-fill z-0"
      />

      {isMobile ? (
        <div className="absolute top-[30.2%] left-[58%] p-1 z-40 -translate-x-1/2">
          <h1
            className="text-4xl text-[#ffda4d] text-center font-extrabold font-[prompt]"
            style={{
              WebkitTextStroke: "2px #5e17eb",
              WebkitTextFillColor: "#ffda4d",
            }}
          >
            {krathongs.length.toString().padStart(3, "0")}
          </h1>
        </div>
      ) : (
        <div className="absolute top-[40%] left-[37.7%] p-1 z-40">
          <div className="flex items-center justify-center gap-2 font-[prompt]">
            <h1 className="text-3xl text-[#4a4649]">จำนวนกระทง</h1>
            <h1 className="text-3xl text-[#4a4649]">
              {krathongs.length.toString().padStart(3, "0")}
            </h1>
            <h2 className="text-3xl text-[#4a4649]">กระทง</h2>
          </div>
        </div>
      )}

      <div className="absolute bottom-0 w-full flex flex-col items-center justify-end gap-y-10 h-[500px] overflow-visible">
        {waveLayers.slice(0, activeLayers).map((waveYBase, layerIdx) => {
          const k = selectedKrathongs[layerIdx];
          if (!k) return null;

          const { waveY, dur } = getRandomProps([waveYBase]);
          const delay = (Math.random() * 1).toFixed(1);

          return (
            <svg
              key={`wave-${layerIdx}`}
              viewBox={`0 0 ${width} 300`}
              className="absolute w-full h-[400px] top-16 left-0"
            >
              <image
                key={`${k.idx}-${layerIdx}`}
                href={k.image_path}
                width="100"
                height="100"
                opacity="1"
              >
                <animateMotion
                  dur={`${dur}s`}
                  repeatCount="indefinite"
                  begin={`${delay}s`} 
                  path={`
                    M-500 ${waveY}
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
            </svg>
          );
        })}
      </div>
    </div>
  );
}
